FROM node:20-alpine AS base
ARG API_PORT
ENV API_PORT=$API_PORT

FROM base AS dev
EXPOSE 4200
ENV NODE_ENV=development
CMD ["sh", "-c", ". ./generate-env.sh && npm install && npx ng serve --host 0.0.0.0 --poll=1000"]
FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force # With devdeps for building
COPY . .
ENV NODE_ENV=production
RUN . ./generate-env.sh && npx ng build --configuration production

FROM nginx:alpine AS prod
COPY --from=build /app/dist/abubakkar-apps/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200