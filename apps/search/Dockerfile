# Multi-stage build for NestJS Search service
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/search ./apps/search
COPY libs ./libs

# Generate Prisma client
RUN npx prisma generate --schema=./apps/search/prisma/schema.prisma

# Build the application
RUN npm run build search

# Production stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from development stage
COPY --from=development /usr/src/app/dist ./dist

# Copy generated Prisma client from development stage
COPY --from=development /usr/src/app/node_modules/@prisma/search-db-client ./node_modules/@prisma/search-db-client

# Copy Prisma schema for migrations
COPY --from=development /usr/src/app/apps/search/prisma ./apps/search/prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

CMD ["node", "dist/apps/search/main"]