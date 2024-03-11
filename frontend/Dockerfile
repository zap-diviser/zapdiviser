FROM node:20-slim as base

ARG API_URL

ENV API_URL=${API_URL}
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV DISABLE_HUSKY="true"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml /app/

RUN NODE_ENV=development pnpm install

COPY . /app

RUN pnpm run build

EXPOSE 8000

CMD ["pnpm", "start"]
