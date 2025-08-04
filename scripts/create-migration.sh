#!/bin/bash

# Database Migration Creation Script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[MIGRATION]${NC} $1"
}

# Check if migration name is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <migration_name>"
    echo "Example: $0 add_user_table"
    exit 1
fi

MIGRATION_NAME="$1"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="${TIMESTAMP}_${MIGRATION_NAME}.sql"
FILEPATH="database/migrations/$FILENAME"

# Create migrations directory if it doesn't exist
mkdir -p database/migrations

# Create migration file
print_header "Creating migration: $FILENAME"

cat > "$FILEPATH" << EOF
-- Migration: $MIGRATION_NAME
-- Created: $(date)
-- Description: 

-- Add your SQL statements here
-- Example:
-- CREATE TABLE IF NOT EXISTS users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255) NOT NULL UNIQUE,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Example ALTER TABLE:
-- ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL;

-- Example INSERT:
-- INSERT INTO settings (key, value) VALUES ('version', '1.0.0');

-- Example UPDATE:
-- UPDATE users SET status = 'active' WHERE status IS NULL;

-- Example DELETE:
-- DELETE FROM temp_data WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

EOF

print_status "Migration file created: $FILEPATH"
echo ""
echo "📝 Next steps:"
echo "   1. Edit $FILEPATH to add your SQL statements"
echo "   2. Test your migration locally if possible"
echo "   3. Commit and push to trigger database deployment"
echo "   4. Monitor the GitHub Actions deployment"
echo ""
echo "💡 Tips:"
echo "   • Use IF NOT EXISTS for CREATE statements"
echo "   • Use IF EXISTS for DROP statements"
echo "   • Test migrations on a copy of production data first"
echo "   • Keep migrations small and focused"
echo "   • Always backup before running migrations" 