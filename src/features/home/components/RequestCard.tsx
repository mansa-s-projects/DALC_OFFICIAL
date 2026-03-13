import type { RequestItem } from '../types';

type RequestCardProps = {
  item: RequestItem;
};

export default function RequestCard({ item }: RequestCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-sm text-white">{item.title}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-white/55">
        <span>{item.status}</span>
        <span>ETA {item.eta}</span>
      </div>
    </div>
  );
}
