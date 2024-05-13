FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod /backend
RUN pnpm deploy --filter=frontend --prod /frontend
RUN pnpm deploy --filter=whatsapp-node --prod /whatsapp-node

FROM base AS backend
COPY --from=build /backend /code
WORKDIR /code
EXPOSE 8000
CMD [ "pnpm", "start:prod" ]

FROM devforth/spa-to-http AS frontend
COPY --from=build /frontend .
EXPOSE 8080
CMD [ "pnpm", "start" ]

FROM base AS whatsapp-node
COPY --from=build /whatsapp-node /code
WORKDIR /code
CMD [ "pnpm", "start" ]
