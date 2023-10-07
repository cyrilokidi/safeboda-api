# syntax=docker/dockerfile:1

FROM node:16.17.0-alpine As development

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=dev

COPY . .

RUN npm run build

FROM node:16.17.0-alpine As production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]