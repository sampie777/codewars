# Docker file, thanks to: https://dzone.com/articles/how-to-dockerize-reactjs-app
# Build stage
FROM node:22-alpine3.23 AS build

RUN corepack enable

RUN mkdir /app
WORKDIR /app

COPY . .

# install app dependencies
RUN yarn install

# build app
ENV NODE_ENV=production
RUN yarn build

# Package stage
FROM nginx:1.31-alpine

# nginx configuration
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
