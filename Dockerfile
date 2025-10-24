# BUILD FRONTEND
FROM node:22-alpine AS build-frontend

WORKDIR /app/frontend
RUN apk update && apk upgrade --no-cache busybox
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build


# BUILD BACKEND
FROM node:22-alpine AS build-backend

WORKDIR /app/backend
RUN apk update && apk upgrade --no-cache busybox
COPY package*.json ./
RUN npm install --production
COPY backend/ .

# FINAL IMAGE
FROM node:22-alpine

WORKDIR /app
RUN apk update && apk upgrade --no-cache busybox
COPY --from=build-backend /app/backend ./backend
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 3000
CMD ["node", "index.js"]
