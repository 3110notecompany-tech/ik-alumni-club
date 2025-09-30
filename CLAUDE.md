# CLAUDE.md

## Conversation Guidelines

- 常に日本語で会話する

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an IK Alumni Club application built with Next.js 15 (App Router), Supabase, and shadcn/ui components. The project uses pnpm workspaces and is configured for local Supabase development.

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Production build with Turbopack
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

**Note**: This project uses `pnpm`, not npm or yarn. The pnpm workspace is configured in `pnpm-workspace.yaml`.

## Supabase Local Development

The project includes a complete Supabase local setup in the `/supabase` directory:

- **API Port**: 54321
- **Database Port**: 54322
- **Studio Port**: 54323 (http://127.0.0.1:54323)
- **Inbucket (Email Testing)**: 54324

Key Supabase CLI commands (if needed):
```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# View database migrations
supabase db diff

# Reset database
supabase db reset
```

Configuration is in `supabase/config.toml`. The `site_url` is set to `http://127.0.0.1:3000`.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and React Server Components (RSC)
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style variant)
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono

### Project Structure
```
/app                 - Next.js App Router pages
  layout.tsx        - Root layout with Geist fonts
  page.tsx          - Home page
  globals.css       - Global styles and Tailwind config
/components         - React components (shadcn/ui components go in /components/ui)
/lib                - Utility functions
  utils.ts          - cn() helper for className merging
/supabase           - Supabase local development config and migrations
/public             - Static assets
```

### Import Aliases
The following path aliases are configured in both `tsconfig.json` and `components.json`:
- `@/*` → root directory
- `@/components` → components directory
- `@/components/ui` → shadcn/ui components
- `@/lib` → lib directory
- `@/lib/utils` → utils.ts
- `@/hooks` → hooks directory

### shadcn/ui Configuration
When adding new shadcn/ui components, they will be:
- Installed to `@/components/ui`
- Use the "New York" style variant
- Use Tailwind CSS variables for theming (neutral base color)
- Use Lucide icons
- Be configured for React Server Components

Add components with: `npx shadcn@latest add <component-name>`

## Key Technical Details

- **TypeScript**: Strict mode enabled, target ES2017
- **Turbopack**: Used for both dev and build (via `--turbopack` flag)
- **Tailwind**: Uses v4 with PostCSS
- **Database**: Postgres 17 (major version configured in Supabase config)