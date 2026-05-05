# localStorage Schema: Tracker — Initial Page Setup

**Feature**: 001-tracker-initial-setup
**Date**: 2026-05-05
**Source**: [data-model.md](../data-model.md)

---

## Storage Key

```
tracker_goals
```

Single key, single value. All goal data lives in one array.

---

## Value Format

**Type**: JSON string — deserialised to `Goal[]`

**Schema version**: 1 (implicit — no version field in v1; add `_schemaVersion` in a future migration if the shape changes)

```ts
type StoredGoals = Goal[];
```

Where `Goal` is:

```ts
{
  id: string;          // UUID v4, e.g. "550e8400-e29b-41d4-a716-446655440000"
  title: string;       // Non-empty, ≤ 200 chars
  endDate: string;     // ISO date "YYYY-MM-DD"
  status: "active" | "completed";
  createdAt: string;   // ISO date "YYYY-MM-DD"
  completedAt: string | null;  // ISO date "YYYY-MM-DD" or null
}
```

---

## Example Payload

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Run a 5K",
    "endDate": "2026-06-01",
    "status": "active",
    "createdAt": "2026-05-01",
    "completedAt": null
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "title": "Read Clean Code",
    "endDate": "2026-04-30",
    "status": "completed",
    "createdAt": "2026-03-15",
    "completedAt": "2026-04-28"
  }
]
```

---

## Read / Write Contract

### Read (`loadGoals`)

```ts
function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem('tracker_goals');
    if (!raw) return [];
    return JSON.parse(raw) as Goal[];
  } catch {
    return [];
  }
}
```

- **On missing key**: return `[]`
- **On JSON parse error**: return `[]` (treat as empty; will be overwritten on next save)
- **On SecurityError** (private browsing quota): return `[]`

### Write (`saveGoals`)

```ts
function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem('tracker_goals', JSON.stringify(goals));
  } catch (error) {
    console.warn('[Tracker] Failed to save goals to localStorage:', error);
  }
}
```

- **On QuotaExceededError**: log warning, do not crash — user sees current state in memory until reload
- **On SecurityError**: same handling

---

## Invariants

1. Every object in the array MUST have all six fields — partial objects are invalid.
2. `status === 'completed'` ⟹ `completedAt !== null`
3. `status === 'active'` ⟹ `completedAt === null`
4. `id` values MUST be unique within the array.
5. Date strings MUST be in `YYYY-MM-DD` format (no time component, no timezone offset).

These invariants are maintained by `useGoals` — they are not re-validated on read (no schema migration layer in v1).
