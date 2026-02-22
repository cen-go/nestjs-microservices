#!/bin/bash

# Docker Commands for NestJS Microservices

# Function to display usage
usage() {
    echo "Usage: $0 {up|down|build|logs|restart|dev|prod|clean}"
    echo "  up      - Start all services in production mode"
    echo "  down    - Stop and remove all services"
    echo "  build   - Build all Docker images"
    echo "  logs    - Show logs for all services"
    echo "  restart - Restart all services"
    echo "  dev     - Start development environment"
    echo "  prod    - Start production environment"
    echo "  clean   - Remove all containers, images, and volumes"
}

# Function to start production environment
start_production() {
    echo "Starting production environment..."
    docker-compose up -d
    echo "Production environment started!"
    echo "Gateway: http://localhost:3000"
    echo "RabbitMQ Management: http://localhost:15672 (guest/guest)"
}

# Function to start development environment
start_development() {
    echo "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    echo "Development environment started!"
    echo "Gateway: http://localhost:3000"
    echo "RabbitMQ Management: http://localhost:15672 (guest/guest)"
}

# Function to stop all services
stop_services() {
    echo "Stopping all services..."
    docker-compose down
}

# Function to build all images
build_images() {
    echo "Building all Docker images..."
    docker-compose build
}

# Function to show logs
show_logs() {
    echo "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

# Function to restart services
restart_services() {
    echo "Restarting all services..."
    docker-compose restart
}

# Function to clean everything
clean_all() {
    echo "Cleaning up Docker resources..."
    
    read -p "This will remove ALL containers, images, and volumes. Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        echo "Cleanup cancelled."
        exit 1
    fi
    
    docker-compose down -v --rmi all --remove-orphans
    echo "Cleanup completed!"
}

# Function to check Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Main script logic
case "$1" in
    up|prod)
        check_docker
        start_production
        ;;
    dev)
        check_docker
        start_development
        ;;
    down)
        stop_services
        ;;
    build)
        check_docker
        build_images
        ;;
    logs)
        show_logs
        ;;
    restart)
        restart_services
        ;;
    clean)
        clean_all
        ;;
    *)
        usage
        exit 1
        ;;
esac