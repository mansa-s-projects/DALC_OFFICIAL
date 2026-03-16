import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4 border-b border-[#C8A46B]/12 pb-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#C8A46B]/75">DALC Admin</p>
        <h1 className="mt-2 text-3xl font-display text-[#F4E2BA]">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-gray-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
