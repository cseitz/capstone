FROM node:latest

WORKDIR /app
COPY package.json .
COPY ./lib ./lib
RUN npm install

COPY . .

ENV NODE_ENV=production
EXPOSE 5001

ENV IGNORE_BUILD_ERRORS=true
RUN npm run build

CMD [ "npm", "run", "start" ]