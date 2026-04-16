"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, FileText, Building2, Landmark } from "lucide-react";
import type { BusinessService } from "../../types/business";
import { SUBCATEGORY_LABELS, SERVICE_TYPE_LABELS } from "../../types/business";

interface ServiceCardProps {
  service: BusinessService;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const {
    name,
    subcategory,
    service_type,
    duration_description,
    description_short,
    hero_image,
    slug,
    estimated_steps,
    is_featured,
    freezone,
    sub_subcategory,
    government_authority,
    required_documents,
  } = service;

  const routeLabel = freezone || sub_subcategory || SERVICE_TYPE_LABELS[service_type];
  const supportLabel = government_authority || `${required_documents.length} core documents prepared`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden border border-white/10 bg-white/[0.03] transition-all duration-500 hover:border-luxury-gold/40"
    >
      <div className="relative h-52 overflow-hidden bg-gray-900">
        {hero_image ? (
          <img
            src={hero_image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <Building2 className="h-12 w-12 text-luxury-gold/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="border border-luxury-gold/30 bg-luxury-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-luxury-gold">
            {SUBCATEGORY_LABELS[subcategory]}
          </span>
          {is_featured && (
            <span className="border border-luxury-gold/50 bg-luxury-gold/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-luxury-gold">
              Featured
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4">
          <span className="border border-white/20 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-gray-300">
            {SERVICE_TYPE_LABELS[service_type]}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-lg leading-snug text-white transition-colors duration-300 group-hover:text-luxury-gold font-display">
          {name}
        </h3>

        {description_short && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {description_short}
          </p>
        )}

        <div className="mb-5 flex items-center gap-4 text-xs text-gray-500">
          {duration_description && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-luxury-gold/60" />
              {duration_description}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-luxury-gold/60" />
            {estimated_steps} steps
          </span>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="mb-4 space-y-3">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500">Best fit</p>
              <p className="text-base font-semibold tracking-wide text-luxury-gold">{routeLabel}</p>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <Landmark className="mt-0.5 h-4 w-4 flex-shrink-0 text-luxury-gold/60" />
              <span className="line-clamp-2">{supportLabel}</span>
            </div>
          </div>

          <Link
            href={`/business/${subcategory}/${slug}`}
            className="flex items-center justify-center gap-2 border border-luxury-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-luxury-gold transition-all duration-300 hover:bg-luxury-gold hover:text-luxury-black"
          >
            View
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}