// Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.cursors = null;
        this.obstacles = null;
        this.deliveryPoints = null;
        this.pickupPoints = null;
        this.hasPackage = false;
        this.currentDelivery = null;
        this.cityMap = null;
        this.buildings = null;
        this.roads = null;
        this.trafficLights = null;
        this.pedestrians = null;
        this.gameTime = 0;
        this.score = 0;
        this.trafficLightTimer = 0;
    }

    preload() {
        // Load game assets
        this.load.image('player', '/assets/images/player.svg');
        this.load.image('building', '/assets/images/building.svg');
        this.load.image('road', '/assets/images/road.svg');
        this.load.image('road-vertical', '/assets/images/road-vertical.svg');
        this.load.image('pickup', '/assets/images/pickup.svg');
        this.load.image('delivery', '/assets/images/delivery.svg');
        this.load.image('traffic-light', '/assets/images/traffic-light.svg');
        this.load.image('park', '/assets/images/park.svg');
        this.load.image('shop', '/assets/images/shop.svg');
        this.load.image('office', '/assets/images/office.svg');
        this.load.image('house', '/assets/images/house.svg');
    }

    create() {
        console.log('GameScene create() called');
        
        // Create detailed city map
        this.createCityMap();
        
        // Create player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Create obstacles and buildings
        this.createBuildings();
        
        // Create delivery points
        this.createDeliveryPoints();
        
        // Create pickup points
        this.createPickupPoints();
        
        // Create traffic lights
        this.createTrafficLights();
        
        // Setup collisions
        this.setupCollisions();
        
        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Setup space key for pickup/delivery
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Start game timer
        this.startGameTimer();
        
        // Add UI elements
        this.createUI();
        
        // Start traffic light animation
        this.startTrafficLightAnimation();
        
        console.log('GameScene create() completed');
    }

    createCityMap() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x87CEEB); // Sky blue background
        
        // Decorative elements
        this.add.circle(150, 80, 20, 0xFFFFFF, 0.3);
        this.add.circle(650, 120, 25, 0xFFFFFF, 0.4);
        this.add.circle(200, 60, 15, 0xFFFFFF, 0.2);
        
        // Create continuous roads
        this.roads = this.physics.add.staticGroup();
        
        // Horizontal roads (continuous lines)
        this.roads.create(400, 150, 'road').setScale(12.5, 1); // Main horizontal road
        this.roads.create(400, 450, 'road').setScale(12.5, 1); // Secondary horizontal road
        
        // Vertical roads (continuous lines)
        this.roads.create(200, 300, 'road-vertical').setScale(1, 9.375); // Main vertical road
        this.roads.create(600, 300, 'road-vertical').setScale(1, 9.375); // Secondary vertical road
        
        // Intersections (crossroads)
        this.add.rectangle(200, 150, 40, 40, 0x696969); // Top-left intersection
        this.add.rectangle(200, 450, 40, 40, 0x696969); // Bottom-left intersection
        this.add.rectangle(600, 150, 40, 40, 0x696969); // Top-right intersection
        this.add.rectangle(600, 450, 40, 40, 0x696969); // Bottom-right intersection
        
        // Road markings at intersections
        // Horizontal lines
        this.add.rectangle(200, 148, 40, 4, 0xFFFFFF);
        this.add.rectangle(200, 452, 40, 4, 0xFFFFFF);
        this.add.rectangle(600, 148, 40, 4, 0xFFFFFF);
        this.add.rectangle(600, 452, 40, 4, 0xFFFFFF);
        
        // Vertical lines
        this.add.rectangle(198, 150, 4, 40, 0xFFFFFF);
        this.add.rectangle(598, 150, 4, 40, 0xFFFFFF);
        this.add.rectangle(198, 450, 4, 40, 0xFFFFFF);
        this.add.rectangle(598, 450, 4, 40, 0xFFFFFF);
    }

    createBuildings() {
        this.buildings = this.physics.add.staticGroup();
        
        // Downtown area (top-left) - Office buildings
        this.buildings.create(100, 100, 'office');
        this.buildings.create(150, 100, 'office');
        this.buildings.create(100, 150, 'office');
        this.buildings.create(150, 150, 'office');
        this.add.text(125, 180, 'Downtown\nDistrict', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Shopping district (top-right) - Shops
        this.buildings.create(650, 100, 'shop');
        this.buildings.create(700, 100, 'shop');
        this.buildings.create(650, 150, 'shop');
        this.buildings.create(700, 150, 'shop');
        this.add.text(675, 180, 'Shopping\nDistrict', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Industrial area (bottom-left) - Factories
        this.buildings.create(100, 500, 'building');
        this.buildings.create(150, 500, 'building');
        this.buildings.create(100, 550, 'building');
        this.buildings.create(150, 550, 'building');
        this.add.text(125, 580, 'Industrial\nZone', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Residential area (bottom-right) - Houses
        this.buildings.create(650, 500, 'house');
        this.buildings.create(700, 500, 'house');
        this.buildings.create(650, 550, 'house');
        this.buildings.create(700, 550, 'house');
        this.add.text(675, 580, 'Residential\nArea', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Central park
        this.buildings.create(400, 300, 'park');
        this.add.text(400, 330, 'Central\nPark', { fontSize: '10px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Office buildings (middle areas)
        this.buildings.create(350, 200, 'office');
        this.buildings.create(450, 200, 'office');
        this.buildings.create(350, 400, 'office');
        this.buildings.create(450, 400, 'office');
        
        // Add some decorative elements
        this.add.circle(400, 280, 8, 0x27AE60, 0.3);
        this.add.circle(400, 320, 8, 0x27AE60, 0.3);
    }

    createDeliveryPoints() {
        this.deliveryPoints = this.physics.add.staticGroup();
        
        // Downtown office
        this.deliveryPoints.create(125, 125, 'delivery');
        this.add.text(125, 140, 'Downtown\nOffice', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Shopping mall
        this.deliveryPoints.create(675, 125, 'delivery');
        this.add.text(675, 140, 'City Mall', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Industrial park
        this.deliveryPoints.create(125, 525, 'delivery');
        this.add.text(125, 540, 'Industrial\nPark', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        // Residential area
        this.deliveryPoints.create(675, 525, 'delivery');
        this.add.text(675, 540, 'Residential\nArea', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
    }

    createPickupPoints() {
        this.pickupPoints = this.physics.add.staticGroup();
        
        // Warehouse locations
        this.pickupPoints.create(75, 200, 'pickup');
        this.add.text(75, 215, 'Warehouse\nA', { fontSize: '8px', fill: '#000', align: 'center' }).setOrigin(0.5);
        
        this.pickupPoints.create(725, 200, 'pickup');
        this.add.text(725, 215, 'Warehouse\nB', { fontSize: '8px', fill: '#000', align: 'center' }).setOrigin(0.5);
        
        this.pickupPoints.create(75, 400, 'pickup');
        this.add.text(75, 415, 'Warehouse\nC', { fontSize: '8px', fill: '#000', align: 'center' }).setOrigin(0.5);
        
        this.pickupPoints.create(725, 400, 'pickup');
        this.add.text(725, 420, 'Warehouse\nD', { fontSize: '8px', fill: '#000', align: 'center' }).setOrigin(0.5);
    }

    createTrafficLights() {
        this.trafficLights = this.physics.add.staticGroup();
        
        // Traffic lights at intersections
        this.trafficLights.create(180, 130, 'traffic-light');
        this.trafficLights.create(220, 170, 'traffic-light');
        this.trafficLights.create(180, 430, 'traffic-light');
        this.trafficLights.create(220, 470, 'traffic-light');
        this.trafficLights.create(580, 130, 'traffic-light');
        this.trafficLights.create(620, 170, 'traffic-light');
        this.trafficLights.create(580, 430, 'traffic-light');
        this.trafficLights.create(620, 470, 'traffic-light');
    }

    startTrafficLightAnimation() {
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.trafficLightTimer++;
                this.updateTrafficLights();
            },
            loop: true
        });
    }

    updateTrafficLights() {
        // Simple traffic light animation (red -> yellow -> green)
        const lights = this.trafficLights.getChildren();
        lights.forEach((light, index) => {
            const phase = (this.trafficLightTimer + index) % 3;
            switch (phase) {
                case 0: // Red
                    light.setTint(0xFF0000);
                    break;
                case 1: // Yellow
                    light.setTint(0xFFFF00);
                    break;
                case 2: // Green
                    light.setTint(0x00FF00);
                    break;
            }
        });
    }

    createUI() {
        // Add mini-map
        this.createMiniMap();
        
        // Add game instructions
        this.add.text(10, 10, 'WASD or Arrow Keys: Move\nSPACE: Pickup/Deliver\nESC: Pause', {
            fontSize: '12px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        
        // Add score display
        this.scoreText = this.add.text(10, 80, 'Score: 0', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        
        // Add time display
        this.timeText = this.add.text(10, 110, 'Time: 00:00', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
    }

    createMiniMap() {
        // Create mini-map background
        this.add.rectangle(750, 50, 40, 40, 0x000000, 0.7);
        
        // Add mini-map elements
        this.add.rectangle(750, 50, 40, 40, 0x87CEEB, 0.3);
        
        // Show player position on mini-map
        this.miniMapPlayer = this.add.rectangle(750, 50, 4, 4, 0xFF0000);
        
        // Add mini-map legend
        this.add.text(750, 80, 'Mini-Map', { fontSize: '8px', fill: '#fff', align: 'center' }).setOrigin(0.5);
    }

    setupCollisions() {
        // Player collision with buildings
        this.physics.add.collider(this.player, this.buildings);
        
        // Player collision with roads (no collision, just for visual)
        
        // Player overlap with pickup points
        this.physics.add.overlap(this.player, this.pickupPoints, this.pickupPackage, null, this);
        
        // Player overlap with delivery points
        this.physics.add.overlap(this.player, this.deliveryPoints, this.deliverPackage, null, this);
    }

    startGameTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.gameTime++;
                this.updateMiniMap();
                this.updateUI();
            },
            loop: true
        });
    }

    updateUI() {
        // Update score display
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Update time display
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        this.timeText.setText(`Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }

    updateMiniMap() {
        // Update player position on mini-map
        const mapX = 750 + (this.player.x - 400) * 0.05;
        const mapY = 50 + (this.player.y - 300) * 0.05;
        this.miniMapPlayer.setPosition(mapX, mapY);
    }

    update() {
        if (!this.player) return;
        
        // Handle player movement
        this.handlePlayerMovement();
        
        // Handle pickup/delivery
        this.handlePickupDelivery();
        
        // Update mini-map
        this.updateMiniMap();
    }

    handlePlayerMovement() {
        const speed = 200;
        this.player.setVelocity(0);
        
        // Arrow keys or WASD
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    handlePickupDelivery() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (!this.hasPackage) {
                this.tryPickup();
            } else {
                this.tryDelivery();
            }
        }
    }

    tryPickup() {
        // Check if player is near a pickup point
        this.pickupPoints.getChildren().forEach(pickup => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                pickup.x, pickup.y
            );
            
            if (distance < 50) {
                this.pickupPackage(this.player, pickup);
            }
        });
    }

    tryDelivery() {
        // Check if player is near a delivery point
        this.deliveryPoints.getChildren().forEach(delivery => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                delivery.x, delivery.y
            );
            
            if (distance < 50) {
                this.deliverPackage(this.player, delivery);
            }
        });
    }

    pickupPackage(player, pickup) {
        if (!this.hasPackage) {
            this.hasPackage = true;
            this.currentDelivery = pickup;
            pickup.setTint(0x00ff00);
            
            // Show pickup message
            this.showMessage('Package picked up! Deliver it to a green point.');
            
            // Update game state
            if (window.deliveryGame) {
                window.deliveryGame.gameState.currentOrder = {
                    destination: 'Delivery Point',
                    reward: 25,
                    timeLimit: 300
                };
            }
            
            // Add score
            this.score += 10;
        }
    }

    deliverPackage(player, delivery) {
        if (this.hasPackage) {
            this.hasPackage = false;
            this.currentDelivery.setTint(0xffffff);
            this.currentDelivery = null;
            
            // Calculate delivery bonus based on time
            const timeBonus = Math.max(0, 300 - this.gameTime) * 2;
            const totalReward = 25 + timeBonus;
            
            // Show delivery message
            this.showMessage(`Package delivered! +$${totalReward} (${timeBonus > 0 ? `+$${timeBonus} time bonus` : 'no time bonus'})`);
            
            // Update game state
            if (window.deliveryGame) {
                window.deliveryGame.completeDelivery();
            }
            
            // Add score
            this.score += totalReward;
            
            // Reset game time for next delivery
            this.gameTime = 0;
        }
    }

    showMessage(text) {
        const message = this.add.text(400, 50, text, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        message.setOrigin(0.5);
        
        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 3000,
            onComplete: () => message.destroy()
        });
    }
}

// UI Scene for overlays
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        console.log('UIScene create() called');
        // This scene can be used for UI overlays if needed
        // Currently handled by HTML/CSS
    }
}

// Export the classes for use in other modules
window.GameScene = GameScene;
window.UIScene = UIScene; 