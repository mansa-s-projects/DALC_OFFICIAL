import BeachClubs from '@/features/nightlife/pages/BeachClubs';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Best Beach Clubs in Dubai | Day & Night Access | Dubai À La Carte',
	description: "Exclusive access to Dubai's premier beach clubs — Nikki Beach, Zero Gravity, Drift Beach, Cove Beach and more. Daybeds, private pools, and curated dining.",
	path: '/nightlife/beach-clubs',
	keywords: ['beach clubs Dubai', 'best beach clubs Dubai', 'Dubai beach clubs 2024', 'Nikki Beach Dubai', 'Zero Gravity Dubai', 'Cove Beach Dubai', 'Dubai beach day pass', 'luxury beach Dubai'],
	ogImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
});

export default function BeachClubsPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: 'Best Beach Clubs in Dubai | Day & Night Access | Dubai À La Carte',
						description: "Exclusive access to Dubai's premier beach clubs — Nikki Beach, Zero Gravity, Drift Beach, Cove Beach and more. Daybeds, private pools, and curated dining.",
						url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/beach-clubs`,
						breadcrumb: {
							'@type': 'BreadcrumbList',
							itemListElement: [
								{ '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}` },
								{ '@type': 'ListItem', position: 2, name: 'Nightlife', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife` },
								{ '@type': 'ListItem', position: 3, name: 'Beach Clubs', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/beach-clubs` },
							],
						},
					}),
				}}
			/>
			<BeachClubs />
		</>
	);
}
