import DiningEntertainment from '@/features/nightlife/pages/DiningEntertainment';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Dubai Dinner Shows | Dining Entertainment Concierge | Dubai À La Carte',
	description: 'Find Dubai dinner shows and dining entertainment experiences with DALC concierge, from theatrical supper clubs to immersive performance venues.',
	path: '/nightlife/dining',
	keywords: ['Dubai dinner shows', 'Dubai dining entertainment', 'immersive dining Dubai', 'supper clubs Dubai', 'concierge dinner shows'],
});

export default function DiningEntertainmentPage() {
	return <DiningEntertainment />;
}
