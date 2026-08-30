# Multi-stage Dockerfile for Tally Web (Next.js)
# Build stage: Install dependencies and build the application
FROM node:20-alpine AS dependencies

WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build

COPY . .
RUN pnpm build

# Runtime stage: Minimal production image
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application and dependencies
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=15s \
    CMD node -e "fetch('http://127.0.0.1:3000').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node_modules/.bin/next", "start"]
