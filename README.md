# URL Health Checker

Production-ready full-stack boilerplate with:
- Backend: Node.js + Express API
- Frontend: React + Vite
- Deployment: single Docker container serving both API and static frontend

## Project Structure

```text
.
|- backend/
|  |- routes/check.js
|  |- package.json
|  '- server.js
|- frontend/
|  |- src/
|  |  |- App.jsx
|  |  |- main.jsx
|  |  '- styles.css
|  |- index.html
|  |- package.json
|  '- vite.config.js
|- .env.example
|- Dockerfile
|- package.json
'- README.md
```

## API

### `POST /api/check`
Request:

```json
{
  "url": "https://example.com",
  "timeoutMs": 4000
}
```

Success response:

```json
{
  "ok": true,
  "url": "https://example.com",
  "finalUrl": "https://example.com/",
  "status": 200,
  "responseTimeMs": 125,
  "checkedAt": "2026-02-15T12:34:56.000Z"
}
```

## Local Development

1. Install root helper dependency:

```bash
npm install
```

2. Install app dependencies:

```bash
npm run install:all
```

3. Start backend + frontend together:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8080`

## Production Build (Local)

```bash
npm run build
npm run start
```

This serves `frontend/dist` from Express on `http://localhost:8080`.

## Docker (Single Container)

```bash
docker build -t url-health-checker:latest .
docker run --rm -p 8080:8080 url-health-checker:latest
```

Open `http://localhost:8080`.

## Environment Variables

Copy `.env.example` to `.env` in project root:

```env
PORT=8080
DEFAULT_TIMEOUT_MS=4000
CORS_ORIGIN=http://localhost:5173
```
