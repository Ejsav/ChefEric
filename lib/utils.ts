/** Class-name joiner with falsy filtering. */
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/** A random id for one form submission (duplicate protection). */
export function submissionId() {
  try { return crypto.randomUUID(); } catch { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`; }
}
