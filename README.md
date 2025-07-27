# Delivery Business Game

A web-based delivery business simulation game built with LAMP stack and modern web technologies.

## Game Overview

Players manage a delivery business with:

- **Business Management**: Orders, inventory, staff, finances
- **Logistics Interface**: Route planning, vehicle management
- **2D Delivery Gameplay**: Navigate streets, avoid obstacles, deliver packages
- **Progression System**: Unlock new areas, vehicles, and business opportunities

## Technology Stack

### Frontend

- **HTML5 Canvas** - 2D game rendering
- **Phaser.js 3** - Game engine for delivery gameplay
- **JavaScript ES6+** - Game logic and UI interactions
- **CSS3** - Styling and animations
- **WebSockets** - Real-time updates

### Backend

- **PHP 8.x** - Server-side logic and API
- **MySQL 8.x** - Game data storage
- **Apache** - Web server
- **Ratchet** - WebSocket server for real-time features

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Git

### Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd delivery

# Start development environment
./scripts/docker-setup.sh dev

# Or manually:
docker-compose -f docker-compose.dev.yml up -d
```

### Production Environment

```bash
# Start production environment
./scripts/docker-setup.sh prod

# Or manually:
docker-compose up -d
```

### Available Services

- **Game**: http://localhost:8000
- **Frontend Dev Server**: http://localhost:3000 (dev only)
- **phpMyAdmin**: http://localhost:8080
- **MailHog**: http://localhost:8025 (dev only)

### Docker Commands

```bash
# View logs
./scripts/docker-setup.sh logs

# Check status
./scripts/docker-setup.sh status

# Stop all containers
./scripts/docker-setup.sh stop

# Rebuild containers
./scripts/docker-setup.sh rebuild
```

## Manual Setup (Non-Docker)

### Prerequisites

- PHP 8.0+
- MySQL 8.0+
- Apache/Nginx
- Node.js 16+
- Composer

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd delivery-game
   ```

2. **Install PHP dependencies**

   ```bash
   composer install
   ```

3. **Install Node.js dependencies**

   ```bash
   npm install
   ```

4. **Configure environment**

   ```bash
   cp env.example .env
   # Edit .env with your database settings
   ```

5. **Setup database**

   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE delivery_game;"
   
   # Import schema
   mysql -u root -p delivery_game < database/schema.sql
   ```

6. **Build assets**

   ```bash
   npm run build
   ```

7. **Start development server**

   ```bash
   php -S localhost:8000 -t public
   ```

## Project Structure

```
delivery-game/
├── public/                 # Web root
│   ├── index.php          # Main entry point
│   ├── assets/            # Static assets
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # JavaScript files
│   │   ├── images/        # Game sprites and UI
│   │   └── audio/         # Sound effects and music
│   └── game/              # Game-specific files
│       ├── scenes/        # Phaser game scenes
│       └── sprites/       # Game objects
├── src/                   # PHP source code
│   ├── api/               # API endpoints
│   ├── models/            # Database models
│   ├── controllers/       # Business logic
│   └── config/            # Configuration files
├── database/              # Database schema and migrations
├── scripts/               # Setup and utility scripts
├── vendor/                # Composer dependencies
├── node_modules/          # npm dependencies
├── Dockerfile             # Production Docker image
├── Dockerfile.dev         # Development Docker image
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
└── deploy.sh              # Deployment script
```

## Deployment

### Docker Deployment

```bash
# Build and push to registry
docker build -t delivery-game .
docker tag delivery-game your-registry/delivery-game:latest
docker push your-registry/delivery-game:latest
```

### LAMP Hosting Deployment

```bash
# Set environment variables
export REMOTE_HOST=your-server.com
export REMOTE_USER=username
export REMOTE_PATH=/var/www/html/delivery-game

# Deploy
./deploy.sh
```

### Manual Deployment

1. Build production assets: `npm run build`
2. Upload files to your web server
3. Install PHP dependencies: `composer install --no-dev`
4. Configure database and environment
5. Set proper file permissions

## Game Features

### Business Management

- Order management system
- Inventory tracking
- Staff hiring and management
- Financial tracking and reporting
- Business expansion opportunities

### Logistics Interface

- Route optimization
- Vehicle fleet management
- Delivery scheduling
- Real-time tracking

### 2D Delivery Gameplay

- Character movement with keyboard controls
- Street navigation with obstacles
- Package pickup and delivery mechanics
- Time-based challenges
- Weather effects and traffic

### Progression System

- Experience points and leveling
- Unlockable areas and vehicles
- Business reputation system
- Achievement system

## Development

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes
3. Test with Docker environment
4. Submit pull request

### Database Changes

1. Create migration in `database/` directory
2. Update schema.sql
3. Test with Docker MySQL container
4. Document changes

### Frontend Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Docker Issues

```bash
# Reset Docker environment
./scripts/docker-setup.sh stop
docker system prune -f
./scripts/docker-setup.sh rebuild
```

### Database Connection Issues

- Check .env file configuration
- Verify MySQL container is running
- Test connection with phpMyAdmin

### Game Not Loading

- Check browser console for JavaScript errors
- Verify Phaser.js is loading correctly
- Check Apache/Nginx configuration

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is licensed under the MIT License.

## Development Roadmap

- [x] Project structure setup
- [x] Docker development environment
- [x] Basic game engine integration
- [x] Character movement system
- [x] Business management interface
- [x] Database schema design
- [ ] API endpoints development
- [ ] Game mechanics implementation
- [ ] UI/UX design and implementation
- [ ] Testing and optimization
- [ ] Deployment preparation