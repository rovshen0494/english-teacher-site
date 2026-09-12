import Link from "next/link";
import { getAllResources } from "@/lib/resources";
import { getAllPosts } from "@/lib/blog";
import { getCollections } from "@/lib/collections";
import { getGalleryItems } from "@/lib/gallery";
import { getContactSubmissions } from "@/lib/contact";
import { WORD_SETS } from "@/content/games/word-sets";

const CARDS = [
  { key: "resources", title: "Resources", href: "/admin/resources", description: "Games, lesson plans, worksheets and IELTS/TOEFL materials." },
  { key: "blog", title: "Blog Posts", href: "/admin/blog", description: "Articles linked to resources in the library." },
  { key: "collections", title: "Collections", href: "/admin/collections", description: "Themed groupings of resources." },
  { key: "gallery", title: "Gallery", href: "/admin/gallery", description: "Classroom photos and videos shown on the About page." },
  { key: "liveQuiz", title: "Live Quiz", href: "/admin/live-quiz", description: "Start a Kahoot-style round students join by QR code." },
  { key: "messages", title: "Messages", href: "/admin/messages", description: "Contact form submissions from the site." },
] as const;

export default async function AdminDashboard() {
  const [resources, posts, collections, gallery, messages] = await Promise.all([
    getAllResources(),
    getAllPosts(),
    getCollections(),
    getGalleryItems(),
    getContactSubmissions(),
  ]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const counts: Record<string, number> = {
    resources: resources.length,
    blog: posts.length,
    collections: collections.length,
    gallery: gallery.length,
    liveQuiz: WORD_SETS.length,
    messages: messages.length,
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Manage everything shown on the public site.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="relative flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
          >
            {card.key === "messages" && unreadCount > 0 && (
              <span className="absolute right-4 top-4 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
            <span className="font-display text-3xl font-semibold text-brand-700">{counts[card.key]}</span>
            <h2 className="mt-3 font-semibold text-ink-900">{card.title}</h2>
            <p className="mt-1 text-sm text-ink-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
