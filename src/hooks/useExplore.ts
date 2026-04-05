import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '../data/venues/mockData';
import type { Category } from '../types';
import { useVenues } from './useVenues';

const PRIMARY_CATEGORY_IDS = ['dining', 'beach-clubs', 'nightlife', 'experiences'] as const;

export function useExplore() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const navigate = (p: string) => router.push(p);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const categoryIds = useMemo(() => new Set(CATEGORIES.map((c) => c.id)), []);

  const routeCategory = ((params?.filter || params?.category || '') as string).toLowerCase();
  const queryCategory = (searchParams?.get('category') || '').toLowerCase();

  const resolvedCategory = useMemo(() => {
    const candidate = routeCategory || queryCategory || 'all';
    if (candidate === 'all') return 'all';
    return categoryIds.has(candidate) ? candidate : 'all';
  }, [categoryIds, queryCategory, routeCategory]);

  useEffect(() => {
    setActiveCategory(resolvedCategory);
  }, [resolvedCategory]);

  useEffect(() => {
    const title =
      resolvedCategory === 'all'
        ? 'Explore Venues | Dubai A La Carte'
        : `${CATEGORIES.find((c) => c.id === resolvedCategory)?.label ?? 'Collection'} | Dubai A La Carte`;

    document.title = title;
  }, [resolvedCategory]);

  const venuesQuery = useVenues({ category: resolvedCategory as Category | 'all' });

  const filteredVenues = useMemo(() => {
    const venues = venuesQuery.data ?? [];
    if (!searchQuery.trim()) {
      return venues;
    }

    const q = searchQuery.toLowerCase();
    return venues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(q) ||
        venue.area.toLowerCase().includes(q) ||
        venue.location.toLowerCase().includes(q)
    );
  }, [venuesQuery.data, searchQuery]);

  const primaryCats = CATEGORIES.filter((c) => PRIMARY_CATEGORY_IDS.includes(c.id as (typeof PRIMARY_CATEGORY_IDS)[number]));
  const secondaryCats = CATEGORIES.filter((c) => !PRIMARY_CATEGORY_IDS.includes(c.id as (typeof PRIMARY_CATEGORY_IDS)[number]));
  const isMoreActive = secondaryCats.some((c) => c.id === activeCategory);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setIsMoreOpen(false);
    if (id === 'all') {
      navigate('/explore');
      return;
    }
    navigate(`/explore?category=${id}`);
  };

  const currentCategoryLabel =
    activeCategory === 'all' ? 'All Collection' : CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Collection';

  return {
    activeCategory,
    searchQuery,
    isMoreOpen,
    setActiveCategory,
    setSearchQuery,
    setIsMoreOpen,
    handleCategorySelect,
    currentCategoryLabel,
    venuesQuery,
    filteredVenues,
    primaryCats,
    secondaryCats,
    isMoreActive,
  };
}
