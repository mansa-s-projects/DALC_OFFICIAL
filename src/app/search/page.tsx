import SearchPage from '@/features/search/pages/SearchPage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Search Dubai À La Carte | Nightlife, Experiences, Travel, Stays',
  description: 'Search across DALC nightlife, experiences, travel, stays, business services, and concierge pathways from a single discovery surface.',
  path: '/search',
  keywords: ['search Dubai concierge', 'Dubai venue search', 'Dubai experiences search', 'Dubai travel search'],
});

export default function SearchRoute() {
  return <SearchPage />;
}
