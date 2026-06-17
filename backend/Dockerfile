FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:prod"]
