# Developer Guide (Local IDE)

This guide explains how to run and debug the project locally in an IDE (VS Code, WebStorm, or similar).

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm 9+
- Git

## 1. Open Project in IDE

Open the repository root folder:

```bash
URL-Health-Checker/
```

Keep terminal working directory at project root unless noted.

## 2. Install Dependencies

Install root tooling and app dependencies:

```bash
npm install
npm run install:all
```

## 3. Configure Environment

Create `.env` from `.env.example` in project root:

```bash
cp .env.example .env
```

Default values:

```env
PORT=8080
DEFAULT_TIMEOUT_MS=4000
CORS_ORIGIN=http://localhost:5173
```

## 4. Run in Development

Run backend + frontend together:

```bash
npm run dev
```

Endpoints:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Health endpoint: `http://localhost:8080/api/health`

## 5. IDE Debug Workflow

- Backend entry file: `backend/server.js`
- Frontend entry file: `frontend/src/main.jsx`
- API route to debug: `backend/routes/check.js`

Set breakpoints in backend route handlers and React component event handlers (`handleSubmit` in `frontend/src/App.jsx`).

## 6. Production-like Local Run

```bash
npm run build
npm run start
```

This serves built frontend from Express on `http://localhost:8080`.

## 7. Common Issues

- `EADDRINUSE` on port 8080: stop the process using that port or change `PORT` in `.env`.
- Frontend cannot reach API: ensure backend is running and Vite proxy in `frontend/vite.config.js` points to `http://localhost:8080`.
- Dependency errors: remove `node_modules` and reinstall with `npm run install:all`.
