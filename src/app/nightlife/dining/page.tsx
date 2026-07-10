import DiningEntertainment from '@/features/nightlife/pages/DiningEntertainment';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Dubai Dining & Entertainment | Show Restaurants & Live Events | Dubai À La Carte',
	description: 'Combine world-class dining with live entertainment in Dubai — immersive dining experiences, celebrity DJ venues, show kitchens, and private event spaces.',
	path: '/nightlife/dining',
	keywords: ['Dubai dining entertainment', 'show restaurants Dubai', 'immersive dining Dubai', 'Dubai dinner show', 'Billionaire Dubai', 'entertainment dining Dubai'],
	ogImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
});

export default function DiningEntertainmentPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: 'Dubai Dining & Entertainment | Show Restaurants & Live Events | Dubai À La Carte',
						description: 'Combine world-class dining with live entertainment in Dubai — immersive dining experiences, celebrity DJ venues, show kitchens, and private event spaces.',
						url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/dining`,
						breadcrumb: {
							'@type': 'BreadcrumbList',
							itemListElement: [
								{ '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}` },
								{ '@type': 'ListItem', position: 2, name: 'Nightlife', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife` },
								{ '@type': 'ListItem', position: 3, name: 'Dining & Entertainment', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/dining` },
							],
						},
					}),
				}}
			/>
			<DiningEntertainment />
		</>
	);
}
