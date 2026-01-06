# AGENTS.md - PatchPigeon Codebase Guide

This document helps AI agents and LLMs understand and work with the PatchPigeon codebase effectively.

## Project Overview

**PatchPigeon** is a changelog management platform for indie developers and small companies. Users can create products, write structured changelog entries, and share beautiful public changelog pages.

**Tech Stack:**
- Next.js 16 (App Router)
- Supabase (Auth + PostgreSQL)
- Material UI (MUI) v7
- Emotion (CSS-in-JS)
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
│   ├── globals.css                     # Minimal global styles
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
│   ├── ui/                             # MUI wrapper components
│   │   ├── button.tsx                  # Button with variant mapping
│   │   ├── card.tsx                    # Card compound components
│   │   ├── input.tsx                   # TextField wrapper
│   │   ├── textarea.tsx                # Multiline TextField
│   │   ├── label.tsx                   # FormLabel wrapper
│   │   ├── switch.tsx                  # Switch with onCheckedChange
│   │   └── alert-dialog.tsx            # Dialog compound components
│   ├── link.tsx                        # Next.js Link wrapper for MUI
│   └── theme-registry.tsx              # MUI ThemeProvider setup
├── lib/
│   ├── theme.ts                        # MUI theme configuration
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

## Styling with MUI

### Theme Configuration

The MUI theme is defined in `lib/theme.ts` with PatchPigeon brand colors:

```typescript
const brandColors = {
  sky: '#a7d8ff',      // Features
  peach: '#ffb8a1',    // Improvements
  mint: '#bfebd6',     // Fixes
  butter: '#ffe7a3',   // Known issues
  ink: '#1f2937',      // Primary text/buttons
  surface: '#ffffff',  // Backgrounds
}
```

### Using the `sx` Prop

All styling is done via MUI's `sx` prop:

```typescript
<Box sx={{ 
  p: 2,                    // padding: 16px (8px * 2)
  mb: 3,                   // marginBottom: 24px
  bgcolor: 'background.paper',
  borderRadius: 2,         // 16px
  '&:hover': {
    boxShadow: 2,
  },
}}>
```

**Important:** Numeric values in `sx` are multiplied by 8px. Use string values for exact pixels:
- `width: 2` = 16px
- `width: "2px"` = 2px

### Next.js 16 Link Integration

Due to Next.js 16 restrictions on passing functions to Client Components, use the wrapper:

```typescript
// Use this for MUI component prop
import Link from '@/components/link'

<Button component={Link} href="/path">Click</Button>
<IconButton component={Link} href="/path">...</IconButton>
```

### ThemeRegistry Setup

The theme is applied in `app/layout.tsx` via `ThemeRegistry`:

```typescript
<ThemeRegistry>
  {children}
</ThemeRegistry>
```

`ThemeRegistry` wraps children with:
- `AppRouterCacheProvider` (Emotion cache for Next.js App Router)
- `ThemeProvider` (MUI theme)
- `CssBaseline` (CSS reset)

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
- Sky: `#a7d8ff` (features)
- Peach: `#ffb8a1` (improvements)
- Mint: `#bfebd6` (fixes)
- Butter: `#ffe7a3` (known issues)
- Red: `#dc2626` (breaking changes)
- Ink: `#1f2937` (primary text/buttons)
- Slate grays for secondary text and borders

**Typography:**
- Font: DM Sans (clean, friendly)

## Common Tasks

### Adding a New Change Type

1. Add to `change_type` enum in database migration
2. Update `ChangeType` in `lib/types.ts`
3. Add config in `components/admin/entry-item-row.tsx` (changeTypeConfig)
4. Add config in `components/changelog/change-type-badge.tsx`
5. Add config in `components/changelog/entry-items-list.tsx` (typeConfig)

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

### Adding New MUI Components

1. Import from `@mui/material` or `@mui/icons-material`
2. Use the `sx` prop for styling (not className with Tailwind)
3. Reference theme colors: `bgcolor: "background.paper"`, `color: "text.primary"`
4. For pixel values, use strings: `width: "2px"` not `width: 2`

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
