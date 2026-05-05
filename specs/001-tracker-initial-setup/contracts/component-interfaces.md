# Component Interfaces: Tracker — Initial Page Setup

**Feature**: 001-tracker-initial-setup
**Date**: 2026-05-05
**Source**: [plan.md](../plan.md) source tree + [data-model.md](../data-model.md)

All components are **purely presentational** — they receive data and callbacks via props and contain no business logic. All goal state and actions live in `useGoals`.

---

## `useGoals` Hook Interface

```ts
// src/features/goals/hooks/useGoals.ts

interface UseGoalsReturn {
  /** All active goals, sorted by createdAt descending */
  activeGoals: Goal[];
  /** All completed goals, sorted by completedAt descending */
  completedGoals: Goal[];
  /** IDs of currently checked active goals */
  checkedIds: Set<string>;
  /** Whether the Add Goal modal is open */
  isModalOpen: boolean;
  /** Toggle the checked state of an active goal */
  toggleChecked: (id: string) => void;
  /** Move an active goal to completed */
  completeGoal: (id: string) => void;
  /** Permanently delete a goal (active or completed) */
  deleteGoal: (id: string) => void;
  /** Open the Add Goal modal */
  openModal: () => void;
  /** Close the Add Goal modal */
  closeModal: () => void;
  /** Add a new goal (called on form submit) */
  addGoal: (title: string, endDate: string) => void;
}
```

---

## `App` Component

```tsx
// src/App.tsx — layout only, no props (root component)
// Consumes useGoals(); renders GoalColumn × 2 and AddGoalModal
```

No props — `App` is the root consumer of `useGoals`.

---

## `GoalColumn`

```tsx
// src/features/goals/components/GoalColumn.tsx

interface GoalColumnProps {
  /** Column heading text, e.g. "Active Goals" or "Completed Goals" */
  title: string;
  /** Content to render in the column header alongside the title (e.g. Add Goal button) */
  headerAction?: React.ReactNode;
  /** The list of goal cards to render inside the column */
  children: React.ReactNode;
  /** Shown when children list is empty */
  emptyMessage: string;
  /** Whether the children list is empty (drives empty state render) */
  isEmpty: boolean;
}
```

---

## `GoalCard`

```tsx
// src/features/goals/components/GoalCard.tsx

interface GoalCardProps {
  goal: Goal;
  isChecked: boolean;
  onToggleCheck: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**Rendering rules**:
- Always shows: `Checkbox`, `goal.title`, `formatDaysLabel(daysRemaining(goal.endDate))`
- When `isChecked`: shows "Move to Completed" and "Delete" action buttons
- When `isUrgent(goal.endDate)`: applies urgency highlight styling

---

## `CompletedGoalCard`

```tsx
// src/features/goals/components/CompletedGoalCard.tsx

interface CompletedGoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
}
```

**Rendering rules**:
- Shows: `goal.title` + "Delete" button
- No checkbox, no days-remaining label

---

## `AddGoalModal`

```tsx
// src/features/goals/components/AddGoalModal.tsx

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, endDate: string) => void;
}
```

**Responsibilities**: Wraps Ant Design `Modal`; renders `GoalForm` inside it. Passes `onSubmit` and `onClose` down to `GoalForm`. Resets form state when closed.

---

## `GoalForm`

```tsx
// src/features/goals/components/GoalForm.tsx

interface GoalFormProps {
  onSubmit: (title: string, endDate: string) => void;
  onClose: () => void;
}
```

**Responsibilities**: Manages local form state only (`title`, `endDate`, validation errors). Calls `onSubmit(title, endDate)` on successful validation. Calls `onClose` on Cancel.

**Validation** (local, not in hook):
- `title`: non-empty, ≤ 200 characters
- `endDate`: valid date string, ≥ today's date

---

## Utility Function Signatures

```ts
// src/features/goals/utils/dateUtils.ts

/** Returns number of whole calendar days between today and endDateIso.
 *  Positive = future, 0 = today, negative = overdue. */
export function daysRemaining(endDateIso: string): number;

/** Returns true if goal should be highlighted (≤ 7 days or overdue). */
export function isUrgent(endDateIso: string): boolean;

/** Returns a human-readable label for the days value. */
export function formatDaysLabel(days: number): string;

/** Returns today's date as an ISO date string 'YYYY-MM-DD'. */
export function todayIso(): string;
```

```ts
// src/features/goals/utils/storageUtils.ts

/** Loads goals from localStorage. Returns [] on failure or empty storage. */
export function loadGoals(): Goal[];

/** Serialises goals array to localStorage. Logs a warning on write failure. */
export function saveGoals(goals: Goal[]): void;
```
