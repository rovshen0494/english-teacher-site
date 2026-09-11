import Link from "next/link";
import Container from "./Container";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{SITE.name}</p>
          <p className="mt-2 text-sm text-ink-500">{SITE.role}</p>
          <p className="mt-1 text-sm text-ink-500">{SITE.location}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-900">Site</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ink-500 hover:text-brand-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-900">Resources</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/resources" className="text-sm text-ink-500 hover:text-brand-700">
                All Teaching Resources
              </Link>
            </li>
            <li>
              <Link href="/games" className="text-sm text-ink-500 hover:text-brand-700">
                Interactive Games
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-ink-500 hover:text-brand-700">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/resources/create" className="text-sm text-ink-500 hover:text-brand-700">
                AI Resource Generator
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-900">Get in touch</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/contact" className="text-sm text-ink-500 hover:text-brand-700">
                Contact Form
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="text-sm text-ink-500 hover:text-brand-700">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.social.linkedin} className="text-sm text-ink-500 hover:text-brand-700">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-ink-100 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-ink-300 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Site content is placeholder text pending final details.</p>
        </Container>
      </div>
    </footer>
  );
}
