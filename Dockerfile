FROM node:alpine
WORKDIR /server-create-frontend
COPY . ./
RUN npm install
EXPOSE 4200
