FROM node:24.12.0-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "api/index.js"]