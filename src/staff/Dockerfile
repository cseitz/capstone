FROM node:latest

COPY package.json .
RUN npm install

COPY . .
WORKDIR app

ENV NODE_ENV=production
EXPOSE 5000

CMD [ "npm", "run", "start" ]