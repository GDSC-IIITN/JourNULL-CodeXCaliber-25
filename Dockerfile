# Multi-stage build for JourNULL

# Base stage with shared dependencies
FROM node:23-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

# Install Bun
FROM base AS bun-installer
RUN apk add --no-cache curl unzip
RUN curl -fsSL https://bun.sh/install | bash

# Install dependencies
FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build backend
FROM deps AS backend-builder
ENV BUN_RUNTIME="$HOME/.bun/bin/bun"
COPY --from=bun-installer /root/.bun /root/.bun
ENV PATH="/root/.bun/bin:$PATH"
WORKDIR /app
RUN pnpm run db:generate
RUN cd apps/backend && pnpm run build

# Build frontend
FROM deps AS frontend-builder
WORKDIR /app
RUN cd apps/frontend && pnpm run build

# Production stage
FROM node:23-alpine AS runner
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/apps/frontend/.next /app/apps/frontend/.next
COPY --from=frontend-builder /app/apps/frontend/public /app/apps/frontend/public
COPY --from=frontend-builder /app/apps/frontend/package.json /app/apps/frontend/package.json
COPY --from=frontend-builder /app/apps/frontend/next.config.ts /app/apps/frontend/next.config.ts

# Copy built backend
COPY --from=backend-builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=backend-builder /app/apps/backend/package.json /app/apps/backend/package.json
COPY --from=backend-builder /app/apps/backend/wrangler.jsonc /app/apps/backend/wrangler.jsonc

# Copy root files needed for operation
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Install production dependencies only
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install --prod --frozen-lockfile

# Install Bun for production
RUN apk add --no-cache curl
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Expose ports
EXPOSE 3000
EXPOSE 8787

# Start both frontend and backend
CMD ["pnpm", "run", "dev"]