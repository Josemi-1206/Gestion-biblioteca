FROM node:22-alpine

WORKDIR /app

RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN chmod +x entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["sh", "entrypoint.sh"]