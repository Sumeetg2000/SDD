# Research: Tracker — Initial Page Setup

**Feature**: 001-tracker-initial-setup
**Date**: 2026-05-05
**Status**: Complete — no NEEDS CLARIFICATION items remain

---

## Decision 1: Tailwind CSS v4 with `@theme` for Pastel Colours

**Decision**: Install `tailwindcss@^4` and `@tailwindcss/vite`. Define a pastel colour palette using the `@theme` block in `src/styles/globals.css`. Reference tokens as `bg-pastel-mint`, `bg-pastel-peach`, etc. via Tailwind's CSS variable bridge.

**Rationale**: Tailwind v4 ships a new first-party Vite plugin (`@tailwindcss/vite`) that replaces the old PostCSS-based setup. The `@theme` block is the v4 way to declare design tokens as CSS custom properties; it integrates cleanly with Tailwind's JIT engine and generates utility classes automatically from declared tokens. No `tailwind.config.ts` file is needed for v4 — configuration moves into CSS.

**Pastel token palette** (proposed for `@theme`):
```css
@theme {
  --color-pastel-mint: #d4f1e4;
  --color-pastel-peach: #fde8d8;
  --color-pastel-lavender: #e8e0f7;
  --color-pastel-sky: #d6eeff;
  --color-pastel-lemon: #fef9c3;
  --color-pastel-rose: #fce4ec;
  --color-surface: #fafafa;
  --color-surface-card: #ffffff;
  --color-text-primary: #1a1a2e;
  --color-text-muted: #6b7280;
  --color-urgent: #fde8d8;      /* peach — used for ≤7 days highlight */
  --color-urgent-border: #f97316;
}
```

**Alternatives considered**:
- Tailwind v3 with `tailwind.config.ts` `extend.colors` — rejected: v4 is the current major version and the user explicitly requested `@theme` syntax.
- Inline CSS variables without Tailwind — rejected: loses utility class generation and responsive modifiers.

---

## Decision 2: Ant Design v5 — Modal, Button, Checkbox Usage

**Decision**: Use `antd@^5`. Import only the three components needed: `Modal`, `Button`, `Checkbox`. Wrap `App` in Ant Design's `<ConfigProvider>` with a minimal theme override to neutralise Ant Design's default blue brand colour and substitute the pastel palette.

**Rationale**: Ant Design v5 uses a CSS-in-JS token system (`theme.token`) that can be overridden via `<ConfigProvider theme={{ token: { ... } }}>` without a separate CSS import. This avoids shipping Ant Design's full CSS bundle. The three required components cover: accessible modal with focus trap + Escape key + scroll lock (`Modal`), styled interactive buttons (`Button`), and labelled checkbox with indeterminate state support (`Checkbox`).

**Key API notes**:
- `Modal`: use `open` prop (not `visible`), `onOk`/`onCancel`, `footer={null}` to supply custom form buttons.
- `Checkbox`: `checked` + `onChange` for controlled use.
- `Button`: `type="primary"` / `type="default"` / `danger` variants available.
- Tree-shaking: Ant Design v5 supports partial imports via named exports from `antd`; no babel plugin needed with Vite.

**Alternatives considered**:
- Radix UI Primitives — rejected: requires more assembly work for Modal; Ant Design ships complete, production-tested accessible components.
- Native HTML `<dialog>` — rejected: browser support for `dialog.showModal()` is inconsistent pre-2023; polyfill adds complexity; no built-in focus trap in older Safari.
- Headless UI — rejected: same assembly effort as Radix; Ant Design is simpler for this scope.

---

## Decision 3: date-fns v4 — Day-Difference and Formatting

**Decision**: Use `date-fns@^4`. Import only two functions: `differenceInCalendarDays` (days remaining calculation) and `parseISO` (safe ISO string → Date conversion).

**Rationale**: `differenceInCalendarDays(dateLeft, dateRight)` computes the number of calendar days between two dates correctly across DST boundaries. It counts from midnight to midnight, which is exactly the "whole calendar day" requirement in the spec. The naive `(endDate - today) / 86400000` formula loses accuracy around DST transitions (clocks shifting ±1 hour introduces fractional days).

**Usage pattern**:
```ts
import { differenceInCalendarDays, parseISO } from 'date-fns';

function daysRemaining(endDateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInCalendarDays(parseISO(endDateIso), today);
}
```
- Positive result → days remaining
- Zero → due today (highlight)
- Negative → overdue (highlight)

**Alternatives considered**:
- Native `Date` arithmetic — rejected: DST edge cases produce off-by-one on day boundaries; reliable implementation requires same amount of code as importing date-fns.
- Temporal API — rejected: not yet available in all target browsers without polyfill; polyfill would be a larger dependency than date-fns.
- Luxon / Day.js — rejected: Luxon is heavier than date-fns for two functions; Day.js v2 has similar bundle size to date-fns but worse tree-shaking.

---

## Decision 4: localStorage Persistence Pattern

**Decision**: Implement two pure utility functions in `storageUtils.ts`: `loadGoals(): Goal[]` and `saveGoals(goals: Goal[]): void`. Call `loadGoals()` as the initial state value in `useGoals`. Sync via `useEffect` that runs whenever the `goals` array changes.

**Rationale**: Co-locating load/save in a utility file keeps `useGoals` clean and makes the storage layer independently replaceable (swap to `sessionStorage` or `IndexedDB` without changing the hook). Using `useEffect` for sync (rather than calling `saveGoals` inside each action) ensures a single write path regardless of how state changes.

**Error handling**: Wrap `localStorage.getItem` in a try/catch; return `[]` on parse errors. Wrap `localStorage.setItem` in try/catch; log a console warning on failure (e.g. storage quota exceeded) without crashing.

**Key**: `tracker_goals` (string constant defined once in `storageUtils.ts`).

**Alternatives considered**:
- `useSyncExternalStore` with a localStorage adapter — rejected: over-engineered for a single-user, single-tab app; no cross-tab sync needed.
- React Context + Provider — rejected: one hook consumed in one component (`App.tsx`) needs no context; direct hook call is simpler.
- IndexedDB — rejected: async API adds complexity; localStorage is sufficient for < 100 goals.

---

## Decision 5: Goal ID Strategy

**Decision**: Use `crypto.randomUUID()` to generate goal IDs on creation. This is a browser-native API, available in all modern browsers, and requires no dependency.

**Rationale**: UUIDs are collision-resistant across sessions and across future multi-tab scenarios. `crypto.randomUUID()` is synchronous, zero-dependency, and available in all target browsers (Chrome 92+, Firefox 95+, Safari 15.4+).

**Alternatives considered**:
- Timestamp-based IDs (`Date.now().toString()`) — rejected: collides if two goals are created in the same millisecond.
- Sequential integers — rejected: fragile if goals are deleted; requires tracking the current max ID.
- `uuid` npm package — rejected: `crypto.randomUUID()` covers the need without an extra dependency.
