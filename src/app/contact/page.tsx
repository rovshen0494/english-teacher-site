import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about English teaching opportunities, IELTS/TOEFL preparation or lessons for children, teenagers and adults in Ho Chi Minh City, Vietnam.",
};

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Contact" title="Let's work together" />
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Whether you&apos;re a school looking to hire, a parent looking for lessons for your
            child, or an adult or IELTS/TOEFL student ready to start — send a message and a reply
            will follow soon.
          </p>

          <div className="mt-8 space-y-3 text-sm">
            <p>
              <span className="font-semibold text-ink-900">Email:</span>{" "}
              <a href={`mailto:${SITE.email}`} className="text-brand-700 hover:text-brand-800">
                {SITE.email}
              </a>
            </p>
            <p>
              <span className="font-semibold text-ink-900">Location:</span> {SITE.location}
            </p>
            <div className="flex gap-4 pt-2">
              <a href={SITE.social.linkedin} className="text-brand-700 hover:text-brand-800">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
