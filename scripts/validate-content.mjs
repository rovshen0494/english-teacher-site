import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "src", "content", "resources");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

const VALID = {
  ageGroups: ["Ages 3-5", "Ages 6-8", "Ages 9-12", "Ages 13-17", "Adults", "IELTS"],
  englishLevels: [
    "Pre-A1",
    "A1 Beginner",
    "A2 Elementary",
    "B1 Intermediate",
    "B2 Upper-Intermediate",
    "C1 Advanced",
    "C2 Proficient",
    "IELTS-specific",
  ],
  resourceType: [
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
  ],
  primarySkill: [
    "Speaking",
    "Listening",
    "Reading",
    "Writing",
    "Vocabulary",
    "Grammar",
    "Pronunciation",
    "Fluency",
    "Critical Thinking",
  ],
  difficulty: ["Easy", "Medium", "Challenging"],
};

function get1(content, key) {
  const m = content.match(new RegExp("^" + key + ":\\s*\"([^\"]+)\"", "m"));
  return m ? m[1] : undefined;
}

function getArr(content, key) {
  const m = content.match(new RegExp("^" + key + ":\\s*\\[([^\\]]*)\\]", "m"));
  if (!m) return [];
  const matches = m[1].match(/"([^"]+)"/g) || [];
  return matches.map((s) => s.slice(1, -1));
}

let errors = 0;
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), "utf-8");

  const rt = get1(content, "resourceType");
  if (!VALID.resourceType.includes(rt)) {
    console.log(f, "BAD resourceType:", rt);
    errors++;
  }

  const diff = get1(content, "difficulty");
  if (!VALID.difficulty.includes(diff)) {
    console.log(f, "BAD difficulty:", diff);
    errors++;
  }

  const skill = get1(content, "primarySkill");
  if (!VALID.primarySkill.includes(skill)) {
    console.log(f, "BAD primarySkill:", skill);
    errors++;
  }

  for (const a of getArr(content, "ageGroups")) {
    if (!VALID.ageGroups.includes(a)) {
      console.log(f, "BAD ageGroup:", a);
      errors++;
    }
  }
  for (const l of getArr(content, "englishLevels")) {
    if (!VALID.englishLevels.includes(l)) {
      console.log(f, "BAD level:", l);
      errors++;
    }
  }
  for (const s of getArr(content, "secondarySkills")) {
    if (!VALID.primarySkill.includes(s)) {
      console.log(f, "BAD secondarySkill:", s);
      errors++;
    }
  }
}

console.log("Checked", files.length, "files. Errors:", errors);
