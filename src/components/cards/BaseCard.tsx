import type { ReactNode } from 'react';

type BaseCardProps = {
  children: ReactNode;
  className?: string;
};

export default function BaseCard({ children, className = '' }: BaseCardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${className}`.trim()}>
      {children}
    </div>
  );
}
