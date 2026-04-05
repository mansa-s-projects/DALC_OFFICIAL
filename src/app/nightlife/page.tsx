import NightlifeHub from '@/features/nightlife/pages/NightlifeHub';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Dubai Nightlife Concierge | Clubs, Beach Clubs, Dining | Dubai À La Carte',
	description: 'Discover Dubai nightlife with DALC concierge access to clubs, beach clubs, restaurants, and dinner shows across DIFC, Downtown, Palm Jumeirah, and beyond.',
	path: '/nightlife',
	keywords: ['Dubai nightlife', 'Dubai clubs', 'Dubai beach clubs', 'Dubai concierge', 'luxury nightlife Dubai'],
});

export default function NightlifePage() {
	return <NightlifeHub />;
}
