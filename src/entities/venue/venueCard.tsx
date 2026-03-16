import type { VenueCardModel } from './venueTypes';

type VenueCardProps = {
  venue: VenueCardModel;
};

export default function VenueCardEntity({ venue }: VenueCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="font-display text-lg text-white">{venue.name}</h4>
      <p className="mt-1 text-sm text-white/65">{venue.area}</p>
      <span className="mt-3 inline-block text-xs uppercase tracking-[0.12em] text-[#D6B574]">
        {venue.vibe}
      </span>
    </article>
  );
}
