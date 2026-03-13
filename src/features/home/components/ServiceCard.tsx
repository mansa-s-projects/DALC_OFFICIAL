import { motion } from 'framer-motion';
import type { ServiceItem } from '../types';

type ServiceCardProps = {
  item: ServiceItem;
  index: number;
};

export default function ServiceCard({ item, index }: ServiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
    >
      <p className="text-[11px] uppercase tracking-[0.12em] text-[#D6B574]">{item.tag}</p>
      <h4 className="mt-2 font-display text-xl text-white">{item.title}</h4>
      <p className="mt-1 text-sm text-white/60">{item.subtitle}</p>
    </motion.article>
  );
}
