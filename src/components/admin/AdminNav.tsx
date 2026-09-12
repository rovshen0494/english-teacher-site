"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/live-quiz", label: "Live Quiz" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center gap-8">
          <Link href="/admin" className="font-display text-lg font-semibold text-ink-900">
            Admin
          </Link>
          <nav className="flex flex-wrap gap-5">
            {LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "text-sm font-medium transition-colors",
                    active ? "text-brand-700" : "text-ink-500 hover:text-brand-700"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-ink-500 hover:text-brand-700">
            View site
          </Link>
          <span className="hidden text-sm text-ink-300 sm:inline">{email}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-ink-100 px-4 py-1.5 text-sm font-semibold text-ink-700 hover:border-brand-300"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
