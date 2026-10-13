/**
 * Quote of the Day Application Logic
 * Adheres to Constitution Principles: Modularity, Testability, Maintainability, Defensive Programming, and Zero Dependencies.
 */

// Curated built-in quotes catalog (satisfies FR-003, N >= 5)
const DEFAULT_QUOTES = [
  {
    id: "q1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    id: "q2",
    text: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra"
  },
  {
    id: "q3",
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck"
  },
  {
    id: "q4",
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    id: "q5",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    id: "q6",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  },
  {
    id: "q7",
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson"
  },
  {
    id: "q8",
    text: "Before software can be reusable it first has to be usable.",
    author: "Ralph Johnson"
  }
];

const STORAGE_KEY = "quote_app_favorites";

/**
 * Selects a random quote from catalog avoiding the current quote (FR-004)
 * @param {Array} catalog - Array of Quote objects
 * @param {string|null} currentId - ID of currently displayed quote
 * @returns {Object} Quote object
 */
function getRandomQuote(catalog, currentId = null) {
  if (!catalog || catalog.length === 0) {
    return { id: "empty", text: "No quotes available.", author: "System" };
  }
  if (catalog.length === 1) {
    return catalog[0];
  }

  // Filter out the current quote to prevent consecutive repeats
  const candidates = currentId
    ? catalog.filter(q => q.id !== currentId)
    : catalog;

  const validCandidates = candidates.length > 0 ? candidates : catalog;
  const randomIndex = Math.floor(Math.random() * validCandidates.length);
  return validCandidates[randomIndex];
}

/**
 * Pure function to toggle a quote's favorited state in a Set
 * @param {Set<string>} favoritesSet
 * @param {string} quoteId
 * @returns {{ favoritesSet: Set<string>, isFavorited: boolean }}
 */
function toggleFavoriteState(favoritesSet, quoteId) {
  if (!quoteId) return { favoritesSet, isFavorited: false };
  let isFavorited;
  if (favoritesSet.has(quoteId)) {
    favoritesSet.delete(quoteId);
    isFavorited = false;
  } else {
    favoritesSet.add(quoteId);
    isFavorited = true;
  }
  return { favoritesSet, isFavorited };
}

/**
 * Creates a defensive StorageAdapter wrapping browser localStorage
 * Gracefully degrades to an in-memory fallback if storage is disabled or quota exceeded
 * @param {Storage} storage - localStorage or mock storage object
 * @param {string} key - Storage key name
 */
function createStorageAdapter(storage = null, key = STORAGE_KEY) {
  let inMemoryFallback = [];
  let storageWorks = false;

  // Probe storage availability
  if (storage) {
    try {
      const probeKey = `__probe_${Date.now()}__`;
      storage.setItem(probeKey, "ok");
      storage.removeItem(probeKey);
      storageWorks = true;
    } catch {
      storageWorks = false;
    }
  }

  return {
    isStorageAvailable() {
      return storageWorks;
    },

    getFavorites() {
      if (!storageWorks) {
        return [...inMemoryFallback];
      }
      try {
        const raw = storage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Ensure all items are strings
          return parsed.filter(item => typeof item === "string");
        }
        return [];
      } catch {
        // Corrupted JSON or read failure
        return [];
      }
    },

    saveFavorites(favoritesArray) {
      const cleanArray = Array.isArray(favoritesArray) ? favoritesArray : [];
      inMemoryFallback = [...cleanArray];
      if (!storageWorks) return false;

      try {
        storage.setItem(key, JSON.stringify(cleanArray));
        return true;
      } catch {
        // QuotaExceededError or private browsing lock
        storageWorks = false;
        return false;
      }
    }
  };
}

// Client-side Application Controller
class QuoteApp {
  constructor(quotes = DEFAULT_QUOTES, storageInstance = null) {
    this.quotes = quotes;
    const storageObj = storageInstance || (typeof window !== "undefined" ? window.localStorage : null);
    this.storageAdapter = createStorageAdapter(storageObj, STORAGE_KEY);
    this.favorites = new Set(this.storageAdapter.getFavorites());
    this.currentQuote = null;

    // DOM Elements cache
    this.elements = {};
  }

  init() {
    if (typeof document === "undefined") return;

    this.elements = {
      card: document.getElementById("quote-card"),
      quoteText: document.getElementById("quote-text"),
      quoteAuthor: document.getElementById("quote-author"),
      newQuoteBtn: document.getElementById("new-quote-btn"),
      favoriteBtn: document.getElementById("favorite-btn"),
      favoriteStatus: document.getElementById("favorite-status"),
      favoriteLabel: document.getElementById("favorite-label")
    };

    if (!this.elements.newQuoteBtn || !this.elements.favoriteBtn) {
      console.warn("QuoteApp: Required DOM elements missing.");
      return;
    }

    // Attach event listeners
    this.elements.newQuoteBtn.addEventListener("click", () => this.cycleQuote());
    this.elements.favoriteBtn.addEventListener("click", () => this.toggleFavorite());

    // Display initial quote
    this.cycleQuote();
  }

  cycleQuote() {
    const nextQuote = getRandomQuote(this.quotes, this.currentQuote ? this.currentQuote.id : null);
    this.currentQuote = nextQuote;
    this.render();
  }

  toggleFavorite() {
    if (!this.currentQuote) return;
    const { isFavorited } = toggleFavoriteState(this.favorites, this.currentQuote.id);
    this.storageAdapter.saveFavorites([...this.favorites]);
    this.renderFavoriteButton(isFavorited);
  }

  render() {
    if (!this.currentQuote || !this.elements.quoteText) return;

    this.elements.quoteText.textContent = `"${this.currentQuote.text}"`;
    this.elements.quoteAuthor.textContent = `— ${this.currentQuote.author}`;

    const isFavorited = this.favorites.has(this.currentQuote.id);
    this.renderFavoriteButton(isFavorited);
  }

  renderFavoriteButton(isFavorited) {
    if (!this.elements.favoriteBtn) return;

    this.elements.favoriteBtn.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (this.elements.favoriteStatus) {
      this.elements.favoriteStatus.textContent = isFavorited ? "★" : "☆";
    }
    if (this.elements.favoriteLabel) {
      this.elements.favoriteLabel.textContent = isFavorited ? "Favorited" : "Favorite";
    }
    if (isFavorited) {
      this.elements.favoriteBtn.classList.add("favorited");
    } else {
      this.elements.favoriteBtn.classList.remove("favorited");
    }
  }
}

// Auto-initialize when running in browser
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    const app = new QuoteApp();
    app.init();
    window.quoteAppInstance = app;
  });
}

// Export for Node.js test environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DEFAULT_QUOTES,
    STORAGE_KEY,
    getRandomQuote,
    toggleFavoriteState,
    createStorageAdapter,
    QuoteApp
  };
}

