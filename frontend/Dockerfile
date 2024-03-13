FROM node:20-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN pnpm install --prod

FROM base AS build
RUN NODE_ENV=development pnpm install
RUN pnpm run build

FROM devforth/spa-to-http

COPY --from=build /app/dist .
