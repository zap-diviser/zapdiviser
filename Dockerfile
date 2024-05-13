FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app/
COPY pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
COPY . .
RUN pnpm install -r --frozen-lockfile
RUN pnpm run -r build

FROM base AS backend
WORKDIR /code/
COPY --from=build /usr/src/app/backend/dist .
EXPOSE 8000
CMD [ "node", "--max-old-space-size=4096", "main.js" ]

FROM devforth/spa-to-http AS frontend
COPY --from=build /usr/src/app/frontend/dist .

FROM base AS whatsapp-node
WORKDIR /code/
COPY --from=build /usr/src/app/whatsapp-node/dist .
CMD [ "node", "index.js" ]
