# Self-hosting PatchPigeon

## Production prerequisites

- Docker Engine and Docker Compose
- A DNS name pointing at the host
- A TLS-terminating reverse proxy such as Caddy, nginx, or Traefik
- An SMTP server if password recovery must work
- Persistent storage and an off-host backup destination

## Configure

Copy `.env.example` to `.env` and set:

| Variable | Required | Purpose |
| --- | --- | --- |
| `APP_URL` | Yes | Canonical external URL, including `https://` in production |
| `AUTH_SECRET` | Yes | Random secret of at least 32 bytes |
| `POSTGRES_PASSWORD` | Yes | Password for the bundled database; use URL-safe random characters |
| `DATABASE_URL` | Yes | PostgreSQL connection URL; keep bundled-database credentials in sync |
| `APP_BIND` | No | Host bind address; defaults to `127.0.0.1` |
| `APP_PORT` | No | Host port; defaults to `3000` |
| `DB_POOL_MAX` | No | Maximum connections per app process; defaults to `10` |
| `SMTP_*` | Recommended | SMTP host, port, TLS mode, and optional credentials |
| `EMAIL_FROM` | Recommended | Verified sender address for password resets |

`APP_URL` is security-sensitive because password-reset links use it. Do not derive it from arbitrary proxy `Host` headers. For the bundled Compose database, the connection host in `DATABASE_URL` is `database`; for local development outside Docker it is normally `localhost`.

## Deploy

```sh
docker compose pull
docker compose up -d --build
docker compose ps
```

The app waits for PostgreSQL, applies every unapplied migration from `drizzle/`, and then starts Next.js. A failed migration prevents the app from serving traffic.

Forward HTTP traffic from the reverse proxy to `127.0.0.1:${APP_PORT}` and preserve the standard `Host`, `X-Forwarded-Host`, and `X-Forwarded-Proto` headers. Terminate TLS at the proxy and set `APP_URL` to the public HTTPS URL.

Rate-limit POST requests to authentication pages and `/api/auth` at the reverse proxy. This is especially important for credential login and password-reset requests on an internet-facing instance.

## Health and logs

`GET /api/health` returns `200` only when the process can query PostgreSQL; it returns `503` for missing configuration or an unavailable database.

```sh
curl --fail https://changelog.example.com/api/health
docker compose logs -f app
docker compose logs -f database
```

## Backups

Back up before every upgrade and copy the dump off the Docker host:

```sh
docker compose exec -T database sh -c \
  'pg_dump --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --format=custom' \
  > patchpigeon-$(date +%F).dump
```

Test restoration regularly against a disposable database:

```sh
createdb patchpigeon_restore_test
pg_restore --clean --if-exists --dbname patchpigeon_restore_test patchpigeon-YYYY-MM-DD.dump
```

The `postgres-data` volume is persistent storage, not a backup. Volume loss, host loss, or operator error can still destroy it.

## Upgrade

1. Read the release notes and take a database backup.
2. Pull the new repository revision or image.
3. Run `docker compose up -d --build`.
4. Wait for `/api/health` to return `200`.
5. Check the app logs for migration or authentication errors.

Migrations are forward-only. Do not edit a migration that may already have run; generate a new one with `pnpm db:generate`.

## SMTP

Password reset works without SMTP only in development, where the reset URL is written to the server log. In production, missing SMTP configuration is treated as a delivery failure and no reset URL is logged.

For implicit TLS use port `465` and `SMTP_SECURE=true`. For STARTTLS, normally use port `587` and `SMTP_SECURE=false`.

## External PostgreSQL

The bundled database is convenient but optional. To use a managed or separately operated PostgreSQL instance, set `DATABASE_URL` for the `app` service. In a deployment-specific Compose file, also remove the `database` service and the app's `depends_on.database` condition; the checked-in Compose file intentionally models the bundled setup. The database user needs permission to create and alter tables during migrations. Configure TLS in the connection URL according to the provider's requirements.
