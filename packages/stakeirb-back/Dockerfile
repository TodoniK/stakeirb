FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "run", "start"]
