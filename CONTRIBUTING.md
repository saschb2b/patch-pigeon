# Contributing

Set up the project with [the development guide](docs/DEVELOPMENT.md). Keep changes focused, preserve existing user work, and run `pnpm check` plus `pnpm build` before submitting them.

Database changes require a new generated migration. Security-sensitive changes to authentication, owner scoping, password recovery, or public-versus-draft visibility should include an explicit test plan.

Use MUI's `sx` prop for styling and the shared `components/link.tsx` wrapper when a MUI `component` prop needs a Next.js link. React Compiler is enabled, so manual memoization needs a concrete correctness reason.
