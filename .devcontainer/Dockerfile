FROM "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm"

WORKDIR /workspace

COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/

RUN npm install && npm cache clean --force

COPY . .