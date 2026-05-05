# Feature Specification: Tracker — Initial Page Setup

**Feature Branch**: `001-tracker-initial-setup`
**Created**: 2026-05-05
**Status**: Clarified
**Input**: User description: "initial page setup - this application should be a goal tracking web app called 'tracker'. There should be two columns - a left one where current goals are shown, along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be 'checked' using a checkbox, and then either moved to the completed column or permanently deleted. To add new goals, user can click on a button to open a new goal form in modal (title and end date fields). Goals reaching their end date (within 7 days) are highlighted. Let's use modern light theme with fun pastel colours."

---

## Clarifications

### Session 2026-05-05

- Q: How should goals in the active column be sorted? → A: Creation date descending — newest goals at the top
- Q: Should deleting a goal require a confirmation step? → A: No — delete immediately on click
- Q: How should column overflow be handled when goals exceed visible height? → A: Each column scrolls independently within a fixed-height area
- Q: How should goals in the completed column be sorted? → A: Completion date descending — most recently completed at the top
- Q: On mobile stacked layout, which column appears first? → A: Active goals on top, completed goals below
- Q: Can users delete a goal from the completed column? → A: Yes — a Delete button is available on completed goals

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Active Goals and Track Progress (Priority: P1)

As a user, I open the Tracker app and immediately see all my active goals in the left column. Each goal displays its title and the number of days remaining until its end date. Goals that are 7 days or fewer away from their end date are visually highlighted to signal urgency. The right column shows all completed goals.

**Why this priority**: This is the core value proposition of the app — surfacing active goals and their deadlines at a glance. Without this, no other feature has meaning.

**Independent Test**: Open the app with pre-seeded goals at various deadlines. Verify the left column lists active goals with correct days-remaining counts. Verify goals within 7 days display with highlight styling. Verify the right column shows completed goals. This delivers standalone value as a read-only dashboard.

**Acceptance Scenarios**:

1. **Given** the app loads with three active goals (deadlines: 30 days, 5 days, 1 day away), **When** the user views the page, **Then** the left column shows all three goals, the 5-day and 1-day goals are highlighted, and the 30-day goal is not.
2. **Given** a goal's end date is exactly today, **When** the user views the page, **Then** days remaining shows "0 days" and the goal is highlighted.
3. **Given** no active goals exist, **When** the user views the page, **Then** the left column shows a friendly empty state message.
4. **Given** no completed goals exist, **When** the user views the right column, **Then** a friendly empty state message is shown.

---

### User Story 2 — Add a New Goal via Modal (Priority: P2)

As a user, I want to add a new goal by clicking an "Add Goal" button. This opens a modal form where I enter a title and an end date, then submit the form to see the goal appear in the active goals column.

**Why this priority**: Adding goals is the primary write action. Without it, the app cannot be populated with real data.

**Independent Test**: Click "Add Goal", fill in a title and future end date, submit. Verify the new goal appears in the left column with correct days remaining. Can be tested in isolation from goal completion/deletion.

**Acceptance Scenarios**:

1. **Given** the user clicks "Add Goal", **When** the modal opens, **Then** it contains a title text field and an end date picker, plus Save and Cancel actions.
2. **Given** the user fills in a title and a future end date, **When** they submit the form, **Then** the modal closes and the new goal appears in the active goals column with the correct days-remaining count.
3. **Given** the user submits the form with an empty title, **When** validation runs, **Then** an inline error message appears and the form is not submitted.
4. **Given** the user submits the form with an end date in the past, **When** validation runs, **Then** an inline error message appears and the form is not submitted.
5. **Given** the modal is open, **When** the user clicks Cancel or presses Escape, **Then** the modal closes without adding a goal.

---

### User Story 3 — Complete or Delete a Goal (Priority: P3)

As a user, I can check the checkbox next to any active goal. Once checked, two action buttons appear inline — "Move to Completed" and "Delete". Choosing "Move to Completed" transfers the goal to the right column. Choosing "Delete" permanently removes the goal. Unchecking the checkbox cancels the action and hides the buttons.

**Why this priority**: Managing goal state (completing or removing) is the key workflow that makes the app useful beyond static viewing.

**Independent Test**: Check a goal's checkbox and choose each action independently. Verify "Move to Completed" removes it from the left column and adds it to the right. Verify "Delete" removes it entirely from both columns and it does not reappear on reload.

**Acceptance Scenarios**:

1. **Given** an active goal is unchecked, **When** the user checks its checkbox, **Then** "Move to Completed" and "Delete" buttons appear next to it.
2. **Given** a goal is checked, **When** the user clicks "Move to Completed", **Then** the goal disappears from the left column and appears in the right (completed) column.
3. **Given** a goal is checked, **When** the user clicks "Delete", **Then** the goal is permanently removed and no longer appears anywhere in the app.
4. **Given** a goal is checked (action buttons visible), **When** the user unchecks the checkbox, **Then** the action buttons disappear and the goal returns to its normal display.
5. **Given** a completed goal exists in the right column, **When** the user views it, **Then** it shows the goal title and a "Delete" button.
6. **Given** a completed goal is visible, **When** the user clicks its "Delete" button, **Then** the goal is permanently removed from the completed column immediately.

---

### Edge Cases

- What happens when the end date is today? Days remaining shows "0 days" and the goal is highlighted.
- What happens when a goal's end date is in the past? Days remaining shows "X days overdue" and the goal is highlighted (same urgency treatment as ≤7 days).
- What if the user adds a goal with a very long title? The title truncates with an ellipsis to preserve layout integrity.
- What if the user closes and reopens the browser? Goals are persisted and restored correctly.

---

## Requirements *(mandatory)*

> **Constitution Constraints (SDD v1.0.0)**: All requirements MUST respect the four
> governing principles — Clean Code, Simple UX, Responsive Design, Minimal Dependencies.
> Implementation MUST use React + Tailwind CSS only. No additional runtime dependencies
> without a constitution amendment.

### Functional Requirements

- **FR-001**: The app MUST display active goals in a left column, each showing the goal title and the number of days remaining until the end date.
- **FR-001a**: Active goals MUST be sorted by creation date descending (most recently created goal shown first).
- **FR-002**: The app MUST display completed goals in a right column showing goal titles, sorted by completion date descending (most recently completed first). Each completed goal MUST show a "Delete" button.
- **FR-003**: Goals with 7 or fewer days until their end date (including overdue goals) MUST be visually distinguished from other active goals using highlight styling.
- **FR-004**: Each active goal MUST have a checkbox. When checked, "Move to Completed" and "Delete" action buttons MUST appear inline; unchecking MUST hide them.
- **FR-005**: Clicking "Move to Completed" MUST transfer the goal from the active column to the completed column.
- **FR-006**: Clicking "Delete" on an active goal MUST permanently remove it from the app immediately, with no confirmation dialog and no recovery option.
- **FR-006a**: Clicking "Delete" on a completed goal MUST permanently remove it from the completed column immediately, with no confirmation dialog and no recovery option.
- **FR-007**: An "Add Goal" button MUST be visible at the top of the active goals column.
- **FR-008**: Clicking "Add Goal" MUST open a modal containing a title text field and an end date field.
- **FR-009**: The modal MUST validate that the title is non-empty and the end date is today or a future date before accepting submission.
- **FR-010**: Successful form submission MUST close the modal and add the new goal to the active column with correct days-remaining calculation.
- **FR-011**: Both columns MUST display a friendly empty state message when they contain no goals.
- **FR-012**: Goal data MUST be persisted in browser storage so goals survive page refreshes.
- **FR-013**: The layout MUST use a two-column side-by-side arrangement on desktop viewports and a single-column stacked arrangement on mobile viewports, with the active goals column appearing first (on top) in the stacked layout.
- **FR-013a**: Each column MUST have a fixed maximum height and scroll independently when its content overflows, keeping column headers and the "Add Goal" button always visible.
- **FR-014**: The visual theme MUST use a light background with pastel accent colours consistent across both columns and the modal. See tasks.md T024 for specific Tailwind token assignments per component.

### Key Entities

- **Goal**: Represents a single user goal. Attributes: title (text), end date (date), status (active | completed), created date (date), completed date (date | null — set when moved to completed).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can add their first goal in under 30 seconds from page load.
- **SC-002**: The column headers and "Add Goal" button remain visible at all times regardless of how many goals exist; goal lists scroll within their column containers.
- **SC-003**: Goals within 7 days of their end date are immediately visually distinguishable from other goals without requiring any user interaction.
- **SC-004**: Completing or deleting a goal requires no more than 2 user interactions (check → action button).
- **SC-005**: Goal data survives a full browser refresh — 100% of goals reappear with correct state.
- **SC-006**: The two-column layout is fully usable (no overflow, no clipped elements) on viewports from 320 px (mobile) to 1920 px (large desktop).

---

## Assumptions

- Single-user application — no authentication, accounts, or server-side storage required.
- Goal data is persisted using browser `localStorage`; no backend API is needed for this feature.
- Goals cannot be edited after creation; users can only add, complete, or delete them.
- The app is a single-page experience with no client-side routing.
- Completed goals cannot be moved back to active status, but they can be permanently deleted from the completed column.
- The pastel colour palette will be defined during implementation; specific hex values are a design decision, not a spec constraint.
- "Days remaining" is calculated as whole calendar days from today's date to the end date; hours are not shown.
