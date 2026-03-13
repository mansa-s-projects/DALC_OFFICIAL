import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-luxury-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-10 w-8 flex items-end justify-center pb-1">
                <svg viewBox="0 0 40 100" className="h-full w-auto text-luxury-gold fill-current">
                   <path d="M19 0 L21 0 L21 100 L19 100 Z" />
                   <path d="M21 20 L25 20 L25 100 L21 100 Z" className="opacity-90"/>
                   <path d="M25 40 L29 40 L29 100 L25 100 Z" className="opacity-75"/>
                   <path d="M29 60 L33 60 L33 100 L29 100 Z" className="opacity-60"/>
                   <path d="M33 80 L38 80 L38 100 L33 100 Z" className="opacity-40"/>
                   <path d="M15 20 L19 20 L19 100 L15 100 Z" className="opacity-90"/>
                   <path d="M11 40 L15 40 L15 100 L11 100 Z" className="opacity-75"/>
                   <path d="M7 60 L11 60 L11 100 L7 100 Z" className="opacity-60"/>
                   <path d="M2 80 L7 80 L7 100 L2 100 Z" className="opacity-40"/>
                 </svg>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier concierge service for the modern elite. Experience Dubai like never before with our curated selection of venues and experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-6">Service</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Concierge</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Membership</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2024 Dubai À La Carte. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>Twitter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}