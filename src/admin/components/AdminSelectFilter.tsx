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
      className={`rounded-xl border border-[#C8A46B]/18 bg-[#111214] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C8A46B]/55 focus:shadow-[0_0_0_4px_rgba(200,164,107,0.10)] ${className ?? ''}`.trim()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
