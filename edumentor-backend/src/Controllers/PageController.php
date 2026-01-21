<?php

declare(strict_types=1);

namespace PraktikaX\Controllers;

use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Response;
use PDO;

class PageController
{
    public function __construct(private Database $db, private Config $config)
    {
    }

    public function index(): void
    {
        $stmt = $this->db->pdo()->query(
            'SELECT id, slug, title, hero_title, hero_subtitle, hero_background, sections_json, meta_title, meta_description, schema_type, is_active
             FROM pages WHERE is_active = 1 ORDER BY id ASC'
        );
        $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json(['pages' => $pages]);
    }

    public function show(string $slug): void
    {
        $stmt = $this->db->pdo()->prepare(
            'SELECT id, slug, title, hero_title, hero_subtitle, hero_background, sections_json, meta_title, meta_description, schema_type, is_active
             FROM pages WHERE slug = :slug LIMIT 1'
        );
        $stmt->execute(['slug' => $slug]);
        $page = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$page || (int)$page['is_active'] !== 1) {
            Response::json(['error' => 'Page not found'], 404);
            return;
        }
        Response::json(['page' => $page]);
    }

    public function sitemap(): void
    {
        $stmt = $this->db->pdo()->query('SELECT slug, updated_at FROM pages WHERE is_active = 1');
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $baseUrl = rtrim($this->config->get('APP_URL', 'http://localhost'), '/');
        $items = '';
        foreach ($rows as $row) {
            $loc = htmlspecialchars($baseUrl . '/' . $row['slug']);
            $lastmod = $row['updated_at'] ? date('c', strtotime($row['updated_at'])) : date('c');
            $items .= "<url><loc>{$loc}</loc><lastmod>{$lastmod}</lastmod></url>";
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        $xml .= $items;
        $xml .= '</urlset>';

        Response::text($xml, 200, 'application/xml');
    }
}
