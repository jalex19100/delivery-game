# Database Management Guide

This guide covers database management for the delivery game application, including migrations, automated deployment, and best practices.

## Overview

The database deployment system consists of:

- **Automated migrations** via GitHub Actions
- **Automatic backups** before each deployment
- **Rollback capability** if migrations fail
- **Version control** for all database changes

## File Structure

```
database/
├── schema.sql          # Initial database schema
├── migrations/         # Database migration files
│   ├── 20240101_120000_add_users_table.sql
│   ├── 20240102_140000_add_orders_table.sql
│   └── ...
└── seeds/             # Data seeding files (optional)
    └── initial_data.sql
```

## Creating Migrations

### Using the Migration Script

```bash
# Create a new migration
./scripts/create-migration.sh add_user_table

# This creates: database/migrations/20240101_120000_add_user_table.sql
```

### Manual Migration Creation

1. Create a new file in `database/migrations/`
2. Use timestamp prefix: `YYYYMMDD_HHMMSS_description.sql`
3. Add descriptive comments
4. Test locally if possible

### Migration Best Practices

#### ✅ Good Migration Examples

```sql
-- Migration: add_user_table
-- Created: 2024-01-01 12:00:00
-- Description: Create users table for authentication

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

```sql
-- Migration: add_user_status_column
-- Created: 2024-01-02 14:00:00
-- Description: Add status column to users table

ALTER TABLE users ADD COLUMN status ENUM('active', 'inactive', 'suspended') DEFAULT 'active';
CREATE INDEX idx_users_status ON users(status);
```

#### ❌ Avoid These Patterns

```sql
-- Don't drop tables without backup
DROP TABLE users;

-- Don't modify data without WHERE clause
UPDATE users SET status = 'inactive';

-- Don't create tables without IF NOT EXISTS
CREATE TABLE users (...);
```

## Deployment Process

### Automatic Deployment

1. **Push Changes**: Commit and push database changes to `main` branch
2. **Trigger Detection**: GitHub Actions detects changes in `database/` folder
3. **Backup Creation**: Automatic database backup before deployment
4. **Migration Execution**: SQL files executed in order:
   - `schema.sql` (if exists)
   - Migration files (alphabetical order)
   - Other SQL files
5. **Verification**: Database integrity check
6. **Rollback**: Automatic rollback if any step fails

### Manual Deployment

```bash
# Check deployment status
./scripts/check-deployment.sh

# Create migration manually
./scripts/create-migration.sh your_migration_name
```

## Database Schema Management

### Initial Setup

1. **Create `schema.sql`**: Define your initial database structure
2. **Version Control**: Commit schema to repository
3. **Deploy**: Push to trigger initial deployment

### Schema Evolution

1. **Create Migration**: Use migration script or manual creation
2. **Test Locally**: Test on development database
3. **Commit & Push**: Trigger automated deployment
4. **Monitor**: Check GitHub Actions logs

## Backup Strategy

### Automatic Backups

- **Pre-deployment**: Automatic backup before each migration
- **Location**: `/public_html/backups/` (configurable)
- **Naming**: `db-backup-YYYYMMDD-HHMMSS.sql`
- **Retention**: Manual cleanup recommended

### Manual Backups

```bash
# Connect to your hosting via SSH
ssh username@your-server.com

# Create manual backup
mysqldump -h localhost -u db_user -p db_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Monitoring and Maintenance

### Database Health Checks

```sql
-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'your_database_name'
ORDER BY (data_length + index_length) DESC;

-- Check for unused indexes
SELECT 
    table_name,
    index_name,
    cardinality
FROM information_schema.statistics 
WHERE table_schema = 'your_database_name'
AND cardinality = 0;
```

### Performance Optimization

1. **Index Management**: Add indexes for frequently queried columns
2. **Query Optimization**: Monitor slow queries
3. **Table Maintenance**: Regular OPTIMIZE TABLE operations
4. **Connection Limits**: Monitor connection usage

## Troubleshooting

### Common Issues

#### Migration Fails
```bash
# Check migration logs in GitHub Actions
# Verify SQL syntax
# Test migration locally
```

#### Database Connection Issues
```bash
# Verify credentials in GitHub secrets
# Check database server status
# Test connection manually
```

#### Backup Failures
```bash
# Check disk space
# Verify backup directory permissions
# Test mysqldump manually
```

### Recovery Procedures

#### Manual Rollback
```bash
# SSH to server
ssh username@your-server.com

# Find latest backup
ls -la /public_html/backups/db-backup-*.sql

# Restore from backup
mysql -u db_user -p db_name < /public_html/backups/db-backup-YYYYMMDD-HHMMSS.sql
```

#### Partial Migration Recovery
```bash
# If migration partially failed, you may need to:
# 1. Restore from backup
# 2. Fix the migration file
# 3. Re-deploy
```

## Security Considerations

### Database Security

1. **Strong Passwords**: Use complex database passwords
2. **Limited Privileges**: Grant minimal required permissions
3. **Connection Security**: Use SSL connections when possible
4. **Regular Updates**: Keep database software updated

### Migration Security

1. **No Sensitive Data**: Never commit passwords or keys
2. **Test Migrations**: Always test on development data first
3. **Backup Before Changes**: Always have a backup before major changes
4. **Review Changes**: Code review all database changes

## Best Practices

### Migration Development

1. **Small Changes**: Keep migrations focused and small
2. **Reversible**: Design migrations to be reversible when possible
3. **Tested**: Test migrations on development data
4. **Documented**: Include clear descriptions and comments

### Deployment Process

1. **Staging Environment**: Test on staging before production
2. **Monitoring**: Monitor deployment logs and database health
3. **Rollback Plan**: Always have a rollback strategy
4. **Communication**: Notify team of database changes

### Maintenance

1. **Regular Backups**: Schedule regular manual backups
2. **Performance Monitoring**: Monitor query performance
3. **Index Maintenance**: Review and optimize indexes
4. **Cleanup**: Remove old backup files periodically

## Tools and Scripts

### Available Scripts

- `./scripts/create-migration.sh` - Create new migrations
- `./scripts/check-deployment.sh` - Check deployment status

### Useful Commands

```bash
# Check database connection
mysql -u username -p database_name -e "SELECT 1;"

# List all tables
mysql -u username -p database_name -e "SHOW TABLES;"

# Check table structure
mysql -u username -p database_name -e "DESCRIBE table_name;"

# Export specific table
mysqldump -u username -p database_name table_name > table_backup.sql
``` 