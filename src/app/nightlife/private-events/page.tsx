import DiningEntertainment from '@/features/nightlife/pages/DiningEntertainment';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Private Events Dubai | Yacht Parties, VIP Venues & Celebrations | Dubai À La Carte',
	description: 'Plan your perfect private event in Dubai — birthday dinners, corporate events, yacht parties, rooftop celebrations, and fully bespoke experiences for groups of any size.',
	path: '/nightlife/private-events',
	keywords: ['private events Dubai', 'event planning Dubai', 'private party Dubai', 'yacht party Dubai', 'birthday Dubai', 'corporate events Dubai', 'VIP events Dubai'],
	ogImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
});

export default function PrivateEventsPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: 'Private Events Dubai | Yacht Parties, VIP Venues & Celebrations | Dubai À La Carte',
						description: 'Plan your perfect private event in Dubai — birthday dinners, corporate events, yacht parties, rooftop celebrations, and fully bespoke experiences for groups of any size.',
						url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/private-events`,
						breadcrumb: {
							'@type': 'BreadcrumbList',
							itemListElement: [
								{ '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}` },
								{ '@type': 'ListItem', position: 2, name: 'Nightlife', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife` },
								{ '@type': 'ListItem', position: 3, name: 'Private Events', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/private-events` },
							],
						},
					}),
				}}
			/>
			<DiningEntertainment />
		</>
	);
}
