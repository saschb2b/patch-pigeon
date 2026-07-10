# Migrating from Supabase

The current self-hosted architecture replaces Supabase Auth, its browser client, PostgREST, and RLS policies with Auth.js, server-only Drizzle queries, and explicit owner checks in Server Actions.

## Important limitation

Treat Supabase authentication data separately from changelog data. Existing Supabase sessions do not transfer. PatchPigeon does not import Supabase password hashes, so migrated users must set a new password through the password-reset flow. Configure SMTP and verify delivery before switching production traffic.

## Recommended migration

1. Put the old deployment into maintenance mode and take a full Supabase database backup.
2. Start PatchPigeon on an empty PostgreSQL database and confirm `/api/health` is healthy.
3. Export the required identity mapping from Supabase Auth: user UUID and normalized email. Handle this export as sensitive data.
4. Insert those identities into the new `users` table with the same UUID, `password_hash = NULL`, and the original creation time.
5. Export and import application tables in dependency order: `profiles`, `products`, `entries`, then `entry_items`.
6. Import only columns present in `lib/db/schema.ts`. The removed legacy `entries.content` and `entries.type` columns are not part of the self-hosted schema.
7. Reset the PostgreSQL sequences if you add serial columns in a future schema; the current schema uses UUIDs and needs no sequence reset.
8. Compare row counts and inspect several public changelogs, JSON feeds, and RSS feeds.
9. Ask every migrated user to use “Forgot password” before signing in.
10. Keep the old deployment and backup read-only until the new installation has been verified.

## Referential-integrity checks

Run these against the imported database; every query should return zero rows:

```sql
SELECT p.id FROM profiles p LEFT JOIN users u ON u.id = p.id WHERE u.id IS NULL;
SELECT p.id FROM products p LEFT JOIN users u ON u.id = p.user_id WHERE u.id IS NULL;
SELECT e.id FROM entries e LEFT JOIN products p ON p.id = e.product_id WHERE p.id IS NULL;
SELECT i.id FROM entry_items i LEFT JOIN entries e ON e.id = i.entry_id WHERE e.id IS NULL;
```

Also verify uniqueness before import:

```sql
SELECT lower(email), count(*) FROM users GROUP BY lower(email) HAVING count(*) > 1;
SELECT owner_slug, count(*) FROM profiles GROUP BY owner_slug HAVING count(*) > 1;
SELECT user_id, slug, count(*) FROM products GROUP BY user_id, slug HAVING count(*) > 1;
SELECT product_id, slug, count(*) FROM entries GROUP BY product_id, slug HAVING count(*) > 1;
```

## Cutover checklist

- [ ] Final database backup completed and stored off-host
- [ ] SMTP reset email tested from the public URL
- [ ] Imported row counts match the source
- [ ] Foreign-key and uniqueness checks pass
- [ ] Public pages, JSON, and RSS verified
- [ ] `APP_URL` uses the final HTTPS origin
- [ ] Reverse proxy health check passes
- [ ] Old deployment is read-only and retained for rollback
