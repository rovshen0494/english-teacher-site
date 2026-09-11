# English Teacher & IELTS/TOEFL Instructor Website

A Next.js (App Router) site for Balgyz Mammetyarova, built around a scalable teaching-resource library and blog.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Remaining placeholder content

Search the codebase for `[Placeholder` to find what's still unfilled:

- The "Why I Enjoy Teaching" section on `src/app/about/page.tsx` is intentionally left blank — it's a personal reflection only Balgyz can write.
- "Availability" on `src/app/for-schools/page.tsx` needs current availability (full-time/part-time/hours).

## The CV PDF

`public/downloads/cv-balgyz-mammetyarova.pdf` is generated from her CV text by `scripts/generate-cv-pdf.mjs` (a small hand-rolled PDF writer — no external PDF library). It's simply formatted and normalises a few Turkish characters (ğ, ş, ı, İ) that the base PDF font can't render. To regenerate after editing the script: `node scripts/generate-cv-pdf.mjs`. For pixel-perfect formatting, replace it with a designed PDF export and update the two `Button href` references in `about` and `for-schools` pages accordingly.

## Photo

`public/images/balgyz-mammetyarova.png` is used by the `TeacherPhoto` component (Home hero, About page). Replace the file directly to update it — no code changes needed as long as the filename stays the same.

## Adding a teaching resource

Add a new Markdown file to `src/content/resources/`, e.g. `src/content/resources/my-new-game.md`:

```markdown
---
title: "My New Game"
slug: "my-new-game"
description: "One or two sentences shown on resource cards."
resourceType: "Game"
ageGroups: ["Ages 6-8"]
englishLevels: ["A1 Beginner"]
primarySkill: "Vocabulary"
secondarySkills: ["Speaking"]
topics: ["Animals"]
duration: "15 minutes"
classSize: "4-20"
prepTime: "5 minutes"
difficulty: "Easy"
materials: ["..."]
relatedResources: ["word-bingo"]
collections: ["vocabulary-games"]
downloads:
  - label: "Teacher Instructions"
    fileType: "PDF"
    url: "/downloads/placeholder-resource.pdf"
author: "[Teacher Name]"
dateCreated: "2026-01-01"
lastUpdated: "2026-01-01"
featured: false
---

## Learning Objective
...

## Materials
...

## How It Works
1. ...

## Student Instructions
...

## Variations
...

## Extension Activity
...

## Teacher Tip
...
```

Valid values for each field live in `src/lib/types.ts` (unions) and `src/lib/constants.ts` (arrays used by filters). The resource appears automatically in `/resources`, its age-group page, and any collection listed once the file is saved — no code changes needed.

Run `node scripts/validate-content.mjs` after adding resources to check every field value matches the allowed types.

## Adding a blog post

Add a Markdown file to `src/content/blog/` with `title`, `slug`, `excerpt`, `category` (see `BLOG_CATEGORIES` in `src/lib/constants.ts`), `date`, `author`, and optional `relatedResources` (an array of resource slugs) in the frontmatter, followed by the article body in Markdown.

## Architecture notes

- Content lives in Markdown files with YAML frontmatter (`src/content/resources`, `src/content/blog`), parsed with `gray-matter` and rendered with `marked` — no database required, and it scales to hundreds of files without changes to the code.
- `src/lib/resources.ts` and `src/lib/blog.ts` are the only places that read from `src/content/` — all pages go through these.
- The AI Resource Generator (`/resources/create`) and AI Lesson Builder (`/resources/lesson-builder`) are UI previews only; no AI API is connected. Wiring one up later means adding a server action/route that writes a new Markdown file for teacher review before publishing — never publishing automatically.
- The contact form posts to `src/app/api/contact/route.ts`, which currently only logs submissions. Connect a real email provider there before launch.
