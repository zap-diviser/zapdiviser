FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY whatsapp-node/package.json whatsapp-node/package.json
COPY universal-types/package.json universal-types/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN pnpm deploy --filter=whatsapp-node --prod /prod/whatsapp-node

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend/
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM devforth/spa-to-http AS frontend
COPY --from=build /prod/frontend .

FROM base AS whatsapp-node
COPY --from=build /prod/whatsapp-node /prod/whatsapp-node
WORKDIR /prod/whatsapp-node/
CMD [ "pnpm", "start" ]
