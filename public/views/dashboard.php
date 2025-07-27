<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delivery Business Game - Dashboard</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/dashboard.css">
</head>
<body>
    <div class="game-container">
        <!-- Navigation Header -->
        <header class="game-header">
            <div class="logo">
                <h1>🚚 Delivery Empire</h1>
            </div>
            <nav class="main-nav">
                <a href="/" class="nav-item active">Dashboard</a>
                <a href="/business" class="nav-item">Business</a>
                <a href="/logistics" class="nav-item">Logistics</a>
                <a href="/game" class="nav-item">Play Game</a>
                <a href="/settings" class="nav-item">Settings</a>
            </nav>
            <div class="player-info">
                <span class="player-name">Player Name</span>
                <span class="player-level">Level 1</span>
                <span class="player-money">$1,000</span>
            </div>
        </header>

        <!-- Main Dashboard Content -->
        <main class="dashboard-content">
            <!-- Quick Stats -->
            <section class="stats-grid">
                <div class="stat-card">
                    <h3>Today's Deliveries</h3>
                    <div class="stat-value">12</div>
                    <div class="stat-change positive">+3 from yesterday</div>
                </div>
                <div class="stat-card">
                    <h3>Revenue</h3>
                    <div class="stat-value">$450</div>
                    <div class="stat-change positive">+$120 from yesterday</div>
                </div>
                <div class="stat-card">
                    <h3>Customer Rating</h3>
                    <div class="stat-value">4.8⭐</div>
                    <div class="stat-change neutral">No change</div>
                </div>
                <div class="stat-card">
                    <h3>Active Orders</h3>
                    <div class="stat-value">5</div>
                    <div class="stat-change negative">2 overdue</div>
                </div>
            </section>

            <!-- Quick Actions -->
            <section class="quick-actions">
                <h2>Quick Actions</h2>
                <div class="action-buttons">
                    <button class="action-btn primary" onclick="startDelivery()">
                        🚚 Start Delivery Run
                    </button>
                    <button class="action-btn secondary" onclick="manageOrders()">
                        📋 Manage Orders
                    </button>
                    <button class="action-btn secondary" onclick="upgradeFleet()">
                        🚗 Upgrade Fleet
                    </button>
                    <button class="action-btn secondary" onclick="hireStaff()">
                        👥 Hire Staff
                    </button>
                </div>
            </section>

            <!-- Recent Activity -->
            <section class="recent-activity">
                <h2>Recent Activity</h2>
                <div class="activity-list">
                    <div class="activity-item">
                        <span class="activity-time">2 min ago</span>
                        <span class="activity-text">Delivered package to Downtown Office</span>
                        <span class="activity-reward">+$25</span>
                    </div>
                    <div class="activity-item">
                        <span class="activity-time">15 min ago</span>
                        <span class="activity-text">New order received from City Mall</span>
                        <span class="activity-reward">+$40</span>
                    </div>
                    <div class="activity-item">
                        <span class="activity-time">1 hour ago</span>
                        <span class="activity-text">Upgraded delivery van</span>
                        <span class="activity-reward">-$500</span>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="/assets/js/dashboard.js"></script>
</body>
</html> 