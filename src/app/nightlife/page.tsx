import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dubai Nightlife Concierge | Dubai À La Carte',
  description: 'Discover Dubai nightlife with DALC concierge access.',
};

export default function NightlifePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-serif text-cipher-gold mb-6">Nightlife</h1>
      <p className="text-xl text-cipher-muted max-w-2xl">
        Experience the ultimate VIP nightlife in Dubai. Exclusive tables, beach clubs, and elite dining entertainment.
      </p>
      <div className="mt-8 text-cipher-dim border border-cipher-rim p-6 rounded bg-cipher-card2">
        <p>Placeholder content - Nightlife architecture refactoring in progress.</p>
      </div>
    </div>
  );
}
