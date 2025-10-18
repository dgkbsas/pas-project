# Copilot Instructions for PAS Project

## Project Overview

- **PAS Manager** is a multi-tenant insurance policy management system built with SvelteKit (frontend) and Supabase (backend: PostgreSQL + Auth + RLS).
- **Key features:** strict Row Level Security (RLS), role-based access, custom RPC functions, and multi-company data isolation.

## Architecture & Data Flow

- **Backend:** Supabase manages all data, authentication, and RLS. All business logic and permissions are enforced at the database level.
- **Frontend:** SvelteKit 5 (Runes) in `src/` communicates with Supabase via the `lib/supabaseClient.js` and `lib/supabase.ts` wrappers.
- **MCP Server:** Custom scripts in `mcp-server/` and `scripts/` interact with Supabase using RPC and direct SQL.
- **Migrations:** All schema and policy changes are tracked in `migrations/`.

## Developer Workflows

- **Install dependencies:** `pnpm install`
- **Run dev server:** `pnpm dev`
- **Run scripts:** `node scripts/<script>.mjs`
- **Apply migrations:** Use Supabase SQL editor or CLI; see `README.md` for step-by-step.
- **Test RLS & RPC:** Use `scripts/test-rls.mjs` and `scripts/test-rpc-functions.mjs`.
- **Inspect DB:** Use `scripts/inspect-database.mjs` or Supabase Dashboard.

## Project Conventions

- **Strict RLS:** All tables have RLS enabled. Never bypass RLS in code; always use authenticated Supabase clients.
- **Roles:** `admin`, `agent`, `guest`—enforced in both DB and UI. See `README.md` for permissions matrix.
- **Multi-tenancy:** All queries must filter by `company_id` (use `public.get_user_company_id()` in SQL or `user.company_id` in app logic).
- **Schema-first:** Any schema or policy change must be reflected in `migrations/` and documented in `README.md`.
- **RPC usage:** Prefer calling custom RPCs for metadata or admin actions (see `README.md` for examples).
- **Scripts:** All automation and DB checks are in `scripts/` (never hardcode credentials).

## Integration Points

- **Supabase:** All data, auth, and policies. Use the project ref and URL from `README.md`.
- **MCP:** Use `mcp__supabase__*` helpers for automation and integration.
- **Frontend:** Use `lib/supabaseClient.js` for all Supabase access. Never access DB directly from UI.

## Key Files & Directories

- `src/lib/supabase.ts` & `supabaseClient.js`: Supabase client setup
- `src/lib/schemas/`: Zod schemas for validation
- `scripts/`: DB, migration, and RLS utilities
- `migrations/`: All schema and policy changes
- `README.md`: Full DB schema, RLS, and workflow documentation

## Examples

- **Query with RLS:** Always use authenticated Supabase client
- **Add migration:** Place SQL in `migrations/`, document in `README.md`
- **Test RLS:** `node scripts/test-rls.mjs`

## Do Not

- Do not bypass RLS or use service role keys in client code
- Do not modify DB schema without a migration and documentation
- Do not hardcode company or user IDs

---

_Last updated: 2025-10-17_
