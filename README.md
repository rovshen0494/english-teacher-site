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

## Contact form

Submissions from the "Get in Touch" form (`src/components/ContactForm.tsx`) POST to `src/app/api/contact/route.ts`, which:

1. Saves the message to the `contact_submissions` table (visible at `/admin/messages`, with unread/read tracking) — this always happens, regardless of email configuration.
2. If `RESEND_API_KEY` is set, also emails a notification via [Resend](https://resend.com) using their `onboarding@resend.dev` sandbox sender. If sending fails or the key isn't set, the submission is still saved — email is a best-effort notification, not the source of truth.

**Resend sandbox limitation:** without a verified domain, Resend's sandbox sender can only deliver to the email address that owns the Resend account — currently `rovshen0494@gmail.com` (see `NOTIFY_EMAILS` in the route). To also notify `bmammet09@gmail.com`, verify a custom domain at resend.com/domains, update the `from` address in `src/app/api/contact/route.ts` to use it, and add her email back to `NOTIFY_EMAILS`.

To (re)configure: create a Resend account, generate an API key (Dashboard → API Keys), and set `RESEND_API_KEY` in `.env.local` and in Vercel's project environment variables.

## Live Quiz (Kahoot-style multiplayer)

From `/admin/live-quiz`, pick a vocabulary topic to start a live round. Students join at `/play` (room code) or by scanning the QR code shown on the host screen (`/admin/live-quiz/[id]/host`), then answer along on their own phones while the host screen shows the shared question, timer, and leaderboard.

Key design points:

- **Question content is reused from the existing vocabulary word-sets** (`src/content/games/word-sets.ts`), not authored separately — a session just stores a shuffled word order for a topic, and every client (host + players) derives the question text, image and correct answer from the same static data. This means there's no new content-authoring UI, but it also means **the server can't independently verify whether an answer was correct** (the client self-reports `is_correct` to the `submit_answer` RPC). Fine for a casual classroom game; not appropriate if this were ever repurposed into a graded assessment.
- **Scoring, duplicate-answer prevention, and timing are still server-enforced** via the `submit_answer` Postgres function (`SECURITY DEFINER`) — it uses the *server's* clock against `game_sessions.question_started_at` to compute time-based points (500–1000 for a correct answer, faster = more), and rejects a second answer from the same player on the same question.
- **Realtime sync** (host screen ↔ player phones ↔ live scoreboard) uses Supabase Realtime's Postgres Changes on `game_sessions`, `game_players` and `game_answers` — all three are added to the `supabase_realtime` publication in `0004_live_quiz.sql`.
- Room codes are short (6 chars, ambiguous characters like `0`/`O`/`1`/`I` excluded) and public-readable — anyone who has the code or QR image can join, matching how Kahoot itself works.

## Database schema

See `supabase/migrations/`. Tables: `resources`, `blog_posts`, `collections`, `gallery_items`, `contact_submissions`, `game_sessions`, `game_players`, `game_answers` — plus a `gallery` Storage bucket. Apply new migrations with:

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
- `src/lib/contact.ts` reads contact submissions for the admin panel (admin-only via RLS); the public `insert` policy on `contact_submissions` allows anyone to submit the form itself.
