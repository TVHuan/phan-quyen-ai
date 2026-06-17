FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY .yarnrc.yml yarn.lock ./
COPY package.json ./

RUN yarn install --immutable

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:prod"]
