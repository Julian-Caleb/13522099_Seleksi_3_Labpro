FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "migrate"]

CMD ["npx", "ts-node", "src/seed/seed.ts"]

EXPOSE 3000

CMD ["npm", "start"]
