import { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Loader2, MapPin, SlidersHorizontal } from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { useSearch } from '../../features/search/useSearch';
import type { SearchResult } from '../../features/search/useSearch';

const PRICE_MARKERS = ['', '$', '$$', '$$$', '$$$$'] as const;

const TYPE_COLORS: Record<string, string> = {
  venue: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  experience: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  transport: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  business: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const TYPE_LABELS: Record<string, string> = {
  venue: 'Venue',
  experience: 'Experience',
  transport: 'Transport',
  business: 'Business',
};

function ResultCard({ result }: { result: SearchResult }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={result.href}
        className="group flex gap-4 rounded-xl border border-white/8 bg-white/3 p-4 hover:border-[#C8A46B]/40 hover:bg-white/6 transition-all duration-300"
      >
        <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={result.image}
            alt={result.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1512453979798-5ea904ac6686?q=80&w=400&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Type badge */}
          <span className={`absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-medium border rounded ${TYPE_COLORS[result.type] || TYPE_COLORS.venue}`}>
            {TYPE_LABELS[result.type] || 'Venue'}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg text-white leading-tight truncate group-hover:text-[#EFD7A4] transition-colors">
                {result.title}
              </h3>
              {result.price_tier && (
                <span className="text-[#C8A46B] text-sm font-medium flex-shrink-0">
                  {PRICE_MARKERS[result.price_tier]}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-white/50 line-clamp-2 leading-snug">
              {result.subtitle}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs text-white/40">
              <MapPin className="h-3 w-3" />
              <span>{result.area}</span>
              <span className="mx-1 text-white/20">·</span>
              <span className="capitalize">{result.category.replace(/-/g, ' ')}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-[#C8A46B]/0 group-hover:text-[#C8A46B]/80 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const { query, setQuery, results, isSearching, clearSearch, hasQuery } = useSearch(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync URL param → query on mount
  useEffect(() => {
    if (initialQ) setQuery(initialQ);
    inputRef.current?.focus();
  }, []);

  // Keep URL in sync
  useEffect(() => {
    if (query) {
      setSearchParams({ q: query }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <Navbar />

      {/* ── Search Header ─────────────────────────────────── */}
      <section className="pt-28 pb-8 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#C8A46B] text-xs font-bold uppercase tracking-[0.4em] mb-3">
              Search Dubai
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-8 leading-tight">
              What are you looking for?
            </h1>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              {isSearching ? (
                <Loader2 className="h-5 w-5 text-[#C8A46B] animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-white/40" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Restaurants, beach clubs, experiences…"
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 py-4 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[#C8A46B]/50 focus:ring-1 focus:ring-[#C8A46B]/30 transition-all"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white/70 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Results ───────────────────────────────────────── */}
      <section className="pb-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Empty state — no query */}
            {!hasQuery && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                <div className="mx-auto mb-6 h-16 w-16 rounded-full border border-[#C8A46B]/20 flex items-center justify-center">
                  <Search className="h-7 w-7 text-[#C8A46B]/60" />
                </div>
                <p className="text-white/40 text-lg mb-2">Start typing to search</p>
                <p className="text-white/25 text-sm">
                  Find venues, experiences, restaurants, and more
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {['Beach Clubs', 'Fine Dining', 'Nightlife', 'Yachts', 'Desert', 'Wellness'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/50 hover:border-[#C8A46B]/40 hover:text-white/80 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {hasQuery && isSearching && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center"
              >
                <Loader2 className="mx-auto h-8 w-8 text-[#C8A46B] animate-spin" />
                <p className="mt-4 text-white/40">Searching…</p>
              </motion.div>
            )}

            {/* No results */}
            {hasQuery && !isSearching && results.length === 0 && (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                <p className="text-white/40 text-lg mb-2">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-white/25 text-sm mb-6">
                  Try a different search term
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#C8A46B]/30 bg-[#C8A46B]/10 px-6 py-3 text-sm text-[#EFD7A4] hover:bg-[#C8A46B]/20 transition-all"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Browse all venues
                </Link>
              </motion.div>
            )}

            {/* Results */}
            {hasQuery && !isSearching && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-white/40">
                    <span className="text-white/80 font-medium">{results.length}</span> result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                  </p>
                  <Link
                    to={`/explore?q=${encodeURIComponent(query)}`}
                    className="text-xs text-[#C8A46B] hover:text-[#EFD7A4] flex items-center gap-1 transition-colors"
                  >
                    View on map <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {results.map((r) => (
                    <ResultCard key={r.id} result={r} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
