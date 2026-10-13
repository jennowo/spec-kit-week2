# Quickstart Validation Guide: Quote of the Day

**Feature**: [Quote of the Day Specification](spec.md)  
**Date**: 2026-10-12  
**Status**: Ready  

This guide provides step-by-step scenarios to validate the implementation end-to-end.

---

## 1. Prerequisites & Launch

1. Open a terminal in the project root:
   ```bash
   cd /home/jenn/cse115a/projects/spec-kit-week2
   ```
2. Serve the application using any static web server (or open `index.html` directly in a browser):
   ```bash
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

---

## 2. Validation Scenarios

### Scenario 1: Initial Page Load (MVP - P1)
- **Action**: Load `http://localhost:8000`.
- **Expected Outcome**:
  - A quote card appears displaying quote text in `#quote-text` and author in `#quote-author`.
  - The "New quote" (`#new-quote-btn`) and "Favorite" (`#favorite-btn`) buttons are visible and active.
  - No console errors are reported.

### Scenario 2: Cycling Quotes (P1)
- **Action**: Click the "New quote" button multiple times.
- **Expected Outcome**:
  - The quote text and author update immediately on each click.
  - The newly displayed quote is different from the quote immediately preceding it (no immediate consecutive repeats).

### Scenario 3: Favoriting a Quote (P2)
- **Action**:
  1. Click the "Favorite" button (`#favorite-btn`).
  2. Verify the visual indicator changes (e.g. icon fills, `aria-pressed="true"`).
  3. Click "Favorite" again.
- **Expected Outcome**:
  - Toggling favorite immediately toggles visual state and `aria-pressed` between `true` and `false`.

### Scenario 4: Persistence Across Page Reload (P3)
- **Action**:
  1. Click "New quote" until a desired quote appears.
  2. Mark it as a favorite (active state).
  3. Note the quote text.
  4. Perform a hard browser reload (Ctrl+R / Cmd+Shift+R).
  5. Cycle through quotes until the previously favorited quote is displayed again.
- **Expected Outcome**:
  - The quote retains its active favorite state (`aria-pressed="true"`).

### Scenario 5: Keyboard Accessibility & Resilience
- **Action**:
  1. Use only the `Tab` and `Enter` / `Space` keys to cycle quotes and toggle favorites.
  2. Open DevTools Application tab, delete or block `localStorage`, and cycle/favorite quotes.
- **Expected Outcome**:
  - All interactive buttons have visible focus rings and respond to keyboard triggers.
  - If storage is blocked, the app continues to display quotes and toggles favorites in-memory without uncaught runtime exceptions.

