import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { after, before, test } from "node:test";

const PORT = 18000 + Math.floor(Math.random() * 1000);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const HUB_TOKEN = "ci-smoke-token";

let server;
let serverOutput = "";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = (path, options = {}) =>
  fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "X-Hub-Token": HUB_TOKEN,
      ...(options.headers ?? {})
    }
  });

before(async () => {
  server = spawn(process.execPath, ["hub/server.js"], {
    env: {
      ...process.env,
      HUB_HOST: "127.0.0.1",
      HUB_PORT: String(PORT),
      HUB_TOKEN
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Hub server exited early.\n${serverOutput}`);
    }

    try {
      const response = await request("/hub/health");
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until the server starts listening.
    }

    await delay(100);
  }

  throw new Error(`Hub server did not become ready.\n${serverOutput}`);
});

after(() => {
  if (server && server.exitCode === null) {
    server.kill();
  }
});

test("hub health endpoint returns runtime status", async () => {
  const response = await request("/hub/health");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.data.totalAgents, 0);
  assert.equal(body.data.onlineAgents, 0);
});

test("hub accepts an agent registration", async () => {
  const response = await request("/hub/agents/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      agentId: "ci-agent-1",
      pcName: "CI-PC-01",
      localIp: "127.0.0.1",
      status: "idle"
    })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.data.agent.agentId, "ci-agent-1");
  assert.equal(body.data.agent.pcName, "CI-PC-01");
  assert.equal(body.data.agent.online, true);
});