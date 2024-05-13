FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app/
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile && mkdir prod
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN pnpm deploy --filter=whatsapp-node --prod /prod/whatsapp-node
RUN cd prod && pnpm run -r build

FROM base AS backend
WORKDIR /code/
COPY --from=build /prod/backend .
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM devforth/spa-to-http AS frontend
COPY --from=build /prod/frontend .

FROM base AS whatsapp-node
WORKDIR /code/
COPY --from=build /prod/whatsapp-node .
CMD [ "pnpm", "start" ]
