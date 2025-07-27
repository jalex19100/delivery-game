#!/bin/bash

# Delivery Game Deployment Script for LAMP Hosting

echo "🚚 Deploying Delivery Game to LAMP Hosting..."

# Configuration
REMOTE_HOST="${REMOTE_HOST:-your-server.com}"
REMOTE_USER="${REMOTE_USER:-username}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/html/delivery-game}"
BACKUP_PATH="${BACKUP_PATH:-/var/www/html/backups}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
if [ "$REMOTE_HOST" = "your-server.com" ]; then
    print_error "Please set REMOTE_HOST environment variable"
    echo "Usage: REMOTE_HOST=your-server.com REMOTE_USER=username ./deploy.sh"
    exit 1
fi

# Build production assets
print_status "Building production assets..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Failed to build assets"
    exit 1
fi

# Create deployment package
print_status "Creating deployment package..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy files to deployment directory
cp -r public "$DEPLOY_DIR/"
cp -r src "$DEPLOY_DIR/"
cp -r database "$DEPLOY_DIR/"
cp composer.json "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp README.md "$DEPLOY_DIR/"
cp env.example "$DEPLOY_DIR/"

# Remove development files
rm -rf "$DEPLOY_DIR/public/assets/dist/node_modules"
rm -rf "$DEPLOY_DIR/public/assets/dist/.git"

# Create deployment archive
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"

print_status "Deployment package created: ${DEPLOY_DIR}.tar.gz"

# Deploy to remote server
print_status "Deploying to $REMOTE_HOST..."

# Create backup of current deployment
print_status "Creating backup..."
ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $BACKUP_PATH && if [ -d $REMOTE_PATH ]; then tar -czf $BACKUP_PATH/delivery-game-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C $REMOTE_PATH .; fi"

# Upload deployment package
print_status "Uploading files..."
scp "${DEPLOY_DIR}.tar.gz" "$REMOTE_USER@$REMOTE_HOST:/tmp/"

# Extract and deploy on remote server
ssh "$REMOTE_USER@$REMOTE_HOST" << EOF
    # Stop web server temporarily
    sudo systemctl stop apache2
    
    # Remove old deployment
    rm -rf $REMOTE_PATH
    
    # Create new deployment directory
    mkdir -p $REMOTE_PATH
    
    # Extract new deployment
    tar -xzf /tmp/${DEPLOY_DIR}.tar.gz -C /tmp/
    cp -r /tmp/$DEPLOY_DIR/* $REMOTE_PATH/
    
    # Set up environment
    cd $REMOTE_PATH
    if [ ! -f .env ]; then
        cp env.example .env
        echo "Please configure your .env file with production settings"
    fi
    
    # Install PHP dependencies
    composer install --no-dev --optimize-autoloader
    
    # Set permissions
    sudo chown -R www-data:www-data $REMOTE_PATH
    sudo chmod -R 755 $REMOTE_PATH
    sudo chmod -R 775 $REMOTE_PATH/database
    
    # Start web server
    sudo systemctl start apache2
    
    # Clean up
    rm /tmp/${DEPLOY_DIR}.tar.gz
    rm -rf /tmp/$DEPLOY_DIR
EOF

# Clean up local files
rm -rf "$DEPLOY_DIR"
rm "${DEPLOY_DIR}.tar.gz"

print_status "Deployment completed successfully!"
print_status "Your game is now available at: http://$REMOTE_HOST/delivery-game"

# Post-deployment checklist
echo ""
echo "📋 Post-deployment checklist:"
echo "   • Configure .env file with production database settings"
echo "   • Import database schema: mysql -u username -p database_name < database/schema.sql"
echo "   • Test the application functionality"
echo "   • Set up SSL certificate if needed"
echo "   • Configure backup strategy"
echo "" 