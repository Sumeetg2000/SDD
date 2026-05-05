---
description: "Task list for Tracker — Initial Page Setup"
---

# Tasks: Tracker — Initial Page Setup

**Input**: Design documents from `/specs/001-tracker-initial-setup/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to
- Exact file paths are included in every description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, configure build tooling, create folder structure, and establish the pastel theme — prerequisites for all stories.

> **Constitution Check (SDD v1.0.0)**: Confirm React + Tailwind CSS stack, TypeScript
> strict mode, ESLint passing, and mobile-first Tailwind config before any feature work.

- [ ] T001 Install runtime dependencies: `npm install antd date-fns` and dev dependency: `npm install -D tailwindcss @tailwindcss/vite`
- [ ] T002 Update `vite.config.ts` — add `@tailwindcss/vite` plugin import and register it alongside `@vitejs/plugin-react`
- [ ] T003 Create `src/styles/globals.css` — add `@import "tailwindcss"` and `@theme` block with all pastel colour tokens: `--color-pastel-mint`, `--color-pastel-peach`, `--color-pastel-lavender`, `--color-pastel-sky`, `--color-pastel-lemon`, `--color-pastel-rose`, `--color-surface`, `--color-surface-card`, `--color-text-primary`, `--color-text-muted`, `--color-urgent`, `--color-urgent-border`
- [ ] T004 Update `src/main.tsx` — replace default CSS import with `import './styles/globals.css'` and wrap `<App />` in Ant Design `<ConfigProvider>` with neutral theme token overrides (set `colorPrimary` to a pastel accent)
- [ ] T005 Create feature folder structure: `src/features/goals/components/`, `src/features/goals/hooks/`, `src/features/goals/types/`, `src/features/goals/utils/`
- [ ] T006 Verify `tsconfig.app.json` has `"strict": true`. If missing, add it. Run `npm run build` to confirm no new errors. Include in Phase 1 setup commit — no separate commit needed.

**Checkpoint**: `npm run dev` starts without errors; Tailwind classes from `@theme` tokens are available; Ant Design renders without styling conflicts.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, utility functions, and the state hook that ALL user stories depend on. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: `useGoals` must be complete before any component is built.

- [ ] T007 Create `src/features/goals/types/goal.ts` — define `GoalStatus` type (`'active' | 'completed'`) and `Goal` interface with fields: `id`, `title`, `endDate`, `status`, `createdAt`, `completedAt` per data-model.md specification
- [ ] T008 [P] Create `src/features/goals/utils/storageUtils.ts` — implement `loadGoals(): Goal[]` (try/catch `localStorage.getItem('tracker_goals')`, return `[]` on failure) and `saveGoals(goals: Goal[]): void` (try/catch `localStorage.setItem`, `console.warn` on failure)
- [ ] T009 [P] Create `src/features/goals/utils/dateUtils.ts` — implement `daysRemaining(endDateIso: string): number` using `differenceInCalendarDays` + `parseISO` from date-fns; `isUrgent(endDateIso: string): boolean` (returns `daysRemaining <= 7`); `formatDaysLabel(days: number): string` (positive/zero/negative cases); `todayIso(): string` (returns `new Date().toISOString().slice(0, 10)`)
- [ ] T010 Create `src/features/goals/hooks/useGoals.ts` — implement full hook: initialise state from `loadGoals()`; `useEffect` to sync `saveGoals` on every `goals` change; expose `activeGoals` (filtered + sorted by `createdAt` desc), `completedGoals` (filtered + sorted by `completedAt` desc), `checkedIds: Set<string>`, `isModalOpen: boolean`, and all action callbacks: `toggleChecked`, `completeGoal` (sets `status: 'completed'` + `completedAt: todayIso()` AND removes the goal's id from `checkedIds`), `deleteGoal`, `openModal`, `closeModal`, `addGoal` — per contracts/component-interfaces.md

**Checkpoint**: `useGoals` can be instantiated; `addGoal` adds to `activeGoals`; `completeGoal` moves to `completedGoals`; `deleteGoal` removes; `saveGoals`/`loadGoals` round-trip correctly in browser console.

---

## Phase 3: User Story 1 — View Active Goals and Track Progress (Priority: P1) 🎯 MVP

**Goal**: Render the two-column layout with active goals (title + days-remaining label + urgency highlight) and completed goals (title only) from pre-seeded data. Both columns have empty states. Columns scroll independently.

**Independent Test**: Manually seed goals into `localStorage` key `tracker_goals` (one with 30 days, one with 5 days, one overdue). Reload the app. Verify left column shows all three, 5-day and overdue goals are highlighted, 30-day is not. Clear storage and reload — verify empty state messages appear in both columns.

- [ ] T011 [US1] Create `src/features/goals/components/GoalColumn.tsx` — presentational component accepting `title`, `headerAction?: React.ReactNode`, `children`, `emptyMessage`, `isEmpty` props; renders column header (title + headerAction), scrollable list container (`overflow-y-auto` with `max-h-[calc(100vh-180px)]`), or empty state `<p>` when `isEmpty` is true; mobile-first full-width, `md:` half-width layout
- [ ] T012 [P] [US1] Create `src/features/goals/components/GoalCard.tsx` — presentational component accepting `goal: Goal`, `isChecked: boolean`, `onToggleCheck`, `onComplete`, `onDelete` props; renders Ant Design `Checkbox`, `goal.title` (truncate with `truncate` class for long titles), `formatDaysLabel(daysRemaining(goal.endDate))` days label; applies `bg-urgent border-urgent-border` Tailwind classes when `isUrgent(goal.endDate)` is true; **do not add action buttons in this task** — action buttons are added in T018 (Phase 5)
- [ ] T013 [P] [US1] Create `src/features/goals/components/CompletedGoalCard.tsx` — presentational component accepting `goal: Goal`, `onDelete: (id: string) => void` props; renders `goal.title` and Ant Design `Button` danger variant labelled "Delete" with `min-h-[44px]` for mobile touch target compliance; no checkbox, no days label
- [ ] T014 [US1] Update `src/App.tsx` — consume `useGoals()`; render page header with app name "Tracker"; render two `<GoalColumn>` instances side-by-side (`flex flex-col md:flex-row gap-6`): left column maps `activeGoals` to `<GoalCard>` with correct callbacks, right column maps `completedGoals` to `<CompletedGoalCard>` with `deleteGoal` callback; pass `isEmpty` and `emptyMessage` props to each column

**Checkpoint (US1 independent test)**: Seed localStorage with `tracker_goals` JSON containing goals at 30-day, 5-day, and overdue dates. Open app at 320 px, 768 px, and 1280 px. Verify: correct column layout at each breakpoint; urgency highlights on ≤7-day goals; days labels correct; empty state messages show when storage is cleared.

---

## Phase 4: User Story 2 — Add a New Goal via Modal (Priority: P2)

**Goal**: "Add Goal" button at the top of the active column opens a modal with title + end date fields. Validated submission creates a new goal and closes the modal.

**Independent Test**: Click "Add Goal". Fill title "Learn Rust" and a future end date. Submit. Verify goal appears top of active column with correct days label. Click "Add Goal" again, leave title blank, submit — verify inline error shown, modal stays open. Press Escape — verify modal closes. Reload — verify goal persisted.

- [ ] T015 [US2] Create `src/features/goals/components/GoalForm.tsx` — controlled form with local state (`title: string`, `endDate: string`, `errors: { title?: string; endDate?: string }`); validates: title non-empty + ≤200 chars, endDate ≥ today (`todayIso()`); on valid submit calls `onSubmit(title, endDate)` and resets local state; on cancel calls `onClose`; renders Ant Design-styled label+input for title (with inline error), label+date input for endDate (min=todayIso(), with inline error), "Save" primary button and "Cancel" default button both with `min-h-[44px]` for mobile touch target compliance
- [ ] T016 [US2] Create `src/features/goals/components/AddGoalModal.tsx` — wraps Ant Design `Modal` with `open={isOpen}`, `onCancel={onClose}`, `footer={null}`, `destroyOnClose` title "Add New Goal"; renders `<GoalForm onSubmit={onSubmit} onClose={onClose} />` inside; passes through `isOpen`, `onClose`, `onSubmit` props
- [ ] T017 [US2] Update `src/App.tsx` — add `<AddGoalModal isOpen={isModalOpen} onClose={closeModal} onSubmit={addGoal} />`; pass `openModal` to the active `GoalColumn` `headerAction` prop as an Ant Design `Button` labelled "+ Add Goal"

**Checkpoint (US2 independent test)**: Click "+ Add Goal" — modal opens. Submit empty form — inline title error visible. Submit past date — inline date error visible. Fill valid title + future date, submit — modal closes, new goal appears at top of active column with correct days label. Reload — goal still present.

---

## Phase 5: User Story 3 — Complete or Delete a Goal (Priority: P3)

**Goal**: Checkbox on active goal reveals "Move to Completed" and "Delete" inline actions. Both actions work correctly and persist. Completed column Delete button removes completed goals.

**Independent Test**: Check a goal's checkbox — verify action buttons appear. Click "Move to Completed" — goal moves to right column. Check another goal, click "Delete" — goal disappears entirely. Uncheck a goal before acting — buttons disappear. Click "Delete" on a completed goal — it disappears. Reload after each action — verify state persisted correctly.

- [ ] T018 [US3] Update `src/features/goals/components/GoalCard.tsx` — add conditional rendering of "Move to Completed" (Ant Design `Button` default) and "Delete" (Ant Design `Button` danger) when `isChecked` is true; both buttons call their respective props (`onComplete(goal.id)`, `onDelete(goal.id)`); ensure both buttons have min-height ≥ 44px for mobile touch targets (`min-h-[44px]`)
- [ ] T019 [P] [US3] Confirm & complete `useGoals.ts` `completeGoal` action — acceptance criteria: (a) goal moves from `activeGoals` to top of `completedGoals`; (b) `completedAt` is set to `todayIso()`; (c) goal's id is removed from `checkedIds` so action buttons disappear; (d) `saveGoals` is called via `useEffect` — reload and confirm goal appears in completed column
- [ ] T020 [P] [US3] Confirm & complete `useGoals.ts` `deleteGoal` action — acceptance criteria: (a) goal is removed from the array regardless of status; (b) goal's id is removed from `checkedIds`; (c) `saveGoals` is called via `useEffect` — reload and confirm goal is gone from both columns

**Checkpoint (US3 independent test)**: Full interaction test — check → complete, check → delete, uncheck (cancel), delete completed goal. After each action: verify visual state, then reload to verify persistence. All scenarios pass with no console errors.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive verification at all breakpoints, pastel theme consistency, title truncation, and final lint/build pass.

- [ ] T021 Verify responsive layout at 320 px — active column stacked on top, completed below; no overflow or clipped elements; "+ Add Goal" button touch target ≥ 44 × 44 px; column scrolls independently
- [ ] T022 [P] Verify responsive layout at 768 px (tablet) — columns displayed side-by-side; widths equal; header actions visible; modal renders correctly and is not clipped
- [ ] T023 [P] Verify responsive layout at 1280 px (desktop) — columns displayed side-by-side; correct max-height scroll behaviour; urgency highlight colours consistent with `@theme` tokens
- [ ] T024 [P] Verify pastel theme consistency — `GoalCard` uses `bg-pastel-mint` or `bg-surface-card` base; urgency highlight uses `bg-urgent border-urgent-border`; `CompletedGoalCard` uses a distinct pastel (e.g. `bg-pastel-lavender`); `AddGoalModal` background uses `bg-surface`; `App` page background uses `bg-surface`
- [ ] T025 [P] Verify title truncation — add a goal with a title > 60 characters; confirm it truncates with ellipsis in `GoalCard` and `CompletedGoalCard` without breaking column layout
- [ ] T026 Run `npm run lint` — fix all ESLint errors until exit code 0; no `any` types, no unused imports, no dead code
- [ ] T027 Run `npm run build` — fix all TypeScript errors until exit code 0; confirm `dist/` output is generated

---

## Dependencies Graph

```
Phase 1 (Setup)
  └─► Phase 2 (Foundational: types + utils + useGoals)
        └─► Phase 3 (US1: GoalColumn + GoalCard + CompletedGoalCard + App layout)  ← MVP
              └─► Phase 4 (US2: GoalForm + AddGoalModal + App modal wiring)
                    └─► Phase 5 (US3: GoalCard actions + useGoals action verification)
                          └─► Phase 6 (Polish + lint + build)
```

**Story independence**: US2 and US3 share `GoalCard` (US1 creates it, US3 extends it). US3 extends US2's work. Each story phase independently adds testable value on top of the prior phase.

---

## Parallel Execution Opportunities

### Within Phase 2 (after T007):
- T008 (storageUtils) ‖ T009 (dateUtils) — different files, no inter-dependency

### Within Phase 3 (after T011):
- T012 (GoalCard) ‖ T013 (CompletedGoalCard) — different files, no inter-dependency

### Within Phase 5 (after T018):
- T019 (verify completeGoal) ‖ T020 (verify deleteGoal) — different action paths

### Within Phase 6 (after T021):
- T022 (768px) ‖ T023 (1280px) ‖ T024 (theme) ‖ T025 (truncation) — all verification, no code changes between them

---

## Implementation Strategy

**MVP scope** (deliver first): **Phase 1 + Phase 2 + Phase 3** — the read-only dashboard with seeded data delivers the core value (US1) and proves the data model, layout, and urgency highlighting work end-to-end.

**Increment 2**: Phase 4 (US2) — adds goal creation, making the app self-sufficient.

**Increment 3**: Phase 5 (US3) — adds complete/delete, completing the full CRUD lifecycle.

**Final**: Phase 6 — polish, responsive QA, lint, build.
