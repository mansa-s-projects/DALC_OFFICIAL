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
      className="rounded-sm border border-white/5 bg-white/[0.02] p-6"
    >
      <div className="mb-3 flex items-center gap-3">
        <Icon className={`h-5 w-5 ${colorClass}`} />
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-display text-white">{value}</p>
    </motion.div>
  );
}
