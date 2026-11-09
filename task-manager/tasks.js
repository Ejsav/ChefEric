/*
 * Task model: pure functions with no DOM or storage access.
 * Loaded as a classic script in the browser (exposes window.TaskModel) and
 * through require() in Node for the unit tests.
 *
 * A task always has this shape:
 *   {
 *     id: string,                       // stable, unique
 *     title: string,                    // trimmed, 1..MAX_TITLE_LENGTH chars
 *     priority: "low" | "medium" | "high",
 *     completed: boolean,
 *     createdAt: string,                // ISO 8601
 *     updatedAt: string,                // ISO 8601
 *     completedAt: string | null        // ISO 8601 while completed
 *   }
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TaskModel = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const PRIORITIES = Object.freeze(["low", "medium", "high"]);
  const PRIORITY_LABELS = Object.freeze({ low: "Low", medium: "Medium", high: "High" });
  const DEFAULT_PRIORITY = "medium";
  const STATUS_FILTERS = Object.freeze(["all", "active", "completed"]);
  const PRIORITY_FILTERS = Object.freeze(["all", "high", "medium", "low"]);
  const DEFAULT_VIEW = Object.freeze({ status: "all", priority: "all" });
  const MAX_TITLE_LENGTH = 200;
  const STORAGE_VERSION = 1;

  // Control characters (tabs, line breaks, NUL...) become spaces.
  const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g;

  function cleanTitle(value) {
    if (typeof value !== "string") return "";
    return value.replace(CONTROL_CHARS, " ").trim();
  }

  /** Returns { ok: true, title } or { ok: false, error }. */
  function validateTitle(value) {
    const title = cleanTitle(value);
    if (!title) return { ok: false, error: "Enter a task title." };
    if (title.length > MAX_TITLE_LENGTH) {
      return {
        ok: false,
        error: `Keep the title to ${MAX_TITLE_LENGTH} characters or fewer (it has ${title.length}).`,
      };
    }
    return { ok: true, title };
  }

  function isPriority(value) {
    return PRIORITIES.includes(value);
  }

  function createId() {
    const c = typeof crypto !== "undefined" ? crypto : null;
    if (c && typeof c.randomUUID === "function") {
      try {
        return c.randomUUID();
      } catch {
        // Not available in this context; fall through.
      }
    }
    const random = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    return `t-${Date.now().toString(36)}-${random}`;
  }

  function toIso(date) {
    return (date instanceof Date ? date : new Date()).toISOString();
  }

  /** Creates a new active task. Throws on an invalid title or priority. */
  function createTask(input, now, id) {
    const check = validateTitle(input && input.title);
    if (!check.ok) throw new Error(check.error);
    const priority = input && input.priority !== undefined ? input.priority : DEFAULT_PRIORITY;
    if (!isPriority(priority)) throw new Error(`Unknown priority: ${String(priority)}`);
    const stamp = toIso(now);
    return {
      id: id || createId(),
      title: check.title,
      priority,
      completed: false,
      createdAt: stamp,
      updatedAt: stamp,
      completedAt: null,
    };
  }

  /**
   * Returns a copy of the task with the given changes applied. Only title,
   * priority and completed can change; every other field is preserved.
   * Throws on an invalid title or priority.
   */
  function updateTask(task, changes, now) {
    const next = { ...task };
    let changed = false;
    if (changes.title !== undefined) {
      const check = validateTitle(changes.title);
      if (!check.ok) throw new Error(check.error);
      if (check.title !== task.title) {
        next.title = check.title;
        changed = true;
      }
    }
    if (changes.priority !== undefined) {
      if (!isPriority(changes.priority)) throw new Error(`Unknown priority: ${String(changes.priority)}`);
      if (changes.priority !== task.priority) {
        next.priority = changes.priority;
        changed = true;
      }
    }
    if (changes.completed !== undefined) {
      const completed = Boolean(changes.completed);
      if (completed !== task.completed) {
        next.completed = completed;
        next.completedAt = completed ? toIso(now) : null;
        changed = true;
      }
    }
    if (!changed) return task;
    next.updatedAt = toIso(now);
    return next;
  }

  function validIso(value) {
    return typeof value === "string" && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : null;
  }

  /**
   * Turns one stored entry into a valid task, or returns null if it cannot be
   * salvaged (not an object, or no usable title). `seenIds` prevents
   * duplicate ids: a repeated id is replaced with a fresh one.
   */
  function normalizeTask(raw, seenIds) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const check = validateTitle(raw.title);
    let title;
    if (check.ok) title = check.title;
    else if (cleanTitle(raw.title)) title = cleanTitle(raw.title).slice(0, MAX_TITLE_LENGTH).trim();
    else return null;

    let id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : typeof raw.id === "number" && Number.isFinite(raw.id) ? String(raw.id) : "";
    if (!id || seenIds.has(id)) id = createId();
    seenIds.add(id);

    const completed = raw.completed === true;
    const createdAt = validIso(raw.createdAt) || toIso();
    const updatedAt = validIso(raw.updatedAt) || createdAt;
    return {
      id,
      title,
      priority: isPriority(raw.priority) ? raw.priority : DEFAULT_PRIORITY,
      completed,
      createdAt,
      updatedAt,
      completedAt: completed ? validIso(raw.completedAt) || updatedAt : null,
    };
  }

  function sameTask(a, b) {
    return (
      a.id === b.id &&
      a.title === b.title &&
      a.priority === b.priority &&
      a.completed === b.completed &&
      a.createdAt === b.createdAt &&
      a.updatedAt === b.updatedAt &&
      a.completedAt === b.completedAt
    );
  }

  /**
   * Parses the stored string. Never throws.
   * status: "empty"    nothing stored
   *         "ok"       read exactly
   *         "repaired" read, but some entries were fixed or skipped
   *         "corrupt"  unreadable; tasks is empty
   */
  function parseStored(raw) {
    if (raw === null || raw === undefined || raw === "") return { status: "empty", tasks: [], skipped: 0 };
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return { status: "corrupt", tasks: [], skipped: 0 };
    }
    let list;
    if (Array.isArray(data)) list = data;
    else if (data && typeof data === "object" && Array.isArray(data.tasks)) list = data.tasks;
    else return { status: "corrupt", tasks: [], skipped: 0 };

    const seen = new Set();
    const tasks = [];
    let skipped = 0;
    let repaired = !(data && data.version === STORAGE_VERSION);
    for (const entry of list) {
      const task = normalizeTask(entry, seen);
      if (!task) {
        skipped += 1;
        repaired = true;
        continue;
      }
      if (!repaired && !sameTask(task, entry)) repaired = true;
      tasks.push(task);
    }
    return { status: repaired ? "repaired" : "ok", tasks, skipped };
  }

  function serialize(tasks) {
    return JSON.stringify({ version: STORAGE_VERSION, tasks });
  }

  function normalizeView(raw) {
    const view = { ...DEFAULT_VIEW };
    if (raw && typeof raw === "object") {
      if (STATUS_FILTERS.includes(raw.status)) view.status = raw.status;
      if (PRIORITY_FILTERS.includes(raw.priority)) view.priority = raw.priority;
    }
    return view;
  }

  function matchesView(task, view) {
    if (view.status === "active" && task.completed) return false;
    if (view.status === "completed" && !task.completed) return false;
    if (view.priority !== "all" && task.priority !== view.priority) return false;
    return true;
  }

  function filterTasks(tasks, view) {
    return tasks.filter((task) => matchesView(task, view));
  }

  function countTasks(tasks) {
    let completed = 0;
    for (const task of tasks) if (task.completed) completed += 1;
    return { total: tasks.length, active: tasks.length - completed, completed };
  }

  return Object.freeze({
    PRIORITIES,
    PRIORITY_LABELS,
    DEFAULT_PRIORITY,
    STATUS_FILTERS,
    PRIORITY_FILTERS,
    DEFAULT_VIEW,
    MAX_TITLE_LENGTH,
    STORAGE_VERSION,
    cleanTitle,
    validateTitle,
    isPriority,
    createId,
    createTask,
    updateTask,
    normalizeTask,
    parseStored,
    serialize,
    normalizeView,
    matchesView,
    filterTasks,
    countTasks,
  });
});
