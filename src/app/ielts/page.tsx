import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import ResourceCard from "@/components/ResourceCard";
import { getResourcesByAgeGroup } from "@/lib/resources";

export const metadata: Metadata = {
  title: "IELTS & TOEFL Preparation",
  description:
    "IELTS and TOEFL preparation with a focus on practical exam strategies and real confidence across Speaking, Writing, Reading and Listening. TOEFL instructor experience in Turkmenistan; based in Ho Chi Minh City, Vietnam.",
};

const SKILLS = [
  {
    title: "Speaking",
    description: "Fluency, vocabulary, pronunciation, answering techniques and confidence.",
  },
  {
    title: "Writing",
    description: "Task structure, coherence, vocabulary, grammar and developing strong arguments.",
  },
  {
    title: "Reading",
    description: "Skimming, scanning, vocabulary strategies and question-type techniques.",
  },
  {
    title: "Listening",
    description: "Listening strategies, prediction, recognising distractors and accuracy.",
  },
];

const RESOURCE_CATEGORIES = [
  { label: "Speaking Questions", href: "/resources?age=IELTS&skill=Speaking" },
  { label: "Speaking Part 2", href: "/resources/ielts-speaking-part-2-cue-card-practice" },
  { label: "Writing Task 1", href: "/resources/ielts-writing-task-1-describing-trends" },
  { label: "Writing Task 2", href: "/resources/ielts-writing-task-2-essay-structure" },
  { label: "Vocabulary", href: "/resources?age=IELTS&skill=Vocabulary" },
  { label: "Grammar", href: "/resources?age=IELTS&skill=Grammar" },
  { label: "Common Mistakes", href: "/resources/ielts-common-mistakes-speaking-and-writing" },
  { label: "Exam Strategies", href: "/resources/ielts-exam-strategy-time-management" },
];

export default function IeltsPage() {
  const ieltsResources = getResourcesByAgeGroup("IELTS");

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 via-background to-background py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Exam Preparation"
            title="IELTS & TOEFL Preparation"
            description="I help students build real confidence and practical exam strategies across Speaking, Writing, Reading and Listening — not just test tricks, but English that holds up on exam day and beyond."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact">Interested in exam prep lessons? Get in touch.</Button>
            <Button href="/resources?age=IELTS" variant="outline">
              Browse Exam Prep Resources
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-ink-900">TOEFL Instructor Experience</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">
              I worked as a TOEFL Instructor at Sahypa Education Centre (Anau, Turkmenistan),
              preparing individuals and small groups for the exam and adapting practice materials
              to individual student weaknesses. The IELTS resources below draw on the same exam-prep
              approach and are shared here as prepared teaching materials — ready to put into
              practice with IELTS candidates.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {SKILLS.map((skill) => (
              <div key={skill.title} className="rounded-3xl border border-ink-100 bg-white p-8">
                <h2 className="font-display text-2xl font-semibold text-ink-900">{skill.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-500">{skill.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="IELTS Resources" title="Practice by category" align="center" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {RESOURCE_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="rounded-full border border-ink-100 px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {ieltsResources.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ieltsResources.slice(0, 6).map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Button href="/resources?age=IELTS" variant="outline">
              View All IELTS Resources
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="rounded-3xl bg-brand-700 px-6 py-14 text-center sm:px-14">
          <h2 className="font-display text-3xl font-semibold text-white">
            Interested in IELTS or TOEFL lessons?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Get in touch to talk about your target score, timeline and which skills to focus on
            first.
          </p>
          <div className="mt-6">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
