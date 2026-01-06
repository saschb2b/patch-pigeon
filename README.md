# PatchPigeon - Changelog Organizer

A beautiful changelog management system for indie devs and small companies. Create, manage, and share product changelogs with your users.

## Features

- **Owner Namespaces** - Each user gets a unique handle (e.g., `/vercel/v0`)
- **Public Changelog Pages** - Beautiful timeline view at `/{owner}/{product}`
- **Entry Detail Pages** - Individual pages for each changelog entry
- **Admin Dashboard** - Create/edit/delete entries with live preview editor
- **Public REST API** - JSON and RSS endpoints for integrations
- **Entry Types** - Feature, Improvement, Fix, Breaking Change badges
- **Markdown Support** - Write rich content with markdown formatting
- **Authentication** - Secure admin access with Supabase Auth
- **Row Level Security** - Data protection with Supabase RLS

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/{ownerSlug}/{productSlug}` | Public changelog timeline |
| `/{ownerSlug}/{productSlug}/{entrySlug}` | Single entry detail page |
| `/admin` | Dashboard to manage products & entries |
| `/auth/login` | Sign in page |
| `/auth/sign-up` | Create account page |
| `/auth/onboarding` | Claim your unique handle |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/{owner}/{product}/changelog.json` | JSON feed of published entries |
| `/api/{owner}/{product}/changelog.rss` | RSS feed for subscriptions |
| `/api/{owner}/{product}/entries/{entrySlug}` | Single entry JSON |

### Query Parameters (JSON API)

- `type` - Filter by entry type (feature, improvement, fix, breaking)
- `limit` - Number of entries to return (default: 50, max: 100)
- `offset` - Pagination offset

## Database Schema

### Profiles Table
- `id` - UUID primary key (links to auth.users)
- `owner_slug` - Unique handle (e.g., "vercel", "johndoe")
- `display_name` - Display name
- `avatar_url` - Profile avatar URL

### Products Table
- `id` - UUID primary key
- `user_id` - Owner reference
- `name` - Product name
- `slug` - URL-friendly identifier (unique per user)
- `description` - Product description
- `logo_url` - Product logo URL

### Entries Table
- `id` - UUID primary key
- `product_id` - Product reference
- `title` - Entry title
- `slug` - URL-friendly identifier
- `content` - Markdown content
- `type` - feature | improvement | fix | breaking
- `version` - Optional version number
- `published` - Publication status
- `publish_date` - Publication date

## Getting Started

1. Run the database migrations:
   - `scripts/001_create_tables.sql`
   - `scripts/002_add_profiles.sql`
2. Sign up for an account at `/auth/sign-up`
3. Complete onboarding to claim your unique handle
4. Create your first product in the admin dashboard
5. Add changelog entries and publish them
6. Share your public changelog URL: `/{your-handle}/{product}`

## Tech Stack

- Next.js 16 App Router
- Supabase (Database + Auth)
- Tailwind CSS v4
- shadcn/ui Components
- DM Sans font
