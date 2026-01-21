<?php

declare(strict_types=1);

use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Response;
use PraktikaX\Router;
use PraktikaX\Controllers\AdminController;
use PraktikaX\Controllers\AuthController;
use PraktikaX\Controllers\MediaController;
use PraktikaX\Controllers\PageController;
use PraktikaX\Controllers\PartnerController;
use PraktikaX\Controllers\ProgramController;
use PraktikaX\Controllers\SubmissionController;

require dirname(__DIR__) . '/src/Bootstrap.php';

$config = new Config(dirname(__DIR__));
$db = new Database($config);

$allowedOrigin = $config->get('CORS_ORIGIN', 'http://localhost:3000');
header("Access-Control-Allow-Origin: {$allowedOrigin}");
header('Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::json(['status' => 'ok']);
    exit;
}

$adminEmail = $config->get('ADMIN_EMAIL');
$adminPassword = $config->get('ADMIN_PASSWORD');
if ($adminEmail && $adminPassword) {
    try {
        $stmt = $db->pdo()->prepare('SELECT id FROM users WHERE email = :email');
        $stmt->execute(['email' => $adminEmail]);
        if (!$stmt->fetchColumn()) {
            $hash = password_hash($adminPassword, PASSWORD_BCRYPT);
            $insert = $db->pdo()->prepare(
                'INSERT INTO users (email, full_name, password_hash, role) VALUES (:email, :full_name, :password_hash, :role)'
            );
            $insert->execute([
                'email' => $adminEmail,
                'full_name' => 'Super Admin',
                'password_hash' => $hash,
                'role' => 'super_admin',
            ]);
        }
    } catch (Throwable $e) {
        // Ignore seeding failures to avoid breaking requests.
    }
}

$router = new Router();

$authController = new AuthController($db, $config);
$pageController = new PageController($db, $config);
$submissionController = new SubmissionController($db, $config);
$adminController = new AdminController($db, $config);
$mediaController = new MediaController($db, $config);
$partnerController = new PartnerController($db, $config);
$programController = new ProgramController($db, $config);

$router->get('/api/health', function () {
    return Response::json(['status' => 'ok']);
});
$router->get('/api/csrf', function () {
    $token = bin2hex(random_bytes(16));
    setcookie('csrf_token', $token, [
        'expires' => time() + 3600,
        'path' => '/',
        'httponly' => false,
        'samesite' => 'Lax',
    ]);
    return Response::json(['csrf_token' => $token]);
});

$router->post('/api/auth/register', [$authController, 'register']);
$router->post('/api/auth/login', [$authController, 'login']);
$router->post('/api/auth/logout', [$authController, 'logout']);

$router->get('/api/pages', [$pageController, 'index']);
$router->get('/api/pages/{slug}', [$pageController, 'show']);
$router->post('/api/pages/{slug}/submit', [$submissionController, 'store']);
$router->get('/api/programs', [$programController, 'index']);
$router->get('/api/programs/{id}', [$programController, 'show']);

$router->get('/api/admin/stats', [$adminController, 'stats']);
$router->get('/api/admin/pages', [$adminController, 'pages']);
$router->post('/api/admin/pages', [$adminController, 'createPage']);
$router->put('/api/admin/pages/{id}', [$adminController, 'updatePage']);
$router->delete('/api/admin/pages/{id}', [$adminController, 'deletePage']);
$router->get('/api/admin/programs', [$programController, 'adminIndex']);
$router->post('/api/admin/programs', [$programController, 'create']);
$router->put('/api/admin/programs/{id}', [$programController, 'update']);
$router->delete('/api/admin/programs/{id}', [$programController, 'delete']);
$router->get('/api/admin/submissions', [$adminController, 'submissions']);
$router->get('/api/admin/submissions/export', [$adminController, 'exportSubmissions']);
$router->get('/api/admin/users', [$adminController, 'users']);
$router->patch('/api/admin/users/{id}/role', [$adminController, 'updateRole']);
$router->get('/api/admin/tracks', [$adminController, 'tracks']);
$router->post('/api/admin/tracks', [$adminController, 'createTrack']);
$router->put('/api/admin/tracks/{id}', [$adminController, 'updateTrack']);
$router->delete('/api/admin/tracks/{id}', [$adminController, 'deleteTrack']);
$router->get('/api/admin/partner-assignments', [$adminController, 'partnerAssignments']);
$router->post('/api/admin/partner-assignments', [$adminController, 'savePartnerAssignments']);

$router->get('/api/admin/media', [$mediaController, 'index']);
$router->post('/api/admin/media', [$mediaController, 'upload']);
$router->delete('/api/admin/media/{id}', [$mediaController, 'delete']);

$router->get('/api/partner/overview', [$partnerController, 'overview']);
$router->get('/api/partner/submissions', [$partnerController, 'submissions']);

$router->get('/sitemap.xml', [$pageController, 'sitemap']);

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
