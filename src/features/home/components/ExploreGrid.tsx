import { useMemo, useState } from 'react';
import InputField from './InputField';
import { EXPLORE_ITEMS } from '../constants';

export default function ExploreGrid() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'experiences' | 'nightlife' | 'travel'>('all');

  const items = useMemo(() => EXPLORE_ITEMS, []);

  const filtered = items.filter((item) => {
    const byFilter = filter === 'all' ? true : item.category === filter;
    const byQuery = item.name.toLowerCase().includes(query.toLowerCase());
    return byFilter && byQuery;
  });

  return (
    <section className="mt-14">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="font-display text-3xl text-[#EBD2A0]">Explore</h2>
        <div className="flex flex-wrap gap-2">
          {(['all', 'experiences', 'nightlife', 'travel'] as const).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.1em] transition ${
                filter === value
                  ? 'border-[#D6B574]/60 bg-[#D6B574]/20 text-[#F2DDAF]'
                  : 'border-white/15 text-white/60 hover:border-white/25'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <InputField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all services" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <Icon className="h-4 w-4 text-[#D6B574]" />
              <p className="mt-2 text-white">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.1em] text-white/45">{item.category}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
