<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// CSRF Protection
if (!isset($_SESSION['csrf_token']) || !isset($_POST['csrf_token']) || $_SESSION['csrf_token'] !== $_POST['csrf_token']) {
    echo json_encode([
        'status' => 'error',
        'message' => 'CSRF token validation failed'
    ]);
    exit;
}

require_once '../config/check-db.php';
require_once '../models/Member.php';

header('Content-Type: application/json');

try {
    $database = Database::getInstance();
    $db = $database->getConnection();
    $member = Member::getInstance($db);

    // Collect and validate input data
    $data = [
        'title' => $_POST['title'] ?? '',
        'image' => $_POST['image'] ?? '',
        'release_at' => $_POST['release_at'] ?? '',
        'summary' => $_POST['summary'] ?? ''
    ];

    // Additional server-side validation
    if (empty($data['title']) || empty($data['image']) || empty($data['release_at'])) {
        throw new InvalidArgumentException('All fields are required');
    }

    // Add member method (to be added in Member.php)
    $result = $member->create($data);

    echo json_encode([
        'status' => 'success',
        'message' => 'Member added successfully',
        'data' => $result
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}