FROM node:10-alpine

RUN apk add git

RUN mkdir /usr/bot
WORKDIR /usr/bot

COPY package.json /usr/bot
COPY yarn.lock /usr/bot

RUN yarn

COPY tsconfig.json /usr/bot
COPY ./src /usr/bot/src
RUN yarn build

CMD ["node", "dist/index.js"]
