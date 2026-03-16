import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type AdminStatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  colorClass: string;
  delay?: number;
};

export default function AdminStatCard({ label, value, icon: Icon, colorClass, delay = 0 }: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-[#C8A46B]/12 bg-[linear-gradient(180deg,rgba(17,18,20,0.95),rgba(11,11,12,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-3 flex items-center gap-3">
        <Icon className={`h-5 w-5 ${colorClass}`} />
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-display text-[#F4E2BA]">{value}</p>
    </motion.div>
  );
}
