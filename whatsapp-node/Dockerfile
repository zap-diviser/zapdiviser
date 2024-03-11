FROM node:20-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV DISABLE_HUSKY="true"
RUN corepack enable
RUN apk add git

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN pnpm install --prod --no-frozen-lockfile

FROM base AS build
RUN NODE_ENV=development pnpm install --no-frozen-lockfile
RUN pnpm run build

FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

CMD ["pnpm", "start"]
