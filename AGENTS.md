# Repository Guidelines

## Project Structure & Module Organization
This repository is a Node.js + React full-stack app packaged for single-container deployment.

- `backend/`: Express API (`server.js`, `routes/check.js`) and backend dependencies.
- `frontend/`: Vite React app (`src/`, `index.html`, `vite.config.js`) and frontend dependencies.
- `Dockerfile`: production build/runtime image for serving API + built frontend together.
- `.env.example`: baseline environment variables.
- `README.md`: setup, API contract, and deployment notes.

Keep backend concerns (validation, request timing, API responses) in `backend/` and UI/state logic in `frontend/src/`.

## Build, Test, and Development Commands
Run commands from the relevant module directory unless noted.

- `cd backend && npm install`: install backend dependencies.
- `cd frontend && npm install`: install frontend dependencies.
- `cd backend && npm run dev`: start API locally (default `http://localhost:8080`).
- `cd frontend && npm run dev`: start Vite dev server (default `http://localhost:5173`).
- `docker build -t codeekai/url-health:latest .`: build production image.
- `docker run -p 8080:8080 codeekai/url-health:latest`: run app in container.

## Coding Style & Naming Conventions
Use modern JavaScript with consistent formatting.

- Indentation: 2 spaces.
- Prefer `const`/`let`, async/await, and small pure helper functions.
- React: functional components + hooks; component files in PascalCase (for example `HealthCheckForm.jsx`).
- Backend modules/routes: lowercase filenames (for example `check.js`).
- Use clear API field names matching the README contract (`responseTimeMs`, `finalUrl`, `checkedAt`).

If ESLint/Prettier configs are added, run them before opening a PR and keep formatting-only changes separate when possible.

## Testing Guidelines
Automated tests are not yet present. Add tests with new behavior changes.

- Frontend: component/interaction tests near source (for example `frontend/src/components/HealthCheckForm.test.jsx`).
- Backend: route/service tests under `backend/tests/` (for example `check.test.js`).
- Focus coverage on URL validation, timeout handling, redirects, and error responses.

## Commit & Pull Request Guidelines
Current history contains a single baseline commit (`Initial commit`), so keep commits short, imperative, and scoped.

- Commit examples: `Add timeout validation for /api/check`, `Handle fetch abort errors in UI`.
- Prefer one logical change per commit.
- PRs should include: purpose, key changes, local test/run steps, and sample API/UI output for behavior changes.
- Link related issues and call out config/env changes explicitly.

## Security & Configuration Tips
- Never commit real secrets; use `.env` locally and keep `.env.example` updated.
- Validate and sanitize user-provided URLs server-side before requesting remote targets.
- Use reasonable request timeouts to avoid hanging checks and resource exhaustion.
