# PatchPigeon agent guide

Start with [the agent knowledge index](knowledge/index.md). It routes architecture, data ownership, and operations by progressive disclosure.

## Required checks

Run `pnpm check` and `pnpm build` after code changes. Run `docker compose config` after deployment changes. Database changes also require `pnpm db:generate`; never edit an already-applied migration.

## Boundaries that must hold

- Server-only reads live in `lib/data/`; authenticated mutations live in Server Actions.
- Every admin read and write is scoped to the authenticated user. There is no RLS safety layer.
- Client components do not import database modules or server-only helpers.
- Public queries and APIs expose published entries only.
- React Compiler is enabled. Do not add manual memoization without an identity or effect-correctness reason.
- Use MUI `sx`, and use `components/link.tsx` when a MUI `component` prop needs a Next.js link.

Human setup and operational procedures live in `docs/`. Keep `knowledge/` conformant with OKF when agent-facing facts change: update timestamps, indexes, cross-links, and `knowledge/log.md`, then validate it.
