FROM node:20-alpine AS build

WORKDIR /app
COPY ./edumentor-frontend/package.json ./edumentor-frontend/package-lock.json ./
RUN npm ci
COPY ./edumentor-frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
