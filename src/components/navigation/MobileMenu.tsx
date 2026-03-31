import Link from 'next/link';

type MobileMenuItem = {
  label: string;
  to: string;
};

type MobileMenuProps = {
  items: MobileMenuItem[];
  onNavigate?: () => void;
};

export default function MobileMenu({ items, onNavigate }: MobileMenuProps) {
  return (
    <nav className="grid gap-2 rounded-xl border border-white/10 bg-black/40 p-4 md:hidden">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.to}
          onClick={onNavigate}
          className="rounded-md px-3 py-2 text-sm uppercase tracking-[0.08em] text-white/80 hover:bg-white/10"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
