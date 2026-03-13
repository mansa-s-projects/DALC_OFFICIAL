type AdminLoadingRowsProps = {
  rows?: number;
  rowClassName?: string;
};

export default function AdminLoadingRows({ rows = 4, rowClassName = 'h-16' }: AdminLoadingRowsProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={`${rowClassName} animate-pulse rounded-sm bg-white/5`} />
      ))}
    </div>
  );
}
