-- Delivery Game Database Schema

-- Players table
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    money DECIMAL(10,2) DEFAULT 1000.00,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    reputation DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    type ENUM('bike', 'car', 'van', 'truck') NOT NULL,
    capacity INT NOT NULL,
    speed DECIMAL(5,2) NOT NULL,
    fuel_level DECIMAL(5,2) DEFAULT 100.00,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    pickup_location VARCHAR(100) NOT NULL,
    delivery_location VARCHAR(100) NOT NULL,
    package_type ENUM('small', 'medium', 'large') NOT NULL,
    reward DECIMAL(8,2) NOT NULL,
    time_limit INT NOT NULL, -- in seconds
    status ENUM('pending', 'picked_up', 'delivered', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Game sessions table
CREATE TABLE game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    deliveries_completed INT DEFAULT 0,
    total_revenue DECIMAL(8,2) DEFAULT 0.00,
    score INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Staff table
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    role ENUM('driver', 'dispatcher', 'manager') NOT NULL,
    salary DECIMAL(8,2) NOT NULL,
    efficiency DECIMAL(3,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT TRUE,
    hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Achievements table
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirement_type ENUM('deliveries', 'revenue', 'level', 'reputation') NOT NULL,
    requirement_value INT NOT NULL,
    reward_type ENUM('money', 'experience', 'vehicle', 'staff') NOT NULL,
    reward_value VARCHAR(100) NOT NULL
);

-- Player achievements table
CREATE TABLE player_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_player_achievement (player_id, achievement_id)
);

-- Game statistics table
CREATE TABLE game_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    total_deliveries INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    total_distance DECIMAL(10,2) DEFAULT 0.00,
    average_delivery_time DECIMAL(8,2) DEFAULT 0.00,
    customer_rating DECIMAL(3,2) DEFAULT 5.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Insert default achievements
INSERT INTO achievements (name, description, requirement_type, requirement_value, reward_type, reward_value) VALUES
('First Delivery', 'Complete your first delivery', 'deliveries', 1, 'money', '100'),
('Speed Demon', 'Complete 10 deliveries in under 5 minutes', 'deliveries', 10, 'experience', '500'),
('Millionaire', 'Earn $1,000,000 in total revenue', 'revenue', 1000000, 'vehicle', 'luxury_truck'),
('Customer Favorite', 'Maintain a 4.8+ rating for 100 deliveries', 'reputation', 480, 'staff', 'expert_driver'),
('Fleet Master', 'Own 5 different vehicles', 'level', 5, 'money', '5000'),
('Business Mogul', 'Reach level 50', 'level', 50, 'staff', 'business_manager');

-- Create indexes for better performance
CREATE INDEX idx_orders_player_status ON orders(player_id, status);
CREATE INDEX idx_vehicles_player_active ON vehicles(player_id, is_active);
CREATE INDEX idx_game_sessions_player ON game_sessions(player_id);
CREATE INDEX idx_staff_player_active ON staff(player_id, is_active); 