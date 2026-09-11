import type { AgeGroup, Difficulty, EnglishLevel, ResourceType, Skill } from "./types";

export const SITE = {
  name: "Balgyz Mammetyarova",
  role: "English Teacher & Exam Prep Instructor",
  location: "Ho Chi Minh City, Vietnam",
  url: "https://example.com",
  email: "bmammet09@gmail.com",
  description:
    "Professional English teacher based in Ho Chi Minh City, Vietnam, working with young learners, teenagers, adults and IELTS/TOEFL exam candidates. Explore a growing library of classroom-ready English teaching resources.",
  social: {
    linkedin: "https://www.linkedin.com/in/balgyz-mammetyarova-65ba0427a/",
  },
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/ielts", label: "IELTS & TOEFL" },
  { href: "/young-learners", label: "Young Learners" },
  { href: "/resources", label: "Resources" },
  { href: "/for-schools", label: "For Schools" },
];

export const AGE_GROUP_LABELS: Partial<Record<AgeGroup, string>> = {
  IELTS: "IELTS & TOEFL",
};

export const AGE_GROUPS: AgeGroup[] = [
  "Ages 3-5",
  "Ages 6-8",
  "Ages 9-12",
  "Ages 13-17",
  "Adults",
  "IELTS",
];

export const ENGLISH_LEVELS: EnglishLevel[] = [
  "Pre-A1",
  "A1 Beginner",
  "A2 Elementary",
  "B1 Intermediate",
  "B2 Upper-Intermediate",
  "C1 Advanced",
  "C2 Proficient",
  "IELTS-specific",
];

export const SKILLS: Skill[] = [
  "Speaking",
  "Listening",
  "Reading",
  "Writing",
  "Vocabulary",
  "Grammar",
  "Pronunciation",
  "Fluency",
  "Critical Thinking",
];

export const RESOURCE_TYPES: ResourceType[] = [
  "Game",
  "Lesson Plan",
  "Worksheet",
  "Flashcards",
  "Quiz",
  "Speaking Activity",
  "Warm-Up",
  "Icebreaker",
  "IELTS Resource",
  "Vocabulary Activity",
  "Grammar Activity",
  "Pronunciation Activity",
];

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Challenging"];

export const TOPICS: string[] = [
  "Animals",
  "Food",
  "Family",
  "School",
  "Hobbies",
  "Sports",
  "Travel",
  "Holidays",
  "Jobs",
  "Technology",
  "Environment",
  "Health",
  "Daily Life",
  "Friendship",
  "Shopping",
  "Transport",
  "Weather",
  "Entertainment",
  "Social Media",
  "Culture",
];

export const DURATIONS = [
  "5-10 minutes",
  "10-15 minutes",
  "15-20 minutes",
  "20-30 minutes",
  "30-45 minutes",
  "45-60 minutes",
];

export const BLOG_CATEGORIES = [
  "IELTS Tips",
  "Teaching Ideas",
  "Young Learners",
  "Teenagers",
  "Adult English",
  "Vocabulary",
  "Grammar",
  "Pronunciation",
];
