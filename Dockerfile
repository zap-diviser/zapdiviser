FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk --no-cache add git

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod ./backend
RUN pnpm deploy --filter=frontend --prod ./frontend
RUN pnpm deploy --filter=whatsapp-node --prod ./whatsapp-node

FROM base AS backend
COPY --from=build /backend /prod/backend
WORKDIR /prod/backend
CMD [ "pnpm", "start:prod" ]

FROM devforth/spa-to-http as frontend
COPY --from=build /frontend .

FROM base AS whatsapp-node
COPY --from=build /whatsapp-node /prod/whatsapp-node
WORKDIR /prod/whatsapp-node
CMD [ "pnpm", "start" ]
