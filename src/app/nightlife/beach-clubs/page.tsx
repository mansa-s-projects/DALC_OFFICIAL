import BeachClubs from '@/features/nightlife/pages/BeachClubs';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Dubai Beach Clubs | Luxury Day-to-Night Beach Venues | Dubai À La Carte',
	description: 'Explore Dubai beach clubs with DALC concierge, from Palm Jumeirah icons to J1 hotspots, sunset lounges, and premium cabana experiences.',
	path: '/nightlife/beach-clubs',
	keywords: ['Dubai beach clubs', 'Palm Jumeirah beach clubs', 'Dubai cabana booking', 'luxury beach clubs Dubai', 'Dubai day clubs'],
});

export default function BeachClubsPage() {
	return <BeachClubs />;
}
