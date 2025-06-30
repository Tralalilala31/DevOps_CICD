
FROM node:20-alpine AS base


FROM base AS dev
WORKDIR /app
EXPOSE 4200
CMD ["sh", "-c", "npm install && npm run start"]

FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist/abubakkar-apps/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200