# Development guide

## Setup

Use Node.js 22 or newer and pnpm 10. Start any PostgreSQL 15+ instance, copy `.env.example` to `.env.local`, and set a local `DATABASE_URL`, `AUTH_SECRET`, and `APP_URL`.

```sh
pnpm install
pnpm db:migrate
pnpm dev
```

The project does not seed a default account. Once the database is running and
the migrations have completed, create a local account at
`http://localhost:3000/auth/sign-up`; passwords must contain at least eight
characters. Signup and login require a working `DATABASE_URL` even though the
public demo routes do not.

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

## End-to-end tests

The Playwright suite covers the public demo, signup and onboarding, sign-out
and login, product creation, release publishing, public changelog pages, and
JSON/RSS feeds. Install Chromium once, then run the managed suite:

```sh
pnpm test:e2e:install
pnpm test:e2e
```

The managed command builds a production image on `127.0.0.1:3100`, starts a
project-scoped PostgreSQL database, runs migrations through the normal
container entrypoint, and removes the containers and volume afterward. It
does not use `.env`, `.env.local`, or development data. Set
`E2E_KEEP_STACK=1` to retain a failed stack for investigation; the next managed
run removes it before starting.

To run against an already-running deployment instead, set `E2E_BASE_URL`; in
that mode the command does not start or stop Docker:

```sh
E2E_BASE_URL=https://staging.example.com pnpm test:e2e
```

Failure traces, screenshots, and videos are written under `test-results/`.
Open the HTML summary with `pnpm test:e2e:report`.

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
