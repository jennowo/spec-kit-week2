// tests/app.test.js - Automated unit tests for Quote of the Day
const assert = require('node:assert');

// Mock localStorage for Node environment
class MockLocalStorage {
  constructor(shouldThrow = false) {
    this.store = {};
    this.shouldThrow = shouldThrow;
  }
  getItem(key) {
    if (this.shouldThrow) throw new Error("SecurityError: localStorage is disabled");
    return this.store[key] !== undefined ? this.store[key] : null;
  }
  setItem(key, value) {
    if (this.shouldThrow) throw new Error("QuotaExceededError: storage full");
    this.store[key] = String(value);
  }
  removeItem(key) {
    if (this.shouldThrow) throw new Error("SecurityError");
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// Load application logic
const {
  DEFAULT_QUOTES,
  getRandomQuote,
  createStorageAdapter,
  toggleFavoriteState
} = require('../app.js');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log("=== Running Quote of the Day Unit Tests ===");

// 1. Catalog Tests
runTest("Catalog has at least 5 quotes with valid id, text, and author", () => {
  assert(Array.isArray(DEFAULT_QUOTES), "DEFAULT_QUOTES should be an array");
  assert(DEFAULT_QUOTES.length >= 5, "Catalog should have at least 5 quotes");
  const seenIds = new Set();
  for (const quote of DEFAULT_QUOTES) {
    assert(typeof quote.id === 'string' && quote.id.trim().length > 0, "Quote ID must be non-empty");
    assert(typeof quote.text === 'string' && quote.text.trim().length > 0, "Quote text must be non-empty");
    assert(typeof quote.author === 'string' && quote.author.trim().length > 0, "Quote author must be non-empty");
    assert(!seenIds.has(quote.id), `Duplicate ID detected: ${quote.id}`);
    seenIds.add(quote.id);
  }
});

// 2. Random Selection Tests (US1)
runTest("getRandomQuote never selects the current quote consecutively when catalog size > 1", () => {
  let current = DEFAULT_QUOTES[0];
  for (let i = 0; i < 100; i++) {
    const next = getRandomQuote(DEFAULT_QUOTES, current.id);
    assert.notStrictEqual(next.id, current.id, `Received consecutive duplicate on iteration ${i}: ${next.id}`);
    current = next;
  }
});

runTest("getRandomQuote handles single quote catalog gracefully", () => {
  const singleCatalog = [{ id: "solo", text: "One", author: "Solo" }];
  const next = getRandomQuote(singleCatalog, "solo");
  assert.strictEqual(next.id, "solo");
});

// 3. Favorite State Toggle Tests (US2)
runTest("toggleFavoriteState adds and removes quote IDs correctly", () => {
  const favorites = new Set();
  
  // Toggle on
  const res1 = toggleFavoriteState(favorites, "q1");
  assert.strictEqual(res1.isFavorited, true);
  assert(favorites.has("q1"), "Favorites should contain q1");

  // Toggle off
  const res2 = toggleFavoriteState(favorites, "q1");
  assert.strictEqual(res2.isFavorited, false);
  assert(!favorites.has("q1"), "Favorites should not contain q1");
});

// 4. Persistence & StorageAdapter Tests (US3)
runTest("StorageAdapter saves and loads favorites reliably", () => {
  const mockStorage = new MockLocalStorage();
  const adapter = createStorageAdapter(mockStorage, "test_favorites");

  assert.strictEqual(adapter.isStorageAvailable(), true);
  assert.deepStrictEqual(adapter.getFavorites(), []);

  adapter.saveFavorites(["q1", "q3"]);
  assert.deepStrictEqual(adapter.getFavorites(), ["q1", "q3"]);

  adapter.saveFavorites(["q3"]);
  assert.deepStrictEqual(adapter.getFavorites(), ["q3"]);
});

runTest("StorageAdapter handles corrupted JSON gracefully", () => {
  const mockStorage = new MockLocalStorage();
  mockStorage.setItem("test_favorites", "{malformed-json::");
  const adapter = createStorageAdapter(mockStorage, "test_favorites");

  const favorites = adapter.getFavorites();
  assert(Array.isArray(favorites), "Should return empty array on corrupt data");
  assert.strictEqual(favorites.length, 0);
});

runTest("StorageAdapter handles restricted/throwing localStorage gracefully", () => {
  const failingStorage = new MockLocalStorage(true);
  const adapter = createStorageAdapter(failingStorage, "test_favorites");

  assert.strictEqual(adapter.isStorageAvailable(), false);
  // Should not throw and should maintain in-memory store
  assert.doesNotThrow(() => {
    adapter.saveFavorites(["q2"]);
  });
  assert.deepStrictEqual(adapter.getFavorites(), ["q2"]);
});

console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
if (process.exitCode) {
  console.error("Test failures occurred!");
} else {
  console.log("All unit tests passed successfully!");
}

