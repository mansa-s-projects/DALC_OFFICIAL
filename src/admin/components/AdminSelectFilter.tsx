type AdminSelectFilterOption = {
  value: string;
  label: string;
};

type AdminSelectFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectFilterOption[];
  className?: string;
};

export default function AdminSelectFilter({ value, onChange, options, className }: AdminSelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-luxury-gold ${className ?? ''}`.trim()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
