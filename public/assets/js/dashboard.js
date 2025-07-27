// Dashboard functionality
class Dashboard {
    constructor() {
        this.gameState = {
            money: 1000,
            level: 1,
            experience: 0,
            deliveries: 0,
            totalDeliveries: 5,
            reputation: 5.0
        };
        
        this.init();
    }

    init() {
        this.loadGameState();
        this.setupEventListeners();
        this.updateDashboard();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Quick action buttons
        const startDeliveryBtn = document.querySelector('[onclick="startDelivery()"]');
        const manageOrdersBtn = document.querySelector('[onclick="manageOrders()"]');
        const upgradeFleetBtn = document.querySelector('[onclick="upgradeFleet()"]');
        const hireStaffBtn = document.querySelector('[onclick="hireStaff()"]');

        if (startDeliveryBtn) {
            startDeliveryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startDelivery();
            });
        }

        if (manageOrdersBtn) {
            manageOrdersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.manageOrders();
            });
        }

        if (upgradeFleetBtn) {
            upgradeFleetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.upgradeFleet();
            });
        }

        if (hireStaffBtn) {
            hireStaffBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hireStaff();
            });
        }

        // Make functions globally available
        window.startDelivery = () => this.startDelivery();
        window.manageOrders = () => this.manageOrders();
        window.upgradeFleet = () => this.upgradeFleet();
        window.hireStaff = () => this.hireStaff();
    }

    loadGameState() {
        const saved = localStorage.getItem('deliveryGameState');
        if (saved) {
            try {
                this.gameState = { ...this.gameState, ...JSON.parse(saved) };
            } catch (error) {
                console.error('Error loading game state:', error);
            }
        }
    }

    saveGameState() {
        localStorage.setItem('deliveryGameState', JSON.stringify(this.gameState));
    }

    updateDashboard() {
        // Update stats
        this.updateStats();
        
        // Update recent activity
        this.updateRecentActivity();
        
        // Update player info
        this.updatePlayerInfo();
    }

    updateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const valueElement = card.querySelector('.stat-value');
            const changeElement = card.querySelector('.stat-change');
            
            switch (title) {
                case "Today's Deliveries":
                    valueElement.textContent = this.gameState.deliveries;
                    const yesterdayDeliveries = Math.max(0, this.gameState.deliveries - 3);
                    const deliveryChange = this.gameState.deliveries - yesterdayDeliveries;
                    changeElement.textContent = `${deliveryChange >= 0 ? '+' : ''}${deliveryChange} from yesterday`;
                    changeElement.className = `stat-change ${deliveryChange >= 0 ? 'positive' : 'negative'}`;
                    break;
                    
                case "Revenue":
                    const revenue = this.gameState.deliveries * 25;
                    valueElement.textContent = `$${revenue}`;
                    const yesterdayRevenue = yesterdayDeliveries * 25;
                    const revenueChange = revenue - yesterdayRevenue;
                    changeElement.textContent = `${revenueChange >= 0 ? '+' : ''}$${revenueChange} from yesterday`;
                    changeElement.className = `stat-change ${revenueChange >= 0 ? 'positive' : 'negative'}`;
                    break;
                    
                case "Customer Rating":
                    valueElement.textContent = `${this.gameState.reputation.toFixed(1)}⭐`;
                    changeElement.textContent = "No change";
                    changeElement.className = "stat-change neutral";
                    break;
                    
                case "Active Orders":
                    const activeOrders = Math.max(0, this.gameState.totalDeliveries - this.gameState.deliveries);
                    valueElement.textContent = activeOrders;
                    const overdueOrders = Math.max(0, activeOrders - 2);
                    changeElement.textContent = overdueOrders > 0 ? `${overdueOrders} overdue` : "All on time";
                    changeElement.className = `stat-change ${overdueOrders > 0 ? 'negative' : 'positive'}`;
                    break;
            }
        });
    }

    updateRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        // Clear existing activities
        activityList.innerHTML = '';

        // Generate recent activities
        const activities = this.generateRecentActivities();
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <span class="activity-time">${activity.time}</span>
                <span class="activity-text">${activity.text}</span>
                <span class="activity-reward" style="color: ${activity.reward >= 0 ? '#27ae60' : '#e74c3c'}">${activity.reward >= 0 ? '+' : ''}$${activity.reward}</span>
            `;
            activityList.appendChild(activityItem);
        });
    }

    generateRecentActivities() {
        const activities = [];
        const now = new Date();
        
        if (this.gameState.deliveries > 0) {
            activities.push({
                time: '2 min ago',
                text: 'Delivered package to Downtown Office',
                reward: 25
            });
        }
        
        if (this.gameState.deliveries > 1) {
            activities.push({
                time: '15 min ago',
                text: 'New order received from City Mall',
                reward: 40
            });
        }
        
        if (this.gameState.money < 1500) {
            activities.push({
                time: '1 hour ago',
                text: 'Upgraded delivery van',
                reward: -500
            });
        }
        
        return activities;
    }

    updatePlayerInfo() {
        const playerName = document.querySelector('.player-name');
        const playerLevel = document.querySelector('.player-level');
        const playerMoney = document.querySelector('.player-money');

        if (playerName) playerName.textContent = 'Player Name';
        if (playerLevel) playerLevel.textContent = `Level ${this.gameState.level}`;
        if (playerMoney) playerMoney.textContent = `$${this.gameState.money.toLocaleString()}`;
    }

    startAutoRefresh() {
        // Refresh dashboard every 30 seconds
        setInterval(() => {
            this.loadGameState();
            this.updateDashboard();
        }, 30000);
    }

    // Action methods
    startDelivery() {
        // Generate new delivery orders
        this.gameState.deliveries = 0;
        this.gameState.totalDeliveries = 5;
        this.saveGameState();
        
        // Navigate to game
        window.location.href = '/game';
    }

    manageOrders() {
        window.location.href = '/business';
    }

    upgradeFleet() {
        const cost = 500;
        if (this.gameState.money >= cost) {
            this.gameState.money -= cost;
            this.gameState.totalDeliveries += 2;
            this.saveGameState();
            this.updateDashboard();
            
            // Show notification
            this.showNotification('Fleet upgraded! You can now handle more deliveries.', 'success');
        } else {
            this.showNotification('Not enough money for fleet upgrade!', 'error');
        }
    }

    hireStaff() {
        const cost = 300;
        if (this.gameState.money >= cost) {
            this.gameState.money -= cost;
            this.saveGameState();
            this.updateDashboard();
            
            // Show notification
            this.showNotification('Staff hired! Your business is growing.', 'success');
        } else {
            this.showNotification('Not enough money to hire staff!', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/' || window.location.pathname === '/dashboard') {
        new Dashboard();
    }
});

// Export for module usage
export default Dashboard; 