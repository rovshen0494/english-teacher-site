import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import ResourceCard from "@/components/ResourceCard";
import PlaceholderNote from "@/components/PlaceholderNote";
import { getFeaturedResources } from "@/lib/resources";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "For Schools & Recruiters",
  description:
    "An English teacher available for language centre, IELTS/TOEFL, young learner, teenager and adult classes in Ho Chi Minh City, Vietnam — CV and teaching samples available.",
};

const AVAILABLE_FOR = [
  "Language centre teaching",
  "IELTS & TOEFL teaching",
  "Young learner classes",
  "Teenager classes",
  "Adult English",
  "Conversation classes",
  "Private lessons",
  "Summer programmes",
  "Online teaching",
];

const WHY_WORK_WITH_ME = [
  {
    title: "Qualifications",
    content: "120-Hour TEFL/TESOL Certificate (World TESOL Academy), plus a B.A. in History & Civilizations and Literature from the American University in Bulgaria.",
  },
  {
    title: "Teaching Experience",
    content: "Over three years teaching English across language centres in Vietnam and Turkmenistan, including curriculum-aligned lessons for varying ages and dedicated TOEFL exam preparation.",
  },
  {
    title: "English Proficiency",
    content: "Fluent English (C1+). Trilingual overall — English, Turkmen and Russian — with additional Turkish, Bulgarian and German.",
  },
  {
    title: "Exam Prep Experience",
    content: "Real TOEFL instructor experience (Sahypa Education Centre, Turkmenistan), plus a full library of original IELTS teaching resources and strategies across Speaking, Writing, Reading and Listening.",
  },
  {
    title: "Age Groups",
    content: "Experience teaching varying ages, from preschoolers through teenagers to adults, including small-group and individual exam-preparation classes.",
  },
  {
    title: "International Experience",
    content: "Lived, studied and worked across Vietnam, Turkmenistan, Bulgaria and Türkiye, with public-facing cross-cultural translation experience for international diplomatic events.",
  },
  {
    title: "Availability",
    content: "Add current availability — full-time, part-time, or specific hours.",
    placeholder: true,
  },
];

export default async function ForSchoolsPage() {
  const sample = await getFeaturedResources(3);

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 via-background to-background py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="For Schools"
            title="Looking for an enthusiastic English teacher?"
            description="I am available to work with language schools and education companies in Ho Chi Minh City on a range of teaching formats."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {AVAILABLE_FOR.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/downloads/cv-balgyz-mammetyarova.pdf">Download My CV</Button>
            <Button href="/contact" variant="outline">
              Discuss a Teaching Opportunity
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Why Work With Me?" title="What I bring to a school or team" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {WHY_WORK_WITH_ME.map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink-100 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink-900">{item.title}</h3>
                <div className="mt-3">
                  {item.placeholder ? (
                    <PlaceholderNote>{item.content}</PlaceholderNote>
                  ) : (
                    <p className="text-sm leading-relaxed text-ink-500">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {sample.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Evidence of Preparation"
              title="A sample of my teaching resources"
              description="A small selection from my teaching resource library, shared here as an example of lesson preparation and classroom-readiness."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sample.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button href="/resources" variant="outline">
                View the Full Resource Library
              </Button>
            </div>
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <Container className="rounded-3xl bg-brand-700 px-6 py-14 text-center sm:px-14">
          <h2 className="font-display text-3xl font-semibold text-white">
            Let&apos;s discuss a teaching opportunity
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Send a message with your school&apos;s needs and I will get back to you promptly.
          </p>
          <div className="mt-6">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
