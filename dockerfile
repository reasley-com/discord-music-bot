FROM node:16.14.0-alpine
WORKDIR /app
COPY . .
RUN npm i
CMD [ "npm", "start" ]
EXPOSE 3000