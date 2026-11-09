// Unit tests for the task model. Run: npm run test:tasks
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const M = require("../tasks.js");

const T0 = new Date("2026-01-01T10:00:00.000Z");
const T1 = new Date("2026-01-01T11:00:00.000Z");

test("validateTitle rejects empty and whitespace-only titles", () => {
  for (const value of ["", "   ", "\n\t ", undefined, null, 42]) {
    assert.equal(M.validateTitle(value).ok, false, `accepted ${JSON.stringify(value)}`);
  }
});

test("validateTitle trims, flattens control characters and caps length", () => {
  assert.deepEqual(M.validateTitle("  Buy milk  "), { ok: true, title: "Buy milk" });
  assert.equal(M.validateTitle("a\nb\tc").title, "a b c");
  assert.equal(M.validateTitle("x".repeat(200)).ok, true);
  assert.equal(M.validateTitle("x".repeat(201)).ok, false);
});

test("createTask builds a complete active task with a unique id", () => {
  const a = M.createTask({ title: " Write report ", priority: "high" }, T0);
  const b = M.createTask({ title: "Write report", priority: "high" }, T0);
  assert.equal(a.title, "Write report");
  assert.equal(a.priority, "high");
  assert.equal(a.completed, false);
  assert.equal(a.createdAt, T0.toISOString());
  assert.equal(a.completedAt, null);
  assert.ok(a.id && b.id && a.id !== b.id);
  assert.equal(M.createTask({ title: "x" }).priority, "medium");
  assert.throws(() => M.createTask({ title: "  " }));
  assert.throws(() => M.createTask({ title: "x", priority: "urgent" }));
});

test("updateTask changes only what was asked and preserves the rest", () => {
  const task = M.createTask({ title: "Draft", priority: "low" }, T0, "fixed-id");
  const edited = M.updateTask(task, { title: "Final", priority: "high" }, T1);
  assert.equal(edited.id, "fixed-id");
  assert.equal(edited.title, "Final");
  assert.equal(edited.priority, "high");
  assert.equal(edited.createdAt, task.createdAt);
  assert.equal(edited.updatedAt, T1.toISOString());
  assert.equal(edited.completed, false);
  assert.equal(task.title, "Draft", "original must not be mutated");

  const done = M.updateTask(edited, { completed: true }, T1);
  assert.equal(done.completed, true);
  assert.equal(done.completedAt, T1.toISOString());
  assert.equal(done.title, "Final");
  const editedWhileDone = M.updateTask(done, { title: "Final v2" }, T1);
  assert.equal(editedWhileDone.completed, true, "editing keeps completion");
  const restored = M.updateTask(done, { completed: false }, T1);
  assert.equal(restored.completed, false);
  assert.equal(restored.completedAt, null);

  assert.equal(M.updateTask(task, { title: " Draft ", priority: "low" }, T1), task, "no-op returns same object");
  assert.throws(() => M.updateTask(task, { title: "" }));
  assert.throws(() => M.updateTask(task, { priority: "none" }));
});

test("filterTasks combines status and priority filters", () => {
  const tasks = [
    M.createTask({ title: "a", priority: "high" }),
    M.updateTask(M.createTask({ title: "b", priority: "high" }), { completed: true }),
    M.createTask({ title: "c", priority: "low" }),
    M.updateTask(M.createTask({ title: "d", priority: "medium" }), { completed: true }),
  ];
  const titles = (view) => M.filterTasks(tasks, view).map((t) => t.title).join("");
  assert.equal(titles({ status: "all", priority: "all" }), "abcd");
  assert.equal(titles({ status: "active", priority: "all" }), "ac");
  assert.equal(titles({ status: "completed", priority: "all" }), "bd");
  assert.equal(titles({ status: "all", priority: "high" }), "ab");
  assert.equal(titles({ status: "active", priority: "high" }), "a");
  assert.equal(titles({ status: "completed", priority: "low" }), "");
  assert.deepEqual(M.countTasks(tasks), { total: 4, active: 2, completed: 2 });
  assert.deepEqual(M.countTasks([]), { total: 0, active: 0, completed: 0 });
});

test("parseStored round-trips serialized tasks exactly", () => {
  const tasks = [M.createTask({ title: "<b>bold</b> & \"quotes\"", priority: "low" }, T0), M.updateTask(M.createTask({ title: "Done" }, T0), { completed: true }, T1)];
  const result = M.parseStored(M.serialize(tasks));
  assert.equal(result.status, "ok");
  assert.deepEqual(result.tasks, tasks);
});

test("parseStored handles missing and corrupted data without throwing", () => {
  assert.equal(M.parseStored(null).status, "empty");
  assert.equal(M.parseStored("").status, "empty");
  for (const raw of ["{not json", "42", '"text"', "null", '{"tasks": "nope"}', "true"]) {
    const result = M.parseStored(raw);
    assert.equal(result.status, "corrupt", raw);
    assert.deepEqual(result.tasks, []);
  }
});

test("parseStored repairs partial data and drops unusable entries", () => {
  const raw = JSON.stringify({
    version: 1,
    tasks: [
      { id: "a", title: "Keep me", priority: "high", completed: false, createdAt: T0.toISOString(), updatedAt: T0.toISOString(), completedAt: null },
      { id: "a", title: "Duplicate id", priority: "low", completed: true },
      { title: "No id, bad priority", priority: "urgent", completed: "yes" },
      { id: "b", title: "   " },
      null,
      "string",
      [1, 2],
      { id: 7, title: "Numeric id" },
    ],
  });
  const result = M.parseStored(raw);
  assert.equal(result.status, "repaired");
  assert.equal(result.skipped, 4);
  assert.deepEqual(result.tasks.map((t) => t.title), ["Keep me", "Duplicate id", "No id, bad priority", "Numeric id"]);
  const ids = result.tasks.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "ids are unique");
  assert.equal(ids[0], "a");
  assert.equal(ids[3], "7");
  assert.equal(result.tasks[2].priority, "medium");
  assert.equal(result.tasks[2].completed, false, "only literal true counts as completed");
  assert.equal(result.tasks[1].completed, true);
  assert.ok(result.tasks[1].completedAt, "completed task gets a completedAt");
});

test("parseStored accepts a bare array (older format)", () => {
  const result = M.parseStored(JSON.stringify([{ id: "x", title: "Old" }]));
  assert.equal(result.status, "repaired");
  assert.equal(result.tasks[0].title, "Old");
});

test("normalizeView falls back to defaults for unknown values", () => {
  assert.deepEqual(M.normalizeView(null), { status: "all", priority: "all" });
  assert.deepEqual(M.normalizeView({ status: "completed", priority: "low" }), { status: "completed", priority: "low" });
  assert.deepEqual(M.normalizeView({ status: "done", priority: 3 }), { status: "all", priority: "all" });
});
