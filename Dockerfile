FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod backend
RUN pnpm deploy --filter=frontend --prod frontend
# RUN pnpm deploy --filter=whatsapp-node --prod whatsapp-node

FROM base AS backend
COPY --from=build /app/backend .
CMD [ "pnpm", "start:prod" ]

FROM devforth/spa-to-http as frontend
COPY --from=build /app/frontend .

# FROM base AS whatsapp-node
# COPY --from=build /app/whatsapp-node .
# CMD [ "pnpm", "start" ]
