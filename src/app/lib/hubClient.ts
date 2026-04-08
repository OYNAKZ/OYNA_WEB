export interface HubAgent {
  agentId: string;
  pcName: string;
  online: boolean;
  status: string;
  userId: string | null;
  sessionId: string | null;
  lastSeenAt: string;
  metadata: Record<string, unknown>;
  metrics: Record<string, unknown>;
}

export interface HubEvent {
  id: string;
  type: string;
  at: string;
  data: Record<string, unknown>;
}

export interface HubCommand {
  commandId: string;
  agentId: string;
  type: string;
  status: string;
  payload: Record<string, unknown>;
  createdAt: string;
  dispatchedAt: string | null;
  finishedAt: string | null;
  ok: boolean | null;
  output: string | null;
  error: string | null;
}

export interface HubSnapshot {
  startedAt: string;
  serverTime: string;
  agents: HubAgent[];
  commands: HubCommand[];
  events: HubEvent[];
}

interface HubEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

interface QueueHubCommandInput {
  agentId: string;
  type: string;
  payload?: Record<string, unknown>;
  requestedBy?: string;
}

type ViteEnvLike = Record<string, string | undefined>;

const viteEnv = ((import.meta as ImportMeta & { env?: ViteEnvLike }).env ?? {}) as ViteEnvLike;
const hubBaseUrl = viteEnv.VITE_HUB_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8787";
const hubToken = viteEnv.VITE_HUB_TOKEN?.trim();

const requestHub = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (hubToken) {
    headers.set("X-Hub-Token", hubToken);
  }

  const response = await fetch(`${hubBaseUrl}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let envelope: HubEnvelope<T> | null = null;

  if (text) {
    try {
      envelope = JSON.parse(text) as HubEnvelope<T>;
    } catch {
      envelope = null;
    }
  }

  if (!response.ok) {
    const details = envelope?.error || text || response.statusText;
    throw new Error(`Hub request failed (${response.status}): ${details}`);
  }

  if (!envelope || !envelope.ok || envelope.data === undefined) {
    throw new Error(envelope?.error || "Invalid hub response");
  }

  return envelope.data;
};

export const fetchHubSnapshot = async (): Promise<HubSnapshot> => requestHub<HubSnapshot>("/hub/snapshot", { method: "GET" });

export const queueHubCommand = async (input: QueueHubCommandInput): Promise<HubCommand> =>
  requestHub<HubCommand>("/hub/admin/commands", {
    method: "POST",
    body: JSON.stringify(input),
  });
