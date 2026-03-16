type AdminLoadingRowsProps = {
  rows?: number;
  rowClassName?: string;
};

export default function AdminLoadingRows({ rows = 4, rowClassName = 'h-16' }: AdminLoadingRowsProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={`${rowClassName} animate-pulse rounded-xl border border-[#C8A46B]/10 bg-[#111214]/85`} />
      ))}
    </div>
  );
}
