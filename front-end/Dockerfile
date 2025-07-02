FROM node:20-alpine AS base
ARG API_URL
ENV API_URL=$API_URL

FROM base AS dev
EXPOSE 4200
ENV NODE_ENV=development
CMD ["sh", "-c", ". ./generate-env.sh && npm install && npm run dev"]

FROM base AS build
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force # With devdeps for building
COPY . .
RUN . ./generate-env.sh && npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist/abubakkar-apps/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200