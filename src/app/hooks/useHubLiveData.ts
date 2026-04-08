import { useCallback, useEffect, useRef, useState } from "react";

import { fetchHubSnapshot, queueHubCommand, type HubAgent, type HubEvent } from "../lib/hubClient";
import type { LiveActivity, LivePC, PCStatus } from "../types/live";

const HOT_STATUSES = new Set(["online", "active", "running"]);
const RESERVED_STATUSES = new Set(["reserved", "busy", "in_session", "occupied"]);

const toRelativeTime = (timestamp: string): string => {
  const value = Date.parse(timestamp);
  if (Number.isNaN(value)) {
    return "unknown";
  }

  const deltaMs = Date.now() - value;
  if (deltaMs < 60_000) {
    return "just now";
  }

  const minutes = Math.floor(deltaMs / 60_000);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const asString = (value: unknown): string | null => (typeof value === "string" && value.trim().length > 0 ? value : null);

const asNumber = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) ? value : null);

const resolveStatus = (agent: HubAgent): PCStatus => {
  if (!agent.online) {
    return "offline";
  }

  const normalized = agent.status.trim().toLowerCase();
  if (RESERVED_STATUSES.has(normalized)) {
    return "reserved";
  }

  if (HOT_STATUSES.has(normalized)) {
    return "online";
  }

  return "online";
};

const mapAgentToPC = (agent: HubAgent): LivePC => {
  const metrics = asRecord(agent.metrics);
  const metadata = asRecord(agent.metadata);

  const sessionTime = asString(metrics.sessionTimeLabel) ?? asString(metrics.sessionTime);
  const specs =
    asString(metadata.specs) ??
    asString(metadata.hardware) ??
    asString(metadata.platform) ??
    "Unknown hardware";
  const temperature = asNumber(metrics.temperature) ?? 35;
  const user = asString(agent.userId) ?? asString(metadata.userName) ?? null;

  return {
    id: agent.agentId,
    name: agent.pcName,
    status: resolveStatus(agent),
    user,
    sessionTime,
    temperature,
    specs,
  };
};

const mapEventToActivity = (event: HubEvent): LiveActivity => {
  const data = asRecord(event.data);
  const rawAgentId = asString(data.agentId) ?? "agent";

  if (event.type === "agent_presence") {
    const online = Boolean(data.online);
    return {
      id: event.id,
      type: online ? "login" : "logout",
      user: rawAgentId,
      time: toRelativeTime(event.at),
      description: online ? "became online" : "went offline",
    };
  }

  if (event.type === "command_result") {
    const command = asRecord(data.command);
    const commandType = asString(command.type) ?? "command";
    const ok = Boolean(command.ok);
    return {
      id: event.id,
      type: "system",
      user: asString(command.agentId) ?? rawAgentId,
      time: toRelativeTime(event.at),
      description: ok ? `${commandType} completed` : `${commandType} failed`,
    };
  }

  if (event.type === "command_queued") {
    const command = asRecord(data.command);
    return {
      id: event.id,
      type: "reservation",
      user: asString(command.agentId) ?? rawAgentId,
      time: toRelativeTime(event.at),
      description: `queued ${asString(command.type) ?? "command"}`,
    };
  }

  if (event.type === "agent_event") {
    return {
      id: event.id,
      type: "system",
      user: rawAgentId,
      time: toRelativeTime(event.at),
      description: asString(data.message) ?? "agent update",
    };
  }

  return {
    id: event.id,
    type: "system",
    user: rawAgentId,
    time: toRelativeTime(event.at),
    description: event.type.replaceAll("_", " "),
  };
};

type SystemActionId = "restart" | "shutdown" | "signOut" | "lockWorkstation";

interface UseHubLiveDataResult {
  pcs: LivePC[];
  activities: LiveActivity[];
  loading: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
  runSystemAction: (agentId: string, actionId: SystemActionId) => Promise<void>;
  runningCommandFor: string | null;
  refresh: () => Promise<void>;
}

export const useHubLiveData = (): UseHubLiveDataResult => {
  const [pcs, setPcs] = useState<LivePC[]>([]);
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [runningCommandFor, setRunningCommandFor] = useState<string | null>(null);

  const inFlightRef = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    try {
      const snapshot = await fetchHubSnapshot();
      setPcs(snapshot.agents.map(mapAgentToPC));
      setActivities(snapshot.events.slice(0, 20).map(mapEventToActivity));
      setLastUpdatedAt(snapshot.serverTime);
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to load data from local hub";
      setError(message);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, []);

  const runSystemAction = useCallback(async (agentId: string, actionId: SystemActionId) => {
    setRunningCommandFor(agentId);
    try {
      await queueHubCommand({
        agentId,
        type: "systemAction",
        payload: {
          actionId,
        },
        requestedBy: "web-admin",
      });
      await refresh();
    } finally {
      setRunningCommandFor(null);
    }
  }, [refresh]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 3_000);

    return () => {
      window.clearInterval(timer);
    };
  }, [refresh]);

  return {
    pcs,
    activities,
    loading,
    error,
    lastUpdatedAt,
    runSystemAction,
    runningCommandFor,
    refresh,
  };
};
