<?php

declare(strict_types=1);

namespace PraktikaX\Controllers;

use PraktikaX\Auth;
use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Request;
use PraktikaX\Response;
use PDO;

class AuthController
{
    private Auth $auth;

    public function __construct(private Database $db, private Config $config)
    {
        $this->auth = new Auth($db);
    }

    public function register(): void
    {
        $data = Request::json();
        $email = strtolower(trim($data['email'] ?? ''));
        $fullName = trim($data['full_name'] ?? '');
        $password = $data['password'] ?? '';

        if ($email === '' || $fullName === '' || strlen($password) < 8) {
            Response::json(['error' => 'Invalid registration data.'], 422);
            return;
        }

        $stmt = $this->db->pdo()->prepare('SELECT id FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            Response::json(['error' => 'Email already registered.'], 409);
            return;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $role = 'public_user';
        $insert = $this->db->pdo()->prepare(
            'INSERT INTO users (email, full_name, password_hash, role) VALUES (:email, :full_name, :password_hash, :role)'
        );
        $insert->execute([
            'email' => $email,
            'full_name' => $fullName,
            'password_hash' => $hash,
            'role' => $role,
        ]);
        $userId = (int)$this->db->pdo()->lastInsertId();
        $token = $this->auth->issueToken($userId);

        Response::json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => $userId,
                'email' => $email,
                'full_name' => $fullName,
                'role' => $role,
            ],
        ], 201);
    }

    public function login(): void
    {
        $data = Request::json();
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        if ($email === '' || $password === '') {
            Response::json(['error' => 'Invalid credentials.'], 422);
            return;
        }

        $stmt = $this->db->pdo()->prepare('SELECT id, password_hash, full_name, role FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::json(['error' => 'Invalid credentials.'], 401);
            return;
        }

        $token = $this->auth->issueToken((int)$user['id']);

        Response::json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => (int)$user['id'],
                'email' => $email,
                'full_name' => $user['full_name'],
                'role' => $user['role'],
            ],
        ]);
    }

    public function logout(): void
    {
        $token = Request::bearerToken();
        if ($token) {
            $this->auth->revokeToken($token);
        }
        Response::json(['status' => 'ok']);
    }
}
