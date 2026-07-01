FROM node:22-alpine

WORKDIR /dw-backend

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV PORT=3000
EXPOSE $PORT

ENV NODE_ENV=production

CMD ["npm", "start"]