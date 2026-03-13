import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';

type AccessCardProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
};

export default function AccessCard({ email, onEmailChange, onSubmit, isSaving }: AccessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 mx-auto w-[min(92vw,460px)] overflow-hidden rounded-2xl border border-[#D6B574]/35 bg-[linear-gradient(160deg,rgba(20,20,20,0.86),rgba(8,8,8,0.82))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.7)] backdrop-blur-md"
    >
      <div className="pointer-events-none absolute -inset-[2px] rounded-2xl border border-[#D6B574]/20" />
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-[#D6B574]/45 bg-[#D6B574]/10 text-[#E7C98F]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-[1.35rem] leading-none text-[#EFD6A2]">Dubai A La Carte</p>
          <p className="pt-1 text-xs tracking-[0.06em] text-white/65">Curated access to Dubai</p>
        </div>
      </div>

      <p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/55">Private Invitation</p>
      <p className="mb-4 text-sm text-white/80">Enter your email to access the menu</p>

      <div className="space-y-3">
        <InputField
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@domain.com"
          autoComplete="email"
          aria-label="Email"
        />
        <PrimaryButton onClick={onSubmit} disabled={isSaving || !email.trim()} className="w-full">
          {isSaving ? 'Securing Access...' : 'Access Menu'}
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
