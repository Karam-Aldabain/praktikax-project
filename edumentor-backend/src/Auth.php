<?php

declare(strict_types=1);

namespace PraktikaX;

use PDO;

class Auth
{
    public function __construct(private Database $db)
    {
    }

    public function requireUser(?string $token): array
    {
        if (!$token) {
            Response::json(['error' => 'Unauthorized'], 401);
            exit;
        }
        $sql = 'SELECT u.id, u.email, u.full_name, u.role
                FROM api_tokens t
                JOIN users u ON u.id = t.user_id
                WHERE t.token = :token AND (t.expires_at IS NULL OR t.expires_at > NOW())';
        $stmt = $this->db->pdo()->prepare($sql);
        $stmt->execute(['token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            Response::json(['error' => 'Unauthorized'], 401);
            exit;
        }
        return $user;
    }

    public function requireRole(array $user, array $allowed): void
    {
        if (!in_array($user['role'], $allowed, true)) {
            Response::json(['error' => 'Forbidden'], 403);
            exit;
        }
    }

    public function issueToken(int $userId): string
    {
        $token = bin2hex(random_bytes(32));
        $stmt = $this->db->pdo()->prepare('INSERT INTO api_tokens (user_id, token) VALUES (:user_id, :token)');
        $stmt->execute(['user_id' => $userId, 'token' => $token]);
        return $token;
    }

    public function revokeToken(string $token): void
    {
        $stmt = $this->db->pdo()->prepare('DELETE FROM api_tokens WHERE token = :token');
        $stmt->execute(['token' => $token]);
    }
}
