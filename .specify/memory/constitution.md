<!--
SYNC IMPACT REPORT
==================
Version change: [PLACEHOLDER] → 1.0.0 (initial constitution — all placeholders filled)
Modified principles: N/A (first ratification)
Added sections: Core Principles (4), Technology Stack, Development Workflow, Governance
Removed sections: N/A
Templates updated:
  ✅ .specify/memory/constitution.md (this file)
  ✅ .specify/templates/plan-template.md (Constitution Check gates aligned)
  ✅ .specify/templates/spec-template.md (requirements section note aligned)
  ✅ .specify/templates/tasks-template.md (phase notes aligned)
Deferred TODOs: none
-->

# SDD Constitution

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)

Every file, function, and component MUST be readable, intentional, and maintainable.
Rules:
- Functions MUST do one thing; files MUST have one clear responsibility.
- Names MUST be descriptive and self-documenting — abbreviations are forbidden.
- Dead code, commented-out code, and unused imports MUST be removed before merge.
- Nesting depth MUST NOT exceed three levels; extract early-return guards or helper
  functions to enforce this.
- TypeScript strict mode MUST be enabled; `any` is forbidden unless justified in a comment.

**Rationale**: Code is read far more often than it is written. Unclear code creates bugs,
slows onboarding, and erodes long-term maintainability.

### II. Simple UX

Every user-facing interaction MUST be intuitive without documentation or tooltips.
Rules:
- Screens MUST NOT contain more than one primary action per viewport.
- User flows MUST be completable in the fewest possible steps; unnecessary steps
  MUST be eliminated.
- Error messages MUST state what happened and what the user should do next,
  in plain language.
- Loading and empty states MUST always be handled visibly.
- No feature may be added solely because it is technically possible; every feature
  MUST solve a named user problem.

**Rationale**: A simple, focused UX reduces cognitive load, increases task completion
rates, and lowers support burden.

### III. Responsive Design

The application MUST work correctly and look polished on mobile (≥320 px),
tablet (≥768 px), and desktop (≥1280 px) viewports.
Rules:
- Tailwind CSS utility classes MUST be used for all layout and spacing; custom CSS
  is only permitted for animations or browser-quirk workarounds.
- Mobile-first breakpoints (`sm:`, `md:`, `lg:`) MUST be used; desktop-only styles
  are never the base style.
- Touch targets MUST be ≥44 × 44 px on mobile.
- Images and media MUST use responsive sizing (`w-full`, `max-w-*`, or `<picture>`).
- Every new UI component MUST be visually verified at all three breakpoints before
  it is considered done.

**Rationale**: A majority of users access web applications on mobile devices.
Responsive design is a baseline expectation, not an enhancement.

### IV. Minimal Dependencies

The dependency footprint MUST be kept as small as possible.
Rules:
- The mandatory runtime dependencies are React and Tailwind CSS ONLY.
  Any additional runtime package MUST be approved by a principle amendment.
- Before adding a new package, the team MUST confirm that the feature cannot be
  implemented with reasonable effort using existing dependencies or browser APIs.
- All dependencies MUST be actively maintained (last release ≤ 18 months).
- Dev-only tooling (Vite, TypeScript, ESLint) is exempt from approval but MUST NOT
  appear in `dependencies` (only in `devDependencies`).
- Package versions MUST be pinned to minor range (`^X.Y.Z`) in `package.json`.

**Rationale**: Each added dependency is a surface area for security vulnerabilities,
breaking changes, and bundle size growth. Lean dependencies reduce risk.

## Technology Stack

The following stack is MANDATORY and cannot be changed without a constitution amendment:

| Layer | Technology | Version constraint |
|-------|------------|--------------------|
| UI Framework | React | `^19` |
| Styling | Tailwind CSS | `^3` or `^4` |
| Language | TypeScript (strict) | `~6` |
| Build tool | Vite | `^8` |
| Linting | ESLint + typescript-eslint | current |

All source code MUST reside under `src/`. Components MUST be `.tsx` files.
Utility/pure functions MUST be `.ts` files with no JSX.

## Development Workflow

1. Every feature MUST start from a spec (`spec.md`) before any code is written.
2. A Constitution Check gate in `plan.md` MUST be completed before Phase 0 research.
3. UI components MUST be reviewed at all three responsive breakpoints before the
   task is marked done.
4. ESLint MUST pass (`npm run lint`) with zero errors before any commit is merged.
5. The TypeScript build MUST pass (`npm run build`) with zero errors before merge.
6. Dependency additions MUST be discussed as a constitution amendment proposal and
   documented in a PR description before the package is installed.

## Governance

This constitution supersedes all other project practices, style guides, and verbal
agreements. Any conflict defaults to the constitution.

Amendment procedure:
1. Open a PR with the proposed change to this file.
2. State the version bump type (MAJOR / MINOR / PATCH) and rationale.
3. Update `LAST_AMENDED_DATE` and `CONSTITUTION_VERSION` in the footer.
4. All open plan.md and tasks.md files MUST be re-checked against the new version
   before implementation continues.

Versioning policy (semantic):
- MAJOR: A principle is removed, renamed, or its rules become incompatible with
  existing code.
- MINOR: A new principle or section is added, or existing guidance is materially
  expanded.
- PATCH: Wording clarifications, typo fixes, non-semantic refinements.

All PRs/reviews MUST include a Constitution Check section confirming compliance
with Principles I–IV. Complexity that cannot be justified against these principles
MUST NOT be merged.

**Version**: 1.0.0 | **Ratified**: 2026-05-05 | **Last Amended**: 2026-05-05

---

## Deferred Amendments

The following dependency additions were approved informally as part of feature `001-tracker-initial-setup` and are recorded here pending a formal PR amendment.
They MUST be formalised as a MINOR amendment (→ v1.1.0) before the feature branch is merged.

| Package | Type | Justification | Approved in |
|---------|------|---------------|-------------|
| `antd` ^5 | Runtime | Accessible Modal (focus trap, Escape, scroll lock, ARIA) is ~200 lines from scratch; Ant Design ships production-tested components | plan.md Complexity Tracking, feature 001 |
| `date-fns` ^4 | Runtime | `differenceInCalendarDays` handles DST-safe whole-day diff; naive `Date` arithmetic fails around DST transitions | plan.md Complexity Tracking, feature 001 |
