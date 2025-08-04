#!/bin/bash

# Deployment Status Check Script for Shared Hosting

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REMOTE_HOST="${REMOTE_HOST:-your-server.com}"
REMOTE_USER="${REMOTE_USER:-username}"
REMOTE_PATH="${REMOTE_PATH:-/public_html/delivery-game}"
APP_URL="http://$REMOTE_HOST/delivery-game"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

# Check if required environment variables are set
if [ "$REMOTE_HOST" = "your-server.com" ]; then
    print_error "Please set REMOTE_HOST environment variable"
    echo "Usage: REMOTE_HOST=your-server.com REMOTE_USER=username ./scripts/check-deployment.sh"
    exit 1
fi

echo "🔍 Checking deployment status for $APP_URL"
echo ""

# Check 1: SSH Connection
print_header "Testing SSH connection..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes "$REMOTE_USER@$REMOTE_HOST" exit 2>/dev/null; then
    print_status "SSH connection successful"
else
    print_error "SSH connection failed"
    exit 1
fi

# Check 2: Application Directory
print_header "Checking application directory..."
if ssh "$REMOTE_USER@$REMOTE_HOST" "[ -d $REMOTE_PATH ]"; then
    print_status "Application directory exists"
    
    # Check key files
    ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
        cd $REMOTE_PATH
        echo "Checking key files..."
        [ -f "public/index.php" ] && echo "✅ index.php exists"
        [ -f "composer.json" ] && echo "✅ composer.json exists"
        [ -f ".env" ] && echo "✅ .env exists" || echo "⚠️  .env missing (may need configuration)"
        [ -d "vendor" ] && echo "✅ vendor directory exists"
        [ -d "public/assets/dist" ] && echo "✅ built assets exist"
EOF
else
    print_error "Application directory not found"
fi

# Check 3: File Permissions (shared hosting friendly)
print_header "Checking file permissions..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
    cd $REMOTE_PATH
    PERMS=$(stat -c '%a' . 2>/dev/null || stat -f '%Lp' . 2>/dev/null || echo "unknown")
    if [ "$PERMS" = "755" ] || [ "$PERMS" = "750" ] || [ "$PERMS" = "700" ]; then
        echo "✅ Directory permissions are $PERMS (acceptable for shared hosting)"
    else
        echo "⚠️  Directory permissions are $PERMS (should be 755, 750, or 700)"
    fi
    
    # Check if files are readable
    if [ -r "public/index.php" ]; then
        echo "✅ index.php is readable"
    else
        echo "❌ index.php is not readable"
    fi
EOF

# Check 4: HTTP Response
print_header "Testing HTTP response..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_status "HTTP 200 OK - Application is responding"
elif [ "$HTTP_STATUS" = "000" ]; then
    print_error "HTTP request failed - Application may not be accessible"
else
    print_warning "HTTP $HTTP_STATUS - Application may have issues"
fi

# Check 5: Database Connection (if .env exists)
print_header "Checking database connection..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
    cd $REMOTE_PATH
    if [ -f .env ]; then
        # Extract database config from .env
        DB_HOST=$(grep DB_HOST .env | cut -d'=' -f2)
        DB_NAME=$(grep DB_NAME .env | cut -d'=' -f2)
        DB_USER=$(grep DB_USER .env | cut -d'=' -f2)
        
        if [ -n "$DB_HOST" ] && [ -n "$DB_NAME" ] && [ -n "$DB_USER" ]; then
            echo "Database configuration found:"
            echo "  Host: $DB_HOST"
            echo "  Database: $DB_NAME"
            echo "  User: $DB_USER"
            
            # Test database connection (without password for security)
            if mysql -h "$DB_HOST" -u "$DB_USER" -e "USE $DB_NAME; SELECT 1;" >/dev/null 2>&1; then
                echo "✅ Database connection successful"
            else
                echo "⚠️  Database connection test skipped (password required)"
                echo "   You can test manually: mysql -u $DB_USER -p $DB_NAME"
            fi
        else
            echo "⚠️  Database configuration incomplete in .env"
        fi
    else
        echo "⚠️  .env file not found"
    fi
EOF

# Check 6: PHP Version and Extensions
print_header "Checking PHP environment..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
    cd $REMOTE_PATH
    echo "PHP Version:"
    php -v 2>/dev/null | head -1 || echo "❌ PHP not accessible"
    
    echo ""
    echo "Required PHP Extensions:"
    php -m 2>/dev/null | grep -E "(mbstring|xml|ctype|iconv|intl|pdo_mysql|openssl|tokenizer|json|curl|zip)" || echo "⚠️  Some extensions may be missing"
EOF

# Check 7: Composer Dependencies
print_header "Checking Composer dependencies..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
    cd $REMOTE_PATH
    if [ -f "composer.json" ] && [ -d "vendor" ]; then
        echo "✅ Composer dependencies installed"
        composer show --installed 2>/dev/null | head -5 || echo "⚠️  Could not list dependencies"
    else
        echo "❌ Composer dependencies not found"
    fi
EOF

echo ""
echo "📋 Deployment Status Summary:"
echo "   • Application URL: $APP_URL"
echo "   • Server: $REMOTE_HOST"
echo "   • Deployment Path: $REMOTE_PATH"
echo ""
echo "🔧 Next Steps:"
echo "   • Verify .env file contains correct database settings"
echo "   • Import database schema if not done"
echo "   • Test application functionality"
echo "   • Set up SSL certificate through hosting provider"
echo "   • Configure monitoring and backups"
echo "" 