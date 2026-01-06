# AGENTS.md - PatchPigeon Codebase Guide

This document helps AI agents and LLMs understand and work with the PatchPigeon codebase effectively.

## Project Overview

**PatchPigeon** is a changelog management platform for indie developers and small companies. Users can create products, write structured changelog entries, and share beautiful public changelog pages.

**Tech Stack:**
- Next.js 16 (App Router)
- Supabase (Auth + PostgreSQL)
- Tailwind CSS v4
- shadcn/ui components
- dnd-kit (drag and drop)

## Project Structure

```
├── app/
│   ├── [ownerSlug]/                    # Public pages (namespaced by owner)
│   │   ├── page.tsx                    # Owner profile - lists all products
│   │   ├── [productSlug]/
│   │   │   ├── page.tsx                # Public changelog timeline
│   │   │   └── [entrySlug]/page.tsx    # Single entry detail page
│   ├── admin/                          # Protected admin dashboard
│   │   ├── page.tsx                    # Dashboard home
│   │   ├── create-product/             # New product form
│   │   └── products/[productId]/       # Product management
│   │       ├── page.tsx                # Entries list
│   │       ├── settings/               # Product settings
│   │       ├── create-entry/           # New entry editor
│   │       └── entries/[entryId]/edit/ # Edit entry
│   ├── auth/                           # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── onboarding/                 # Claim owner handle post-signup
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/[ownerSlug]/[productSlug]/  # Public REST API
│   │   ├── changelog.json/
│   │   ├── changelog.rss/
│   │   └── entries/[entrySlug]/
│   └── page.tsx                        # Landing page
├── components/
│   ├── admin/                          # Admin-specific components
│   │   ├── entry-editor.tsx            # Split-screen structured editor
│   │   ├── entry-item-row.tsx          # Draggable entry item row
│   │   ├── admin-header.tsx
│   │   └── ...
│   ├── changelog/                      # Public changelog components
│   │   ├── changelog-header.tsx
│   │   ├── entry-card.tsx
│   │   ├── change-type-badge.tsx       # Badge for ChangeType enum
│   │   ├── entry-items-list.tsx        # Grouped list of items
│   │   └── timeline-group.tsx
│   ├── brand/                          # Branding components
│   │   ├── pigeon-logo.tsx
│   │   └── brand-header.tsx
│   └── ui/                             # shadcn/ui primitives
├── lib/
│   ├── supabase/                       # Supabase clients
│   │   ├── client.ts                   # Browser client (singleton)
│   │   ├── server.ts                   # Server client
│   │   └── proxy.ts                    # Middleware utilities
│   ├── types.ts                        # TypeScript interfaces
│   ├── hooks/
│   │   └── use-profile.ts              # Profile fetching hook
│   └── utils/
│       └── slug.ts                     # Slug generation utilities
├── scripts/                            # SQL migrations (run in order)
│   ├── 001_create_tables.sql
│   ├── 002_add_profiles.sql
│   └── 003_add_entry_items.sql
└── proxy.ts                            # Next.js middleware
```

## Database Schema

### Tables

**profiles** - User profiles with unique handles
- `id` (uuid, PK, references auth.users)
- `owner_slug` (text, unique) - Public handle like "vercel", "johndoe"
- `display_name` (text)
- `avatar_url` (text, nullable)

**products** - User's products/projects
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `name` (text)
- `slug` (text) - URL slug, unique per user
- `description` (text, nullable)
- `logo_url` (text, nullable)

**entries** - Version/release entries (container for items)
- `id` (uuid, PK)
- `product_id` (uuid, FK → products)
- `title` (text) - Version title like "January 2025 Update"
- `slug` (text) - URL slug, unique per product
- `summary` (text, nullable) - Optional version summary
- `version` (text, nullable) - Semver like "1.2.0"
- `published` (boolean, default false)
- `publish_date` (date)

**entry_items** - Individual changes within a version
- `id` (uuid, PK)
- `entry_id` (uuid, FK → entries)
- `type` (change_type enum) - FEATURE, FIX, IMPROVEMENT, etc.
- `title` (text) - Brief description of the change
- `description` (text, nullable) - Optional longer description
- `area` (text, nullable) - Optional tag like "Editor", "API"
- `sort_order` (integer) - For drag-to-reorder

### Change Type Enum

```sql
CREATE TYPE change_type AS ENUM (
  'FEATURE',      -- New features
  'FIX',          -- Bug fixes
  'IMPROVEMENT',  -- Enhancements
  'KNOWNISSUE',   -- Known issues
  'BREAKING',     -- Breaking changes
  'REMOVED',      -- Removed features
  'NOTE'          -- General notes
);
```

### Row Level Security (RLS)

All tables have RLS enabled:
- **profiles**: Public read, owner write
- **products**: Public read, owner write
- **entries**: Public read (published only), product owner write
- **entry_items**: Public read (for published entries), entry owner write

## Key Patterns

### Supabase Client Usage

```typescript
// Browser (client components) - use singleton
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server (RSC, route handlers, server actions)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### Fetching Entries with Items

```typescript
const { data } = await supabase
  .from('entries')
  .select('*, entry_items(*)')
  .eq('product_id', productId)
  .eq('published', true)
```

### Route Conflict Avoidance

Static routes use distinct paths to avoid conflicts with dynamic segments:
- `/admin/create-product` NOT `/admin/products/new`
- `/admin/products/[id]/create-entry` NOT `.../entries/new`
- `/admin/products/[id]/entries/[entryId]/edit` NOT `.../entries/[entryId]`

### Public URL Structure

All public pages are namespaced by owner:
```
/{ownerSlug}                           # Owner profile
/{ownerSlug}/{productSlug}             # Product changelog
/{ownerSlug}/{productSlug}/{entrySlug} # Single entry
```

## Brand Guidelines

**Name:** PatchPigeon
**Tagline:** "Your changelog, delivered."
**Personality:** Friendly, helpful, playful

**Color Palette:**
- Sky: `#7DD3FC` (primary, features)
- Peach: `#FDBA74` (improvements)
- Mint: `#86EFAC` (fixes)
- Butter: `#FDE047` (known issues)
- Red: Standard red (breaking changes)
- Neutrals: Slate grays

**Typography:**
- Font: DM Sans (clean, friendly)

## Common Tasks

### Adding a New Change Type

1. Add to `change_type` enum in database migration
2. Update `ChangeType` in `lib/types.ts`
3. Add config in `components/admin/entry-item-row.tsx` (changeTypeConfig)
4. Add config in `components/changelog/change-type-badge.tsx`

### Adding New Admin Pages

1. Create page under `app/admin/` with distinct route name
2. Use `createClient` from server, check auth
3. Redirect to `/auth/login` if unauthenticated
4. Check profile exists, redirect to `/auth/onboarding` if not

### Modifying Database Schema

1. Create new migration file: `scripts/00X_description.sql`
2. Never edit existing migration files that have been run
3. Update `lib/types.ts` with new interfaces
4. Update RLS policies as needed

## API Response Format

```json
{
  "product": { "name": "...", "slug": "...", "description": "..." },
  "entries": [
    {
      "id": "...",
      "title": "January 2025 Update",
      "version": "1.2.0",
      "publish_date": "2025-01-06",
      "items": [
        { "type": "FEATURE", "title": "...", "area": "Editor" },
        { "type": "FIX", "title": "..." }
      ]
    }
  ]
}
```

## Testing Flows

1. **Sign Up Flow:** `/auth/sign-up` → Email confirmation → `/auth/onboarding` → `/admin`
2. **Create Product:** `/admin` → "New Product" → Fill form → `/admin/products/[id]`
3. **Create Entry:** Product page → "New Version" → Add structured items → Save
4. **Public View:** `/{owner}/{product}` → Timeline → Click entry → Detail page
