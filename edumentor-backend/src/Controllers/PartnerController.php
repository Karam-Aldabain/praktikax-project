<?php

declare(strict_types=1);

namespace PraktikaX\Controllers;

use PraktikaX\Auth;
use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Request;
use PraktikaX\Response;
use PDO;

class PartnerController
{
    private Auth $auth;

    public function __construct(private Database $db, private Config $config)
    {
        $this->auth = new Auth($db);
    }

    public function overview(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['partner_view', 'super_admin']);

        $pages = $this->assignedPages((int)$user['id']);
        $pageIds = array_column($pages, 'id');
        if (empty($pageIds)) {
            Response::json(['pages' => [], 'stats' => ['submissions' => 0]]);
            return;
        }

        $in = implode(',', array_fill(0, count($pageIds), '?'));
        $stmt = $this->db->pdo()->prepare("SELECT COUNT(*) FROM submissions WHERE page_id IN ({$in})");
        $stmt->execute($pageIds);
        $count = (int)$stmt->fetchColumn();

        Response::json([
            'pages' => $pages,
            'stats' => ['submissions' => $count],
        ]);
    }

    public function submissions(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['partner_view', 'super_admin']);

        $pages = $this->assignedPages((int)$user['id']);
        $pageIds = array_column($pages, 'id');
        if (empty($pageIds)) {
            Response::json(['submissions' => []]);
            return;
        }

        $in = implode(',', array_fill(0, count($pageIds), '?'));
        $stmt = $this->db->pdo()->prepare(
            "SELECT s.id, p.slug, s.form_data_json, s.file_path, s.created_at
             FROM submissions s JOIN pages p ON p.id = s.page_id
             WHERE s.page_id IN ({$in})
             ORDER BY s.created_at DESC"
        );
        $stmt->execute($pageIds);
        Response::json(['submissions' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    private function assignedPages(int $userId): array
    {
        $stmt = $this->db->pdo()->prepare(
            'SELECT p.id, p.slug, p.title
             FROM partner_page_access a
             JOIN pages p ON p.id = a.page_id
             WHERE a.user_id = :user_id'
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
