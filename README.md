# PatchPigeon

Beautiful changelogs for indie developers. Open source and community funded.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/license-MIT-blue)

## What is PatchPigeon?

A simple changelog platform where you can create products, write structured updates, and share public changelog pages with your users. No more scattering updates across Discord, Twitter, and email.

**Live at:** [patchpigeon.com](https://patchpigeon.com)

## Features

- Public changelog pages at `/{owner}/{product}`
- Structured entry editor with live preview
- REST API (JSON + RSS feeds)
- Drag & drop reordering
- Change type badges (Feature, Fix, Improvement, Breaking, etc.)

## Tech Stack

- Next.js 16 (App Router)
- Supabase (PostgreSQL + Auth)
- Material UI v7
- dnd-kit

## Local Development

### Prerequisites

- Node.js 18+
- pnpm
- Supabase account

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/saschb2b/patch-pigeon.git
   cd patch-pigeon
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a Supabase project and run the migrations in order:
   - `scripts/001_create_tables.sql`
   - `scripts/002_add_profiles.sql`
   - `scripts/003_add_entry_items.sql`

4. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Run the dev server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## API

| Endpoint | Description |
|----------|-------------|
| `/api/{owner}/{product}/changelog.json` | JSON feed |
| `/api/{owner}/{product}/changelog.rss` | RSS feed |
| `/api/{owner}/{product}/entries/{slug}` | Single entry |

## Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## Support

This project is free and open source. If you find it useful, consider [sponsoring its development](https://github.com/sponsors/saschb2b).

## License

MIT
