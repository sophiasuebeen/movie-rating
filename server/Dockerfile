# Backend (Node.js + Express)
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma files
COPY server/prisma ./prisma
COPY server/src ./src

# Install Prisma dependencies
RUN npm run prisma:generate

# Build application
ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]
