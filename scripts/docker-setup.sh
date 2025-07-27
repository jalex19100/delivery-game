#!/bin/bash

# Delivery Game Docker Setup Script

echo "🚚 Setting up Delivery Game Docker Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Function to start development environment
start_dev() {
    echo "🔧 Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    
    echo ""
    echo "🎉 Development environment is starting up!"
    echo ""
    echo "📱 Services available at:"
    echo "   • Game: http://localhost:8000"
    echo "   • Frontend Dev: http://localhost:3000"
    echo "   • phpMyAdmin: http://localhost:8080"
    echo "   • MailHog: http://localhost:8025"
    echo ""
    echo "🔍 To view logs: docker-compose -f docker-compose.dev.yml logs -f"
    echo "🛑 To stop: docker-compose -f docker-compose.dev.yml down"
}

# Function to start production environment
start_prod() {
    echo "🚀 Starting production environment..."
    docker-compose up -d
    
    echo ""
    echo "🎉 Production environment is starting up!"
    echo ""
    echo "📱 Services available at:"
    echo "   • Game: http://localhost:8000"
    echo "   • phpMyAdmin: http://localhost:8080"
    echo ""
    echo "🔍 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
}

# Function to stop all containers
stop_all() {
    echo "🛑 Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All containers stopped"
}

# Function to rebuild containers
rebuild() {
    echo "🔨 Rebuilding containers..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.dev.yml up -d
    echo "✅ Containers rebuilt and started"
}

# Function to show status
status() {
    echo "📊 Container Status:"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to show logs
logs() {
    echo "📋 Showing logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Main script logic
case "${1:-dev}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_all
        ;;
    "rebuild")
        rebuild
        ;;
    "status")
        status
        ;;
    "logs")
        logs
        ;;
    *)
        echo "Usage: $0 {dev|prod|stop|rebuild|status|logs}"
        echo ""
        echo "Commands:"
        echo "  dev     - Start development environment (default)"
        echo "  prod    - Start production environment"
        echo "  stop    - Stop all containers"
        echo "  rebuild - Rebuild and restart containers"
        echo "  status  - Show container status"
        echo "  logs    - Show container logs"
        exit 1
        ;;
esac 