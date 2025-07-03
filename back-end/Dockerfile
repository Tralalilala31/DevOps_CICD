FROM node:20-alpine AS base

FROM base AS dev
EXPOSE 3000
ENV NODE_ENV=development
CMD ["sh", "-c", "npm install && npx ts-node-dev --respawn --transpile-only server.ts"]

FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund # With devdeps for building
COPY . .
RUN npx tsc --project tsconfig.prod.json

FROM base AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npx", "node", "dist/server.js"]