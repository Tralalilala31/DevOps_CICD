FROM node:20-alpine as dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]