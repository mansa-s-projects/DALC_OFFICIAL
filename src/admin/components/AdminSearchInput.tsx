import { Search } from 'lucide-react';

type AdminSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function AdminSearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: AdminSearchInputProps) {
  return (
    <div className={`relative flex-1 max-w-sm ${className ?? ''}`.trim()}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C8A46B]/55" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#C8A46B]/18 bg-[#111214] py-3 pl-10 pr-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition placeholder:text-white/25 focus:border-[#C8A46B]/55 focus:shadow-[0_0_0_4px_rgba(200,164,107,0.10)]"
      />
    </div>
  );
}
