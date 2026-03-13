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
  placeholder = 'Search... ',
  className,
}: AdminSearchInputProps) {
  return (
    <div className={`relative flex-1 max-w-sm ${className ?? ''}`.trim()}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-luxury-gold"
      />
    </div>
  );
}
