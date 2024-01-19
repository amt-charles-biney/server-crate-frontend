FROM node:alpine as build
WORKDIR /server-create-frontend
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build --omit=dev

COPY --from=build /app/dist/server-create-frontend /usr/share/nginx/html/server-create-frontend
