# Build stage
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
ARG VITE_ENV=production
RUN npm run build:$VITE_ENV

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80