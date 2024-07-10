FROM "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm"

WORKDIR /workspace

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .