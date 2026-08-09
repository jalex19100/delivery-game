// Import game scenes
import './game-scenes.js';

// Main Game Class
class DeliveryGame {
    constructor() {
        this.game = null;
        this.gameState = {
            money: 1000,
            deliveries: 0,
            score: 0,
            time: 0,
            currentOrder: null,
            isPaused: false,
            level: 1,
            experience: 0,
            vehicle: 'bike',
            inventory: [],
            reputation: 50,
            completedDeliveries: [],
            failedDeliveries: [],
            totalEarnings: 0,
            bestTime: null,
            consecutiveDeliveries: 0
        };
        
        this.deliveryTypes = {
            standard: { reward: 25, timeLimit: 300, reputation: 1 },
            urgent: { reward: 50, timeLimit: 180, reputation: 2 },
            fragile: { reward: 75, timeLimit: 240, reputation: 3 },
            heavy: { reward: 100, timeLimit: 360, reputation: 2 }
        };
        
        this.vehicles = {
            bike: { speed: 1, capacity: 1, cost: 0 },
            scooter: { speed: 1.2, capacity: 2, cost: 500 },
            van: { speed: 1.5, capacity: 5, cost: 2000 },
            truck: { speed: 1.8, capacity: 10, cost: 5000 }
        };
        
        this.init();
    }

    init() {
        this.loadGameState();
        this.setupEventListeners();
        this.initPhaserGame();
        this.updateUI();
    }

    initPhaserGame() {
        // Check if Phaser is available
        if (typeof Phaser === 'undefined') {
            console.error('Phaser is not loaded!');
            return;
        }

        // Check if game canvas element exists
        const canvasElement = document.getElementById('game-canvas');
        if (!canvasElement) {
            console.error('Game canvas element not found!');
            return;
        }

        // Check if scene classes are available
        if (typeof window.GameScene === 'undefined' || typeof window.UIScene === 'undefined') {
            console.error('GameScene or UIScene classes not found!');
            return;
        }

        console.log('Initializing Phaser game...');

        // Phaser game configuration
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-canvas',
            backgroundColor: '#87CEEB',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [window.GameScene, window.UIScene]
        };

        try {
            // Initialize Phaser game
            this.game = new Phaser.Game(config);
            console.log('Phaser game initialized successfully');
            
            // Make game instance available globally
            window.deliveryGame = this;
        } catch (error) {
            console.error('Failed to initialize Phaser game:', error);
        }
    }

    setupEventListeners() {
        // Pause game on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });

        // Save game state periodically
        setInterval(() => {
            this.saveGameState();
        }, 30000); // Save every 30 seconds

        // Setup global function references for UI buttons
        window.togglePause = () => this.togglePause();
        window.resumeGame = () => this.resumeGame();
        window.restartGame = () => this.restartGame();
        window.exitGame = () => this.exitGame();
    }

    startDeliveryRun() {
        if (this.gameState.currentOrder) {
            console.log('Delivery already in progress');
            return;
        }

        // Generate a random delivery order
        const deliveryTypes = Object.keys(this.deliveryTypes);
        const randomType = deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)];
        const deliveryConfig = this.deliveryTypes[randomType];
        
        const destinations = [
            'Downtown Office',
            'City Mall', 
            'Industrial Park',
            'Residential Area'
        ];
        const destination = destinations[Math.floor(Math.random() * destinations.length)];
        
        this.gameState.currentOrder = {
            type: randomType,
            destination: destination,
            reward: deliveryConfig.reward,
            timeLimit: deliveryConfig.timeLimit,
            reputation: deliveryConfig.reputation,
            startTime: Date.now(),
            status: 'active'
        };

        this.updateUI();
        this.showNotification(`New ${randomType} delivery to ${destination}!`, 'info');
    }

    completeDelivery() {
        if (!this.gameState.currentOrder) {
            console.log('No active delivery');
            return;
        }

        const order = this.gameState.currentOrder;
        const deliveryTime = (Date.now() - order.startTime) / 1000;
        const timeBonus = Math.max(0, order.timeLimit - deliveryTime) * 2;
        const totalReward = order.reward + timeBonus;
        
        // Update game state
        this.gameState.money += totalReward;
        this.gameState.deliveries++;
        this.gameState.score += totalReward;
        this.gameState.totalEarnings += totalReward;
        this.gameState.reputation += order.reputation;
        this.gameState.consecutiveDeliveries++;
        this.gameState.experience += order.reputation * 10;
        
        // Check for level up
        this.checkLevelUp();
        
        // Record completed delivery
        this.gameState.completedDeliveries.push({
            ...order,
            completionTime: deliveryTime,
            totalReward: totalReward,
            timeBonus: timeBonus,
            completedAt: new Date().toISOString()
        });
        
        // Update best time if applicable
        if (!this.gameState.bestTime || deliveryTime < this.gameState.bestTime) {
            this.gameState.bestTime = deliveryTime;
        }
        
        // Clear current order
        this.gameState.currentOrder = null;
        
        this.updateUI();
        this.saveGameState();
        
        this.showNotification(`Delivery completed! +$${totalReward}`, 'success');
    }

    failDelivery() {
        if (!this.gameState.currentOrder) {
            return;
        }

        const order = this.gameState.currentOrder;
        
        // Penalties for failed delivery
        this.gameState.reputation = Math.max(0, this.gameState.reputation - order.reputation);
        this.gameState.consecutiveDeliveries = 0;
        
        // Record failed delivery
        this.gameState.failedDeliveries.push({
            ...order,
            failedAt: new Date().toISOString()
        });
        
        this.gameState.currentOrder = null;
        this.updateUI();
        this.saveGameState();
        
        this.showNotification('Delivery failed! Reputation decreased.', 'error');
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.gameState.experience / 100) + 1;
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            this.showNotification(`Level up! You are now level ${newLevel}!`, 'success');
            
            // Level up bonuses
            this.gameState.money += newLevel * 100;
            this.gameState.reputation += 5;
        }
    }

    upgradeFleet() {
        const currentVehicle = this.vehicles[this.gameState.vehicle];
        const vehicleOptions = Object.entries(this.vehicles);
        
        // Find next available vehicle
        for (const [vehicleName, vehicleConfig] of vehicleOptions) {
            if (vehicleConfig.cost > currentVehicle.cost && 
                this.gameState.money >= vehicleConfig.cost) {
                
                this.gameState.money -= vehicleConfig.cost;
                this.gameState.vehicle = vehicleName;
                
                this.updateUI();
                this.saveGameState();
                
                this.showNotification(`Upgraded to ${vehicleName}!`, 'success');
                return;
            }
        }
        
        this.showNotification('No affordable upgrades available.', 'info');
    }

    hireStaff() {
        const staffCost = 200 + (this.gameState.level * 50);
        
        if (this.gameState.money >= staffCost) {
            this.gameState.money -= staffCost;
            this.gameState.reputation += 2;
            
            this.updateUI();
            this.saveGameState();
            
            this.showNotification('Staff member hired! Reputation increased.', 'success');
        } else {
            this.showNotification('Not enough money to hire staff.', 'error');
        }
    }

    manageOrders() {
        // This would open an order management interface
        this.showNotification('Order management coming soon!', 'info');
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            this.pauseGame();
        } else {
            this.resumeGame();
        }
        
        this.updateUI();
    }

    pauseGame() {
        if (this.game && this.game.scene.isPaused('GameScene')) {
            this.game.scene.resume('GameScene');
        } else if (this.game) {
            this.game.scene.pause('GameScene');
        }
    }

    resumeGame() {
        if (this.game && this.game.scene.isPaused('GameScene')) {
            this.game.scene.resume('GameScene');
        }
    }

    restartGame() {
        if (this.game) {
            this.game.scene.restart('GameScene');
        }
        this.gameState.currentOrder = null;
        this.gameState.isPaused = false;
        this.updateUI();
    }

    exitGame() {
        this.saveGameState();
        window.location.href = '/';
    }

    updateUI() {
        // Update money display
        const moneyElement = document.getElementById('money');
        if (moneyElement) {
            moneyElement.textContent = this.formatCurrency(this.gameState.money);
        }
        
        // Update delivery count
        const deliveryElement = document.getElementById('deliveries');
        if (deliveryElement) {
            deliveryElement.textContent = this.gameState.deliveries;
        }
        
        // Update score
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.gameState.score;
        }
        
        // Update level
        const levelElement = document.getElementById('level');
        if (levelElement) {
            levelElement.textContent = this.gameState.level;
        }
        
        // Update reputation
        const reputationElement = document.getElementById('reputation');
        if (reputationElement) {
            reputationElement.textContent = this.gameState.reputation;
        }
        
        // Update vehicle
        const vehicleElement = document.getElementById('vehicle');
        if (vehicleElement) {
            vehicleElement.textContent = this.gameState.vehicle.charAt(0).toUpperCase() + this.gameState.vehicle.slice(1);
        }
        
        // Update current order info
        this.updateOrderInfo();
    }

    updateOrderInfo() {
        const orderInfo = document.getElementById('order-info');
        if (!orderInfo) return;
        
        if (this.gameState.currentOrder) {
            const order = this.gameState.currentOrder;
            
            // Validate order structure and provide fallbacks for missing properties
            const orderType = order.type || 'standard';
            const destination = order.destination || 'Unknown Location';
            const reward = order.reward || 25;
            const timeLimit = order.timeLimit || 300;
            const reputation = order.reputation || 1;
            const startTime = order.startTime || Date.now();
            
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const remainingTime = Math.max(0, timeLimit - elapsedTime);
            
            orderInfo.innerHTML = `
                <h3>Current Delivery</h3>
                <p><strong>Type:</strong> ${orderType.charAt(0).toUpperCase() + orderType.slice(1)}</p>
                <p><strong>Destination:</strong> ${destination}</p>
                <p><strong>Reward:</strong> $${reward}</p>
                <p><strong>Time Remaining:</strong> ${this.formatTime(remainingTime)}</p>
                <p><strong>Reputation:</strong> +${reputation}</p>
            `;
        } else {
            orderInfo.innerHTML = `
                <h3>No Active Delivery</h3>
                <p>Pick up a package from a warehouse to start!</p>
            `;
        }
    }

    saveGameState() {
        try {
            localStorage.setItem('deliveryGameState', JSON.stringify(this.gameState));
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    }

    loadGameState() {
        try {
            const savedState = localStorage.getItem('deliveryGameState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                
                // Validate and sanitize the loaded state
                const sanitizedState = this.sanitizeGameState(parsedState);
                this.gameState = { ...this.gameState, ...sanitizedState };
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
            // Clear corrupted state
            localStorage.removeItem('deliveryGameState');
        }
    }

    sanitizeGameState(state) {
        const sanitized = {};
        
        // Validate and sanitize each property
        if (typeof state.money === 'number' && state.money >= 0) {
            sanitized.money = state.money;
        }
        
        if (typeof state.deliveries === 'number' && state.deliveries >= 0) {
            sanitized.deliveries = state.deliveries;
        }
        
        if (typeof state.score === 'number' && state.score >= 0) {
            sanitized.score = state.score;
        }
        
        if (typeof state.time === 'number' && state.time >= 0) {
            sanitized.time = state.time;
        }
        
        if (typeof state.level === 'number' && state.level >= 1) {
            sanitized.level = state.level;
        }
        
        if (typeof state.experience === 'number' && state.experience >= 0) {
            sanitized.experience = state.experience;
        }
        
        if (typeof state.reputation === 'number' && state.reputation >= 0 && state.reputation <= 100) {
            sanitized.reputation = state.reputation;
        }
        
        if (typeof state.totalEarnings === 'number' && state.totalEarnings >= 0) {
            sanitized.totalEarnings = state.totalEarnings;
        }
        
        if (typeof state.consecutiveDeliveries === 'number' && state.consecutiveDeliveries >= 0) {
            sanitized.consecutiveDeliveries = state.consecutiveDeliveries;
        }
        
        // Validate vehicle
        if (state.vehicle && this.vehicles[state.vehicle]) {
            sanitized.vehicle = state.vehicle;
        }
        
        // Validate arrays
        if (Array.isArray(state.inventory)) {
            sanitized.inventory = state.inventory;
        }
        
        if (Array.isArray(state.completedDeliveries)) {
            sanitized.completedDeliveries = state.completedDeliveries;
        }
        
        if (Array.isArray(state.failedDeliveries)) {
            sanitized.failedDeliveries = state.failedDeliveries;
        }
        
        // Validate current order - if invalid, clear it
        if (state.currentOrder && typeof state.currentOrder === 'object') {
            const order = state.currentOrder;
            if (order.type && order.destination && typeof order.reward === 'number' && 
                typeof order.timeLimit === 'number' && typeof order.reputation === 'number' &&
                typeof order.startTime === 'number' && order.status === 'active') {
                sanitized.currentOrder = order;
            } else {
                console.warn('Invalid current order found, clearing it');
                sanitized.currentOrder = null;
            }
        }
        
        // Validate best time
        if (typeof state.bestTime === 'number' && state.bestTime > 0) {
            sanitized.bestTime = state.bestTime;
        }
        
        return sanitized;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getGameStats() {
        return {
            totalDeliveries: this.gameState.deliveries,
            totalEarnings: this.gameState.totalEarnings,
            averageDeliveryTime: this.gameState.completedDeliveries.length > 0 
                ? this.gameState.completedDeliveries.reduce((sum, delivery) => sum + delivery.completionTime, 0) / this.gameState.completedDeliveries.length
                : 0,
            successRate: this.gameState.completedDeliveries.length > 0
                ? (this.gameState.completedDeliveries.length / (this.gameState.completedDeliveries.length + this.gameState.failedDeliveries.length)) * 100
                : 0,
            bestTime: this.gameState.bestTime,
            currentStreak: this.gameState.consecutiveDeliveries
        };
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Delivery Game...');
        window.deliveryGame = new DeliveryGame();
        console.log('Delivery Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Delivery Game:', error);
        
        // Fallback: Show error message on page
        const gameCanvas = document.getElementById('game-canvas');
        if (gameCanvas) {
            gameCanvas.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center;">
                    <div>
                        <h3>Game Loading Error</h3>
                        <p>There was an issue loading the game. Please refresh the page.</p>
                        <p>Error: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
}); 