FROM node:20-alpine AS base

FROM base AS dev
WORKDIR /app
EXPOSE 3000
ENV NODE_ENV=development
CMD ["sh", "-c", "npm install && npm run dev"]
