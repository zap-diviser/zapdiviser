# Zapdiviser

## Setup

```bash
docker build . -t zapdiviser
docker build . --target whatsapp-node --tag whatsapp
```

## Run

```bash
docker compose -f compose.yaml -f compose.dev.yaml up
cd backend
pnpm start:dev
cd ../frontend
pnpm dev
```
