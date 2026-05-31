'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ImageOff } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import { getExperienceCategory, type ExperienceCatalogItem } from '../catalog';
import { EXPERIENCE_CATEGORY_FALLBACK_IMAGES } from '../constants';
import { DESERT_SUBCATEGORIES, type DesertSubcategory } from '../desertData';
import { WATER_MODELS, type WaterModel } from '../waterData';

// Experience card with image error handling
function ExperienceCard({ item, categorySlug }: { item: ExperienceCatalogItem; categorySlug: string }) {
  const [imgError, setImgError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const fallbackImage = EXPERIENCE_CATEGORY_FALLBACK_IMAGES[categorySlug];
  const primaryImage = item.image || '';
  const usingFallback = imgError || !primaryImage;
  const imageSrc = usingFallback ? fallbackImage : primaryImage;
  const showPlaceholder = !imageSrc || fallbackError;

  return (
    <article className="border border-white/10 bg-white/[0.02] overflow-hidden group hover:border-luxury-gold/30 transition-all duration-300">
      <div className="relative w-full h-48 bg-white/5 overflow-hidden">
        {!showPlaceholder && imageSrc ? (
          <img 
            src={imageSrc} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              if (!usingFallback && fallbackImage) {
                setImgError(true);
                setFallbackError(false);
                return;
              }

              setFallbackError(true);
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <ImageOff className="w-8 h-8 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h2 className="text-xl font-display text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300">{item.title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{item.description}</p>
        <Link
          href={`/experiences/${categorySlug}/${item.slug}`}
          className="inline-flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors"
        >
          View Detail <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}

function DesertSubcategoryCard({ sub }: { sub: DesertSubcategory }) {
  return (
    <Link
      href={`/experiences/desert-adventures/${sub.slug}`}
      className="group relative overflow-hidden border border-cipher-rim hover:border-cipher-gold/50 transition-all duration-500 bg-cipher-ink"
    >
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <img
          src={sub.image}
          alt={sub.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        {sub.badge && (
          <span className="absolute top-3 left-3 bg-cipher-gold text-black font-mono text-[9px] uppercase tracking-widest px-2.5 py-1">
            {sub.badge}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="font-display text-white text-xl leading-snug mb-1.5 group-hover:text-cipher-gold transition-colors duration-300">
            {sub.title}
          </h2>
          <p className="text-white/55 text-xs line-clamp-2 mb-3 leading-relaxed">{sub.shortDescription}</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-cipher-gold text-sm">from AED {sub.fromPrice.toLocaleString()}</span>
            <span className="flex items-center gap-1 font-mono text-white/40 text-[10px] uppercase tracking-widest group-hover:text-cipher-gold transition-colors duration-300">
              Book Now <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function WaterModelCard({ model }: { model: WaterModel }) {
  return (
    <Link
      href={`/experiences/water-activities/${model.slug}`}
      className="group relative overflow-hidden border border-cipher-rim hover:border-cipher-rim3 transition-all duration-300 bg-cipher-ink"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={model.image}
          alt={model.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cipher-void/80 to-transparent" />
        <span className="absolute top-3 right-3 bg-cipher-gold/15 border border-cipher-gold/40 text-cipher-gold text-[9px] font-mono uppercase tracking-widest px-2.5 py-1">
          {model.group === 'jet-car' ? 'Jet Car' : 'Jet Ski'}
        </span>
        {model.badge && (
          <span className="absolute top-3 left-3 bg-cipher-gold/15 border border-cipher-gold/40 text-cipher-gold text-[9px] font-mono uppercase tracking-widest px-2.5 py-1">
            {model.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-lg font-display text-cipher-white mb-1 group-hover:text-cipher-gold transition-colors duration-300">
          {model.title}
        </h2>
        <p className="text-cipher-muted text-sm line-clamp-2 mb-4">{model.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-cipher-gold font-mono text-xs">from AED {model.fromPrice.toLocaleString()}</span>
          <span className="flex items-center gap-1.5 text-cipher-gold text-xs uppercase tracking-widest">
            Explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SubcategoryListPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = use(params);

  if (categorySlug === 'water-activities') {
    const jetSkis = WATER_MODELS.filter((m) => m.group === 'jet-ski');
    const jetCars = WATER_MODELS.filter((m) => m.group === 'jet-car');
    return (
      <div className="min-h-screen bg-cipher-void">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-cipher-muted hover:text-cipher-gold transition-colors text-xs uppercase tracking-widest mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Experiences
          </Link>
          <header className="mb-12">
            <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-3">Experiences</p>
            <h1 className="text-4xl md:text-5xl font-display text-cipher-white mb-4">
              Water Activities Dubai
            </h1>
            <p className="text-cipher-muted max-w-2xl leading-relaxed">
              Dubai&apos;s Arabian Gulf at your throttle — premium jet skis and jet cars departing from JBR Beach,
              Palm Jumeirah Marina, and Dubai Marina. Every session includes safety gear and a full briefing.
            </p>
          </header>
          {jetSkis.length > 0 && (
            <section className="mb-14">
              <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-6">Jet Skis</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jetSkis.map((model) => (
                  <WaterModelCard key={model.slug} model={model} />
                ))}
              </div>
            </section>
          )}
          {jetCars.length > 0 && (
            <section>
              <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-6">Jet Cars</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jetCars.map((model) => (
                  <WaterModelCard key={model.slug} model={model} />
                ))}
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (categorySlug === 'desert-adventures') {
    return (
      <div className="min-h-screen bg-cipher-void">
        <Navbar />
        <section className="relative h-[56vh] min-h-[380px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=2070&auto=format&fit=crop"
            alt="Desert Adventures Dubai"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cipher-void via-cipher-void/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cipher-void/60 to-transparent" />
          <div className="absolute bottom-10 left-4 md:left-10 xl:left-16">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-cipher-gold transition-colors text-[10px] uppercase tracking-[0.35em] mb-5"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Experiences
            </Link>
            <p className="text-cipher-gold text-[10px] uppercase tracking-[0.5em] mb-2">Experiences · Dubai Desert</p>
            <h1 className="text-5xl md:text-7xl font-display text-white leading-none mb-4">
              Desert Adventures
            </h1>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300/80 text-xs font-mono tracking-wide">32 bookings this week · 5 categories</span>
            </div>
          </div>
        </section>
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24">
          <p className="text-cipher-muted text-sm leading-relaxed max-w-2xl mb-10">
            From high-octane dune buggies and ATVs to sunset desert safaris, camel rides, and sandboarding —
            five ways to experience the legendary Lahbab Red Sand Dunes.
          </p>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {DESERT_SUBCATEGORIES.map((sub) => (
              <DesertSubcategoryCard key={sub.slug} sub={sub} />
            ))}
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const category = getExperienceCategory(categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-luxury-black text-white">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-20 text-center">
          <p className="text-gray-400 mb-6">Category not found.</p>
          <Link href="/experiences" className="text-luxury-gold text-sm uppercase tracking-widest">
            Back to Experiences
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
        <Link
          href="/experiences"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors text-xs uppercase tracking-widest mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>

        <header className="mb-10">
          <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-3">{category.title}</p>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-3">{category.title}</h1>
          <p className="text-gray-400 max-w-2xl">{category.description}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {category.items.map((item) => (
            <ExperienceCard key={item.slug} item={item} categorySlug={category.slug} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
