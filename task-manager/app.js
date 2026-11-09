/*
 * Task manager UI: state, persistence and rendering.
 * Depends on window.TaskModel (tasks.js). Every change goes through
 * commit(), which updates state, saves, and re-renders the list, the
 * filters and the counts together.
 */
(function () {
  "use strict";

  const Model = window.TaskModel;
  const TASKS_KEY = "taskManager.tasks";
  const VIEW_KEY = "taskManager.view";
  const UNREADABLE_KEY = "taskManager.tasks.unreadable";
  const REPEAT_WINDOW_MS = 800; // accidental double submissions
  const UNDO_MS = 8000;

  /* ---------- Storage (never throws) ---------- */

  const storage = (function createStorage() {
    let ls = null;
    try {
      ls = window.localStorage;
      // Accessing the property can succeed while reads still throw.
      ls.getItem(TASKS_KEY);
    } catch {
      ls = null;
    }
    return {
      readable: ls !== null,
      read(key) {
        if (!ls) return null;
        try {
          return ls.getItem(key);
        } catch {
          return null;
        }
      },
      write(key, value) {
        if (!ls) return false;
        try {
          ls.setItem(key, value);
          return true;
        } catch {
          return false;
        }
      },
    };
  })();

  /* ---------- Elements ---------- */

  const $ = (id) => document.getElementById(id);
  const el = {
    form: $("new-task-form"),
    title: $("new-task-title"),
    priority: $("new-task-priority"),
    error: $("new-task-error"),
    hint: $("new-task-hint"),
    list: $("task-list"),
    listHeading: $("task-list-heading"),
    showing: $("showing"),
    empty: $("empty-state"),
    emptyTitle: $("empty-title"),
    emptyBody: $("empty-body"),
    emptyReset: $("empty-reset"),
    priorityFilter: $("priority-filter"),
    statusRadios: Array.from(document.querySelectorAll('input[name="status"]')),
    countTotal: $("count-total"),
    countActive: $("count-active"),
    countCompleted: $("count-completed"),
    segmentCounts: Array.from(document.querySelectorAll("[data-count]")),
    storageAlert: $("storage-alert"),
    loadNotice: $("load-notice"),
    loadNoticeText: $("load-notice-text"),
    loadNoticeDismiss: $("load-notice-dismiss"),
    undoBar: $("undo-bar"),
    undoText: $("undo-text"),
    undoButton: $("undo-button"),
    undoClose: $("undo-close"),
    announcer: $("announcer"),
    taskTemplate: $("task-template"),
    editTemplate: $("edit-template"),
  };

  /* ---------- State ---------- */

  const state = {
    tasks: [],
    view: { ...Model.DEFAULT_VIEW },
    editing: null, // { id, title, priority, error }
    saveFailed: false,
    lastAdd: null, // { title, priority, at }
    undo: null, // { task, index, timer }
  };

  /* ---------- Persistence ---------- */

  function saveTasks() {
    const ok = storage.write(TASKS_KEY, Model.serialize(state.tasks));
    setSaveFailed(!ok);
    return ok;
  }

  function saveView() {
    storage.write(VIEW_KEY, JSON.stringify(state.view));
  }

  function setSaveFailed(failed) {
    if (failed === state.saveFailed) return;
    state.saveFailed = failed;
    if (failed) {
      el.storageAlert.textContent = storage.readable
        ? "Your latest changes couldn't be saved (browser storage is full or blocked). Everything still works, but changes may be lost when you close or reload this page."
        : "This browser isn't letting the page save data, so tasks may be lost when you close or reload this page. Everything else still works.";
      el.storageAlert.hidden = false;
    } else {
      el.storageAlert.hidden = true;
      el.storageAlert.textContent = "";
    }
  }

  function showLoadNotice(text) {
    el.loadNoticeText.textContent = text;
    el.loadNotice.hidden = false;
  }

  function loadInitialState() {
    let viewData = null;
    try {
      viewData = JSON.parse(storage.read(VIEW_KEY) || "null");
    } catch {
      viewData = null;
    }
    state.view = Model.normalizeView(viewData);

    if (!storage.readable) {
      setSaveFailed(true);
      return;
    }

    const raw = storage.read(TASKS_KEY);
    const result = Model.parseStored(raw);
    state.tasks = result.tasks;

    if (result.status === "corrupt") {
      // Keep the unreadable data so nothing is destroyed silently.
      storage.write(UNREADABLE_KEY, raw);
      showLoadNotice("Your saved tasks couldn't be read, so the list has started fresh. A copy of the unreadable data was kept in this browser.");
      saveTasks();
    } else if (result.status === "repaired") {
      if (result.skipped > 0) {
        const n = result.skipped;
        showLoadNotice(`${n} saved ${n === 1 ? "task was" : "tasks were"} unreadable and skipped. Everything else was restored.`);
      }
      saveTasks();
    }
  }

  /* ---------- Changes ---------- */

  /**
   * Applies a new task list, saves it and re-renders.
   * `focus` names what should hold focus after the render.
   */
  function commit(tasks, message, focus) {
    state.tasks = tasks;
    if (state.editing && !tasks.some((t) => t.id === state.editing.id)) state.editing = null;
    const saved = saveTasks();
    render(focus);
    if (message) announce(saved ? message : `${message} Not saved.`);
  }

  function findIndex(id) {
    return state.tasks.findIndex((t) => t.id === id);
  }

  function addTask(event) {
    event.preventDefault();
    const now = Date.now();
    const recent = state.lastAdd && now - state.lastAdd.at < REPEAT_WINDOW_MS ? state.lastAdd : null;
    const rawTitle = el.title.value;

    // A repeated submit right after a successful add (double click, key
    // repeat) arrives with an empty field or the same text: ignore it.
    if (recent && (!Model.cleanTitle(rawTitle) || (Model.cleanTitle(rawTitle) === recent.title && el.priority.value === recent.priority))) {
      el.title.value = "";
      return;
    }

    const check = Model.validateTitle(rawTitle);
    if (!check.ok) {
      showFieldError(el.title, el.error, check.error);
      el.title.focus();
      return;
    }
    clearFieldError(el.title, el.error);

    const priority = Model.isPriority(el.priority.value) ? el.priority.value : Model.DEFAULT_PRIORITY;
    const task = Model.createTask({ title: check.title, priority });
    state.lastAdd = { title: task.title, priority, at: now };
    el.title.value = "";

    const visible = Model.matchesView(task, state.view);
    if (visible) {
      el.hint.hidden = true;
      el.hint.textContent = "";
    } else {
      el.hint.textContent = "Added, but hidden by the current filters.";
      el.hint.hidden = false;
    }
    commit([task, ...state.tasks], visible ? `Added "${task.title}".` : `Added "${task.title}". It is hidden by the current filters.`, { kind: "new-task" });
  }

  function toggleTask(id, completed) {
    const index = findIndex(id);
    if (index === -1) return;
    const task = Model.updateTask(state.tasks[index], { completed });
    const tasks = state.tasks.slice();
    tasks[index] = task;
    const stillVisible = Model.matchesView(task, state.view);
    commit(
      tasks,
      completed ? `Completed "${task.title}".` : `Restored "${task.title}" to active.`,
      stillVisible ? { kind: "task", id, role: "toggle" } : neighbourFocus(id),
    );
  }

  function startEdit(id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    state.editing = { id, title: task.title, priority: task.priority, error: "" };
    render({ kind: "task", id, role: "edit-title", select: true });
  }

  function cancelEdit() {
    if (!state.editing) return;
    const id = state.editing.id;
    state.editing = null;
    render({ kind: "task", id, role: "edit" });
  }

  function saveEdit() {
    const editing = state.editing;
    if (!editing) return;
    const index = findIndex(editing.id);
    if (index === -1) {
      state.editing = null;
      render({ kind: "heading" });
      return;
    }
    const check = Model.validateTitle(editing.title);
    if (!check.ok) {
      editing.error = check.error;
      render({ kind: "task", id: editing.id, role: "edit-title" });
      return;
    }
    const before = state.tasks[index];
    const task = Model.updateTask(before, { title: check.title, priority: editing.priority });
    state.editing = null;
    if (task === before) {
      render({ kind: "task", id: task.id, role: "edit" });
      announce("No changes.");
      return;
    }
    const tasks = state.tasks.slice();
    tasks[index] = task;
    const visible = Model.matchesView(task, state.view);
    commit(
      tasks,
      visible ? `Saved "${task.title}".` : `Saved "${task.title}". It is now hidden by the current filters.`,
      visible ? { kind: "task", id: task.id, role: "edit" } : neighbourFocus(task.id),
    );
  }

  function deleteTask(id) {
    const index = findIndex(id);
    if (index === -1) return;
    const task = state.tasks[index];
    const focus = neighbourFocus(id);
    const tasks = state.tasks.slice();
    tasks.splice(index, 1);
    commit(tasks, `Deleted "${task.title}". Undo is available.`, focus);
    offerUndo(task, index);
  }

  function offerUndo(task, index) {
    clearUndo();
    state.undo = { task, index, timer: 0 };
    el.undoText.textContent = `Deleted "${task.title}".`;
    el.undoBar.hidden = false;
    scheduleUndoExpiry();
  }

  function scheduleUndoExpiry() {
    if (!state.undo) return;
    window.clearTimeout(state.undo.timer);
    state.undo.timer = window.setTimeout(clearUndo, UNDO_MS);
  }

  function pauseUndoExpiry() {
    if (state.undo) window.clearTimeout(state.undo.timer);
  }

  function clearUndo() {
    if (state.undo) window.clearTimeout(state.undo.timer);
    state.undo = null;
    el.undoBar.hidden = true;
    el.undoText.textContent = "";
  }

  function undoDelete() {
    const undo = state.undo;
    if (!undo) return;
    const hadFocus = el.undoBar.contains(document.activeElement);
    clearUndo();
    if (state.tasks.some((t) => t.id === undo.task.id)) return;
    const tasks = state.tasks.slice();
    tasks.splice(Math.min(undo.index, tasks.length), 0, undo.task);
    const visible = Model.matchesView(undo.task, state.view);
    commit(
      tasks,
      `Restored "${undo.task.title}".`,
      visible ? { kind: "task", id: undo.task.id, role: "toggle" } : hadFocus ? { kind: "heading" } : null,
    );
  }

  /** Focus target for when task `id` is about to leave the visible list. */
  function neighbourFocus(id) {
    const visible = Model.filterTasks(state.tasks, state.view);
    const i = visible.findIndex((t) => t.id === id);
    const next = visible[i + 1] || visible[i - 1];
    return next ? { kind: "task", id: next.id, role: "toggle" } : { kind: "heading" };
  }

  function setView(changes) {
    state.view = Model.normalizeView({ ...state.view, ...changes });
    saveView();
    el.hint.hidden = true;
    render(null);
  }

  /* ---------- Rendering ---------- */

  function render(focus) {
    const restore = focus === undefined || focus === null ? captureFocus() : focus;
    renderCounts();
    renderFilters();
    renderList();
    applyFocus(restore);
  }

  function renderCounts() {
    const counts = Model.countTasks(state.tasks);
    el.countTotal.textContent = String(counts.total);
    el.countActive.textContent = String(counts.active);
    el.countCompleted.textContent = String(counts.completed);
    for (const node of el.segmentCounts) node.textContent = String(counts[node.dataset.count]);
    document.title = counts.active > 0 ? `Tasks (${counts.active} active)` : "Tasks";
  }

  function renderFilters() {
    for (const radio of el.statusRadios) radio.checked = radio.value === state.view.status;
    el.priorityFilter.value = state.view.priority;
  }

  function renderList() {
    const visible = Model.filterTasks(state.tasks, state.view);
    if (state.editing && !visible.some((t) => t.id === state.editing.id)) state.editing = null;

    const fragment = document.createDocumentFragment();
    for (const task of visible) {
      fragment.appendChild(state.editing && state.editing.id === task.id ? buildEditItem(task) : buildTaskItem(task));
    }
    el.list.replaceChildren(fragment);
    el.list.hidden = visible.length === 0;

    const total = state.tasks.length;
    const filtered = state.view.status !== "all" || state.view.priority !== "all";
    el.showing.textContent = total === 0 ? "" : filtered ? `Showing ${visible.length} of ${total} ${total === 1 ? "task" : "tasks"}` : `${total} ${total === 1 ? "task" : "tasks"}`;
    el.showing.hidden = total === 0;

    renderEmpty(visible.length, total);
  }

  function renderEmpty(visibleCount, total) {
    if (visibleCount > 0) {
      el.empty.hidden = true;
      return;
    }
    el.empty.hidden = false;
    if (total === 0) {
      el.emptyTitle.textContent = "No tasks yet";
      el.emptyBody.textContent = "Add your first task above. Pick a priority so the important things stand out.";
      el.emptyReset.hidden = true;
      return;
    }
    const status = state.view.status;
    const priority = state.view.priority;
    const priorityText = priority === "all" ? "" : `${Model.PRIORITY_LABELS[priority].toLowerCase()}-priority `;
    if (status === "completed") {
      el.emptyTitle.textContent = `No completed ${priorityText}tasks`;
      el.emptyBody.textContent = "Tick a task's checkbox when it's done and it will show up here.";
    } else if (status === "active") {
      el.emptyTitle.textContent = `No active ${priorityText}tasks`;
      el.emptyBody.textContent = priority === "all" ? "Everything is done. Nice work." : "Nothing left to do at this priority.";
    } else {
      el.emptyTitle.textContent = `No ${priorityText}tasks`;
      el.emptyBody.textContent = "Try another priority, or show every task.";
    }
    el.emptyReset.hidden = false;
  }

  function buildTaskItem(task) {
    const item = el.taskTemplate.content.firstElementChild.cloneNode(true);
    const checkId = `task-${task.id}`;
    item.dataset.id = task.id;
    item.classList.toggle("task--completed", task.completed);

    const check = item.querySelector('[data-role="toggle"]');
    check.id = checkId;
    check.checked = task.completed;
    check.dataset.id = task.id;

    const label = item.querySelector(".task__title");
    label.htmlFor = checkId;
    label.textContent = task.title; // never parsed as HTML

    const badge = item.querySelector(".priority");
    const priorityId = `${checkId}-priority`;
    badge.id = priorityId;
    badge.dataset.priority = task.priority;
    badge.querySelector(".priority__label").textContent = Model.PRIORITY_LABELS[task.priority];
    check.setAttribute("aria-describedby", priorityId);

    const edit = item.querySelector('[data-role="edit"]');
    edit.dataset.id = task.id;
    edit.setAttribute("aria-label", `Edit "${task.title}"`);
    const del = item.querySelector('[data-role="delete"]');
    del.dataset.id = task.id;
    del.setAttribute("aria-label", `Delete "${task.title}"`);
    return item;
  }

  function buildEditItem(task) {
    const editing = state.editing;
    const item = el.editTemplate.content.firstElementChild.cloneNode(true);
    const base = `edit-${task.id}`;
    item.dataset.id = task.id;

    const form = item.querySelector("form");
    form.dataset.id = task.id;
    form.setAttribute("aria-label", `Edit "${task.title}"`);

    const title = item.querySelector('[data-role="edit-title"]');
    title.id = `${base}-title`;
    title.value = editing.title;
    title.dataset.id = task.id;
    item.querySelector('[data-for="title"]').htmlFor = title.id;

    const priority = item.querySelector('[data-role="edit-priority"]');
    priority.id = `${base}-priority`;
    priority.value = editing.priority;
    priority.dataset.id = task.id;
    item.querySelector('[data-for="priority"]').htmlFor = priority.id;

    const error = item.querySelector('[data-role="edit-error"]');
    error.id = `${base}-error`;
    title.setAttribute("aria-describedby", error.id);
    if (editing.error) showFieldError(title, error, editing.error);

    for (const button of item.querySelectorAll("button")) button.dataset.id = task.id;
    return item;
  }

  /* ---------- Focus ---------- */

  function captureFocus() {
    const active = document.activeElement;
    if (!active || !el.list.contains(active) || !active.dataset.role) return null;
    const item = active.closest("[data-id]");
    return item ? { kind: "task", id: item.dataset.id, role: active.dataset.role } : null;
  }

  function applyFocus(target) {
    if (!target) return;
    let node = null;
    if (target.kind === "new-task") node = el.title;
    else if (target.kind === "heading") node = el.listHeading;
    else if (target.kind === "task") {
      const item = el.list.querySelector(`[data-id="${cssEscape(target.id)}"]`);
      if (item) node = item.querySelector(`[data-role="${target.role}"]`) || item.querySelector("[data-role]");
      if (!node) node = el.listHeading;
    }
    if (!node) return;
    node.focus();
    if (target.select && typeof node.select === "function") node.select();
  }

  function cssEscape(value) {
    return window.CSS && typeof window.CSS.escape === "function" ? window.CSS.escape(value) : String(value).replace(/["\\]/g, "\\$&");
  }

  /* ---------- Feedback ---------- */

  function showFieldError(input, node, message) {
    node.textContent = message;
    node.hidden = false;
    input.setAttribute("aria-invalid", "true");
  }

  function clearFieldError(input, node) {
    node.textContent = "";
    node.hidden = true;
    input.removeAttribute("aria-invalid");
  }

  let announceTimer = 0;
  function announce(message) {
    // Clearing first makes repeated identical messages announce again.
    el.announcer.textContent = "";
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
      el.announcer.textContent = message;
    }, 50);
  }

  /* ---------- Events ---------- */

  function bindEvents() {
    el.form.addEventListener("submit", addTask);
    el.title.addEventListener("input", () => {
      if (!el.error.hidden && Model.cleanTitle(el.title.value)) clearFieldError(el.title, el.error);
      el.hint.hidden = true;
    });

    for (const radio of el.statusRadios) {
      radio.addEventListener("change", () => {
        if (radio.checked) setView({ status: radio.value });
      });
    }
    el.priorityFilter.addEventListener("change", () => setView({ priority: el.priorityFilter.value }));
    el.emptyReset.addEventListener("click", () => {
      setView({ status: "all", priority: "all" });
      applyFocus({ kind: "heading" });
    });

    // One set of listeners for every task row.
    el.list.addEventListener("change", (event) => {
      const target = event.target;
      if (target.dataset.role === "toggle") toggleTask(target.dataset.id, target.checked);
      else if (target.dataset.role === "edit-priority" && state.editing) state.editing.priority = target.value;
    });
    el.list.addEventListener("input", (event) => {
      const target = event.target;
      if (target.dataset.role !== "edit-title" || !state.editing) return;
      state.editing.title = target.value;
      if (state.editing.error && Model.cleanTitle(target.value)) {
        state.editing.error = "";
        const error = target.closest("form").querySelector('[data-role="edit-error"]');
        clearFieldError(target, error);
      }
    });
    el.list.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || !el.list.contains(button)) return;
      const id = button.dataset.id;
      if (button.dataset.role === "edit") {
        if (state.editing && state.editing.id !== id) state.editing = null;
        startEdit(id);
      } else if (button.dataset.role === "delete") deleteTask(id);
      else if (button.dataset.role === "cancel") cancelEdit();
    });
    el.list.addEventListener("submit", (event) => {
      event.preventDefault();
      saveEdit();
    });
    el.list.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.editing && event.target.closest(".edit-form")) {
        event.preventDefault();
        cancelEdit();
      }
    });

    el.loadNoticeDismiss.addEventListener("click", () => {
      el.loadNotice.hidden = true;
      el.title.focus();
    });

    el.undoButton.addEventListener("click", undoDelete);
    el.undoClose.addEventListener("click", () => {
      clearUndo();
      el.title.focus();
    });
    el.undoBar.addEventListener("mouseenter", pauseUndoExpiry);
    el.undoBar.addEventListener("mouseleave", scheduleUndoExpiry);
    el.undoBar.addEventListener("focusin", pauseUndoExpiry);
    el.undoBar.addEventListener("focusout", (event) => {
      if (!el.undoBar.contains(event.relatedTarget)) scheduleUndoExpiry();
    });

    // Keep several open tabs in step instead of overwriting each other.
    window.addEventListener("storage", (event) => {
      if (event.key === TASKS_KEY) {
        const result = Model.parseStored(event.newValue);
        if (result.status === "corrupt") return;
        state.tasks = result.tasks;
        render(null);
      } else if (event.key === VIEW_KEY) {
        try {
          state.view = Model.normalizeView(JSON.parse(event.newValue || "null"));
        } catch {
          return;
        }
        render(null);
      }
    });
  }

  /* ---------- Start ---------- */

  loadInitialState();
  bindEvents();
  render(null);
  document.documentElement.dataset.ready = "true";
})();
