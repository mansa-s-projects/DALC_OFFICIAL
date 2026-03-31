"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Command } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  useSearch,
  SEARCH_SUGGESTIONS,
  SEARCH_RESULT_TYPE_LABELS,
  type SearchResultType,
} from "@/features/search";
import SearchResultItem from "./SearchResultItem";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Venues", href: "/venues", color: "#C9A84C" },
  { label: "Experiences", href: "/experiences", color: "#7EB8A0" },
  { label: "Transport", href: "/transport", color: "#8BA4D4" },
  { label: "Stays", href: "/stays", color: "#B89AD4" },
  { label: "Business", href: "/business", color: "#C4917D" },
  { label: "Concierge", href: "/concierge", color: "#C9A84C" },
];

// ─── Component ───────────────────────────────────────────────────────────────────

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { query, setQuery, results, isSearching, clearSearch, hasQuery } =
    useSearch();

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof results> = {};
    for (const r of results) {
      const key = r.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }
    return groups;
  }, [results]);

  const flatResults = useMemo(() => results, [results]);

  // ── Keyboard shortcut (Cmd/Ctrl + K) ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(-1);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < flatResults.length) {
          const result = flatResults[activeIndex];
          setIsOpen(false);
          router.push(result.href);
        } else if (query.trim().length >= 2) {
          setIsOpen(false);
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
      }
    },
    [activeIndex, flatResults, query, router],
  );

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll("[data-search-result]");
      items[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // Expose open function globally
  useEffect(() => {
    (window as any).__openSearchModal = () => setIsOpen(true);
    return () => {
      delete (window as any).__openSearchModal;
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100]"
            style={{
              background: "rgba(8,7,6,0.85)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[101] left-4 right-4 top-[10vh] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl"
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #120F0A 0%, #0D0B08 100%)",
                border: "1px solid rgba(212,195,150,0.12)",
                boxShadow:
                  "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08)",
              }}
            >
              {/* Search Input */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: "1px solid rgba(212,195,150,0.07)" }}
              >
                <Search
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "rgba(201,168,76,0.50)" }}
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search Dubai..."
                  className="flex-1 bg-transparent text-sm outline-none caret-cipher-gold"
                  style={{
                    color: "rgba(245,237,216,0.95)",
                    fontFamily: "var(--font-body)",
                    caretColor: "#C9A84C",
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    onClick={() => {
                      clearSearch();
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded hover:bg-cipher-surface transition-colors"
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: "rgba(212,195,150,0.40)" }}
                    />
                  </button>
                )}
                <kbd
                  className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-[10px]"
                  style={{
                    color: "rgba(212,195,150,0.35)",
                    background: "rgba(212,195,150,0.06)",
                    border: "1px solid rgba(212,195,150,0.08)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Content */}
              <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
                {/* Results */}
                {hasQuery && flatResults.length > 0 && (
                  <div className="p-3">
                    {Object.entries(groupedResults).map(([type, items]) => (
                      <div key={type} className="mb-3 last:mb-0">
                        <div className="px-2 py-1.5 mb-1">
                          <span
                            className="text-[9px] uppercase tracking-[0.15em] font-medium"
                            style={{
                              color: "rgba(212,195,150,0.35)",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {SEARCH_RESULT_TYPE_LABELS[
                              type as SearchResultType
                            ] || type}
                          </span>
                          <span
                            className="ml-2 text-[9px]"
                            style={{
                              color: "rgba(212,195,150,0.20)",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {items.length}
                          </span>
                        </div>
                        {items.map((result) => {
                          const idx = flatResults.indexOf(result);
                          return (
                            <div key={result.id} data-search-result>
                              <SearchResultItem
                                result={result}
                                isActive={idx === activeIndex}
                                onClick={() => setIsOpen(false)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* View All */}
                    <button
                      onClick={handleViewAll}
                      className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-cipher-gold/5"
                      style={{
                        color: "#C9A84C",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                      }}
                    >
                      View all results for &ldquo;{query}&rdquo;
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Loading */}
                {isSearching && hasQuery && (
                  <div className="px-5 py-8 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-cipher-gold/20 border-t-cipher-gold rounded-full animate-spin" />
                      <span
                        className="text-xs"
                        style={{
                          color: "rgba(212,195,150,0.40)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        Searching...
                      </span>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {hasQuery && !isSearching && flatResults.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <p
                      className="text-sm mb-1"
                      style={{
                        color: "rgba(245,237,216,0.60)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      No results found
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: "rgba(212,195,150,0.30)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Try a different search term
                    </p>
                  </div>
                )}

                {/* No query — suggestions + quick links */}
                {!hasQuery && (
                  <div className="p-4">
                    {/* Quick Links */}
                    <div className="mb-5">
                      <p
                        className="text-[9px] uppercase tracking-[0.15em] mb-3 px-2"
                        style={{
                          color: "rgba(212,195,150,0.30)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        Quick Links
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {QUICK_LINKS.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-cipher-surface group"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: link.color }}
                            />
                            <span
                              className="text-xs transition-colors"
                              style={{
                                color: "rgba(212,195,150,0.55)",
                                fontFamily: "var(--font-mono)",
                                fontSize: "10px",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {link.label}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.15em] mb-3 px-2"
                        style={{
                          color: "rgba(212,195,150,0.30)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        Trending
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SEARCH_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSuggestionClick(s)}
                            className="px-3 py-1.5 rounded-full text-[10px] transition-all duration-200 hover:bg-cipher-gold/10 hover:border-cipher-gold/20"
                            style={{
                              color: "rgba(212,195,150,0.50)",
                              background: "rgba(212,195,150,0.04)",
                              border: "1px solid rgba(212,195,150,0.08)",
                              fontFamily: "var(--font-mono)",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{
                  borderTop: "1px solid rgba(212,195,150,0.06)",
                  background: "rgba(8,7,6,0.4)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd
                      className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px]"
                      style={{
                        color: "rgba(212,195,150,0.30)",
                        background: "rgba(212,195,150,0.06)",
                        border: "1px solid rgba(212,195,150,0.08)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ↑
                    </kbd>
                    <kbd
                      className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px]"
                      style={{
                        color: "rgba(212,195,150,0.30)",
                        background: "rgba(212,195,150,0.06)",
                        border: "1px solid rgba(212,195,150,0.08)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ↓
                    </kbd>
                    <span
                      className="text-[9px] ml-1"
                      style={{
                        color: "rgba(212,195,150,0.25)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      navigate
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd
                      className="inline-flex items-center justify-center h-5 px-1.5 rounded text-[9px]"
                      style={{
                        color: "rgba(212,195,150,0.30)",
                        background: "rgba(212,195,150,0.06)",
                        border: "1px solid rgba(212,195,150,0.08)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ↵
                    </kbd>
                    <span
                      className="text-[9px]"
                      style={{
                        color: "rgba(212,195,150,0.25)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      open
                    </span>
                  </span>
                </div>
                <span
                  className="text-[9px] flex items-center gap-1"
                  style={{
                    color: "rgba(212,195,150,0.20)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <Command className="w-3 h-3" />K to open
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
