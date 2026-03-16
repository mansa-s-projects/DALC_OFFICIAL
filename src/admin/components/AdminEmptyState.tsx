type AdminEmptyStateProps = {
  message: string;
};

export default function AdminEmptyState({ message }: AdminEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[#C8A46B]/12 bg-[#111214]/85 px-6 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <p className="text-sm uppercase tracking-[0.16em] text-[#C8A46B]/70">No Results</p>
      <p className="mt-3 font-display text-2xl text-[#F4E2BA]">{message}</p>
    </div>
  );
}
