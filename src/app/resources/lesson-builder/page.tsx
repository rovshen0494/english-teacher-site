import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "AI Lesson Builder — Coming Soon",
  description: "A preview of the upcoming full AI lesson builder for generating complete, ready-to-teach lessons.",
  robots: { index: false, follow: true },
};

const INPUTS = ["Age", "Level", "Topic", "Skill", "Lesson duration", "Class size", "Teaching objective", "Available materials"];
const OUTPUTS = [
  "Complete lesson plan",
  "Warm-up",
  "Vocabulary",
  "Grammar",
  "Main activity",
  "Game",
  "Speaking activity",
  "Practice exercises",
  "Homework",
  "Extension activity",
  "Printable resources",
];

export default function LessonBuilderPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Coming Soon"
        title="AI Lesson Builder"
        description="A future tool that turns a few inputs into a complete, classroom-ready lesson — always reviewed by a teacher before use."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink-900">Teacher provides</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-500">
            {INPUTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink-900">Lesson builder generates</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-500">
            {OUTPUTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-ink-500">
        This interface is a concept preview only. No AI generation is connected yet, and when it is,
        every generated lesson will require teacher review before it can be used or published.
      </p>
    </Container>
  );
}
