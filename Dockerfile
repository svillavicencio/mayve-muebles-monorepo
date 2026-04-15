# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: pruner
# Scopes the monorepo to only the files needed by the `api` workspace.
# Outputs:
#   out/json/  — package manifests + lockfile (stable layer, rarely changes)
#   out/full/  — full pruned source
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS pruner
RUN npm install -g turbo@latest
WORKDIR /app
COPY . .
RUN turbo prune --scope=api --docker

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: installer
# Installs dependencies against the pruned lockfile.
# Copying manifests before source maximises layer cache reuse.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN npm install

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: builder
# Generates the Prisma client (must run before nest build) and compiles the API.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
RUN cd apps/api && npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 4: runner
# Minimal production image. No build tooling, no source, no devDependencies.
#
# Runtime env vars (inject at `docker run` — never baked in):
#   DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY,
#   SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Hoisted node_modules (includes generated .prisma/client engines)
COPY --from=builder /app/node_modules ./node_modules

# Workspace root manifest (needed for module resolution)
COPY --from=builder /app/package.json ./package.json

# API package manifest and compiled output
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Static assets served by ServeStaticModule (rootPath: join(__dirname, '..', 'public'))
COPY --from=builder /app/apps/api/public ./apps/api/public

# @mayve/database workspace package — node_modules/@mayve/database symlinks here at runtime
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/index.js ./packages/database/index.js

# Prisma schema (referenced by the client and needed for potential migrate commands)
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

EXPOSE 3000

# Drop to the non-root `node` user pre-baked into node:alpine (UID 1000)
USER node

# Volvemos a la raíz para evitar errores de rutas repetidas
WORKDIR /app
CMD ["node", "apps/api/dist/main"]
