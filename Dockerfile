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
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=whatsapp-node --prod /prod/whatsapp-node

FROM base AS backend
WORKDIR /code/
COPY --from=build /prod/backend .
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM devforth/spa-to-http AS frontend
COPY --from=build /usr/src/app/frontend/dist .

FROM base AS whatsapp-node
WORKDIR /code/
COPY --from=build /usr/src/app/whatsapp-node .
CMD [ "pnpm", "start" ]
