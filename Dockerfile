# syntax=docker/dockerfile:1.7

FROM docker.io/library/node:22-alpine AS build

WORKDIR /app

RUN apk add --no-cache git \
  && corepack enable \
  && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=secret,id=content_repo,required=false \
  if [ -f /run/secrets/content_repo ]; then \
    export CONTENT_REPO="$(cat /run/secrets/content_repo)"; \
  fi; \
  pnpm run build

FROM docker.io/library/nginx:1.29-alpine AS runtime

LABEL org.opencontainers.image.title="Risun's Blog" \
  org.opencontainers.image.source="https://github.com/Risuntsy/blog" \
  org.opencontainers.image.licenses="OFL-1.1"

COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=nginx:nginx /app/dist/ /usr/share/nginx/html/
COPY --from=build /app/third_party/fusion-pixel-font/ /usr/share/licenses/fusion-pixel-font/

USER nginx

EXPOSE 8080

ENTRYPOINT []

CMD ["nginx", "-g", "daemon off;"]
