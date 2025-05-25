FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npx tailwindcss init -p

EXPOSE 3000

CMD ["npm", "start"]