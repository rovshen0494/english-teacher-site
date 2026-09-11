import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function readContentDir(dir: string): string[] {
  const fullPath = path.join(process.cwd(), "src", "content", dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath).filter((file) => file.endsWith(".md"));
}

export function readContentFile<T>(dir: string, filename: string): { data: T; bodyHtml: string } {
  const fullPath = path.join(process.cwd(), "src", "content", dir, filename);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const bodyHtml = marked.parse(content, { async: false }) as string;
  return { data: data as T, bodyHtml };
}
