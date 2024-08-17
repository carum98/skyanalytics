# Stage 1
FROM node:22.2.0-alpine3.20 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install -D typescript
RUN npm install && npm cache clean --force

COPY . .
RUN npm run build
RUN npm prune --production

# Stage 2
FROM node:22.2.0-alpine3.20

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "preview"]