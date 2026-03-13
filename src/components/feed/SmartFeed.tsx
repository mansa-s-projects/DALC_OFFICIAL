import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, MapPin, Heart } from 'lucide-react';
import { Venue, FeedItem, UserSkill } from '../../types';
import { buildSmartFeed } from '../../utils/recommendations';
import { useAppStore } from '../../store/useAppStore';
import VenueCard from '../cards/VenueCard';
import { feedContainer, feedItem } from '../../lib/motion';

interface SmartFeedProps {
  venues: Venue[];
  maxItems?: number;
}

const SECTION_ICONS = {
  TRENDING: Flame,
  SKILL_MATCH: Sparkles,
  STAGE_BASED: MapPin,
  SIMILAR: Heart,
};

const SECTION_TITLES = {
  TRENDING: 'Trending Now',
  SKILL_MATCH: 'Curated for You',
  STAGE_BASED: 'Perfect for Your Stage',
  SIMILAR: 'You Might Also Like',
};

export default function SmartFeed({ venues, maxItems = 20 }: SmartFeedProps) {
  const user = useAppStore((s) => s.user);

  const feed = useMemo(() => buildSmartFeed(venues, user), [venues, user]);
  const displayItems = feed.slice(0, maxItems);

  // Group items by type for section headers
  const sections = useMemo(() => {
    const groups: { type: FeedItem['type']; items: FeedItem[] }[] = [];
    let currentType: FeedItem['type'] | null = null;

    for (const item of displayItems) {
      if (item.type !== currentType) {
        currentType = item.type;
        groups.push({ type: item.type, items: [item] });
      } else {
        groups[groups.length - 1].items.push(item);
      }
    }
    return groups;
  }, [displayItems]);

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="font-display text-xl">No venues to show</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sections.map((section, sectionIndex) => {
        const Icon = SECTION_ICONS[section.type];
        const title = SECTION_TITLES[section.type];

        return (
          <div key={`${section.type}-${sectionIndex}`}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <Icon className={`w-5 h-5 ${section.type === 'TRENDING' ? 'text-amber-500' : 'text-luxury-gold'}`} />
              <h3 className="text-xl font-display text-white">{title}</h3>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Cards Grid */}
            <motion.div
              variants={feedContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {section.items.map((item) => (
                <motion.div key={item.id} variants={feedItem}>
                  <VenueCard
                    venue={item.venue}
                    matchScore={user?.skills.length ? item.relevanceScore : undefined}
                    matchExplanation={item.explanation}
                    showTrendingBadge={item.type === 'TRENDING'}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
