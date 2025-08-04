# GitHub Actions Deployment Setup for Shared Hosting

This guide will help you set up automated deployment of your delivery game application to shared hosting using GitHub Actions.

## Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Shared Hosting Access**: SSH access to your shared hosting provider
3. **Hosting Requirements**: PHP 8.0+ with MySQL support

## Step 1: Generate SSH Key Pair

Generate a new SSH key pair for GitHub Actions:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@your-domain.com" -f ~/.ssh/github_actions
```

## Step 2: Add Public Key to Shared Hosting

Add the public key to your shared hosting account:

```bash
# Copy the public key content
cat ~/.ssh/github_actions.pub

# Add this key to your shared hosting SSH keys section
# (Usually found in cPanel → SSH Access → Manage SSH Keys)
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, then add these secrets:

### Required Secrets

- `REMOTE_HOST`: Your shared hosting server's IP address or domain
- `REMOTE_USER`: SSH username for your shared hosting account
- `SSH_PRIVATE_KEY`: The entire content of your private key file (`~/.ssh/github_actions`)
- `DB_HOST`: Your database host (usually `localhost`)
- `DB_NAME`: Your database name
- `DB_USER`: Your database username
- `DB_PASS`: Your database password

### Optional Secrets

- `SSH_PORT`: SSH port (default: 22)
- `REMOTE_PATH`: Deployment path on server (default: `/public_html/delivery-game`)
- `BACKUP_PATH`: Backup storage path (default: `/public_html/backups`)
- `REMOTE_URL`: Your domain for notifications

## Step 4: Shared Hosting Preparation

Ensure your shared hosting account has:

1. **PHP 8.0+** with required extensions:
   - mbstring, xml, ctype, iconv, intl, pdo_mysql, openssl, tokenizer, json, curl, zip

2. **MySQL Database**:
   - Create a database for your application
   - Note the database credentials for GitHub secrets

3. **SSH Access**:
   - Enable SSH access in your hosting control panel
   - Add the GitHub Actions public key

## Step 5: Database Setup

Create your production database through your hosting control panel:

```sql
CREATE DATABASE delivery_game;
-- Your hosting provider may have already created a user for you
-- Use the credentials provided by your hosting provider
```

## Step 6: Test Deployment

1. Push your code to the `main` or `master` branch
2. Go to Actions tab in GitHub to monitor the deployment
3. Check your shared hosting file manager to ensure files are deployed

## Step 7: Import Database Schema

After deployment, import your database schema:

```bash
# Connect to your database through phpMyAdmin or SSH
mysql -u your_db_user -p your_database_name < database/schema.sql
```

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify SSH key is correctly added to hosting account
   - Check if SSH access is enabled in your hosting control panel
   - Ensure the correct port (usually 22)

2. **Permission Denied**
   - Shared hosting typically doesn't allow sudo commands
   - The workflow is designed to work without sudo access
   - Check file permissions in your hosting file manager

3. **Build Failures**
   - Check Node.js and PHP versions in GitHub Actions logs
   - Verify all dependencies are correctly specified

4. **Database Connection Issues**
   - Verify database credentials in GitHub secrets
   - Check if database exists and is accessible
   - Ensure database user has proper permissions

### Debugging

To debug deployment issues:

1. Check GitHub Actions logs in the Actions tab
2. Use your hosting file manager to inspect deployed files
3. Check error logs through your hosting control panel

## Security Considerations

1. **SSH Key Security**: Keep your private key secure and never commit it to the repository
2. **Database Credentials**: Use strong passwords and store them securely in GitHub secrets
3. **Environment Variables**: The `.env` file is created from GitHub secrets during deployment
4. **SSL Certificate**: Set up HTTPS through your hosting provider

## Monitoring

Consider setting up monitoring for:
- Application uptime
- Error logs (available through hosting control panel)
- Database performance
- File system usage

## Backup Strategy

The deployment automatically creates backups, but consider:
- Regular database backups through hosting control panel
- File system backups
- Off-site backup storage
- Backup retention policies

## Shared Hosting Limitations

Be aware of shared hosting limitations:
- No sudo access
- Limited server configuration options
- Resource usage limits
- File permission restrictions
- Database connection limits 