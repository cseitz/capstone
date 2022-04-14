FROM node:latest

WORKDIR /staff
COPY package.json .
COPY ./lib ./lib
RUN npm install

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

ENV IGNORE_BUILD_ERRORS=true
RUN npm run build

ENV MONGO=mongodb://host.docker.internal:27017/capstone_test1

CMD [ "npm", "run", "start" ]