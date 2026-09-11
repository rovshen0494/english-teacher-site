import { readContentDir, readContentFile } from "./markdown";
import type {
  AgeGroup,
  CollectionMeta,
  Difficulty,
  EnglishLevel,
  Resource,
  ResourceFrontmatter,
  ResourceType,
  Skill,
} from "./types";

const DIR = "resources";

let cache: Resource[] | null = null;

export function getAllResources(): Resource[] {
  // Content files can change between requests during local development
  // (editing markdown shouldn't require a server restart), so only cache in production.
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = readContentDir(DIR);
  const resources = files.map((file) => {
    const { data, bodyHtml } = readContentFile<ResourceFrontmatter>(DIR, file);
    return { ...data, bodyHtml };
  });
  resources.sort((a, b) => (a.title > b.title ? 1 : -1));
  cache = resources;
  return resources;
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return getAllResources().find((r) => r.slug === slug);
}

export function getFeaturedResources(limit?: number): Resource[] {
  const featured = getAllResources().filter((r) => r.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export function getRelatedResources(resource: Resource): Resource[] {
  if (!resource.relatedResources?.length) return [];
  return resource.relatedResources
    .map((slug) => getResourceBySlug(slug))
    .filter((r): r is Resource => Boolean(r));
}

export function getResourcesByAgeGroup(age: AgeGroup): Resource[] {
  return getAllResources().filter((r) => r.ageGroups.includes(age));
}

export function getResourcesByCollection(collectionSlug: string): Resource[] {
  return getAllResources().filter((r) => r.collections?.includes(collectionSlug));
}

export interface ResourceFilters {
  query?: string;
  age?: AgeGroup;
  level?: EnglishLevel;
  skill?: Skill;
  type?: ResourceType;
  topic?: string;
  difficulty?: Difficulty;
}

export function filterResources(filters: ResourceFilters): Resource[] {
  const all = getAllResources();
  const query = filters.query?.trim().toLowerCase();

  return all.filter((r) => {
    if (filters.age && !r.ageGroups.includes(filters.age)) return false;
    if (filters.level && !r.englishLevels.includes(filters.level)) return false;
    if (filters.skill && r.primarySkill !== filters.skill && !r.secondarySkills.includes(filters.skill))
      return false;
    if (filters.type && r.resourceType !== filters.type) return false;
    if (filters.topic && !r.topics.includes(filters.topic)) return false;
    if (filters.difficulty && r.difficulty !== filters.difficulty) return false;
    if (query) {
      const haystack = `${r.title} ${r.description} ${r.topics.join(" ")}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    slug: "first-day-activities",
    title: "First Day Activities",
    description: "Warm, low-pressure activities for meeting a new class.",
  },
  {
    slug: "10-minute-classroom-games",
    title: "10-Minute Classroom Games",
    description: "Quick games that fit into any lesson without extra planning.",
  },
  {
    slug: "vocabulary-games",
    title: "Vocabulary Games",
    description: "Interactive ways to introduce, practise and review new words.",
  },
  {
    slug: "speaking-activities",
    title: "Speaking Activities",
    description: "Discussion, role play and conversation practice for every level.",
  },
  {
    slug: "no-prep-activities",
    title: "No-Prep Activities",
    description: "Effective activities that need little to no preparation time.",
  },
  {
    slug: "ielts-speaking-practice",
    title: "IELTS Speaking Practice",
    description: "Resources for building fluency and confidence in the Speaking test.",
  },
  {
    slug: "ielts-writing-practice",
    title: "IELTS Writing Practice",
    description: "Structured practice for Writing Task 1 and Task 2.",
  },
  {
    slug: "games-for-large-classes",
    title: "Games for Large Classes",
    description: "Activities that work well with bigger groups of students.",
  },
  {
    slug: "activities-for-shy-students",
    title: "Activities for Shy Students",
    description: "Low-pressure formats that build confidence before whole-class speaking.",
  },
  {
    slug: "teenage-conversation-activities",
    title: "Teenage Conversation Activities",
    description: "Discussion and debate activities that teenagers actually enjoy.",
  },
];

export function getCollectionBySlug(slug: string): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
