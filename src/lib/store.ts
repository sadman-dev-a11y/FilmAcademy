import { z } from "zod";
import { courses, lessons } from "../data/curriculum";
import type { Course, Question } from "../data/types";
const text = z.string().max(10000);
const id = z.string().min(1).max(150);
const shotSchema = z.object({
  id,
  title: z.string().max(200),
  size: z.enum(["Wide", "Medium", "Close"]),
  angle: z.enum(["High", "Eye level", "Low"]),
  action: text,
  note: text,
  duration: z.number().min(0).max(3600),
});
const boardSchema = z.object({
  id,
  title: z.string().max(200),
  updatedAt: z.string().datetime(),
  shots: z.array(shotSchema).max(200),
});
const attemptSchema = z.object({
  courseId: id,
  answers: z.array(z.number().int().min(0).max(10)).max(8),
  score: z.number().int().min(0).max(100),
  date: z.string().datetime(),
});
const stateSchema = z.object({
  schemaVersion: z.literal(2),
  completed: z.array(id).max(200),
  bookmarks: z.array(id).max(200),
  notes: z.record(z.string(), text),
  attempts: z.array(attemptSchema).max(1000),
  recent: z.array(id).max(20),
  boards: z.array(boardSchema).max(50),
  motion: z.enum(["system", "reduce", "full"]),
  updatedAt: z.string().datetime(),
});
export type Shot = z.infer<typeof shotSchema>;
export type Board = z.infer<typeof boardSchema>;
export type LearningState = z.infer<typeof stateSchema>;
export const KEY = "filmacademy.learning";
export const createId = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint32Array(4)), (n) =>
        n.toString(16).padStart(8, "0"),
      ).join("-");
export const emptyState = (): LearningState => ({
  schemaVersion: 2,
  completed: [],
  bookmarks: [],
  notes: {},
  attempts: [],
  recent: [],
  boards: [],
  motion: "system",
  updatedAt: new Date().toISOString(),
});
export function grade(questions: Question[], answers: number[]) {
  return Math.round(
    (questions.reduce((n, q, i) => n + Number(q.correct === answers[i]), 0) /
      questions.length) *
      100,
  );
}
export function parseState(raw: string): LearningState {
  if (raw.length > 2_000_000)
    throw new Error("File is too large. Maximum backup size is 2 MB.");
  const value: unknown = JSON.parse(raw);
  let candidate = value;
  if (
    typeof value === "object" &&
    value !== null &&
    "schemaVersion" in value &&
    value.schemaVersion === 1
  )
    candidate = { ...emptyState(), ...value, schemaVersion: 2 };
  const parsed = stateSchema.parse(candidate);
  const ids = new Set(lessons.map((l) => l.id));
  if (
    [
      ...parsed.completed,
      ...parsed.bookmarks,
      ...parsed.recent,
      ...Object.keys(parsed.notes),
    ].some((v) => !ids.has(v))
  )
    throw new Error("Backup contains an unknown lesson.");
  if (
    parsed.attempts.some((a) => {
      const c = courses.find((c) => c.id === a.courseId);
      return (
        !c ||
        a.answers.length !== c.quiz.length ||
        a.answers.some((v, i) => v >= c.quiz[i].options.length) ||
        grade(c.quiz, a.answers) !== a.score
      );
    })
  )
    throw new Error("Backup contains an invalid quiz attempt.");
  if (
    new Set(parsed.boards.map((b) => b.id)).size !== parsed.boards.length ||
    parsed.boards.some(
      (b) => new Set(b.shots.map((s) => s.id)).size !== b.shots.length,
    )
  )
    throw new Error("Backup contains duplicate storyboard identifiers.");
  return {
    ...parsed,
    completed: [...new Set(parsed.completed)],
    bookmarks: [...new Set(parsed.bookmarks)],
    recent: [...new Set(parsed.recent)],
  };
}
export function readState(): { state: LearningState; warning: string } {
  try {
    const raw = localStorage.getItem(KEY);
    return { state: raw ? parseState(raw) : emptyState(), warning: "" };
  } catch {
    return {
      state: emptyState(),
      warning:
        "Saved data could not be read. It has not been overwritten. Export a recovery copy in Settings before saving new work.",
    };
  }
}
export function percent(c: Course, s: LearningState) {
  return Math.round(
    (c.lessons.filter((l) => s.completed.includes(l.id)).length /
      c.lessons.length) *
      100,
  );
}
export function earned(c: Course, s: LearningState) {
  return (
    percent(c, s) === 100 &&
    s.attempts.some((a) => a.courseId === c.id && a.score >= 80)
  );
}
export function moveShot(shots: Shot[], index: number, delta: number) {
  const next = [...shots];
  const target = index + delta;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
export const newShot = (): Shot => ({
  id: createId(),
  title: "Untitled shot",
  size: "Wide",
  angle: "Eye level",
  action: "",
  note: "",
  duration: 4,
});
export const newBoard = (): Board => ({
  id: createId(),
  title: "Untitled storyboard",
  updatedAt: new Date().toISOString(),
  shots: [],
});
export function parseBoard(raw: string): Board {
  if (raw.length > 1_000_000) throw new Error("Storyboard exceeds 1 MB.");
  const parsed = z
    .object({ schemaVersion: z.literal(1), board: boardSchema })
    .parse(JSON.parse(raw));
  if (
    new Set(parsed.board.shots.map((s) => s.id)).size !==
    parsed.board.shots.length
  )
    throw new Error("Duplicate shot identifiers.");
  return { ...parsed.board, id: createId() };
}
export function download(name: string, value: unknown) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
