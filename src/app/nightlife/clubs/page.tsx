import NightClubs from '@/features/nightlife/pages/NightClubs';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Dubai Night Clubs | VIP Tables, Late-Night Venues | Dubai À La Carte',
	description: 'Browse DALC’s curated Dubai night clubs with VIP table access, underground rooms, rooftop scenes, and late-night concierge support.',
	path: '/nightlife/clubs',
	keywords: ['Dubai night clubs', 'VIP tables Dubai', 'Dubai club concierge', 'late night Dubai', 'Dubai nightlife venues'],
});

export default function NightClubsPage() {
	return <NightClubs />;
}
