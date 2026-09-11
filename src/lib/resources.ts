import { marked } from "marked";
import { createClient } from "./supabase/server";
import type {
  AgeGroup,
  Difficulty,
  EnglishLevel,
  Resource,
  ResourceType,
  Skill,
} from "./types";

marked.setOptions({ gfm: true, breaks: false });

interface ResourceRow {
  slug: string;
  title: string;
  description: string;
  resource_type: string;
  age_groups: string[];
  english_levels: string[];
  primary_skill: string;
  secondary_skills: string[];
  topics: string[];
  duration: string;
  class_size: string;
  prep_time: string;
  difficulty: string;
  materials: string[];
  related_resources: string[];
  collections: string[];
  downloads: { label: string; fileType: string; url: string }[];
  author: string;
  date_created: string;
  last_updated: string;
  featured: boolean;
  body: string;
}

function mapRow(row: ResourceRow): Resource {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    resourceType: row.resource_type as ResourceType,
    ageGroups: row.age_groups as AgeGroup[],
    englishLevels: row.english_levels as EnglishLevel[],
    primarySkill: row.primary_skill as Skill,
    secondarySkills: row.secondary_skills as Skill[],
    topics: row.topics,
    duration: row.duration,
    classSize: row.class_size,
    prepTime: row.prep_time,
    difficulty: row.difficulty as Difficulty,
    materials: row.materials,
    relatedResources: row.related_resources,
    collections: row.collections,
    downloads: row.downloads as Resource["downloads"],
    author: row.author,
    dateCreated: row.date_created,
    lastUpdated: row.last_updated,
    featured: row.featured,
    body: row.body ?? "",
    bodyHtml: marked.parse(row.body ?? "", { async: false }) as string,
  };
}

export async function getAllResources(): Promise<Resource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("resources").select("*").order("title", { ascending: true });
  if (error) throw error;
  return (data as ResourceRow[]).map(mapRow);
}

export async function getResourceBySlug(slug: string): Promise<Resource | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("resources").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as ResourceRow) : undefined;
}

export async function getFeaturedResources(limit?: number): Promise<Resource[]> {
  const supabase = await createClient();
  let query = supabase.from("resources").select("*").eq("featured", true).order("title", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data as ResourceRow[]).map(mapRow);
}

export async function getRelatedResources(resource: Resource): Promise<Resource[]> {
  if (!resource.relatedResources?.length) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("resources").select("*").in("slug", resource.relatedResources);
  if (error) throw error;
  const bySlug = new Map((data as ResourceRow[]).map((r) => [r.slug, r]));
  return resource.relatedResources
    .map((slug) => bySlug.get(slug))
    .filter((r): r is ResourceRow => Boolean(r))
    .map(mapRow);
}

export async function getResourcesByAgeGroup(age: AgeGroup): Promise<Resource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .contains("age_groups", [age])
    .order("title", { ascending: true });
  if (error) throw error;
  return (data as ResourceRow[]).map(mapRow);
}

export async function getResourcesByCollection(collectionSlug: string): Promise<Resource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .contains("collections", [collectionSlug])
    .order("title", { ascending: true });
  if (error) throw error;
  return (data as ResourceRow[]).map(mapRow);
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

export async function filterResources(filters: ResourceFilters): Promise<Resource[]> {
  const all = await getAllResources();
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
