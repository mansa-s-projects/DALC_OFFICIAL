import DiningEntertainment from '@/features/nightlife/pages/DiningEntertainment';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Dubai Private Event Venues | Dining Shows and Hosted Nights | Dubai À La Carte',
	description: 'Source Dubai private event venues through DALC, including dinner shows, hosted celebration spaces, and nightlife-adjacent entertainment venues.',
	path: '/nightlife/private-events',
	keywords: ['Dubai private events', 'Dubai hosted venues', 'private dining show Dubai', 'Dubai celebration venues', 'Dubai concierge events'],
});

export default function PrivateEventsPage() {
	return <DiningEntertainment />;
}
