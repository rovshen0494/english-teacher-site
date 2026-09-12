import { getWordSet, type GameWord } from "@/content/games/word-sets";
import { shuffle } from "./shuffle";

export type GameStatus = "lobby" | "question" | "reveal" | "leaderboard" | "finished";

export const QUESTION_TIME_LIMIT_SECONDS = 20;

export interface GameSession {
  id: string;
  roomCode: string;
  topic: string;
  questionOrder: string[];
  status: GameStatus;
  currentQuestionIndex: number;
  questionStartedAt: string | null;
  createdAt: string;
}

export interface GamePlayer {
  id: string;
  sessionId: string;
  nickname: string;
  score: number;
  joinedAt: string;
}

export interface GameSessionRow {
  id: string;
  room_code: string;
  topic: string;
  question_order: string[];
  status: GameStatus;
  current_question_index: number;
  question_started_at: string | null;
  created_at: string;
}

export interface GamePlayerRow {
  id: string;
  session_id: string;
  nickname: string;
  score: number;
  joined_at: string;
}

export function mapSessionRow(row: GameSessionRow): GameSession {
  return {
    id: row.id,
    roomCode: row.room_code,
    topic: row.topic,
    questionOrder: row.question_order,
    status: row.status,
    currentQuestionIndex: row.current_question_index,
    questionStartedAt: row.question_started_at,
    createdAt: row.created_at,
  };
}

export function mapPlayerRow(row: GamePlayerRow): GamePlayer {
  return {
    id: row.id,
    sessionId: row.session_id,
    nickname: row.nickname,
    score: row.score,
    joinedAt: row.joined_at,
  };
}

export const ANSWER_STYLES = [
  { bg: "#ef4444", shape: "triangle" },
  { bg: "#3b82f6", shape: "diamond" },
  { bg: "#eab308", shape: "circle" },
  { bg: "#22c55e", shape: "square" },
] as const;

const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_ALPHABET[Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)];
  }
  return code;
}

/** Builds the shuffled word order stored on a new session for a given topic. */
export function buildQuestionOrder(topicSlug: string): string[] {
  const set = getWordSet(topicSlug);
  if (!set) throw new Error(`Unknown topic: ${topicSlug}`);
  return shuffle(set.words).map((w) => w.word);
}

export function getQuestionWord(topicSlug: string, word: string): GameWord | undefined {
  const set = getWordSet(topicSlug);
  return set?.words.find((w) => w.word === word);
}

/** Builds the 4 answer options (1 correct + 3 distractors) for a question word. */
export function buildQuestionOptions(topicSlug: string, word: string): GameWord[] {
  const set = getWordSet(topicSlug);
  if (!set) return [];
  const correct = set.words.find((w) => w.word === word);
  if (!correct) return [];
  const distractors = shuffle(set.words.filter((w) => w.word !== word)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}
