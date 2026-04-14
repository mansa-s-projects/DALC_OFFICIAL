'use client';

import { useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Map } from 'lucide-react';

interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  dur: number;
  delay: number;
  opacity: number;
}

interface GridLine {
  id: number;
  x: string;
  y: string;
  horizontal: boolean;
  length: string;
  opacity: number;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function ExploreHero() {
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 500], [0, 60]);
  const bgY = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: `${(i * 41 + 13) % 100}%`,
        y: `${(i * 67 + 5) % 100}%`,
        size: i % 3 === 0 ? 2 : 1,
        dur: 3.5 + (i % 7) * 0.55,
        delay: (i % 11) * 0.28,
        opacity: 0.15 + (i % 5) * 0.07,
      })),
    [],
  );

  // Sparse cartographic grid lines for map-atlas feel
  const gridLines = useMemo<GridLine[]>(
    () => [
      { id: 0,  x: '18%',  y: '0',    horizontal: false, length: '100%', opacity: 0.04 },
      { id: 1,  x: '42%',  y: '0',    horizontal: false, length: '100%', opacity: 0.03 },
      { id: 2,  x: '67%',  y: '0',    horizontal: false, length: '100%', opacity: 0.04 },
      { id: 3,  x: '84%',  y: '0',    horizontal: false, length: '100%', opacity: 0.025 },
      { id: 4,  x: '0',    y: '28%',  horizontal: true,  length: '100%', opacity: 0.04 },
      { id: 5,  x: '0',    y: '55%',  horizontal: true,  length: '100%', opacity: 0.03 },
      { id: 6,  x: '0',    y: '76%',  horizontal: true,  length: '100%', opacity: 0.035 },
    ],
    [],
  );

  const handleExplore = useCallback(() => scrollToId('explore-filters'), []);
  const handleMap    = useCallback(() => scrollToId('explore-map'), []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0B0B0C]">

      {/* ── Layered background ──────────────────────────────────────────── */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0">

        {/* Deep base glow — top centre */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,rgba(200,164,107,0.09),transparent)]" />

        {/* Mid glow — bottom offset */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_110%,rgba(200,164,107,0.055),transparent)]" />

        {/* Horizon line */}
        <div className="absolute left-0 right-0 top-[58%] h-px bg-gradient-to-r from-transparent via-[#C8A46B]/12 to-transparent" />

        {/* Cartographic grid */}
        {gridLines.map((line) =>
          line.horizontal ? (
            <div
              key={line.id}
              className="absolute left-0 right-0 h-px"
              style={{ top: line.y, opacity: line.opacity, background: 'rgba(200,164,107,1)' }}
            />
          ) : (
            <div
              key={line.id}
              className="absolute top-0 w-px"
              style={{ left: line.x, height: line.length, opacity: line.opacity, background: 'rgba(200,164,107,1)' }}
            />
          ),
        )}

        {/* Drifting coordinate labels — atlas flavour */}
        {[
          { label: '25.2048° N', x: '10%',  y: '22%', delay: 0 },
          { label: '55.2708° E', x: '80%',  y: '38%', delay: 0.6 },
          { label: '24.4539° N', x: '62%',  y: '72%', delay: 1.1 },
          { label: '54.6773° E', x: '22%',  y: '64%', delay: 0.3 },
          { label: '26.1921° N', x: '46%',  y: '16%', delay: 0.9 },
        ].map((coord, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, coord.delay < 0.5 ? 0.18 : 0.12, 0.18] }}
            transition={{ duration: 3, delay: 1.6 + coord.delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            className="absolute select-none font-mono text-[9px] tracking-widest text-[#C8A46B]"
            style={{ left: coord.x, top: coord.y }}
          >
            {coord.label}
          </motion.span>
        ))}
      </motion.div>

      {/* ── Particle field ──────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#C8A46B]"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{
              opacity: [p.opacity, p.opacity * 4.5, p.opacity],
              scale:   [1, p.size === 2 ? 1.8 : 1.4, 1],
            }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Hero content ────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#C8A46B]/70" />
          <span className="text-[10px] font-bold uppercase tracking-[0.55em] text-[#C8A46B]">
            Dubai À La Carte
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#C8A46B]/70" />
        </motion.div>

        {/* Main headline — two lines, staggered reveal */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-white"
          >
            Explore the
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.05, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block font-display text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-[#C8A46B]"
          >
            UAE
            {/* Animated underline */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-2 left-0 block h-[2px] w-full origin-left bg-gradient-to-r from-[#C8A46B] via-[#C8A46B]/70 to-transparent"
            />
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
          className="mx-auto mt-9 max-w-md text-[1.05rem] leading-[1.75] tracking-[0.01em] text-[#B6B6B6]"
        >
          Hidden gems, iconic places, and curated destinations — a private atlas of the Emirates.
        </motion.p>

        {/* CTA cluster */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.72, ease: 'easeOut' }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={handleExplore}
            className="group relative overflow-hidden rounded-full bg-[#C8A46B] px-9 py-3.5 text-sm font-semibold tracking-[0.06em] text-[#0B0B0C] transition-all duration-300 hover:shadow-[0_0_40px_-4px_rgba(200,164,107,0.65)] active:scale-[0.97]"
          >
            <span className="relative z-10 uppercase">Start Exploring</span>
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
          </button>

          <button
            onClick={handleMap}
            className="group flex items-center gap-2.5 rounded-full border border-[rgba(200,164,107,0.35)] bg-transparent px-8 py-3.5 text-sm font-semibold tracking-[0.06em] text-[#C8A46B] backdrop-blur-sm transition-all duration-300 hover:border-[#C8A46B]/70 hover:bg-[rgba(200,164,107,0.07)] active:scale-[0.97] uppercase"
          >
            <Map className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
            View Map
          </button>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 flex items-center justify-center gap-8"
        >
          {[
            { value: '7', label: 'Emirates' },
            { value: '200+', label: 'Locations' },
            { value: '40+', label: 'Categories' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="font-display text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#B6B6B6]/50">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4 text-[#C8A46B]/40" />
        </motion.div>
        <span className="text-[9px] uppercase tracking-[0.45em] text-[#C8A46B]/30">Discover</span>
      </motion.div>

      {/* ── Bottom vignette fade ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B0B0C] to-transparent" />
    </section>
  );
}
