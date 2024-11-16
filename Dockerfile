# Etapa 1: Construir la aplicación
FROM node:20.18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -f
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20.18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -f --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000

CMD ["node", "dist/main"]
