# Docker Setup for NestJS Microservices

This document provides instructions for running the NestJS microservices application using Docker.

## Prerequisites

1. Docker and Docker Compose installed on your system
2. Node.js and npm (for local development without Docker)
3. Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual configuration values.

## Quick Start

### Using the provided script (recommended)

Make the script executable and use it:

```bash
chmod +x docker-commands.sh

# Start production environment
./docker-commands.sh prod

# Start development environment (with hot reload)
./docker-commands.sh dev

# Stop all services
./docker-commands.sh down

# View logs
./docker-commands.sh logs
```

### Using Docker Compose directly

#### Production Environment
```bash
docker-compose up -d
```

#### Development Environment (with hot reload)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### Stop Services
```bash
docker-compose down
```

## Services Overview

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 3000 | HTTP gateway that routes requests to microservices |
| Auth | Authentication and authorization service |
| Catalog | Product catalog management service |
| Media | Media upload and management service (Cloudinary) |
| Search | Search functionality service |
| PostgreSQL | 5432 | Database for all services |
| RabbitMQ | 5672/15672 | Message broker (AMQP port / Management UI) |

## Access Points

- **Gateway API**: http://localhost:3000
- **RabbitMQ Management UI**: http://localhost:15672 (username: `guest`, password: `guest`)
- **PostgreSQL Database**: `localhost:5432` (username: `postgres`, password: `postgres`)

## Database Setup

Each service has its own database schema. The Docker setup automatically:

1. Creates separate databases for each service
2. Runs Prisma migrations on startup
3. Generates Prisma clients

### Database Names
- Auth Service: `auth_db`
- Catalog Service: `catalog_db`
- Media Service: `media_db`
- Search Service: `search_db`

## Environment Variables

Key environment variables that need to be configured in `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Cloudinary Configuration (for Media Service)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Service-specific database URLs (automatically configured for Docker)
AUTH_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/auth_db
CATALOG_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/catalog_db
MEDIA_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/media_db
SEARCH_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/search_db
```

## Development vs Production

### Development Mode (`docker-compose.dev.yml`)
- Hot reload enabled
- Source code mounted as volumes
- Prisma migrations run in development mode
- Easier debugging

### Production Mode (`docker-compose.yml`)
- Optimized multi-stage builds
- Production dependencies only
- Prisma migrations run in deploy mode
- Non-root user for security

## Building Individual Services

Each service has its own Dockerfile. To build a specific service:

```bash
# Build gateway service
cd apps/gateway
docker build -t nestjs-gateway .

# Build auth service
cd apps/auth
docker build -t nestjs-auth .
```

## Troubleshooting

### 1. Port Conflicts
If ports are already in use, modify the port mappings in `docker-compose.yml`.

### 2. Database Connection Issues
Ensure PostgreSQL container is healthy:
```bash
docker-compose logs postgres
```

### 3. RabbitMQ Connection Issues
Check RabbitMQ health:
```bash
docker-compose logs rabbitmq
```

### 4. Prisma Migration Errors
Run migrations manually:
```bash
# For auth service
docker-compose exec auth npx prisma migrate deploy --schema=./apps/auth/prisma/schema.prisma
```

### 5. Clean Start
To completely reset everything:
```bash
./docker-commands.sh clean
```

## Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f gateway
```

### Check Container Status
```bash
docker-compose ps
```

### View Resource Usage
```bash
docker stats
```

## Security Notes

1. **Change default passwords** in production:
   - PostgreSQL: `POSTGRES_PASSWORD`
   - RabbitMQ: `RABBITMQ_DEFAULT_PASS`
   - JWT Secret: `JWT_SECRET`

2. **Use SSL/TLS** for database and RabbitMQ connections in production

3. **Regularly update** Docker images with security patches

4. **Never commit** `.env` files to version control

## Next Steps

1. Configure SSL/TLS certificates
2. Set up monitoring (Prometheus, Grafana)
3. Implement CI/CD pipeline
4. Configure load balancing
5. Set up backup strategy for databases