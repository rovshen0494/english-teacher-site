import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import Tag from "@/components/Tag";
import TeacherPhoto from "@/components/TeacherPhoto";
import ResourceCard from "@/components/ResourceCard";
import { getFeaturedResources } from "@/lib/resources";
import { GAMES } from "@/lib/games";

export const dynamic = "force-dynamic";

const WHAT_I_TEACH = [
  {
    title: "Young Learners",
    description:
      "Fun, engaging English lessons using games, stories, songs and interactive activities.",
    href: "/young-learners",
    tone: "brand" as const,
  },
  {
    title: "Teenagers",
    description:
      "Communication, vocabulary, grammar, confidence-building and exam preparation.",
    href: "/young-learners#ages-13-17",
    tone: "accent" as const,
  },
  {
    title: "Adults",
    description: "Practical English for everyday life, work and communication.",
    href: "/resources?age=Adults",
    tone: "brand" as const,
  },
  {
    title: "IELTS & TOEFL",
    description: "Structured exam preparation across Speaking, Writing, Reading and Listening.",
    href: "/ielts",
    tone: "accent" as const,
  },
];

const RESOURCE_FILTER_CHIPS = [
  { label: "Games", param: "type", value: "Game" },
  { label: "Lesson Plans", param: "type", value: "Lesson Plan" },
  { label: "IELTS & TOEFL", param: "age", value: "IELTS" },
  { label: "Speaking", param: "skill", value: "Speaking" },
  { label: "Vocabulary", param: "skill", value: "Vocabulary" },
  { label: "Grammar", param: "skill", value: "Grammar" },
];

export default async function HomePage() {
  const featured = await getFeaturedResources(8);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-background to-background">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <Tag tone="brand">Based in Ho Chi Minh City, Vietnam</Tag>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl lg:text-6xl text-balance">
              English Teacher &amp; Exam Prep Instructor
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
              Helping learners build confidence, improve their English and achieve their goals.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/for-schools" variant="secondary">
                For Language Schools
              </Button>
              <Button href="/ielts" variant="primary">
                IELTS &amp; TOEFL Students
              </Button>
            </div>
            <div className="mt-4">
              <Link href="/resources" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                Explore Teaching Resources &rarr;
              </Link>
            </div>
          </div>

          <TeacherPhoto priority src="/images/balgyz-mammetyarova-home.png" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              eyebrow="A Little About My Work"
              title="I work with students at every stage of their English journey"
            />
            <p className="text-lg leading-relaxed text-ink-500">
              From young learners taking their first steps in English, through teenagers preparing
              for exams, to adults building communication skills for work and travel, and IELTS or
              TOEFL candidates working toward a target score — every lesson is planned around the
              individual student, not a one-size-fits-all curriculum.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What I Teach" title="Lessons built around who you are" align="center" className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHAT_I_TEACH.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col rounded-2xl border border-ink-100 p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <h3 className="font-display text-xl font-semibold text-ink-900 group-hover:text-brand-700">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Teaching Resource Library"
              title="Explore My Teaching Resources"
              description="A growing collection of games, lesson plans, worksheets and IELTS resources — built for real classrooms."
            />
            <Button href="/resources" variant="outline" className="shrink-0">
              View All Resources
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {RESOURCE_FILTER_CHIPS.map((chip) => (
              <Link
                key={chip.label}
                href={`/resources?${chip.param}=${encodeURIComponent(chip.value)}`}
                className="rounded-full border border-ink-100 px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {featured.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-ink-500">Resources are being added — check back soon.</p>
          )}
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Play & Practise"
              title="Interactive Games for Students"
              description="Real, playable vocabulary games — no downloads, no sign-up. Great for classroom warm-ups or self-study at home."
            />
            <Button href="/games" variant="outline" className="shrink-0">
              Play All Games
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {GAMES.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-ink-100 bg-white p-8 text-center transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <span className="text-4xl">{game.emoji}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 group-hover:text-brand-700">
                  {game.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{game.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-700 py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl text-balance">
            Looking for an English teacher for your school, your child or yourself?
          </h2>
          <p className="max-w-xl text-brand-100">
            Let&apos;s talk about how I can help — whether that&apos;s a teaching role, lessons for
            your child, or IELTS/TOEFL preparation.
          </p>
          <Button href="/contact" variant="primary">
            Get in Touch
          </Button>
        </Container>
      </section>
    </>
  );
}
