# BUILD FRONTEND
FROM node:slim AS build-frontend

WORKDIR /app/frontend
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY frontend/package*.json ./
RUN npm install --production --ignore-scripts
COPY frontend/ .
RUN npm run build


# BUILD BACKEND
FROM node:slim AS build-backend

WORKDIR /app/backend
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --production --ignore-scripts
COPY backend/ .

# FINAL IMAGE
FROM node:slim

RUN groupadd -r nonroot && useradd -r -g nonroot nonroot

WORKDIR /app
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY --from=build-backend /app/backend ./backend
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

USER nonroot

EXPOSE 3000
CMD ["node", "index.js"]
