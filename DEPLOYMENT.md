# Deployment Guide

This project is deployed as a single Docker container that serves:
- Express API (`/api/*`)
- React static frontend (`/`)

## Prerequisites

- Docker 24+
- Node.js 18+ (only needed for local non-Docker validation)

## 1. Configure Environment

Create a root `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Minimum variables:

```env
PORT=8080
DEFAULT_TIMEOUT_MS=4000
CORS_ORIGIN=http://localhost:5173
```

For containerized deployment, `PORT` is used inside the container.

## 2. Build Image

From repository root:

```bash
docker build -t url-health-checker:latest .
```

## 3. Run Container

```bash
docker run -d --name url-health-checker -p 8080:8080 --env-file .env url-health-checker:latest
```

Access app:
- UI: `http://localhost:8080`
- Health check: `http://localhost:8080/api/health`

## 4. Verify Deployment

Quick API validation:

```bash
curl -X POST http://localhost:8080/api/check \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\",\"timeoutMs\":4000}"
```

Expected: JSON with `ok`, `status`, `responseTimeMs`, and `finalUrl`.

## 5. Update / Redeploy

```bash
docker build -t url-health-checker:latest .
docker stop url-health-checker && docker rm url-health-checker
docker run -d --name url-health-checker -p 8080:8080 --env-file .env url-health-checker:latest
```

## 6. Logs and Troubleshooting

```bash
docker logs -f url-health-checker
```

If startup fails:
- confirm `.env` exists and has valid values
- ensure port `8080` is free on host
- rebuild image without cache if needed: `docker build --no-cache -t url-health-checker:latest .`
