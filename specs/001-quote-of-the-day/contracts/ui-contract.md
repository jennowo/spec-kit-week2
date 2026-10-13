# Interface & UI Contracts: Quote of the Day

**Feature**: [Quote of the Day Specification](../spec.md)  
**Date**: 2026-10-12 (Updated: 2026-10-12)  
**Status**: Ready  

---

## 1. DOM Element & Accessibility Contract

The client HTML interface MUST adhere to the following element identifiers, semantic tags, and ARIA attributes:

### Active Quote Card (`#quote-card`)
| Element ID | HTML Tag | Role / ARIA Attributes | Description |
|---|---|---|---|
| `#quote-card` | `<main>` / `<article>` | `aria-live="polite"` | Container holding the active quote card |
| `#quote-text` | `<blockquote>` | Text container | Displays the active quote text body |
| `#quote-author` | `<cite>` | Author attribution | Displays author preceded by em-dash or styling |
| `#new-quote-btn` | `<button>` | `type="button"` | User trigger to fetch and display another random quote |
| `#favorite-btn` | `<button>` | `type="button"`, `aria-pressed="true\|false"`, `aria-label="Toggle favorite for current quote"` | Toggles favorite status for currently displayed quote |
| `#favorite-status` | `<span>` | Visual / indicator badge | Shows icon indicating favorite state (★ / ☆) |

### Favorites Collection Section (`#favorites-section`)
| Element ID | HTML Tag | Role / ARIA Attributes | Description |
|---|---|---|---|
| `#favorites-section` | `<section>` | `aria-labelledby="favorites-heading"` | Container holding the saved favorites collection |
| `#favorites-heading` | `<h2>` | Section heading | Heading text: "Saved Favorites" |
| `#favorites-empty` | `<p>` | Empty state text | Displayed when `favorites` is empty ("No favorite quotes yet.") |
| `#favorites-list` | `<ul>` | Semantic unordered list | List of saved favorites (hidden/empty when none exist) |
| `.favorite-item` | `<li>` | List item | Contains favorited quote body (`<blockquote>`) and author (`<cite>`) |

---

## 2. Storage Service Interface Contract

The internal persistence module must expose the following contract:

```javascript
/**
 * StorageAdapter interface contract
 */
interface StorageAdapter {
  /**
   * Retrieves array of favorited quote IDs.
   * Returns empty array if none exist or if read fails.
   */
  getFavorites(): string[];

  /**
   * Persists an array of favorited quote IDs to localStorage.
   * Returns true on success, false if storage quota exceeded or disabled.
   */
  saveFavorites(ids: string[]): boolean;

  /**
   * Verifies if localStorage is currently accessible in the browser context.
   */
  isStorageAvailable(): boolean;
}
```

---

## 3. Keyboard & Interaction Contract

- **`Tab` Navigation**: Focus moves logically: `[New quote button] → [Favorite button]`.
- **`Enter` / `Space` Activation**: Triggers button action according to standard W3C button behaviors.
- **Focus Indicators**: All interactive elements MUST have a clearly visible focus outline conforming to WCAG 2.1 AA (at least 3:1 contrast ratio against background).
