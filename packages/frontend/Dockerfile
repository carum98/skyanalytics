# Stage 1
FROM node:22.2.0-alpine3.20 as builder

ARG VITE_URL_FRONTEND=

WORKDIR /app
COPY package*.json ./
RUN npm install -D typescript
RUN npm install && npm cache clean --force

COPY . .

# Generate nitro types
RUN npx nitro prepare

RUN npm run build
RUN npm prune --production

# Stage 2
FROM node:22.2.0-alpine3.20

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

RUN npm install -g serve

CMD ["npm", "run", "start"]