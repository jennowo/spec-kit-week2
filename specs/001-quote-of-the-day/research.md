# Technical Research: Quote of the Day

**Feature**: [Quote of the Day Specification](spec.md)  
**Date**: 2026-10-12  
**Status**: Completed  

---

### Research Topic 1: Application Architecture & Tech Stack

- **Decision**: Plain vanilla HTML5, CSS3, and modern ES6+ JavaScript structured across separate `index.html`, `styles.css`, and `app.js` files with zero build pipelines.
- **Rationale**: Aligns strictly with Constitution Principle V (Minimal Dependencies & Durable Simplicity) and Principle I (Code Quality & Modularity). Single-page client-side architecture loads instantly without bundlers, node_modules, or external network requests.
- **Alternatives Considered**:
  - *React / Vue*: Rejected due to unnecessary bundle overhead, complex build configurations, and external dependency maintenance for a simple static widget.
  - *Single monolithic HTML file*: Rejected because interleaving markup, CSS, and JS violates Constitution Principle I (Separation of Concerns).

---

### Research Topic 2: Persistence Strategy & Fallback

- **Decision**: Browser `localStorage` utilizing a dedicated storage abstraction module with structured JSON serialization, input validation, and in-memory fallback inside a `try...catch` wrapper.
- **Rationale**: Meets requirement FR-006 and Constitution Principle IV (Defensive Programming). Handles private browsing modes, quota errors, and corrupted stored strings gracefully without crashing the UI.
- **Alternatives Considered**:
  - *IndexedDB*: Rejected due to excessive asynchronous API complexity for storing a lightweight set of string IDs.
  - *Cookies*: Rejected due to storage limits and unnecessary transmission overhead in potential HTTP headers.

---

### Research Topic 3: Randomization & Duplicate Avoidance

- **Decision**: Pseudo-random selection (`Math.random()`) with explicit current-quote exclusion. When "New quote" is triggered on a catalog of size $N > 1$, candidate selection is restricted to $\{quote \in catalog \mid quote.id \neq currentQuote.id\}$.
- **Rationale**: Satisfies FR-004 and edge case specifications by ensuring users never experience consecutive duplicate quotes while maintaining uniform distribution across the remaining quotes.
- **Alternatives Considered**:
  - *Unrestricted Math.random()*: Rejected because it frequently repeats identical quotes in small catalogs ($N \approx 5-10$).
  - *Full deck shuffle array*: Rejected as over-engineered state management for a static quote browser.

---

### Research Topic 4: Accessibility & Keyboard Navigation

- **Decision**: Semantic HTML5 elements (`<blockquote>`, `<cite>`, `<button>`) with explicit `aria-pressed` states for the favorite toggle and visible `:focus-visible` CSS indicators.
- **Rationale**: Fulfills FR-008 and SC-004. Native HTML button elements provide built-in Tab navigation and Enter/Space keyboard trigger support across all browsers.
- **Alternatives Considered**:
  - *Custom `<div>` or `<span>` clickables*: Rejected because custom elements lack built-in accessibility semantics and keyboard listeners.

