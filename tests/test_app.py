#!/usr/bin/env python3
"""
Python verification test for Quote of the Day
Validates index.html structure, contracts, styles.css rules, and app.js catalog.
"""
import re
import sys
import json

def test_index_html():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    assert '<main id="quote-card"' in html, "Missing #quote-card element"
    assert '<blockquote id="quote-text"' in html, "Missing #quote-text element"
    assert '<cite id="quote-author"' in html, "Missing #quote-author element"
    assert '<button id="new-quote-btn"' in html, "Missing #new-quote-btn element"
    assert '<button id="favorite-btn"' in html, "Missing #favorite-btn element"
    assert 'aria-pressed=' in html, "Missing aria-pressed attribute"
    assert 'app.js' in html, "Missing app.js script tag"
    print("✓ PASS: index.html DOM structure conforms to contracts")

def test_styles_css():
    with open("styles.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert "#quote-card" in css, "Missing #quote-card style rule"
    assert "#new-quote-btn" in css or ".btn-primary" in css, "Missing button styles"
    assert ".favorited" in css, "Missing .favorited active state class"
    assert ":focus-visible" in css, "Missing :focus-visible accessibility rule"
    print("✓ PASS: styles.css contains required accessibility and UI rules")

def test_app_js():
    with open("app.js", "r", encoding="utf-8") as f:
        js = f.read()

    # Extract DEFAULT_QUOTES
    match = re.search(r'const DEFAULT_QUOTES = (\[.*?\]);', js, re.DOTALL)
    assert match, "Could not find DEFAULT_QUOTES in app.js"
    quotes_raw = match.group(1)
    
    # Check count of quotes
    id_matches = re.findall(r'id:\s*"([^"]+)"', quotes_raw)
    assert len(id_matches) >= 5, f"Expected >= 5 quotes, found {len(id_matches)}"
    assert len(id_matches) == len(set(id_matches)), "Duplicate quote IDs found"

    # Check key functions exist
    assert "function getRandomQuote" in js, "Missing getRandomQuote function"
    assert "function toggleFavoriteState" in js, "Missing toggleFavoriteState function"
    assert "function createStorageAdapter" in js, "Missing createStorageAdapter function"
    assert "localStorage" in js, "Missing localStorage persistence logic"
    assert "try" in js and "catch" in js, "Missing defensive try/catch error handling"
    print(f"✓ PASS: app.js contains valid quotes catalog ({len(id_matches)} items) and required modules")

if __name__ == "__main__":
    print("=== Running Automated Verification Suite ===")
    try:
        test_index_html()
        test_styles_css()
        test_app_js()
        print("\nAll verification tests passed successfully!")
    except Exception as e:
        print(f"\n✗ FAIL: {e}")
        sys.exit(1)

