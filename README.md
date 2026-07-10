# PatchPigeon

PatchPigeon is a self-hostable changelog platform for products and small teams. It provides a structured release editor, public owner and product pages, JSON and RSS feeds, and credential-based accounts.

## Quick start with Docker

Requirements: Docker Engine with Docker Compose.

1. Copy the environment template:

   ```sh
   cp .env.example .env
   ```

   In PowerShell, use `Copy-Item .env.example .env`.

2. Set `POSTGRES_PASSWORD`, the matching password inside `DATABASE_URL`, and `AUTH_SECRET` in `.env`. Generate the auth secret with `openssl rand -base64 32`.

3. Start PatchPigeon:

   ```sh
   docker compose up -d --build
   ```

4. Open [http://localhost:3000](http://localhost:3000). Database migrations run automatically before the app starts.

The default Compose configuration binds the app to `127.0.0.1`. Keep that default when a reverse proxy runs on the same host; set `APP_BIND=0.0.0.0` only when the container must be reachable directly from another machine.

## Self-hosting

Production configuration, TLS/reverse-proxy requirements, backups, upgrades, health checks, and SMTP setup are covered in [Self-hosting PatchPigeon](docs/SELF_HOSTING.md).

If this repository was previously connected to Supabase, read [Migrating from Supabase](docs/MIGRATING_FROM_SUPABASE.md) before importing data. The application tables are portable PostgreSQL data, but Supabase Auth sessions and passwords are not imported by PatchPigeon.

## Local development

Requirements: Node.js 22+, pnpm 10, and PostgreSQL 15+.

```sh
pnpm install
cp .env.example .env.local
pnpm db:migrate
pnpm dev
```

Set `DATABASE_URL` (using `localhost`, not the Compose hostname `database`), `AUTH_SECRET`, and `APP_URL=http://localhost:3000` in `.env.local`. See [Development guide](docs/DEVELOPMENT.md) for database and verification commands.

## Main routes

| Route | Purpose |
| --- | --- |
| `/{owner}` | Public owner profile |
| `/{owner}/{product}` | Public changelog |
| `/{owner}/{product}/{entry}` | Published release detail |
| `/admin` | Authenticated dashboard |
| `/api/{owner}/{product}/changelog.json` | Paginated JSON feed |
| `/api/{owner}/{product}/changelog.rss` | RSS feed |
| `/api/health` | Database-aware health check |

## Technology

- Next.js 16 and React 19
- Auth.js credentials authentication
- PostgreSQL with Drizzle ORM and versioned SQL migrations
- Material UI 7 and dnd-kit
- SMTP password-recovery email

## Documentation

- [Self-hosting and operations](docs/SELF_HOSTING.md)
- [Supabase migration guide](docs/MIGRATING_FROM_SUPABASE.md)
- [Development guide](docs/DEVELOPMENT.md)
- [Agent knowledge index](knowledge/index.md)
- [Contributing](CONTRIBUTING.md)

## License

[MIT](LICENSE)
