FROM node:24.22.1-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
USER node
CMD ["node", "api/index.js"]
