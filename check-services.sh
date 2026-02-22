#!/bin/bash

# Health check script for NestJS Microservices

echo "Checking Docker containers status..."
echo "===================================="

docker-compose ps

echo ""
echo "Testing service endpoints..."
echo "===================================="

# Check Gateway
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health > /dev/null 2>&1; then
    echo "✓ Gateway (port 3000): HEALTHY"
else
    echo "✗ Gateway (port 3000): UNHEALTHY or /health endpoint not implemented"
fi

# Check RabbitMQ Management
if curl -s -o /dev/null -w "%{http_code}" http://localhost:15672 > /dev/null 2>&1; then
    echo "✓ RabbitMQ Management (port 15672): ACCESSIBLE"
else
    echo "✗ RabbitMQ Management (port 15672): NOT ACCESSIBLE"
fi

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✓ PostgreSQL (port 5432): HEALTHY"
else
    echo "✗ PostgreSQL (port 5432): UNHEALTHY"
fi

echo ""
echo "Container resource usage..."
echo "===================================="

docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | head -7

echo ""
echo "Logs from last 5 minutes..."
echo "===================================="

docker-compose logs --since=5m | tail -20