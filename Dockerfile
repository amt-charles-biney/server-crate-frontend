FROM node:alpine as build
WORKDIR /server-create-frontend
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build --omit=dev

FROM nginx:alpine
# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/*.conf

# Copy your custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=build /server-create-frontend/dist/server-crate-frontend/browser /usr/share/nginx/html
