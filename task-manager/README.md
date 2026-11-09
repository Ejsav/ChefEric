# Tasks

A focused task manager in plain HTML, CSS and JavaScript. No framework, no build step, no network requests. Tasks are kept in the browser's `localStorage`.

## Use it

Open `index.html` in a browser. Double-clicking it works, and so does serving the folder from any static host.

- **Add** a task with a title and a priority (Low, Medium or High). Empty or whitespace-only titles are refused with a message under the field.
- **Edit** a task's title and priority in place. Enter saves, Escape cancels. Completion state and creation date are kept.
- **Complete** a task with its checkbox, or by clicking its title. Untick it to restore it to active.
- **Delete** removes a task straight away. An *Undo* bar puts it back where it was. The bar closes after 8 seconds, or stays open while the pointer or focus is on it.
- **Filter** by status (All, Active, Completed) and by priority. Both filters are remembered. Adding or editing a task never resets them, and the app says when a new task is hidden by the current filters.
- **Counts** for Total, Active and Completed sit in the header and on the status filter. They update on every change.

## Files

| File | Role |
|---|---|
| `index.html` | Semantic markup: the form, the filters, the list, the notices, and the row templates. |
| `styles.css` | Design tokens (light and dark), layout, components, the small-screen layout, reduced-motion and forced-colours rules. |
| `tasks.js` | The model. Pure functions with no DOM or storage access: validation, creating and updating tasks, filtering, counting, and parsing and repairing stored data. |
| `app.js` | State, persistence, rendering, focus management and events. Every change goes through `commit()`, which saves and re-renders the list, the filters and the counts together. |
| `tests/` | `model.test.mjs` (unit) and `app.test.mjs` (Playwright, in Chromium). |

## Data

Stored under `taskManager.tasks` as `{ "version": 1, "tasks": [...] }`. Each task:

```json
{
  "id": "4c1e…",
  "title": "Write proposal",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-11-09T10:00:00.000Z",
  "updatedAt": "2026-11-09T10:00:00.000Z",
  "completedAt": null
}
```

The filters are stored under `taskManager.view`.

## Reliability

- **Stable ids:** `crypto.randomUUID()`, with a fallback. Duplicate or missing ids in stored data are replaced on load.
- **Corrupted storage:** if the saved data can't be parsed, the list starts empty and a notice says so. The unreadable text is copied to `taskManager.tasks.unreadable`, so nothing is destroyed silently. Partly invalid data is repaired: bad entries are skipped and counted, an unknown priority becomes Medium, and a long title is shortened.
- **No storage:** if `localStorage` is blocked or a save fails (for example, when storage is full), the app keeps working for the session. A warning says changes may be lost, and it clears once a save succeeds.
- **Safe rendering:** task text is only ever set with `textContent`, so markup in a title is shown as text, never run.
- **No duplicates:** a second submit within 0.8 s of a successful add (a double click or a repeated Enter) is ignored. Adding the same title deliberately later is allowed.
- **Several tabs:** changes made in one tab appear in the others through the `storage` event, so one tab doesn't overwrite the other.

## Accessibility

Labelled controls. The status filter is a native radio group and works with the arrow keys. Errors are linked to their fields with `aria-describedby` and `aria-invalid`. A polite live region announces each action. Focus moves predictably after editing, completing and deleting. Every control has a visible focus outline, and there is a skip link. Priority is shown as a text label plus a 1–3 bar meter, so it never relies on colour alone. Completed tasks are struck through, muted and checked.

## Tests

```bash
npm run test:tasks
```

Run this from the repository root. It needs the repository's dev dependencies (`npm install`) and a Playwright Chromium (`npx playwright install chromium`). To use a Chromium installed somewhere else, set `PW_CHROMIUM_PATH=/path/to/chrome`.
