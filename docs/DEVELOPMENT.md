# Development guide

## Setup

Use Node.js 22 or newer and pnpm 10. Start any PostgreSQL 15+ instance, copy `.env.example` to `.env.local`, and set a local `DATABASE_URL`, `AUTH_SECRET`, and `APP_URL`.

```sh
pnpm install
pnpm db:migrate
pnpm dev
```

When SMTP is unset in development, requested password-reset URLs appear in the server log.

## Database workflow

The schema source is `lib/db/schema.ts`; checked-in migrations under `drizzle/` are the deployment contract.

```sh
pnpm db:generate  # generate SQL after changing the schema
pnpm db:migrate   # apply checked-in migrations
pnpm db:studio    # inspect a local database
```

Do not use `db:push` against shared or production databases. It is provided only for disposable local experimentation.

## Verification

Before opening a pull request, run:

```sh
pnpm check
pnpm build
docker compose config
```

`pnpm check` runs TypeScript and strict React Compiler-aware ESLint rules. The compiler is enabled in `next.config.mjs`; avoid manual `useMemo`, `useCallback`, and `React.memo` unless referential identity is required outside React or for effect correctness.

## Dependency maintenance

Use `pnpm outdated` to review available updates and `pnpm audit` to check the full dependency tree. Keep framework, lint, and TypeScript upgrades inside the peer ranges declared by Next.js and its ESLint plugins; a newer standalone release is not an upgrade if the surrounding toolchain does not support it yet.

Auth.js v5 is intentionally pinned to its current beta. Better Auth is a future migration option, but switching requires migrating credential records and validating existing sessions rather than only replacing packages.

For an end-to-end container check:

```sh
docker compose up -d --build
curl --fail http://localhost:3000/api/health
docker compose down
```

## Code boundaries

- Server-only reads belong in `lib/data/`.
- Authenticated mutations belong in Server Actions under `app/*/actions.ts`.
- Every admin query and mutation must scope data by the authenticated user; there is no Supabase RLS layer anymore.
- Client components never import `lib/db`, `lib/data`, or server-only auth helpers.
- Public APIs return published entries only.
