import React from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  Waves,
  Dumbbell,
  Sparkles,
  Umbrella,
  Car,
  Utensils,
  Wine,
  Headphones,
  Wind,
  ChefHat,
  Shirt,
  LayoutGrid,
  Eye,
  Building,
  Trees,
  Flame,
  Shield,
  ArrowUpDown,
  Dog,
  Users,
  Briefcase,
  Clock,
  Tv,
  Coffee,
  Sun,
  Check,
  Anchor,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react';

interface AmenityListProps {
  amenities: string[];
  highlightAmenities?: string[];
  showAll?: boolean;
  limit?: number;
}

const AMENITY_ICON_MAP: Record<string, LucideIcon> = {
  'WiFi': Wifi,
  'wifi': Wifi,
  'Pool': Waves,
  'pool': Waves,
  'Gym': Dumbbell,
  'gym': Dumbbell,
  'Spa': Sparkles,
  'spa': Sparkles,
  'Beach Access': Umbrella,
  'beach access': Umbrella,
  'beach': Umbrella,
  'Parking': Car,
  'parking': Car,
  'Restaurant': Utensils,
  'restaurant': Utensils,
  'Bar': Wine,
  'bar': Wine,
  'Room Service': Headphones,
  'room service': Headphones,
  'Concierge': Headphones,
  'concierge': Headphones,
  'Air Conditioning': Wind,
  'air conditioning': Wind,
  'ac': Wind,
  'Kitchen': ChefHat,
  'kitchen': ChefHat,
  'Laundry': Shirt,
  'laundry': Shirt,
  'Balcony': LayoutGrid,
  'balcony': LayoutGrid,
  'Sea View': Eye,
  'sea view': Eye,
  'ocean view': Eye,
  'City View': Building,
  'city view': Building,
  'Private Pool': Waves,
  'private pool': Waves,
  'Garden': Trees,
  'garden': Trees,
  'BBQ': Flame,
  'bbq': Flame,
  'Security': Shield,
  'security': Shield,
  '24/7 Security': Shield,
  'Elevator': ArrowUpDown,
  'elevator': ArrowUpDown,
  'Pet Friendly': Dog,
  'pet friendly': Dog,
  'pets': Dog,
  'Family Friendly': Users,
  'family friendly': Users,
  'Business Center': Briefcase,
  'business center': Briefcase,
  'Meeting Rooms': Users,
  'meeting rooms': Users,
  '24/7 Reception': Clock,
  '24/7 reception': Clock,
  'reception': Clock,
  'Housekeeping': Shirt,
  'housekeeping': Shirt,
  'maid service': Shirt,
  'TV': Tv,
  'tv': Tv,
  'television': Tv,
  'Coffee Machine': Coffee,
  'coffee': Coffee,
  'Terrace': Sun,
  'terrace': Sun,
  'Marina View': Anchor,
  'marina view': Anchor,
  'Butler Service': HeartHandshake,
  'butler service': HeartHandshake,
  'butler': HeartHandshake,
  'Helipad': Anchor,
  'helipad': Anchor,
  'Aquaventure': Waves,
  'aquaventure': Waves,
  'Sky Pool': Waves,
  'sky pool': Waves,
};

function getAmenityIcon(amenity: string): LucideIcon {
  // Try direct match
  if (AMENITY_ICON_MAP[amenity]) {
    return AMENITY_ICON_MAP[amenity];
  }
  
  // Try case-insensitive match
  const normalizedAmenity = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(AMENITY_ICON_MAP)) {
    if (key.toLowerCase() === normalizedAmenity) {
      return icon;
    }
  }
  
  // Partial matches
  if (normalizedAmenity.includes('pool')) return Waves;
  if (normalizedAmenity.includes('wifi') || normalizedAmenity.includes('internet')) return Wifi;
  if (normalizedAmenity.includes('gym') || normalizedAmenity.includes('fitness')) return Dumbbell;
  if (normalizedAmenity.includes('spa')) return Sparkles;
  if (normalizedAmenity.includes('beach') || normalizedAmenity.includes('ocean') || normalizedAmenity.includes('sea')) return Umbrella;
  if (normalizedAmenity.includes('parking') || normalizedAmenity.includes('car')) return Car;
  if (normalizedAmenity.includes('restaurant') || normalizedAmenity.includes('dining')) return Utensils;
  if (normalizedAmenity.includes('bar')) return Wine;
  if (normalizedAmenity.includes('concierge') || normalizedAmenity.includes('service')) return Headphones;
  if (normalizedAmenity.includes('air') || normalizedAmenity.includes('ac')) return Wind;
  if (normalizedAmenity.includes('kitchen') || normalizedAmenity.includes('cooking')) return ChefHat;
  if (normalizedAmenity.includes('laundry') || normalizedAmenity.includes('washing')) return Shirt;
  if (normalizedAmenity.includes('view') || normalizedAmenity.includes('balcony')) return Eye;
  if (normalizedAmenity.includes('garden') || normalizedAmenity.includes('outdoor')) return Trees;
  if (normalizedAmenity.includes('bbq') || normalizedAmenity.includes('grill')) return Flame;
  if (normalizedAmenity.includes('security') || normalizedAmenity.includes('safe')) return Shield;
  if (normalizedAmenity.includes('elevator') || normalizedAmenity.includes('lift')) return ArrowUpDown;
  if (normalizedAmenity.includes('pet') || normalizedAmenity.includes('dog')) return Dog;
  if (normalizedAmenity.includes('family') || normalizedAmenity.includes('kids')) return Users;
  if (normalizedAmenity.includes('business') || normalizedAmenity.includes('meeting')) return Briefcase;
  if (normalizedAmenity.includes('reception') || normalizedAmenity.includes('front desk')) return Clock;
  if (normalizedAmenity.includes('tv') || normalizedAmenity.includes('television')) return Tv;
  if (normalizedAmenity.includes('coffee')) return Coffee;
  
  // Default
  return Check;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function AmenityList({ 
  amenities, 
  highlightAmenities = [], 
  showAll = false,
  limit = 12 
}: AmenityListProps) {
  const displayAmenities = showAll ? amenities : amenities.slice(0, limit);
  const hasMore = amenities.length > limit && !showAll;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {displayAmenities.map((amenity, idx) => {
          const Icon = getAmenityIcon(amenity);
          const isHighlighted = highlightAmenities.includes(amenity);
          
          return (
            <motion.div
              key={amenity}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
              className={`flex items-center gap-3 p-3 border ${
                isHighlighted 
                  ? 'border-luxury-gold/30 bg-luxury-gold/5' 
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${
                isHighlighted ? 'text-luxury-gold' : 'text-gray-400'
              }`} />
              <span className={`text-sm ${
                isHighlighted ? 'text-white' : 'text-gray-300'
              }`}>
                {amenity}
              </span>
            </motion.div>
          );
        })}
      </div>
      
      {hasMore && (
        <button className="mt-4 text-luxury-gold text-sm hover:text-white transition-colors">
          + {amenities.length - limit} more amenities
        </button>
      )}
    </div>
  );
}

// Export for individual amenity display
export function AmenityItem({ amenity, highlighted = false }: { amenity: string; highlighted?: boolean }) {
  const Icon = getAmenityIcon(amenity);
  
  return (
    <div className={`flex items-center gap-2 ${highlighted ? 'text-luxury-gold' : 'text-gray-300'}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm">{amenity}</span>
    </div>
  );
}
