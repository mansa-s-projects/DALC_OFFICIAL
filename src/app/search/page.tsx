"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import SearchResultItem from "@/components/search/SearchResultItem";
import {
  useSearch,
  SEARCH_SUGGESTIONS,
  SEARCH_FILTER_LABELS,
  SEARCH_RESULT_TYPE_LABELS,
  type SearchResultType,
} from "@/features/search";
import { cn } from "@/lib/utils";

// ─── Filter Tabs ─────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "venue", label: "Venues" },
  { key: "experience", label: "Experiences" },
  { key: "transport", label: "Transport" },
  { key: "business", label: "Business" },
  { key: "stay", label: "Stays" },
];

// ─── Inner Component (uses useSearchParams) ──────────────────────────────────────

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";
  const [activeFilter, setActiveFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const { query, setQuery, results, isSearching, clearSearch, hasQuery } =
    useSearch(initialQ);

  // Sync URL
  useEffect(() => {
    const q = query.trim();
    if (q.length >= 2) {
      const params = new URLSearchParams();
      params.set("q", q);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [query, router]);

  // Filtered results
  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return results;
    return results.filter((r) => r.type === activeFilter);
  }, [results, activeFilter]);

  // Group for display
  const groupedResults = useMemo(() => {
    if (activeFilter !== "all") return { [activeFilter]: filteredResults };
    const groups: Record<string, typeof results> = {};
    for (const r of filteredResults) {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    }
    return groups;
  }, [filteredResults, activeFilter]);

  // Counts per type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: results.length };
    for (const r of results) {
      counts[r.type] = (counts[r.type] || 0) + 1;
    }
    return counts;
  }, [results]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setActiveFilter("all");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen" style={{ background: "#080706" }}>
      <Navbar />

      {/* Hero / Search Area */}
      <section
        className="pt-32 pb-8 px-4"
        style={{
          background: "linear-gradient(180deg, #120F0A 0%, #080706 100%)",
          borderBottom: "1px solid rgba(212,195,150,0.06)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="text-center mb-8"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 300,
                color: "rgba(245,237,216,0.95)",
                letterSpacing: "-0.01em",
              }}
            >
              Discover{" "}
              <span style={{ fontStyle: "italic", color: "#C9A84C" }}>
                Dubai
              </span>
            </h1>

            {/* Search Input */}
            <div
              className="relative flex items-center gap-3 px-5 py-4 rounded-xl"
              style={{
                background: "rgba(24,21,16,0.8)",
                border: "1px solid rgba(212,195,150,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
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
                  setActiveFilter("all");
                }}
                placeholder="Search venues, experiences, transport..."
                className="flex-1 bg-transparent text-sm outline-none caret-cipher-gold"
                style={{
                  color: "rgba(245,237,216,0.95)",
                  fontFamily: "var(--font-body)",
                  caretColor: "#C9A84C",
                }}
                autoComplete="off"
                autoFocus
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      clearSearch();
                      setActiveFilter("all");
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded hover:bg-cipher-surface transition-colors"
                  >
                    <X
                      className="w-4 h-4"
                      style={{ color: "rgba(212,195,150,0.40)" }}
                    />
                  </motion.button>
                )}
              </AnimatePresence>
              <kbd
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px]"
                style={{
                  color: "rgba(212,195,150,0.30)",
                  background: "rgba(212,195,150,0.06)",
                  border: "1px solid rgba(212,195,150,0.08)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ⌘K
              </kbd>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide">
              {FILTER_OPTIONS.map((f) => {
                const count = typeCounts[f.key] || 0;
                const isActive = activeFilter === f.key;
                const hasResults = count > 0;
                return (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    disabled={!hasQuery || (!hasResults && f.key !== "all")}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-200 flex-shrink-0",
                      isActive
                        ? "bg-cipher-gold/10 border-cipher-gold/25"
                        : "hover:bg-cipher-surface border-transparent",
                      (!hasQuery || (!hasResults && f.key !== "all")) &&
                        "opacity-40 cursor-not-allowed",
                    )}
                    style={{
                      color: isActive ? "#C9A84C" : "rgba(212,195,150,0.50)",
                      background: isActive
                        ? "rgba(201,168,76,0.08)"
                        : "transparent",
                      border: `1px solid ${isActive ? "rgba(201,168,76,0.20)" : "rgba(212,195,150,0.08)"}`,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {f.label}
                    {hasQuery && hasResults && (
                      <span
                        className="ml-1 px-1.5 py-0.5 rounded-full text-[8px]"
                        style={{
                          background: isActive
                            ? "rgba(201,168,76,0.15)"
                            : "rgba(212,195,150,0.08)",
                          color: isActive
                            ? "#C9A84C"
                            : "rgba(212,195,150,0.40)",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Loading */}
          {isSearching && hasQuery && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cipher-gold/20 border-t-cipher-gold rounded-full animate-spin" />
                <span
                  className="text-xs"
                  style={{
                    color: "rgba(212,195,150,0.40)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Searching across all categories...
                </span>
              </div>
            </div>
          )}

          {/* Results */}
          {!isSearching && hasQuery && filteredResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-5">
                <p
                  className="text-xs"
                  style={{
                    color: "rgba(212,195,150,0.40)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {filteredResults.length} result
                  {filteredResults.length !== 1 ? "s" : ""}
                  {query && (
                    <span>
                      {" "}
                      for &ldquo;
                      <span style={{ color: "rgba(201,168,76,0.60)" }}>
                        {query}
                      </span>
                      &rdquo;
                    </span>
                  )}
                </p>
              </div>

              {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="mb-6 last:mb-0">
                  {activeFilter === "all" && (
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span
                        className="text-[9px] uppercase tracking-[0.15em] font-medium"
                        style={{
                          color: "rgba(212,195,150,0.30)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {SEARCH_RESULT_TYPE_LABELS[type as SearchResultType] ||
                          type}
                      </span>
                      <div
                        className="flex-1 h-px"
                        style={{ background: "rgba(212,195,150,0.06)" }}
                      />
                      <span
                        className="text-[9px]"
                        style={{
                          color: "rgba(212,195,150,0.20)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {items.length}
                      </span>
                    </div>
                  )}
                  <div className="space-y-1">
                    {items.map((result, idx) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                      >
                        <SearchResultItem result={result} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Empty */}
          {!isSearching && hasQuery && filteredResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: "rgba(212,195,150,0.04)",
                  border: "1px solid rgba(212,195,150,0.08)",
                }}
              >
                <Search
                  className="w-6 h-6"
                  style={{ color: "rgba(212,195,150,0.20)" }}
                />
              </div>
              <h3
                className="text-lg mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(245,237,216,0.70)",
                }}
              >
                No results found
              </h3>
              <p
                className="text-sm mb-8"
                style={{
                  color: "rgba(212,195,150,0.35)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Try adjusting your search or explore our suggestions
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SEARCH_SUGGESTIONS.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 rounded-full text-[10px] transition-all duration-200 hover:bg-cipher-gold/10 hover:border-cipher-gold/20"
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
            </motion.div>
          )}

          {/* Initial State */}
          {!hasQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="py-12"
            >
              {/* Trending Suggestions */}
              <div className="mb-10">
                <h3
                  className="text-xs uppercase tracking-widest mb-5"
                  style={{
                    color: "rgba(212,195,150,0.30)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.15em",
                  }}
                >
                  Trending Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SEARCH_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-5 py-2.5 rounded-full text-[11px] transition-all duration-200 hover:bg-cipher-gold/10 hover:border-cipher-gold/20"
                      style={{
                        color: "rgba(212,195,150,0.55)",
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

              {/* Browse Categories */}
              <div>
                <h3
                  className="text-xs uppercase tracking-widest mb-5"
                  style={{
                    color: "rgba(212,195,150,0.30)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.15em",
                  }}
                >
                  Browse Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Venues",
                      desc: "Clubs, restaurants, beach clubs",
                      href: "/venues",
                      color: "#C9A84C",
                    },
                    {
                      label: "Experiences",
                      desc: "Adventure, dining, wellness",
                      href: "/experiences",
                      color: "#7EB8A0",
                    },
                    {
                      label: "Transport",
                      desc: "Cars, yachts, jets",
                      href: "/transport",
                      color: "#8BA4D4",
                    },
                    {
                      label: "Stays",
                      desc: "Hotels, villas, residences",
                      href: "/stays",
                      color: "#B89AD4",
                    },
                    {
                      label: "Business",
                      desc: "Formation, licensing, banking",
                      href: "/business",
                      color: "#C4917D",
                    },
                    {
                      label: "Concierge",
                      desc: "Personal assistance",
                      href: "/concierge",
                      color: "#C9A84C",
                    },
                  ].map((cat) => (
                    <a
                      key={cat.href}
                      href={cat.href}
                      className="group p-4 rounded-xl transition-all duration-300 hover:bg-cipher-surface"
                      style={{
                        background: "rgba(18,15,10,0.6)",
                        border: "1px solid rgba(212,195,150,0.06)",
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mb-3"
                        style={{ background: cat.color }}
                      />
                      <h4
                        className="text-sm mb-1 group-hover:text-cipher-gold transition-colors"
                        style={{
                          color: "rgba(245,237,216,0.85)",
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                        }}
                      >
                        {cat.label}
                      </h4>
                      <p
                        className="text-[10px]"
                        style={{
                          color: "rgba(212,195,150,0.35)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {cat.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Keyboard shortcut hint */}
              <div className="text-center mt-12">
                <p
                  className="text-[10px] flex items-center justify-center gap-2"
                  style={{
                    color: "rgba(212,195,150,0.20)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Press
                  <kbd
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px]"
                    style={{
                      background: "rgba(212,195,150,0.06)",
                      border: "1px solid rgba(212,195,150,0.08)",
                    }}
                  >
                    ⌘K
                  </kbd>
                  anywhere to open quick search
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#080706" }}
        >
          <div className="w-6 h-6 border-2 border-cipher-gold/20 border-t-cipher-gold rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
