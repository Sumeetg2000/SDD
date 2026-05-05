# Implementation Plan: Tracker — Initial Page Setup

**Branch**: `001-tracker-initial-setup` | **Date**: 2026-05-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-tracker-initial-setup/spec.md`

## Summary

Build the initial page of **Tracker**, a client-side goal-tracking web app. The page renders two columns — active goals (left, sorted newest-first, with urgency highlighting for ≤7 days remaining) and completed goals (right, sorted most-recently-completed-first). Users can add goals via a modal form, mark active goals with a checkbox to reveal complete/delete actions, and delete completed goals. All data persists in `localStorage`. Implemented as a React + TypeScript + Tailwind CSS v4 SPA using Ant Design for accessible UI primitives and date-fns for date arithmetic.

## Technical Context

**Language/Version**: TypeScript ~6.0 (strict mode)
**Primary Dependencies**: React ^19, Tailwind CSS ^4 (via `@tailwindcss/vite`), Ant Design ^5, date-fns ^4
**Storage**: Browser `localStorage` — JSON-serialised goal array, single key `tracker_goals`
**Testing**: No test setup for this feature (excluded per requirements)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge); single-page, client-only
**Project Type**: Web application (SPA)
**Performance Goals**: Instant render on load (no async data fetching); < 5 ms localStorage read/write
**Constraints**: Offline-capable (pure client); no backend; no routing; no auth
**Scale/Scope**: Single user; expected < 100 goals total; single screen

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Clean Code** — TypeScript strict mode configured; `any` forbidden; feature-based
  folder structure; single-responsibility components; pure utility functions in `.ts` files.
- [x] **II. Simple UX** — One primary action per viewport (Add Goal); all states handled
  (empty columns, inline form validation, urgency highlight); user flows ≤ 2 interactions
  to complete/delete.
- [x] **III. Responsive Design** — Mobile-first Tailwind breakpoints; stacked → side-by-side
  at `md:`; touch targets ≥ 44 × 44 px on all buttons; verified at 320/768/1280 px.
- [⚠️] **IV. Minimal Dependencies** — **Two additional runtime packages** (Ant Design,
  date-fns) beyond the React + Tailwind baseline. Justified in Complexity Tracking below.

## Project Structure

### Documentation (this feature)

```text
specs/001-tracker-initial-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── component-interfaces.md
│   └── localstorage-schema.md
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── features/
│   └── goals/
│       ├── components/
│       │   ├── GoalCard.tsx           # Active goal row: checkbox, title, days remaining, action buttons
│       │   ├── CompletedGoalCard.tsx  # Completed goal row: title + delete button
│       │   ├── GoalColumn.tsx         # Column shell: header, empty state, scrollable list
│       │   ├── AddGoalModal.tsx       # Ant Design Modal wrapper; delegates form to GoalForm
│       │   └── GoalForm.tsx           # Controlled form: title input + date picker + inline errors
│       ├── hooks/
│       │   └── useGoals.ts            # All goal state, localStorage sync, and action callbacks
│       ├── types/
│       │   └── goal.ts                # Goal interface, GoalStatus type
│       └── utils/
│           ├── dateUtils.ts           # daysRemaining(), isUrgent(), formatDaysLabel()
│           └── storageUtils.ts        # loadGoals(), saveGoals()
├── styles/
│   └── globals.css                    # @import "tailwindcss"; @theme { pastel tokens }
├── App.tsx                            # Layout only: page header + two <GoalColumn> instances
└── main.tsx                           # Vite entry point; mounts <App>

index.html                             # Vite HTML entry
vite.config.ts                         # @tailwindcss/vite plugin
```

**Structure Decision**: Feature-based layout under `src/features/goals/`. `App.tsx` is layout-only. All goal logic is co-located in one feature folder, making the entire feature portable. No shared mutable state across files — everything flows from `useGoals`.

## Data Flow

```
useGoals (state + actions)
  │
  ├─► App.tsx (layout host)
  │     ├─► GoalColumn [active]
  │     │     └─► GoalCard[]        ← receives goal + callbacks (onToggleCheck, onComplete, onDelete)
  │     ├─► GoalColumn [completed]
  │     │     └─► CompletedGoalCard[] ← receives goal + onDelete callback
  │     └─► AddGoalModal            ← receives isOpen + onSubmit + onClose callbacks
  │           └─► GoalForm          ← receives onSubmit + onClose; manages local form state only
  │
  └─► localStorage (synced via useEffect on goals state change)
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| **Ant Design** (extra runtime dep) | Provides accessible Modal, Button, Checkbox with keyboard/ARIA support out-of-the-box | Building an accessible modal from scratch (focus trap, Escape key, scroll lock, ARIA roles) is ~200 lines of non-trivial code; checkbox + button accessibility also requires careful ARIA handling |
| **date-fns** (extra runtime dep) | `differenceInCalendarDays` handles timezone-safe whole-day diff correctly | `Math.round((endDate - today) / 86400000)` fails around DST transitions and produces off-by-one errors at midnight; building a reliable replacement is more complex than importing one function |
