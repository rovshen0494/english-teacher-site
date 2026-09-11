import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import { socksFetch } from "./socks-fetch.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.MIGRATION_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.MIGRATION_ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, MIGRATION_ADMIN_EMAIL, MIGRATION_ADMIN_PASSWORD"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { fetch: socksFetch } });

const COLLECTIONS = [
  { slug: "first-day-activities", title: "First Day Activities", description: "Warm, low-pressure activities for meeting a new class." },
  { slug: "10-minute-classroom-games", title: "10-Minute Classroom Games", description: "Quick games that fit into any lesson without extra planning." },
  { slug: "vocabulary-games", title: "Vocabulary Games", description: "Interactive ways to introduce, practise and review new words." },
  { slug: "speaking-activities", title: "Speaking Activities", description: "Discussion, role play and conversation practice for every level." },
  { slug: "no-prep-activities", title: "No-Prep Activities", description: "Effective activities that need little to no preparation time." },
  { slug: "ielts-speaking-practice", title: "IELTS Speaking Practice", description: "Resources for building fluency and confidence in the Speaking test." },
  { slug: "ielts-writing-practice", title: "IELTS Writing Practice", description: "Structured practice for Writing Task 1 and Task 2." },
  { slug: "games-for-large-classes", title: "Games for Large Classes", description: "Activities that work well with bigger groups of students." },
  { slug: "activities-for-shy-students", title: "Activities for Shy Students", description: "Low-pressure formats that build confidence before whole-class speaking." },
  { slug: "teenage-conversation-activities", title: "Teenage Conversation Activities", description: "Discussion and debate activities that teenagers actually enjoy." },
];

function readMarkdownDir(dir) {
  const fullPath = path.join(root, "src", "content", dir);
  return fs.readdirSync(fullPath).filter((f) => f.endsWith(".md")).map((file) => {
    const raw = fs.readFileSync(path.join(fullPath, file), "utf-8");
    const { data, content } = matter(raw);
    return { ...data, body: content.trim() };
  });
}

async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (error) {
    console.error("Failed to sign in as admin:", error.message);
    process.exit(1);
  }
  console.log("Signed in as admin.");
}

async function migrateCollections() {
  const { error } = await supabase.from("collections").upsert(COLLECTIONS, { onConflict: "slug" });
  if (error) throw error;
  console.log(`Migrated ${COLLECTIONS.length} collections.`);
}

async function migrateResources() {
  const resources = readMarkdownDir("resources");
  const rows = resources.map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    resource_type: r.resourceType,
    age_groups: r.ageGroups ?? [],
    english_levels: r.englishLevels ?? [],
    primary_skill: r.primarySkill,
    secondary_skills: r.secondarySkills ?? [],
    topics: r.topics ?? [],
    duration: r.duration,
    class_size: r.classSize,
    prep_time: r.prepTime,
    difficulty: r.difficulty,
    materials: r.materials ?? [],
    related_resources: r.relatedResources ?? [],
    collections: r.collections ?? [],
    downloads: r.downloads ?? [],
    author: r.author,
    date_created: r.dateCreated,
    last_updated: r.lastUpdated,
    featured: r.featured ?? false,
    body: r.body,
  }));
  const { error } = await supabase.from("resources").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`Migrated ${rows.length} resources.`);
}

async function migrateBlogPosts() {
  const posts = readMarkdownDir("blog");
  const rows = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    author: p.author,
    related_resources: p.relatedResources ?? [],
    featured: p.featured ?? false,
    body: p.body,
  }));
  const { error } = await supabase.from("blog_posts").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`Migrated ${rows.length} blog posts.`);
}

async function uploadFile(localPath, storagePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const contentType = ext === ".mp4" ? "video/mp4" : ext === ".png" ? "image/png" : "image/jpeg";
  const { error } = await supabase.storage.from("gallery").upload(storagePath, fileBuffer, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("gallery").getPublicUrl(storagePath);
  return data.publicUrl;
}

const GALLERY_ITEMS = [
  { type: "photo", src: "/images/classroom/phonics-lesson-1.jpg", width: 1280, height: 960, alt: "Leading a phonics lesson, teaching the letter sound \"f\" with a projected slide" },
  { type: "photo", src: "/images/classroom/phonics-lesson-2.jpg", width: 1280, height: 695, alt: "Demonstrating the letter sound \"b\" during a phonics lesson" },
  { type: "video", src: "/videos/classroom/classroom-clip-1.mp4", poster: "/images/classroom/classroom-clip-1-poster.jpg", width: 480, height: 854, alt: "Teaching word families (\"op\", \"ip\") using a phonics matching activity" },
  { type: "video", src: "/videos/classroom/classroom-clip-3.mp4", poster: "/images/classroom/classroom-clip-3-poster.jpg", width: 854, height: 480, alt: "Leading a phonics chant for the letter sound \"c\", with students joining in" },
  { type: "video", src: "/videos/classroom/classroom-clip-2.mp4", poster: "/images/classroom/classroom-clip-2-poster.jpg", width: 480, height: 854, alt: "Explaining an interactive whiteboard activity to the class" },
  { type: "video", src: "/videos/classroom/classroom-clip-4.mp4", poster: "/images/classroom/classroom-clip-4-poster.jpg", width: 480, height: 854, alt: "Observing students working through an activity at the board" },
  { type: "video", src: "/videos/classroom/classroom-clip-5.mp4", poster: "/images/classroom/classroom-clip-5-poster.jpg", width: 480, height: 854, alt: "Guiding students through a classroom activity in small groups" },
];

async function migrateGallery() {
  const items = GALLERY_ITEMS;

  const rows = [];
  for (const [index, item] of items.entries()) {
    const localSrcPath = path.join(root, "public", item.src);
    const storageSrcPath = item.src.replace(/^\//, "");
    const publicSrc = await uploadFile(localSrcPath, storageSrcPath);

    let publicPoster;
    if (item.poster) {
      const localPosterPath = path.join(root, "public", item.poster);
      const storagePosterPath = item.poster.replace(/^\//, "");
      publicPoster = await uploadFile(localPosterPath, storagePosterPath);
    }

    rows.push({
      type: item.type,
      src: publicSrc,
      poster: publicPoster ?? null,
      width: item.width,
      height: item.height,
      alt: item.alt,
      sort_order: index,
    });
    console.log(`Uploaded gallery item ${index + 1}/${items.length}: ${item.src}`);
  }

  const { error } = await supabase.from("gallery_items").insert(rows);
  if (error) throw error;
  console.log(`Migrated ${rows.length} gallery items.`);
}

async function main() {
  await signIn();
  await migrateCollections();
  await migrateResources();
  await migrateBlogPosts();
  await migrateGallery();
  console.log("Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
