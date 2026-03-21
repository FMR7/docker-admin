# BUILD FRONTEND
FROM node:22-alpine AS build-frontend

WORKDIR /app/frontend
RUN apk update && apk upgrade --no-cache busybox
COPY frontend/package*.json ./
RUN npm install --production --ignore-scripts
COPY frontend/ .
RUN npm run build


# BUILD BACKEND
FROM node:22-alpine AS build-backend

WORKDIR /app/backend
RUN apk update && apk upgrade --no-cache busybox
COPY package*.json ./
RUN npm install --production --ignore-scripts
COPY backend/ .

# FINAL IMAGE
FROM node:22-alpine

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

WORKDIR /app
RUN apk update && apk upgrade --no-cache busybox
COPY --from=build-backend /app/backend ./backend
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

USER nonroot

EXPOSE 3000
CMD ["node", "index.js"]
