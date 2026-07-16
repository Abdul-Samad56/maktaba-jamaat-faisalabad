import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchSearchSuggestions, fetchPopularSearches, trackSearch } from "../api";
import {
  addSearchHistory,
  clearSearchHistory,
  getSearchHistory,
  removeSearchHistoryItem,
} from "../hooks/useSearchHistory";

function scrollToProducts() {
  requestAnimationFrame(() => {
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/**
 * Professional search bar with:
 * - Instant suggestions (debounced)
 * - Recent + popular searches
 * - Keyboard navigation (↑↓ Enter Esc)
 * - Mobile-friendly dropdown
 */
export default function SearchBar({ onMenuClose } = {}) {
  const [params, setParams] = useSearchParams();
  const urlSearch = params.get("search") || "";
  const listId = useId();

  const [value, setValue] = useState(urlSearch);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [popular, setPopular] = useState([]);
  const [history, setHistory] = useState(() => getSearchHistory());
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // Sync input when URL search changes (e.g. browser back)
  useEffect(() => {
    setValue(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    fetchPopularSearches(8)
      .then((data) => setPopular(data?.items || []))
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const loadSuggestions = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    const trimmed = String(q || "").trim();
    if (!trimmed) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const data = await fetchSearchSuggestions(trimmed, 8, controller.signal);
        if (controller.signal.aborted) return;
        setSuggestions(data?.suggestions || []);
      } catch (err) {
        if (err?.name !== "AbortError") setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);
  }, []);

  const commitSearch = useCallback(
    (raw) => {
      const q = String(raw || "").trim();
      const next = new URLSearchParams(params);
      if (q) {
        next.set("search", q);
        setHistory(addSearchHistory(q));
        trackSearch(q).catch(() => {});
      } else {
        next.delete("search");
      }
      next.delete("page");
      setParams(next);
      setValue(q);
      setOpen(false);
      setActiveIndex(-1);
      onMenuClose?.();
      scrollToProducts();
    },
    [params, setParams, onMenuClose]
  );

  const flatItems = (() => {
    const items = [];
    if (!value.trim()) {
      history.forEach((text) => items.push({ type: "recent", text }));
      popular.forEach((text) => items.push({ type: "popular", text }));
    } else {
      suggestions.forEach((s) => items.push(s));
    }
    return items;
  })();

  const onChange = (e) => {
    const v = e.target.value;
    setValue(v);
    setOpen(true);
    setActiveIndex(-1);
    loadSuggestions(v);
  };

  const onFocus = () => {
    setOpen(true);
    setHistory(getSearchHistory());
    if (value.trim()) loadSuggestions(value);
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatItems[activeIndex]) {
        commitSearch(flatItems[activeIndex].text);
      } else {
        commitSearch(value);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    commitSearch(value);
  };

  const showPanel = open;

  return (
    <div className={`smart-search ${open ? "is-open" : ""}`} ref={wrapRef}>
      <form className="search-box smart-search-form" onSubmit={onSubmit} role="search">
        <label className="sr-only" htmlFor={listId + "-input"}>
          Search books
        </label>
        <span className="smart-search-icon" aria-hidden="true">
          {loading ? <span className="smart-search-spinner" /> : "⌕"}
        </span>
        <input
          id={listId + "-input"}
          ref={inputRef}
          name="search"
          type="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Search اردو / English..."
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showPanel}
          role="combobox"
        />
        {value && (
          <button
            type="button"
            className="smart-search-clear"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              setSuggestions([]);
              inputRef.current?.focus();
              setOpen(true);
            }}
          >
            ×
          </button>
        )}
        <button type="submit">Search</button>
      </form>

      {showPanel && (
        <div className="smart-search-dropdown" id={listId} role="listbox">
          {!value.trim() && history.length > 0 && (
            <div className="smart-search-section">
              <div className="smart-search-section-head">
                <span>Recent Searches</span>
                <button
                  type="button"
                  className="smart-search-clear-all"
                  onClick={() => setHistory(clearSearchHistory())}
                >
                  Clear
                </button>
              </div>
              <ul>
                {history.map((text, i) => {
                  const idx = flatItems.findIndex((x) => x.type === "recent" && x.text === text);
                  return (
                    <li key={`h-${text}`}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeIndex === idx}
                        className={activeIndex === idx ? "is-active" : ""}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => commitSearch(text)}
                      >
                        <span className="sug-icon" aria-hidden="true">
                          ⏱
                        </span>
                        <span className="sug-text">{text}</span>
                      </button>
                      <button
                        type="button"
                        className="sug-remove"
                        aria-label={`Remove ${text}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setHistory(removeSearchHistoryItem(text));
                        }}
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!value.trim() && popular.length > 0 && (
            <div className="smart-search-section">
              <div className="smart-search-section-head">
                <span>Popular Searches</span>
              </div>
              <div className="smart-search-chips">
                {popular.map((text) => (
                  <button key={text} type="button" className="search-chip" onClick={() => commitSearch(text)}>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {value.trim() && (
            <div className="smart-search-section">
              <div className="smart-search-section-head">
                <span>{loading ? "Searching…" : "Suggestions"}</span>
              </div>
              {loading && !suggestions.length && (
                <div className="smart-search-loading">
                  <span className="smart-search-spinner" />
                  <span>Finding books…</span>
                </div>
              )}
              {!loading && !suggestions.length && (
                <p className="smart-search-empty">Press Enter to search for &ldquo;{value.trim()}&rdquo;</p>
              )}
              <ul>
                {suggestions.map((s, i) => (
                  <li key={`${s.type}-${s.text}-${i}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={activeIndex === i}
                      className={activeIndex === i ? "is-active" : ""}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => commitSearch(s.text)}
                    >
                      <span className="sug-icon" aria-hidden="true">
                        {s.type === "author" ? "✎" : s.type === "product" ? "▣" : "⌕"}
                      </span>
                      <span className="sug-body">
                        <span className="sug-text">{s.text}</span>
                        {s.author ? <span className="sug-meta">{s.author}</span> : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
