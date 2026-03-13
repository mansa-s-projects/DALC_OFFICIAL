import type { ButtonHTMLAttributes } from 'react';
import { ArrowRight } from 'lucide-react';

export default function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl border border-[#D6B574]/45 bg-gradient-to-r from-[#D6B574]/30 to-[#D6B574]/15 px-5 py-3 text-sm font-medium tracking-[0.08em] text-[#F7EED8] transition duration-300 hover:from-[#D6B574]/40 hover:to-[#D6B574]/25 disabled:cursor-not-allowed disabled:opacity-55 ${props.className || ''}`}
    >
      {props.children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}
