# BUILD FRONTEND
FROM node:22 AS build-frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build


# BUILD BACKEND
FROM node:22

WORKDIR /app
COPY backend backend
COPY --from=build-frontend /app/frontend/dist frontend/dist
WORKDIR /app/backend
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
