export type AgeGroup =
  | "Ages 3-5"
  | "Ages 6-8"
  | "Ages 9-12"
  | "Ages 13-17"
  | "Adults"
  | "IELTS";

export type EnglishLevel =
  | "Pre-A1"
  | "A1 Beginner"
  | "A2 Elementary"
  | "B1 Intermediate"
  | "B2 Upper-Intermediate"
  | "C1 Advanced"
  | "C2 Proficient"
  | "IELTS-specific";

export type Skill =
  | "Speaking"
  | "Listening"
  | "Reading"
  | "Writing"
  | "Vocabulary"
  | "Grammar"
  | "Pronunciation"
  | "Fluency"
  | "Critical Thinking";

export type ResourceType =
  | "Game"
  | "Lesson Plan"
  | "Worksheet"
  | "Flashcards"
  | "Quiz"
  | "Speaking Activity"
  | "Warm-Up"
  | "Icebreaker"
  | "IELTS Resource"
  | "Vocabulary Activity"
  | "Grammar Activity"
  | "Pronunciation Activity";

export type Difficulty = "Easy" | "Medium" | "Challenging";

export type FileType = "PDF" | "DOCX" | "PPTX" | "Image";

export interface ResourceDownload {
  label: string;
  fileType: FileType;
  url: string;
}

export interface ResourceFrontmatter {
  title: string;
  slug: string;
  description: string;
  resourceType: ResourceType;
  ageGroups: AgeGroup[];
  englishLevels: EnglishLevel[];
  primarySkill: Skill;
  secondarySkills: Skill[];
  topics: string[];
  duration: string;
  classSize: string;
  prepTime: string;
  difficulty: Difficulty;
  materials: string[];
  relatedResources?: string[];
  collections?: string[];
  downloads?: ResourceDownload[];
  author: string;
  dateCreated: string;
  lastUpdated: string;
  featured?: boolean;
}

export interface Resource extends ResourceFrontmatter {
  bodyHtml: string;
}

export interface CollectionMeta {
  slug: string;
  title: string;
  description: string;
}

export interface BlogFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  relatedResources?: string[];
  featured?: boolean;
}

export interface BlogPost extends BlogFrontmatter {
  bodyHtml: string;
}
