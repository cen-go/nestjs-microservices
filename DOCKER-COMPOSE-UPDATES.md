"# Docker Compose Updates Summary

## Changes Made

### 1. PostgreSQL Service Enhancement
- Added `POSTGRES_MULTIPLE_DATABASES` environment variable to create all required databases
- Added initialization script `init-databases.sh` mounted to `/docker-entrypoint-initdb.d/`
- The script automatically creates: `auth_db`, `catalog_db`, `media_db`, and `search_db`

### 2. Environment Variables with Default Values
- **JWT_SECRET**: Now has a more descriptive default value reminding users to change it in production
- **JWT_EXPIRATION**: Now supports environment variable override with default value of `1d`
- **Cloudinary Variables**: Added default values for development/testing:
  - `CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME:-demo-cloud}`
  - `CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY:-demo-key}`
  - `CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET:-demo-secret}`

### 3. Database Initialization Script
Created `init-databases.sh` that:
- Runs automatically when PostgreSQL container starts
- Creates all specified databases from `POSTGRES_MULTIPLE_DATABASES` environment variable
- Grants all privileges to the PostgreSQL user

## How to Use

### Starting the Services
```bash
docker-compose up -d
```

### Checking Database Creation
```bash
# Connect to PostgreSQL
docker exec -it nestjs-postgres psql -U postgres -d postgres

# List databases
\\l
```

### Customizing Environment Variables
Create a `.env` file in the project root with your values:
```bash
# Copy from .env.example if available
# Or create your own with:
JWT_SECRET=your-actual-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Notes
- The initialization script only runs on first container start (when database is empty)
- Default values allow the system to start without external dependencies for development
- For production, always set proper environment variables
- The script has been made executable with appropriate permissions"