FROM node:20-alpine AS base

FROM base AS dev
EXPOSE 4200
CMD ["sh", "-c", "npm install && npm run dev"]

FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force # With devdeps for building
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist/abubakkar-apps/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200