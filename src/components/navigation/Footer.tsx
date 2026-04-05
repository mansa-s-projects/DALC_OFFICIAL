import React from 'react';
import Link from 'next/link';

// DALC palette
const C = {
  gold:    '#C9A84C',
  goldDim: '#7A6025',
  deep:    '#120F0A',
  white:   'rgba(245,237,216,0.95)',
  muted:   'rgba(212,195,150,0.60)',
  dim:     'rgba(212,195,150,0.30)',
  rim:     'rgba(212,195,150,0.07)',
};

export default function Footer() {
  return (
    <footer style={{ background: C.deep, borderTop: `1px solid ${C.rim}` }} className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">

          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative h-10 w-8 flex items-end justify-center pb-1">
                <svg viewBox="0 0 40 100" className="h-full w-auto fill-current" style={{ color: C.gold }}>
                  <path d="M19 0 L21 0 L21 100 L19 100 Z" />
                  <path d="M21 20 L25 20 L25 100 L21 100 Z" className="opacity-90" />
                  <path d="M25 40 L29 40 L29 100 L25 100 Z" className="opacity-75" />
                  <path d="M29 60 L33 60 L33 100 L29 100 Z" className="opacity-60" />
                  <path d="M33 80 L38 80 L38 100 L33 100 Z" className="opacity-40" />
                  <path d="M15 20 L19 20 L19 100 L15 100 Z" className="opacity-90" />
                  <path d="M11 40 L15 40 L15 100 L11 100 Z" className="opacity-75" />
                  <path d="M7 60 L11 60 L11 100 L7 100 Z" className="opacity-60" />
                  <path d="M2 80 L7 80 L7 100 L2 100 Z" className="opacity-40" />
                </svg>
              </div>
              <div>
                <p className="font-display font-light leading-none" style={{ fontSize: '18px', letterSpacing: '-0.01em', color: C.white }}>
                  Dubai
                </p>
                <p className="font-display font-light italic leading-none" style={{ fontSize: '14px', color: C.gold }}>
                  À La Carte
                </p>
              </div>
            </div>
            <p className="font-body font-light text-sm leading-relaxed" style={{ color: C.dim }}>
              The premier concierge service for the modern elite. Experience Dubai like never before
              with our curated selection of venues and experiences.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            {[
              {
                label: 'Explore',
                links: [
                  { label: 'Move To Dubai', href: '/move-to-dubai' },
                  { label: 'Nightlife',     href: '/nightlife' },
                  { label: 'Experiences',   href: '/experiences' },
                  { label: 'Travel',        href: '/travel' },
                ],
              },
              {
                label: 'Service',
                links: [
                  { label: 'Concierge', href: '/request' },
                  { label: 'Business',  href: '/business' },
                  { label: 'Live Map',  href: '/live-map' },
                ],
              },
              {
                label: 'Account',
                links: [
                  { label: 'Profile',       href: '/profile' },
                  { label: 'My Requests',   href: '/profile?tab=requests' },
                  { label: 'Notifications', href: '/notifications' },
                ],
              },
            ].map((col) => (
              <div key={col.label}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-4" style={{ background: C.goldDim }} />
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                    {col.label}
                  </h4>
                </div>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-body font-light text-sm transition-colors duration-200"
                        style={{ color: C.dim }}
                        onMouseEnter={e => { e.currentTarget.style.color = C.white; }}
                        onMouseLeave={e => { e.currentTarget.style.color = C.dim; }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: `1px solid rgba(212,195,150,0.05)` }}
        >
          <p className="font-mono text-[10px] tracking-[0.15em]" style={{ color: C.dim }}>
            © 2024 Dubai À La Carte. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Instagram', 'LinkedIn', 'Twitter'].map((social) => (
              <span
                key={social}
                className="font-mono text-[10px] tracking-[0.15em] cursor-pointer transition-colors duration-200"
                style={{ color: C.dim }}
                onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.dim; }}
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
