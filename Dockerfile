ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /dw-backend

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]