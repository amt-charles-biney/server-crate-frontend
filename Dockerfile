FROM node:alpine
WORKDIR /server-create-frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 4200
