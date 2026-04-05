import ExplorePage from '@/explore/pages/ExplorePage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
	title: 'Explore Dubai | Landmarks, Hidden Gems, Cultural Sites | Dubai À La Carte',
	description: 'Explore Dubai and the UAE through DALC’s editorial map of landmarks, hidden gems, museums, cultural sites, and concierge-worthy discovery stops.',
	path: '/explore',
	keywords: ['explore Dubai', 'Dubai landmarks', 'Dubai hidden gems', 'UAE cultural sites'],
});

export default function ExploreRoute() {
	return <ExplorePage />;
}
