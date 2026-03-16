import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import AccessCard from '../../../components/cards/AccessCard';
import CategoryCard from '../../../components/cards/CategoryCard';
import EditorsPicks from '../../../components/layout/EditorsPicks';
import HeroSection from '../../../components/layout/HeroSection';
import ExploreGrid from '../components/ExploreGrid';
import RequestCard from '../components/RequestCard';
import VenueCard from '../components/VenueCard';
import { EDITORS_PICKS, EAGLE_PATH, FEATURED_VENUES, ROW_ONE_CATEGORIES, ROW_TWO_CATEGORIES, SAMPLE_REQUESTS } from '../constants';

const MAIN_NAV_ITEMS = [
  { label: 'Move To Dubai', to: '/move-to-dubai' },
  { label: 'Home', to: '/' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Nightlife', to: '/nightlife' },
  { label: 'Travel', to: '/travel' },
  { label: 'Business', to: '/business' },
  { label: 'Concierge', to: '/concierge' },
  { label: 'Explore', to: '/explore' },
] as const;

export default function HomeEntry() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowCard(true), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const handleAccess = async () => {
    const normalized = email.trim().toLowerCase();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSaving(true);

    if (supabase) {
      const { error: insertError } = await supabase.from('requests').insert({
        category: 'travel',
        request_type: 'inquiry',
        contact_name: 'DALC Access',
        contact_info: normalized,
        notes: 'source=dalc_access',
      });

      if (insertError) {
        setIsSaving(false);
        setError('Unable to secure access right now. Please try again.');
        return;
      }
    } else {
      const existing = JSON.parse(localStorage.getItem('dalc_access_emails') || '[]') as string[];
      localStorage.setItem('dalc_access_emails', JSON.stringify(Array.from(new Set([...existing, normalized]))));
    }

    setIsSaving(false);
    setIsAccessGranted(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050607] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(214,181,116,0.14),transparent_45%),radial-gradient(circle_at_80%_18%,rgba(142,168,194,0.18),transparent_44%),linear-gradient(180deg,#040507_0%,#07090c_46%,#040507_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:3px_3px]" />

      <motion.svg className="pointer-events-none absolute left-0 top-0 h-[320px] w-full opacity-55" viewBox="0 0 1120 140" fill="none">
        <defs>
          <linearGradient id="skyStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(199,216,232,0)" />
            <stop offset="45%" stopColor="rgba(199,216,232,0.7)" />
            <stop offset="100%" stopColor="rgba(199,216,232,0)" />
          </linearGradient>
        </defs>
        <path d={EAGLE_PATH} stroke="url(#skyStroke)" strokeWidth="1.5" />
      </motion.svg>

      <header className="relative z-30 px-6 py-6 md:px-12">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[#EBD2A0]">
            <Compass className="h-4 w-4" />
            <span className="font-display text-lg">DALC</span>
          </div>

          <nav className="hidden flex-1 items-center gap-5 md:flex lg:gap-6">
            {MAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs uppercase tracking-[0.1em] text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link to="/concierge" className="text-xs uppercase tracking-[0.1em] text-white/70 hover:text-white">Concierge</Link>
            <Link to="/login" className="rounded-md border border-[#D6B574]/40 px-4 py-2 text-xs uppercase tracking-[0.12em] text-[#EBD2A0] hover:bg-[#D6B574]/12">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="relative z-20 px-6 pb-16 md:px-12">
        <section className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <HeroSection />

            {!isAccessGranted && showCard ? (
              <div className="mx-auto mt-8 max-w-2xl">
                <AccessCard email={email} onEmailChange={setEmail} onSubmit={handleAccess} isSaving={isSaving} />
                {error ? <p className="mt-3 text-center text-sm text-red-300">{error}</p> : null}
              </div>
            ) : null}

            <motion.div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ROW_ONE_CATEGORIES.map((item, index) => (
                <CategoryCard key={item.title} item={item} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto mt-4 max-w-6xl">
          <div className="mb-8">
            <div className="grid gap-4 md:grid-cols-3">
              {ROW_TWO_CATEGORIES.map((item, index) => (
                <CategoryCard key={item.title} item={item} index={index} />
              ))}
            </div>
          </div>

          <EditorsPicks items={EDITORS_PICKS} />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
              <h3 className="font-display text-2xl text-[#EFD7A4]">Venues</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {FEATURED_VENUES.map((item) => (
                  <VenueCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
              <h3 className="font-display text-2xl text-[#EFD7A4]">Request Updates</h3>
              <div className="mt-4 grid gap-3">
                {SAMPLE_REQUESTS.map((item) => (
                  <RequestCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>

          <section className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-3xl text-[#EBD2A0] md:text-4xl">Explore</h2>
              <span className="text-xs uppercase tracking-[0.12em] text-white/45">Browse all services</span>
            </div>
            <ExploreGrid />
          </section>
        </section>
      </main>
    </div>
  );
}
