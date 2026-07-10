'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Article {
  slug: string
  category: string
  title: string
  excerpt: string
  image: string
  href: string
}

const CATEGORIES = ['All', 'Nightlife', 'Experiences', 'Relocation', 'Services', 'Area Guide']

export default function CategoryFilter({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? articles : articles.filter(a => a.category === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-body tracking-wide transition-all duration-200',
              active === cat
                ? 'bg-cipher-gold text-cipher-void font-medium'
                : 'border border-cipher-rim text-cipher-muted hover:text-cipher-white hover:border-cipher-rim2'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(article => (
          <Link
            key={article.slug}
            href={article.href}
            className="group block bg-cipher-card2 border border-cipher-rim rounded-xl overflow-hidden hover:border-cipher-rim2 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
                {article.category}
              </span>
              <h2 className="font-display text-xl text-cipher-white mt-2 mb-3 leading-snug group-hover:text-cipher-beige transition-colors duration-200">
                {article.title}
              </h2>
              <p className="text-cipher-muted text-sm font-body leading-relaxed mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <span className="text-cipher-gold text-sm font-body font-medium group-hover:underline">
                Read More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
