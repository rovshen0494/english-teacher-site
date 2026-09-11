import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ResourceCard from "@/components/ResourceCard";
import Button from "@/components/Button";
import Link from "next/link";
import { getResourcesByAgeGroup } from "@/lib/resources";
import type { AgeGroup } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Young Learners & Teenagers",
  description:
    "English lessons for children and teenagers in Ho Chi Minh City, organised by age — from playful lessons for ages 3-5 to exam preparation and debate for teenagers.",
};

const PHILOSOPHY_STEPS = ["Learn", "Practise", "Play", "Communicate", "Review"];

const AGE_SECTIONS: {
  id: string;
  age: AgeGroup;
  label: string;
  focus: string[];
  accent: string;
  playful: boolean;
}[] = [
  {
    id: "ages-3-5",
    age: "Ages 3-5",
    label: "Ages 3–5",
    focus: ["Songs", "Movement", "Stories", "Colours", "Numbers", "Basic vocabulary", "Simple instructions"],
    accent: "bg-kid-yellow/30 border-kid-yellow",
    playful: true,
  },
  {
    id: "ages-6-8",
    age: "Ages 6-8",
    label: "Ages 6–8",
    focus: ["Phonics", "Vocabulary", "Speaking", "Simple reading", "Grammar through games", "Team activities"],
    accent: "bg-kid-coral/15 border-kid-coral",
    playful: true,
  },
  {
    id: "ages-9-12",
    age: "Ages 9-12",
    label: "Ages 9–12",
    focus: ["Conversation", "Reading", "Writing", "Vocabulary", "Grammar", "Projects", "Quizzes", "Role play"],
    accent: "bg-kid-sky/15 border-kid-sky",
    playful: true,
  },
  {
    id: "ages-13-17",
    age: "Ages 13-17",
    label: "Ages 13–17",
    focus: [
      "Conversation",
      "Debate",
      "Critical thinking",
      "Exam preparation",
      "Academic vocabulary",
      "Writing",
      "Presentation skills",
    ],
    accent: "bg-brand-50 border-brand-200",
    playful: false,
  },
];

export default async function YoungLearnersPage() {
  const resourcesByAge = await Promise.all(
    AGE_SECTIONS.map((section) => getResourcesByAgeGroup(section.age))
  );

  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Young Learners"
            title="English lessons for children and teenagers"
            description="Lessons are organised by age, so every activity matches what students can actually do — and enjoy — at that stage."
          />

          <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-ink-100 bg-white p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-300">
              Teaching approach
            </span>
            {PHILOSOPHY_STEPS.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
                  {step}
                </span>
                {i < PHILOSOPHY_STEPS.length - 1 && <span className="text-ink-300">&rarr;</span>}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-kid-sky bg-kid-sky/15 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🎮</span>
              <p className="font-display font-semibold text-ink-900">
                Kids can also practise with interactive vocabulary games — matching, word scramble and quizzes.
              </p>
            </div>
            <Link
              href="/games"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Play Games
            </Link>
          </div>
        </Container>
      </section>

      {AGE_SECTIONS.map((section, index) => {
        const resources = resourcesByAge[index];
        return (
          <section key={section.id} id={section.id} className="scroll-mt-24 py-12 sm:py-14">
            <Container>
              <div className={`rounded-3xl border-2 p-8 sm:p-10 ${section.accent}`}>
                <h2 className="font-display text-3xl font-semibold text-ink-900">{section.label}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {section.focus.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink-700 shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {resources.length > 0 ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <ResourceCard key={resource.slug} resource={resource} />
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-sm text-ink-500">Resources for this age group are coming soon.</p>
              )}
            </Container>
          </section>
        );
      })}

      <section className="py-16 sm:py-20">
        <Container className="rounded-3xl bg-brand-700 px-6 py-14 text-center sm:px-14">
          <h2 className="font-display text-3xl font-semibold text-white">
            Looking for lessons for your child or teenager?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Get in touch to talk about your child&apos;s age, level and goals.
          </p>
          <div className="mt-6">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
