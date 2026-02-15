# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app/backend

# Install backend dependencies only for runtime.
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source and built frontend assets.
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
