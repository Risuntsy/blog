# syntax=docker/dockerfile:1.7

FROM docker.io/library/node:22-alpine AS build

WORKDIR /app

RUN apk add --no-cache git
COPY --from=docker.io/oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN --mount=type=secret,id=content_repo,required=false \
  if [ -f /run/secrets/content_repo ]; then \
    export CONTENT_REPO="$(cat /run/secrets/content_repo)"; \
  fi; \
  bun scripts/sync-content.mjs && bun run --bun astro build && bun run --bun pagefind --site dist

FROM docker.io/library/nginx:1.29-alpine AS runtime

LABEL org.opencontainers.image.title="Risun's Blog" \
  org.opencontainers.image.source="https://github.com/Risuntsy/blog"

COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=nginx:nginx /app/dist/ /usr/share/nginx/html/

USER nginx

EXPOSE 8080

ENTRYPOINT []

CMD ["nginx", "-g", "daemon off;"]
