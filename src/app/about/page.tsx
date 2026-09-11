import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import TeacherPhoto from "@/components/TeacherPhoto";
import PlaceholderNote from "@/components/PlaceholderNote";
import Button from "@/components/Button";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Learn about a professional English teacher and IELTS/TOEFL instructor in Ho Chi Minh City, Vietnam — teaching philosophy, experience and qualifications.",
};

const PHILOSOPHY = [
  {
    title: "Confidence",
    description: "Students learn best when they feel comfortable making mistakes.",
  },
  {
    title: "Communication",
    description: "English should be used, not simply memorised.",
  },
  {
    title: "Engagement",
    description: "Games, activities and real-world situations make learning memorable.",
  },
  {
    title: "Progress",
    description: "Students should understand what they are improving and why.",
  },
];

const WHO_I_TEACH = ["Ages 3-5", "Ages 6-8", "Ages 9-12", "Ages 13-17", "Adults", "IELTS & TOEFL Students"];

export default function AboutPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <TeacherPhoto />

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">About Me</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 sm:text-5xl text-balance">
              {SITE.name}
            </h1>
            <p className="mt-2 text-lg text-ink-500">
              {SITE.role} &middot; {SITE.location}
            </p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-700">
              <p>
                I&apos;m a TEFL/TESOL-certified ESL teacher with over three years of experience
                teaching English to students of varying ages, nationalities and proficiency levels
                across Vietnam and Turkmenistan, including dedicated TOEFL exam preparation.
              </p>
              <p>
                I prepare curriculum-aligned lesson plans and design original instructional
                materials using PowerPoint, Canva, Wordwall and Bamboozle, and adapt my teaching
                methods to meet diverse learner needs. Trilingual in English, Turkmen and Russian, I
                bring strong classroom management, cross-cultural communication and interpersonal
                skills built through international teaching, translation and public-facing
                cultural-diplomacy work.
              </p>
            </div>

            <div className="mt-8">
              <Button href="/contact">Get in Touch</Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Teaching Philosophy" title="How I approach every lesson" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PHILOSOPHY.map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink-100 p-6">
                <h3 className="font-display text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Qualifications</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-500">
              <li>120-Hour TEFL/TESOL Certificate &mdash; World TESOL Academy (2026)</li>
              <li>
                B.A. in History &amp; Civilizations and Literature (Double Degree) &mdash; American
                University in Bulgaria (AUBG), 2018&ndash;2022
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Teaching Experience</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-500">
              <li>
                <span className="font-semibold text-ink-900">ESL Teacher</span> &mdash; PMP Training
                Center, Ho Chi Minh City, Vietnam (2026&ndash;Present)
              </li>
              <li>
                <span className="font-semibold text-ink-900">TOEFL Instructor / English Language
                Teacher</span> &mdash; Sahypa Education Centre, Anau, Turkmenistan (2025&ndash;2026)
              </li>
              <li>
                <span className="font-semibold text-ink-900">English Language Teacher</span> &mdash;
                Päk Nesil Education Centre, Ashgabat, Turkmenistan (2023&ndash;2024)
              </li>
              <li>
                <span className="font-semibold text-ink-900">Teaching Assistant</span> &mdash;
                Ashgabat International School, Ashgabat (2017&ndash;2018)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Exam Preparation Experience</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              I worked as a TOEFL Instructor at Sahypa Education Centre in Turkmenistan, preparing
              individuals and small groups for the exam and adapting practice materials to
              individual weaknesses. I bring the same structured, strategy-focused approach to IELTS
              preparation, with a growing library of original IELTS teaching resources covering
              Speaking, Writing, Reading and Listening.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">International Experience</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              I have lived, studied and worked across Vietnam, Turkmenistan, Bulgaria, Türkiye and
              the United States. I hold a double degree from the American University in Bulgaria,
              and worked as a ceremonial English&ndash;Turkmen&ndash;Russian translator for the
              International Day of Yoga in Ashgabat, held in cooperation with the Indian Embassy.
              I&apos;m trilingual in English, Turkmen and Russian, with additional Turkish, Bulgarian
              and German.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-ink-900">Why I Enjoy Teaching</h2>
            <PlaceholderNote>
              This is a personal reflection only you can write — replace with your own words about
              what you find rewarding about teaching English.
            </PlaceholderNote>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-500">
              [Placeholder: share, in your own voice, what you find most rewarding about helping
              students learn English.]
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Who I Teach" title="Age groups and student types" align="center" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {WHO_I_TEACH.map((group) => (
              <span
                key={group}
                className="rounded-full border border-ink-100 bg-brand-50 px-5 py-2.5 text-sm font-medium text-brand-700"
              >
                {group}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="rounded-3xl bg-brand-700 px-6 py-14 sm:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white">My CV</h2>
              <p className="mt-3 max-w-xl text-brand-100">
                Download a copy of my CV below, covering qualifications, teaching experience and
                international background in full.
              </p>
            </div>
            <Button href="/downloads/cv-balgyz-mammetyarova.pdf" variant="primary">
              Download My CV
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
