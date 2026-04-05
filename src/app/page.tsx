import HomeEntry from '@/features/home/pages/HomeEntry';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
	title: 'Dubai À La Carte | Luxury Concierge, Nightlife, Experiences, Travel',
	description: 'Book Dubai nightlife, curated experiences, travel, stays, and concierge support through one luxury platform built for high-intent requests.',
	path: '/',
	keywords: ['Dubai concierge', 'Dubai nightlife', 'Dubai experiences', 'luxury travel Dubai', 'Dubai stays'],
});

export default function HomePage() {
	return <HomeEntry />;
}
