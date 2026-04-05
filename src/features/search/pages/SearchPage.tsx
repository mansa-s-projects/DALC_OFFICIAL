"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import SearchResultItem from "@/components/search/SearchResultItem";
import { useAppStore } from "@/store/useAppStore";
import {
  useSearch,
  SEARCH_SUGGESTIONS,
  SEARCH_RESULT_TYPE_LABELS,
  type SearchResultType,
} from "@/features/search";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "venue", label: "Venues" },
  { key: "experience", label: "Experiences" },
  { key: "transport", label: "Travel" },
  { key: "business", label: "Business" },
  { key: "stay", label: "Travel Stays" },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";
  const [activeFilter, setActiveFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const profileSkills = useAppStore((s) => s.profile?.skills ?? s.user?.skills ?? []);

  const { query, setQuery, results, isSearching, clearSearch, hasQuery } =
    useSearch(initialQ);

  useEffect(() => {
    const q = query.trim();
    if (q.length >= 2) {
      const params = new URLSearchParams();
      params.set("q", q);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [query, router]);

  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return results;
    return results.filter((r) => r.type === activeFilter);
  }, [results, activeFilter]);

  const groupedResults = useMemo(() => {
    if (activeFilter !== "all") return { [activeFilter]: filteredResults };
    const groups: Record<string, typeof results> = {};
    for (const r of filteredResults) {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    }
    return groups;
  }, [filteredResults, activeFilter]);

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

  const conciergeCopy = profileSkills.length > 0
    ? `Your profile leans ${profileSkills.slice(0, 2).join(" and ").toLowerCase()} right now.`
    : "Need something bespoke? Our concierge team can stitch venues, travel, and travel stays into one plan.";

  return (
    <div className="min-h-screen" style={{ background: "#080706" }}>
      <Navbar />

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
              className="text-center mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 300,
                color: "rgba(245,237,216,0.95)",
                letterSpacing: "-0.01em",
              }}
            >
              Find the next <span style={{ fontStyle: "italic", color: "#C9A84C" }}>move</span>
            </h1>
            <p
              className="mb-8 text-center text-sm"
              style={{ color: "rgba(212,195,150,0.45)", fontFamily: "var(--font-body)" }}
            >
              Search nightlife, experiences, travel, business setup, and travel stays across the full DALC funnel.
            </p>

            <div
              className="relative flex items-center gap-3 px-5 py-4 rounded-xl"
              style={{
                background: "rgba(24,21,16,0.8)",
                border: "1px solid rgba(212,195,150,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <Search className="w-5 h-5 flex-shrink-0" style={{ color: "rgba(201,168,76,0.50)" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveFilter("all");
                }}
                placeholder="Search venues, experiences, travel, travel stays, or concierge needs..."
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
                    <X className="w-4 h-4" style={{ color: "rgba(212,195,150,0.40)" }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

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
                      isActive ? "bg-cipher-gold/10 border-cipher-gold/25" : "hover:bg-cipher-surface border-transparent",
                      (!hasQuery || (!hasResults && f.key !== "all")) && "opacity-40 cursor-not-allowed",
                    )}
                    style={{
                      color: isActive ? "#C9A84C" : "rgba(212,195,150,0.50)",
                      background: isActive ? "rgba(201,168,76,0.08)" : "transparent",
                      border: `1px solid ${isActive ? "rgba(201,168,76,0.20)" : "rgba(212,195,150,0.08)"}`,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {f.label}
                    {hasQuery && hasResults && (
                      <span
                        className="ml-1 px-1.5 py-0.5 rounded-full text-[8px]"
                        style={{
                          background: isActive ? "rgba(201,168,76,0.15)" : "rgba(212,195,150,0.08)",
                          color: isActive ? "#C9A84C" : "rgba(212,195,150,0.40)",
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

      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {!isSearching && !hasQuery && (
            <div
              className="mb-8 rounded-2xl border p-5"
              style={{ background: "rgba(201,168,76,0.05)", borderColor: "rgba(201,168,76,0.14)" }}
            >
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(201,168,76,0.72)", fontFamily: "var(--font-mono)" }}>
                Concierge Shortcut
              </p>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl" style={{ color: "rgba(245,237,216,0.92)", fontFamily: "var(--font-display)" }}>
                    Can’t find the exact fit?
                  </h2>
                  <p className="mt-2 max-w-xl text-sm" style={{ color: "rgba(212,195,150,0.48)" }}>
                    {conciergeCopy}
                  </p>
                </div>
                <Link
                  href="/request"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.18em]"
                  style={{ background: "#C9A84C", color: "#100800", fontFamily: "var(--font-mono)" }}
                >
                  Open Concierge Brief <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {isSearching && hasQuery && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cipher-gold/20 border-t-cipher-gold rounded-full animate-spin" />
                <span className="text-xs" style={{ color: "rgba(212,195,150,0.40)", fontFamily: "var(--font-mono)" }}>
                  Searching across all categories...
                </span>
              </div>
            </div>
          )}

          {!isSearching && hasQuery && filteredResults.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs" style={{ color: "rgba(212,195,150,0.40)", fontFamily: "var(--font-mono)" }}>
                  {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                  {query && (
                    <span> for &ldquo;<span style={{ color: "rgba(201,168,76,0.60)" }}>{query}</span>&rdquo;</span>
                  )}
                </p>
              </div>

              {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="mb-6 last:mb-0">
                  {activeFilter === "all" && (
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className="text-[9px] uppercase tracking-[0.15em] font-medium" style={{ color: "rgba(212,195,150,0.30)", fontFamily: "var(--font-mono)" }}>
                        {SEARCH_RESULT_TYPE_LABELS[type as SearchResultType] || type}
                      </span>
                      <div className="flex-1 h-px" style={{ background: "rgba(212,195,150,0.06)" }} />
                      <span className="text-[9px]" style={{ color: "rgba(212,195,150,0.20)", fontFamily: "var(--font-mono)" }}>{items.length}</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    {items.map((result, idx) => (
                      <motion.div key={result.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: idx * 0.03 }}>
                        <SearchResultItem result={result} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!isSearching && hasQuery && filteredResults.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(212,195,150,0.04)", border: "1px solid rgba(212,195,150,0.08)" }}>
                <Search className="w-6 h-6" style={{ color: "rgba(212,195,150,0.20)" }} />
              </div>
              <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-display)", color: "rgba(245,237,216,0.70)" }}>
                No exact matches yet
              </h3>
              <p className="text-sm mb-8" style={{ color: "rgba(212,195,150,0.35)", fontFamily: "var(--font-body)" }}>
                Try another search term or open a concierge brief for a bespoke route.
              </p>
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {SEARCH_SUGGESTIONS.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 rounded-full text-[10px] transition-all duration-200 hover:bg-cipher-gold/10 hover:border-cipher-gold/20"
                    style={{ color: "rgba(212,195,150,0.50)", background: "rgba(212,195,150,0.04)", border: "1px solid rgba(212,195,150,0.08)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Link href="/request" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.18em]" style={{ background: "rgba(201,168,76,0.10)", border: "1px solid rgba(201,168,76,0.20)", color: "#C9A84C", fontFamily: "var(--font-mono)" }}>
                Ask Concierge Instead <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          )}

          {!hasQuery && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-12">
              <div className="mb-10">
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(212,195,150,0.30)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
                  Trending Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SEARCH_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-5 py-2.5 rounded-full text-[11px] transition-all duration-200 hover:bg-cipher-gold/10 hover:border-cipher-gold/20"
                      style={{ color: "rgba(212,195,150,0.55)", background: "rgba(212,195,150,0.04)", border: "1px solid rgba(212,195,150,0.08)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(212,195,150,0.30)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
                  Browse Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Nightlife", desc: "Clubs, restaurants, beach clubs", href: "/nightlife", color: "#C9A84C" },
                    { label: "Experiences", desc: "Desert, water, culture, wellness", href: "/experiences", color: "#7EB8A0" },
                    { label: "Travel", desc: "Car rental, flights, hotels, villas, residences, private jets", href: "/travel", color: "#8BA4D4" },
                    { label: "Travel Stays", desc: "Hotels, villas, and residences inside Travel", href: "/travel/hotels", color: "#B89AD4" },
                    { label: "Business", desc: "Formation, licensing, banking", href: "/business", color: "#C4917D" },
                    { label: "Concierge", desc: "Personal assistance and bespoke requests", href: "/request", color: "#C9A84C" },
                  ].map((cat) => (
                    <a key={cat.href} href={cat.href} className="group p-4 rounded-xl transition-all duration-300 hover:bg-cipher-surface" style={{ background: "rgba(18,15,10,0.6)", border: "1px solid rgba(212,195,150,0.06)" }}>
                      <div className="w-2 h-2 rounded-full mb-3" style={{ background: cat.color }} />
                      <h4 className="text-sm mb-1 group-hover:text-cipher-gold transition-colors" style={{ color: "rgba(245,237,216,0.85)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{cat.label}</h4>
                      <p className="text-[10px]" style={{ color: "rgba(212,195,150,0.35)", fontFamily: "var(--font-body)" }}>{cat.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#080706" }}>
          <div className="w-6 h-6 border-2 border-cipher-gold/20 border-t-cipher-gold rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
