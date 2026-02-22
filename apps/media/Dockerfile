# Multi-stage build for NestJS Media service
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/media ./apps/media
COPY libs ./libs

# Generate Prisma client
RUN npx prisma generate --schema=./apps/media/prisma/schema.prisma

# Build the application
RUN npm run build media

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
COPY --from=development /usr/src/app/node_modules/@prisma/media-db-client ./node_modules/@prisma/media-db-client

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

CMD ["node", "dist/apps/media/main"]