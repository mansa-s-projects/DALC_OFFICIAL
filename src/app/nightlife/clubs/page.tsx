import NightClubs from '@/features/nightlife/pages/NightClubs';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Best Nightclubs in Dubai | VIP Tables & Bottle Service | Dubai À La Carte',
	description: "Book VIP tables at Dubai's most exclusive nightclubs — WHITE Dubai, Soho Garden, Drai's, Base Dubai and more. Skip the queue, secured entry and dedicated service.",
	path: '/nightlife/clubs',
	keywords: ['Dubai nightclubs', 'VIP tables Dubai', 'bottle service Dubai', 'WHITE Dubai', 'Soho Garden Dubai', 'best clubs Dubai', 'Dubai club booking', 'nightclubs Dubai Marina'],
	ogImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
});

export default function NightClubsPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: 'Best Nightclubs in Dubai | VIP Tables & Bottle Service | Dubai À La Carte',
						description: "Book VIP tables at Dubai's most exclusive nightclubs — WHITE Dubai, Soho Garden, Drai's, Base Dubai and more. Skip the queue, secured entry and dedicated service.",
						url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/clubs`,
						breadcrumb: {
							'@type': 'BreadcrumbList',
							itemListElement: [
								{ '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}` },
								{ '@type': 'ListItem', position: 2, name: 'Nightlife', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife` },
								{ '@type': 'ListItem', position: 3, name: 'Clubs', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/clubs` },
							],
						},
					}),
				}}
			/>
			<NightClubs />
		</>
	);
}
