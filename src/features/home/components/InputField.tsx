import type { InputHTMLAttributes } from 'react';

export default function InputField(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-white/20 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition duration-250 focus:border-[#D6B574]/65 focus:bg-black/35 focus:shadow-[0_0_0_4px_rgba(214,181,116,0.12)] ${props.className || ''}`}
    />
  );
}
