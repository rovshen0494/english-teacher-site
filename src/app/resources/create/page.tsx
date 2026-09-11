import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ResourceGeneratorForm from "@/components/ResourceGeneratorForm";

export const metadata: Metadata = {
  title: "Create a Resource — AI Resource Generator",
  description: "A preview of the upcoming AI-assisted resource generator, with teacher review built into every step.",
  robots: { index: false, follow: true },
};

const WORKFLOW_STEPS = [
  "Teacher enters age, level, topic, skill, duration, class size and objective",
  "AI generates a draft activity",
  "Teacher reviews and edits the draft",
  "Teacher approves the final version",
  "Resource is published to the library",
];

export default function CreateResourcePage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Teacher Tools"
        title="Create a Resource"
        description="AI Resource Generator — Coming Soon. This is a working preview of the interface; draft generation is not yet connected to a live AI service."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-900">How it will work</h2>
          <ol className="mt-4 space-y-3">
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-ink-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-xl border border-ink-100 bg-white p-4 text-xs leading-relaxed text-ink-500">
            AI-generated content is never published automatically. Every draft is reviewed and
            approved by a teacher before it appears in the resource library, so quality and
            accuracy stay in human hands.
          </p>
          <Link
            href="/resources/lesson-builder"
            className="mt-5 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            See the full AI Lesson Builder concept &rarr;
          </Link>
        </div>

        <ResourceGeneratorForm />
      </div>
    </Container>
  );
}
