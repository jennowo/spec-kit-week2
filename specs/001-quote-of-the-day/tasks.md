# Implementation Tasks: Quote of the Day

**Feature**: [Quote of the Day Specification](spec.md)  
**Plan**: [Implementation Plan](plan.md)  
**Date**: 2026-10-12  
**Status**: Ready for Implementation  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize directory structure and create placeholder project files in `index.html`, `styles.css`, `app.js`, and `tests/app.test.js`
- [ ] T002 [P] Create base semantic HTML5 document skeleton with accessible meta tags, page title, and stylesheet/script links in `index.html`
- [ ] T003 [P] Setup base CSS styling system, typography reset, responsive layout variables, and `:focus-visible` styling in `styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and data structures that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Define curated built-in quote catalog with at least 5 quotes, each having `id` ("non-empty, unique across catalog"), `text` ("non-empty text"), and `author` ("non-empty text") in `app.js`
- [ ] T005 [P] Implement `StorageAdapter` module wrapping browser `localStorage` with `try...catch` handling, storage key `"quote_app_favorites"`, and in-memory fallback in `app.js`
- [ ] T006 [P] Create standalone test runner script for assertions on catalog structure and storage fallback in `tests/app.test.js`

**Checkpoint**: Foundation ready — User Story 1 implementation can now begin.

---

## Phase 3: User Story 1 - View and Cycle Random Quotes (Priority: P1) 🎯 MVP

**Goal**: A visitor sees an initial quote with author and can cycle through new random quotes without immediate consecutive repeats.

**Independent Test**: Load `index.html` in browser; verify quote and author appear in `#quote-text` and `#quote-author`. Click `#new-quote-btn` and verify a different quote from the catalog displays immediately.

### Tests for User Story 1
- [ ] T007 [P] [US1] Implement unit test verifying random quote selection never returns the current quote consecutively when catalog size > 1 in `tests/app.test.js`

### Implementation for User Story 1
- [ ] T008 [US1] Implement non-consecutive random quote selector function `getRandomQuote(catalog, currentId)` in `app.js`
- [ ] T009 [US1] Add semantic quote display card markup (`<main id="quote-card">`, `<blockquote id="quote-text">`, `<cite id="quote-author">`, `<button id="new-quote-btn">`) in `index.html`
- [ ] T010 [US1] Style the quote presentation card, quote typography, author attribution, and "New quote" action button in `styles.css`
- [ ] T011 [US1] Wire DOM initialization and click handler for `#new-quote-btn` to update `AppState.currentQuote` and render to DOM in `app.js`

**Checkpoint**: User Story 1 (MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Toggle Favorite Status for Quotes (Priority: P2)

**Goal**: A visitor can mark/unmark any displayed quote as a favorite with immediate visual and accessible feedback.

**Independent Test**: Click `#favorite-btn` on currently displayed quote; confirm visual indicator updates and `aria-pressed="true"`. Click `#favorite-btn` again; confirm visual indicator reverts and `aria-pressed="false"`.

### Tests for User Story 2
- [ ] T012 [P] [US2] Implement unit test verifying favorite toggle updates the `favorites` Set correctly in `tests/app.test.js`

### Implementation for User Story 2
- [ ] T013 [US2] Add `#favorite-btn` button element with `aria-pressed="false"` and `#favorite-status` visual indicator badge inside `#quote-card` in `index.html`
- [ ] T014 [US2] Style `#favorite-btn` with active (★) and inactive (☆) visual states and accessible focus rings in `styles.css`
- [ ] T015 [US2] Implement `toggleFavorite(currentQuoteId)` function and attach click event listener on `#favorite-btn` to synchronize UI state in `app.js`

**Checkpoint**: User Stories 1 and 2 both work independently and together.

---

## Phase 5: User Story 3 - Persist Favorites Across Sessions (Priority: P3)

**Goal**: Favorited quotes remain favorited when reloading the page or restarting the browser.

**Independent Test**: Favorite a quote, reload the browser page, navigate to that quote, and verify it displays with `aria-pressed="true"` and the active favorite indicator.

### Tests for User Story 3
- [ ] T016 [P] [US3] Implement unit test verifying serialization, deserialization, and recovery from corrupted storage in `tests/app.test.js`

### Implementation for User Story 3
- [ ] T017 [US3] Connect `StorageAdapter.saveFavorites` to `toggleFavorite` to persist favorite IDs to `localStorage` in `app.js`
- [ ] T018 [US3] Implement page initialization logic to load existing favorites from `StorageAdapter.getFavorites` into `AppState.favorites` in `app.js`

**Checkpoint**: All three user stories are functional and persist state correctly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, accessibility, and end-to-end verification

- [ ] T019 [P] Verify full keyboard accessibility (`Tab`, `Enter`, `Space`) and WCAG 2.1 AA focus rings on all interactive buttons in `styles.css` and `index.html`
- [ ] T020 Verify defensive handling when `localStorage` is restricted or blocked, ensuring in-memory fallback without runtime exceptions in `app.js`
- [ ] T021 Execute all manual validation scenarios from `specs/001-quote-of-the-day/quickstart.md` and verify automated test suite passes via `node tests/app.test.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — executes immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  - Can proceed sequentially: US1 (P1) → US2 (P2) → US3 (P3).
- **Polish (Phase 6)**: Depends on completion of all user story phases.

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Foundational (Phase 2). Standalone MVP.
- **User Story 2 (P2)**: Builds upon the quote display from US1; independent state toggle.
- **User Story 3 (P3)**: Adds persistence to the favorite toggle from US2.

### Parallel Opportunities

- Within Phase 1: `T002` (HTML) and `T003` (CSS) can execute in parallel.
- Within Phase 2: `T005` (StorageAdapter) and `T006` (Test runner) can execute in parallel.
- Within User Story 1: `T007` (Test) can run before or in parallel with `T008` (Logic).
- Within User Story 2: `T012` (Test) can run before implementation tasks `T013` and `T014`.
- Within User Story 3: `T016` (Test) can run before `T017` and `T018`.

---

## Parallel Execution Example: User Story 1

```bash
# Launch test and markup tasks in parallel:
Task: "T007 [P] [US1] Implement unit test verifying random quote selection in tests/app.test.js"
Task: "T009 [US1] Add semantic quote display card markup in index.html"
Task: "T010 [US1] Style the quote presentation card in styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup (`T001`–`T003`).
2. Complete Phase 2: Foundational (`T004`–`T006`).
3. Complete Phase 3: User Story 1 (`T007`–`T011`).
4. **STOP and VALIDATE**: Verify quote loading and cycling in the browser.

### Incremental Delivery
1. Add User Story 2 (`T012`–`T015`): Enable in-memory favoriting toggle.
2. Add User Story 3 (`T016`–`T018`): Enable persistent local storage.
3. Complete Polish (`T019`–`T021`): Validate accessibility and end-to-end quickstart scenarios.

