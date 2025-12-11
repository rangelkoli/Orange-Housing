# Stage 1: Install dependencies and build using Bun
FROM oven/bun:1 AS builder
WORKDIR /app

# Build arguments for Vite (must be available at build time)
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build

# Stage 2: Prepare production dependencies
FROM oven/bun:1 AS prod-deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production

# Stage 3: Run with Node
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY package.json ./

CMD ["npm", "run", "start"]