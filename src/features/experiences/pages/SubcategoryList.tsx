'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ImageOff } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import { getExperienceCategory, type ExperienceCatalogItem } from '../catalog';

// Category fallback images
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'desert-adventures': 'https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=800&auto=format&fit=crop',
  'water-activities': 'https://images.unsplash.com/photo-1566373809071-8bc4ae67f186?q=80&w=800&auto=format&fit=crop',
  'aerial-and-adrenaline': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=800&auto=format&fit=crop',
  wellness: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
  'tickets-and-culture': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
  'luxury-leisure': 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
};

// Experience card with image error handling
function ExperienceCard({ item, categorySlug }: { item: ExperienceCatalogItem; categorySlug: string }) {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = CATEGORY_FALLBACK_IMAGES[categorySlug];
  const imageSrc = imgError ? fallbackImage : (item.image || fallbackImage);

  return (
    <article className="border border-white/10 bg-white/[0.02] overflow-hidden group hover:border-luxury-gold/30 transition-all duration-300">
      <div className="relative w-full h-48 bg-white/5 overflow-hidden">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
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

export default function SubcategoryListPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = use(params);
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
