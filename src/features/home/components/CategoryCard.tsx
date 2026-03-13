import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CategoryItem } from '../types';

type CategoryCardProps = {
  item: CategoryItem;
  index: number;
};

export default function CategoryCard({ item, index }: CategoryCardProps) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="group"
    >
      <Link
        to={item.href}
        className="relative block overflow-hidden rounded-2xl border border-[#D6B574]/30 bg-[linear-gradient(170deg,rgba(23,23,23,0.9),rgba(10,10,10,0.86))] p-5 transition-colors duration-300 hover:border-[#D6B574]/60"
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D6B574]/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Icon className="mb-4 h-5 w-5 text-[#D6B574]" />
        <h3 className="font-display text-2xl text-[#EBD2A0]">{item.title}</h3>
        <p className="mt-1 text-sm text-white/68">{item.subtitle}</p>
        <div className="mt-4 flex justify-end text-[#D6B574]">
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
