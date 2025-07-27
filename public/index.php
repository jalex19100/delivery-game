<?php
session_start();
require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Simple routing
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

// Remove trailing slash
$path = rtrim($path, '/');

// Route to appropriate page
switch ($path) {
    case '':
    case '/':
        include __DIR__ . '/views/dashboard.php';
        break;
    case '/game':
        include __DIR__ . '/views/game.php';
        break;
    case '/business':
        include __DIR__ . '/views/business.php';
        break;
    case '/logistics':
        include __DIR__ . '/views/logistics.php';
        break;
    case '/settings':
        include __DIR__ . '/views/settings.php';
        break;
    default:
        http_response_code(404);
        include __DIR__ . '/views/404.php';
        break;
}
?> 