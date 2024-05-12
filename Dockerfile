FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN pnpm deploy --filter=whatsapp-node --prod /prod/whatsapp-node

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
EXPOSE 8000
CMD [ "pnpm", "start:prod" ]

FROM devforth/spa-to-http AS frontend
COPY --from=build /prod/frontend .
EXPOSE 8080
CMD [ "pnpm", "start" ]

FROM base AS whatsapp-node
COPY --from=build /prod/whatsapp-node /prod/whatsapp-node
WORKDIR /prod/whatsapp-node
CMD [ "pnpm", "start" ]
