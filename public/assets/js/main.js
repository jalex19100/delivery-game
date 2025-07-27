// Main application entry point
import './game.js';
import './dashboard.js';

// Global application state
window.DeliveryGameApp = {
    // Initialize the application
    init() {
        console.log('🚚 Delivery Game App Initialized');
        this.setupEventListeners();
        this.loadGameState();
    },

    // Setup global event listeners
    setupEventListeners() {
        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-nav]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-nav');
                this.navigateTo(route);
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'g':
                        e.preventDefault();
                        this.navigateTo('/game');
                        break;
                    case 'b':
                        e.preventDefault();
                        this.navigateTo('/business');
                        break;
                    case 'l':
                        e.preventDefault();
                        this.navigateTo('/logistics');
                        break;
                }
            }
        });
    },

    // Navigate to different pages
    navigateTo(route) {
        window.location.href = route;
    },

    // Load game state from localStorage
    loadGameState() {
        const saved = localStorage.getItem('deliveryGameState');
        if (saved) {
            try {
                const gameState = JSON.parse(saved);
                this.updateGlobalUI(gameState);
            } catch (error) {
                console.error('Error loading game state:', error);
            }
        }
    },

    // Update global UI elements
    updateGlobalUI(gameState) {
        // Update player info in header
        const playerName = document.querySelector('.player-name');
        const playerLevel = document.querySelector('.player-level');
        const playerMoney = document.querySelector('.player-money');

        if (playerName) playerName.textContent = gameState.playerName || 'Player';
        if (playerLevel) playerLevel.textContent = `Level ${gameState.level || 1}`;
        if (playerMoney) playerMoney.textContent = `$${(gameState.money || 1000).toLocaleString()}`;
    },

    // Save game state to localStorage
    saveGameState(gameState) {
        try {
            localStorage.setItem('deliveryGameState', JSON.stringify(gameState));
        } catch (error) {
            console.error('Error saving game state:', error);
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format time
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.DeliveryGameApp.init();
});

// Export for module usage
export default window.DeliveryGameApp; 