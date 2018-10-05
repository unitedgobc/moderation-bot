FROM node:10-alpine

RUN apk add git

RUN mkdir /usr/web
WORKDIR /usr/web

COPY package.json /usr/web
COPY yarn.lock /usr/web

RUN yarn

COPY ./src /usr/web

CMD ["node", "index.js"]
