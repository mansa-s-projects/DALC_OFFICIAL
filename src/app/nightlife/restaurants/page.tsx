import Restaurants from '@/features/nightlife/pages/Restaurants';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Dubai Restaurants | Fine Dining Concierge Guide | Dubai À La Carte',
	description: 'Browse DALC’s Dubai restaurant collection with fine dining, chef-led rooms, skyline venues, and concierge-led table access across the city.',
	path: '/nightlife/restaurants',
	keywords: ['Dubai restaurants', 'fine dining Dubai', 'Dubai restaurant concierge', 'best restaurants Dubai', 'luxury dining Dubai'],
});

export default function RestaurantsPage() {
	return <Restaurants />;
}
