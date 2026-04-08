# OYNA Admin Dashboard

[![CI](https://github.com/OYNAKZ/OYNA_WEB/actions/workflows/ci.yml/badge.svg)](https://github.com/OYNAKZ/OYNA_WEB/actions/workflows/ci.yml)
[![CD](https://github.com/OYNAKZ/OYNA_WEB/actions/workflows/cd.yml/badge.svg)](https://github.com/OYNAKZ/OYNA_WEB/actions/workflows/cd.yml)

OYNA is a web admin dashboard for managing a computer club: PCs, reservations, users, and payments.

This repo now also contains a local Node-based `hub` module for LAN tracking/management between `OYNA_WEB` and `OYNA_LOCAL`.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Run CI checks locally:

```bash
npm run ci
```

## Docker

Build and run the production web container:

```bash
docker compose up --build
```

The app will be available at `http://localhost:8080`.

To build manually without Compose:

```bash
docker build -t oyna-web:local .
docker run --rm -p 8080:80 oyna-web:local
```

## CI/CD

GitHub Actions now has two pipelines:

- `CI`: runs on pushes and pull requests to `main`, `master`, and `develop`; builds the Vite app on Node 20 and Node 22, runs Hub smoke tests, checks production dependencies for critical advisories, builds the Docker image, and uploads the `dist` artifact from the Node 22 build.
- `CD`: runs on pushes to `main` and manual dispatches; publishes a Docker image to GitHub Container Registry and deploys the static build to GitHub Pages.

For GitHub Pages deployment, set the repository Pages source to `GitHub Actions` in the repository settings.

## Run Local Hub (LAN bridge)

Start hub server:

```bash
npm run hub:start
```

By default it runs at `http://0.0.0.0:8787`.

Useful env vars:

- `HUB_PORT` (default `8787`)
- `HUB_HOST` (default `0.0.0.0`)
- `HUB_TOKEN` (optional auth token, pass in `X-Hub-Token`)
- `HUB_HEARTBEAT_TIMEOUT_MS` (default `15000`)
- `HUB_CORS_ORIGIN` (default `*`)

Main hub endpoints:

- `POST /hub/agents/register`
- `POST /hub/agents/:agentId/heartbeat`
- `POST /hub/agents/:agentId/events`
- `GET /hub/agents/:agentId/commands/next`
- `POST /hub/agents/:agentId/commands/:commandId/result`
- `POST /hub/admin/commands`
- `GET /hub/agents`
- `GET /hub/commands`
- `GET /hub/stream` (SSE)
