# English Teacher & IELTS/TOEFL Instructor Website

A Next.js (App Router) site for Balgyz Mammetyarova, backed by Supabase (Postgres + Auth + Storage) with an admin panel for managing all content.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already set up in this environment; see Vercel project settings for production values).

## Admin panel

Go to `/admin/login` and sign in (currently `rovshen0494@gmail.com`). From there you can create, edit and delete:

- **Resources** (`/admin/resources`)
- **Blog posts** (`/admin/blog`)
- **Collections** (`/admin/collections`)
- **Gallery photos/videos** (`/admin/gallery`) — uploads go straight to Supabase Storage; width/height and video poster thumbnails are generated automatically in the browser at upload time.

Access is enforced by Postgres Row Level Security: anyone can read (`select`) the public tables, but writes require a logged-in session whose email matches the hardcoded admin email in the RLS policies (see `supabase/migrations/`). There's no separate roles table since there is exactly one admin.

To change the admin email, add a new migration that drops and recreates the `*_admin_insert/update/delete` policies (on `resources`, `blog_posts`, `collections`, `gallery_items`, and `storage.objects`) with the new email, then create the corresponding Supabase Auth user and confirm it.

Public pages that read from Supabase are rendered with `export const dynamic = "force-dynamic"` so admin edits appear immediately, with no redeploy needed.

## Remaining placeholder content

Search the codebase for `[Placeholder` to find what's still unfilled:

- The "Why I Enjoy Teaching" section on `src/app/about/page.tsx` is intentionally left blank — it's a personal reflection only Balgyz can write.
- "Availability" on `src/app/for-schools/page.tsx` needs current availability (full-time/part-time/hours).

## The CV PDF

`public/downloads/cv-balgyz-mammetyarova.pdf` is generated from her CV text by `scripts/generate-cv-pdf.mjs` (a small hand-rolled PDF writer — no external PDF library). It's simply formatted and normalises a few Turkish characters (ğ, ş, ı, İ) that the base PDF font can't render. To regenerate after editing the script: `node scripts/generate-cv-pdf.mjs`. For pixel-perfect formatting, replace it with a designed PDF export and update the two `Button href` references in `about` and `for-schools` pages accordingly.

## Photo

`public/images/balgyz-mammetyarova.png` (About page) and `public/images/balgyz-mammetyarova-home.png` (Home hero) are used by the `TeacherPhoto` component. Replace the files directly to update them — no code changes needed as long as the filenames stay the same.

## Database schema

See `supabase/migrations/`. Four tables — `resources`, `blog_posts`, `collections`, `gallery_items` — plus a `gallery` Storage bucket. Apply new migrations with:

```bash
SUPABASE_ACCESS_TOKEN=... npx supabase db push
```

## Working around restrictive networks

This project is developed on a network where only port 443 is open and a local SOCKS5 proxy (`Happ`, listening on `127.0.0.1:10808`) is required for most outbound traffic — including to Supabase and Vercel, which aren't reachable directly even with the VPN's own default routing. Two scripts route around this for local tooling:

- `scripts/socks-fetch.mjs` — a `fetch` replacement (via `node-fetch` + `socks-proxy-agent`) that tunnels through the local SOCKS proxy. Pass it as `global: { fetch: socksFetch }` when creating a Supabase client in a standalone Node script.
- `scripts/run-sql.mjs` — runs arbitrary SQL against the linked Supabase project via the Management API (`POST /v1/projects/:ref/database/query`), since the `supabase` CLI binary doesn't respect the SOCKS proxy. Usage: `SUPABASE_ACCESS_TOKEN=... node scripts/run-sql.mjs "<SQL or path to .sql file>"`.

`npm` itself was pointed at the proxy once via `npm config set proxy/https-proxy socks5://127.0.0.1:10808` (a global npm config change, not project-specific).

The Next.js app itself (dev server and production) does **not** need this workaround — Vercel's servers have normal internet access. When testing locally hits connectivity issues, it's faster to push and verify against the live Vercel deployment than to debug the local network.

## Adding a teaching resource, blog post or collection

Use the admin panel (`/admin`) — there's no longer a Markdown/file-based workflow. The migration script (`scripts/migrate-to-supabase.mjs`) is kept for reference; it was a one-time import from the old Markdown content system into Supabase and isn't part of the normal workflow anymore.

## Architecture notes

- `src/lib/resources.ts`, `blog.ts`, `collections.ts`, `gallery.ts` are the only places that query Supabase for public content — all pages and admin forms go through these (or the browser Supabase client directly for admin writes).
- `src/lib/supabase/client.ts` (browser) and `server.ts` (Server Components, via `@supabase/ssr`) are the two ways the app talks to Supabase; `src/proxy.ts` refreshes the auth session on every request and gates `/admin/*`.
- The AI Resource Generator (`/resources/create`) and AI Lesson Builder (`/resources/lesson-builder`) are UI previews only; no AI API is connected. Wiring one up later means writing a draft row with a `status: "draft"`-style flag for teacher review before publishing — never publishing automatically.
- The contact form posts to `src/app/api/contact/route.ts`, which currently only logs submissions. Connect a real email provider there before launch.
