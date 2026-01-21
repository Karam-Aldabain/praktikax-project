# PraktikaX Backend (PHP 8 + MySQL)

## Quick start
1. Create a MySQL database and import `sql/schema.sql` (optional sample content: `sql/seed.sql`).
2. Copy `.env.example` to `.env` and update DB credentials + `APP_URL`.
3. Point your web server document root to `public/`.
4. Start the server (PHP built-in example): `php -S localhost:8080 -t public`

## PostgreSQL
1. Create a Postgres database and import `sql/schema.pgsql.sql`.
2. Set `DB_DRIVER=pgsql`, `DB_PORT=5432`, and optionally `DB_SSLMODE=require`.

## API overview
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Pages: `GET /api/pages`, `GET /api/pages/{slug}`
- Submissions: `POST /api/pages/{slug}/submit` (supports file upload)
- Admin: `GET /api/admin/stats`, `GET /api/admin/pages`, `POST /api/admin/pages`, `PUT /api/admin/pages/{id}`
- Admin submissions: `GET /api/admin/submissions`, `GET /api/admin/submissions/export`
- Admin roles: `GET /api/admin/users`, `PATCH /api/admin/users/{id}/role`
- Media: `GET /api/admin/media`, `POST /api/admin/media`
- Sitemap: `GET /sitemap.xml`

## Roles
- super_admin: Full access
- content_manager: Manage pages, content, media
- form_manager: View submissions and export
- partner_view: Read-only partner access (reserved)
- public_user: Default for registrants
