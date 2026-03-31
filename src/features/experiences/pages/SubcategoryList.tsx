'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import { getExperienceCategory } from '../catalog';

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
            <article key={item.slug} className="border border-white/10 bg-white/[0.02] overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-white/5" />
              )}

              <div className="p-6">
                <h2 className="text-xl font-display text-white mb-2">{item.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{item.description}</p>
                <Link
                  href={`/experiences/${category.slug}/${item.slug}`}
                  className="inline-flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  View Detail <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
