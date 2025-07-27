<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delivery Game - Play</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/game.css">
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
</head>
<body>
    <div class="game-container">
        <!-- Game Header -->
        <header class="game-header">
            <div class="game-nav">
                <a href="/" class="nav-back">← Back to Dashboard</a>
            </div>
            <div class="game-stats">
                <div class="stat">
                    <span class="stat-label">Money:</span>
                    <span class="stat-value" id="money">$1,000</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Level:</span>
                    <span class="stat-value" id="level">1</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Reputation:</span>
                    <span class="stat-value" id="reputation">50</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Vehicle:</span>
                    <span class="stat-value" id="vehicle">Bike</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Deliveries:</span>
                    <span class="stat-value" id="deliveries">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Score:</span>
                    <span class="stat-value" id="score">0</span>
                </div>
            </div>
        </header>

        <!-- Game Canvas Container -->
        <div class="game-canvas-container">
            <div id="game-canvas"></div>
            
            <!-- Game UI Overlay -->
            <div class="game-ui" id="game-ui">
                <!-- Pause Menu -->
                <div class="pause-menu" id="pause-menu" style="display: none;">
                    <div class="pause-content">
                        <h2>Game Paused</h2>
                        <button class="ui-btn primary" onclick="resumeGame()">Resume</button>
                        <button class="ui-btn secondary" onclick="restartGame()">Restart</button>
                        <button class="ui-btn secondary" onclick="exitGame()">Exit to Dashboard</button>
                    </div>
                </div>

                <!-- Delivery Info -->
                <div class="delivery-info" id="delivery-info">
                    <div id="order-info">
                        <h3>No Active Delivery</h3>
                        <p>Pick up a package from a warehouse to start!</p>
                    </div>
                </div>

                <!-- Controls Help -->
                <div class="controls-help" id="controls-help">
                    <h4>Controls</h4>
                    <div class="control-list">
                        <div class="control-item">
                            <span class="key">WASD</span>
                            <span class="action">Move Character</span>
                        </div>
                        <div class="control-item">
                            <span class="key">SPACE</span>
                            <span class="action">Pickup/Deliver</span>
                        </div>
                        <div class="control-item">
                            <span class="key">ESC</span>
                            <span class="action">Pause Game</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Game Controls -->
        <div class="game-controls">
            <button class="control-btn" id="pause-btn" onclick="togglePause()">⏸️ Pause</button>
            <button class="control-btn" id="restart-btn" onclick="restartGame()">🔄 Restart</button>
            <button class="control-btn" id="exit-btn" onclick="exitGame()">🚪 Exit</button>
        </div>
    </div>

    <!-- Load built assets -->
    <script src="/assets/dist/js/game.js"></script>
</body>
</html> 