import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

const PORT = Number(process.env.HUB_PORT ?? 8787);
const HOST = process.env.HUB_HOST ?? "0.0.0.0";
const HUB_TOKEN = (process.env.HUB_TOKEN ?? "").trim();
const CORS_ORIGIN = process.env.HUB_CORS_ORIGIN ?? "*";
const HEARTBEAT_TIMEOUT_MS = Number(process.env.HUB_HEARTBEAT_TIMEOUT_MS ?? 15_000);
const MAX_BODY_BYTES = Number(process.env.HUB_MAX_BODY_BYTES ?? 262_144);

const startedAt = new Date().toISOString();

const agents = new Map();
const commandQueueByAgent = new Map();
const commandsById = new Map();
const events = [];
const streamClients = new Map();
const onlineStateByAgent = new Map();

const json = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Hub-Token");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
};

const ensureAuth = (req, res) => {
  if (!HUB_TOKEN) {
    return true;
  }

  const token = req.headers["x-hub-token"];
  if (token === HUB_TOKEN) {
    return true;
  }

  json(res, 401, { ok: false, error: "Unauthorized" });
  return false;
};

const nowIso = () => new Date().toISOString();

const isAgentOnline = (agent) => {
  const lastSeen = Date.parse(agent.lastSeenAt);
  if (Number.isNaN(lastSeen)) {
    return false;
  }

  return Date.now() - lastSeen <= HEARTBEAT_TIMEOUT_MS;
};

const toAgentView = (agent) => ({
  agentId: agent.agentId,
  pcName: agent.pcName,
  localIp: agent.localIp ?? null,
  metadata: agent.metadata ?? {},
  status: agent.status ?? "unknown",
  userId: agent.userId ?? null,
  sessionId: agent.sessionId ?? null,
  activeApp: agent.activeApp ?? null,
  metrics: agent.metrics ?? {},
  registeredAt: agent.registeredAt,
  lastSeenAt: agent.lastSeenAt,
  online: isAgentOnline(agent)
});

const toCommandView = (command) => ({
  commandId: command.commandId,
  agentId: command.agentId,
  type: command.type,
  payload: command.payload ?? {},
  requestedBy: command.requestedBy ?? null,
  status: command.status,
  createdAt: command.createdAt,
  dispatchedAt: command.dispatchedAt ?? null,
  finishedAt: command.finishedAt ?? null,
  ok: command.ok ?? null,
  output: command.output ?? null,
  error: command.error ?? null
});

const pushEvent = (type, data) => {
  const item = {
    id: randomUUID(),
    type,
    at: nowIso(),
    data
  };

  events.unshift(item);
  if (events.length > 500) {
    events.length = 500;
  }

  broadcast("event", item);
};

const sanitizeObject = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
};

const readJsonBody = async (req) =>
  new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error("Payload is too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }

      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", reject);
  });

const getQueue = (agentId) => {
  if (!commandQueueByAgent.has(agentId)) {
    commandQueueByAgent.set(agentId, []);
  }

  return commandQueueByAgent.get(agentId);
};

const writeSse = (res, eventName, payload) => {
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const broadcast = (eventName, payload) => {
  for (const { res } of streamClients.values()) {
    writeSse(res, eventName, payload);
  }
};

const snapshot = () => ({
  startedAt,
  serverTime: nowIso(),
  agents: [...agents.values()].map(toAgentView),
  commands: [...commandsById.values()]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 200)
    .map(toCommandView),
  events: events.slice(0, 200)
});

const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!ensureAuth(req, res)) {
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  try {
    if (req.method === "GET" && pathname === "/hub/health") {
      const online = [...agents.values()].filter((item) => isAgentOnline(item)).length;
      json(res, 200, {
        ok: true,
        data: {
          startedAt,
          serverTime: nowIso(),
          uptimeSec: Math.floor(process.uptime()),
          totalAgents: agents.size,
          onlineAgents: online
        }
      });
      return;
    }

    if (req.method === "GET" && pathname === "/hub/snapshot") {
      json(res, 200, { ok: true, data: snapshot() });
      return;
    }

    if (req.method === "GET" && pathname === "/hub/stream") {
      const streamId = randomUUID();
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");

      streamClients.set(streamId, { res });
      writeSse(res, "snapshot", snapshot());

      req.on("close", () => {
        streamClients.delete(streamId);
      });

      return;
    }

    if (req.method === "GET" && pathname === "/hub/agents") {
      const items = [...agents.values()]
        .map(toAgentView)
        .sort((a, b) => a.pcName.localeCompare(b.pcName));
      json(res, 200, { ok: true, data: items });
      return;
    }

    if (req.method === "GET" && pathname === "/hub/commands") {
      const agentId = url.searchParams.get("agentId");
      const status = url.searchParams.get("status");

      const items = [...commandsById.values()]
        .filter((item) => (agentId ? item.agentId === agentId : true))
        .filter((item) => (status ? item.status === status : true))
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .map(toCommandView);

      json(res, 200, { ok: true, data: items });
      return;
    }

    if (req.method === "POST" && pathname === "/hub/agents/register") {
      const payload = sanitizeObject(await readJsonBody(req));
      const agentId = String(payload.agentId ?? "").trim();
      const pcName = String(payload.pcName ?? "").trim();

      if (!agentId || !pcName) {
        json(res, 400, { ok: false, error: "agentId and pcName are required" });
        return;
      }

      const existing = agents.get(agentId);
      const registeredAt = existing?.registeredAt ?? nowIso();
      const next = {
        agentId,
        pcName,
        localIp: payload.localIp ? String(payload.localIp) : existing?.localIp,
        metadata: sanitizeObject(payload.metadata),
        status: String(payload.status ?? existing?.status ?? "idle"),
        userId: payload.userId ? String(payload.userId) : existing?.userId ?? null,
        sessionId: payload.sessionId ? String(payload.sessionId) : existing?.sessionId ?? null,
        activeApp: payload.activeApp ? String(payload.activeApp) : existing?.activeApp ?? null,
        metrics: sanitizeObject(payload.metrics),
        registeredAt,
        lastSeenAt: nowIso()
      };

      agents.set(agentId, next);
      onlineStateByAgent.set(agentId, true);
      pushEvent("agent_registered", { agent: toAgentView(next) });
      broadcast("agents_updated", [...agents.values()].map(toAgentView));

      json(res, 200, {
        ok: true,
        data: {
          agent: toAgentView(next),
          heartbeatEveryMs: 5_000,
          pollCommandsEveryMs: 2_000
        }
      });
      return;
    }

    const heartbeatMatch = pathname.match(/^\/hub\/agents\/([^/]+)\/heartbeat$/);
    if (req.method === "POST" && heartbeatMatch) {
      const agentId = decodeURIComponent(heartbeatMatch[1]);
      const existing = agents.get(agentId);
      if (!existing) {
        json(res, 404, { ok: false, error: "Agent is not registered" });
        return;
      }

      const payload = sanitizeObject(await readJsonBody(req));
      existing.lastSeenAt = nowIso();
      existing.status = String(payload.status ?? existing.status ?? "idle");
      existing.userId = payload.userId ? String(payload.userId) : null;
      existing.sessionId = payload.sessionId ? String(payload.sessionId) : null;
      existing.activeApp = payload.activeApp ? String(payload.activeApp) : null;
      existing.metrics = sanitizeObject(payload.metrics);

      agents.set(agentId, existing);
      broadcast("agents_updated", [...agents.values()].map(toAgentView));

      json(res, 200, { ok: true, data: { serverTime: nowIso() } });
      return;
    }

    const eventsMatch = pathname.match(/^\/hub\/agents\/([^/]+)\/events$/);
    if (req.method === "POST" && eventsMatch) {
      const agentId = decodeURIComponent(eventsMatch[1]);
      if (!agents.has(agentId)) {
        json(res, 404, { ok: false, error: "Agent is not registered" });
        return;
      }

      const payload = sanitizeObject(await readJsonBody(req));
      const inputEvents = Array.isArray(payload.events) ? payload.events : [];

      for (const raw of inputEvents.slice(0, 50)) {
        const item = sanitizeObject(raw);
        pushEvent("agent_event", {
          agentId,
          type: String(item.type ?? "info"),
          message: String(item.message ?? ""),
          level: String(item.level ?? "info"),
          data: sanitizeObject(item.data)
        });
      }

      json(res, 200, { ok: true, data: { accepted: inputEvents.length } });
      return;
    }

    if (req.method === "POST" && pathname === "/hub/admin/commands") {
      const payload = sanitizeObject(await readJsonBody(req));
      const agentId = String(payload.agentId ?? "").trim();
      const type = String(payload.type ?? "").trim();

      if (!agentId || !type) {
        json(res, 400, { ok: false, error: "agentId and type are required" });
        return;
      }

      if (!agents.has(agentId)) {
        json(res, 404, { ok: false, error: "Agent was not found" });
        return;
      }

      const command = {
        commandId: randomUUID(),
        agentId,
        type,
        payload: sanitizeObject(payload.payload),
        requestedBy: payload.requestedBy ? String(payload.requestedBy) : null,
        status: "pending",
        createdAt: nowIso(),
        dispatchedAt: null,
        finishedAt: null,
        ok: null,
        output: null,
        error: null
      };

      commandsById.set(command.commandId, command);
      getQueue(agentId).push(command);
      pushEvent("command_queued", { command: toCommandView(command) });
      broadcast("commands_updated", { agentId });

      json(res, 201, { ok: true, data: toCommandView(command) });
      return;
    }

    const nextCommandsMatch = pathname.match(/^\/hub\/agents\/([^/]+)\/commands\/next$/);
    if (req.method === "GET" && nextCommandsMatch) {
      const agentId = decodeURIComponent(nextCommandsMatch[1]);
      if (!agents.has(agentId)) {
        json(res, 404, { ok: false, error: "Agent is not registered" });
        return;
      }

      const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") ?? 10)));
      const queue = getQueue(agentId);
      const chunk = queue.splice(0, limit);

      for (const cmd of chunk) {
        cmd.status = "dispatched";
        cmd.dispatchedAt = nowIso();
        commandsById.set(cmd.commandId, cmd);
      }

      if (chunk.length > 0) {
        pushEvent("commands_dispatched", {
          agentId,
          commandIds: chunk.map((item) => item.commandId)
        });
      }

      json(res, 200, { ok: true, data: chunk.map(toCommandView) });
      return;
    }

    const commandResultMatch = pathname.match(/^\/hub\/agents\/([^/]+)\/commands\/([^/]+)\/result$/);
    if (req.method === "POST" && commandResultMatch) {
      const agentId = decodeURIComponent(commandResultMatch[1]);
      const commandId = decodeURIComponent(commandResultMatch[2]);
      const command = commandsById.get(commandId);

      if (!command || command.agentId !== agentId) {
        json(res, 404, { ok: false, error: "Command was not found" });
        return;
      }

      const payload = sanitizeObject(await readJsonBody(req));
      const ok = Boolean(payload.ok);
      command.status = ok ? "completed" : "failed";
      command.ok = ok;
      command.output = payload.output == null ? null : String(payload.output);
      command.error = payload.error == null ? null : String(payload.error);
      command.finishedAt = nowIso();
      commandsById.set(commandId, command);

      pushEvent("command_result", { command: toCommandView(command) });
      broadcast("commands_updated", { agentId: command.agentId });

      json(res, 200, { ok: true, data: toCommandView(command) });
      return;
    }

    json(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    json(res, 400, {
      ok: false,
      error: error instanceof Error ? error.message : "Request failed"
    });
  }
});

setInterval(() => {
  for (const [agentId, agent] of agents.entries()) {
    const onlineNow = isAgentOnline(agent);
    const onlineBefore = onlineStateByAgent.get(agentId);
    if (onlineNow !== onlineBefore) {
      onlineStateByAgent.set(agentId, onlineNow);
      pushEvent("agent_presence", {
        agentId,
        online: onlineNow,
        at: nowIso()
      });
      broadcast("agents_updated", [...agents.values()].map(toAgentView));
    }
  }

  for (const { res } of streamClients.values()) {
    writeSse(res, "ping", { at: nowIso() });
  }
}, 3_000).unref();

server.listen(PORT, HOST, () => {
  const tokenState = HUB_TOKEN ? "enabled" : "disabled";
  // eslint-disable-next-line no-console
  console.log(
    `[hub] listening on http://${HOST}:${PORT} | auth=${tokenState} | startedAt=${startedAt}`
  );
});
