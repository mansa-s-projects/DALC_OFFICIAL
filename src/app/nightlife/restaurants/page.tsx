import Restaurants from '@/features/nightlife/pages/Restaurants';
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata';

export const metadata = buildNightlifeMetadata({
	title: 'Best Restaurants in Dubai | Fine Dining & VIP Reservations | Dubai À La Carte',
	description: "Reserve at Dubai's finest restaurants — Michelin-starred chefs, skyline views, celebrity hotspots, and hidden gems. From Tresind Studio to Nobu, guaranteed tables.",
	path: '/nightlife/restaurants',
	keywords: ['best restaurants Dubai', 'fine dining Dubai', 'Michelin restaurants Dubai', 'Dubai restaurant reservations', 'luxury dining Dubai', 'rooftop restaurants Dubai', 'Dubai foodie guide'],
	ogImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
});

export default function RestaurantsPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: 'Best Restaurants in Dubai | Fine Dining & VIP Reservations | Dubai À La Carte',
						description: "Reserve at Dubai's finest restaurants — Michelin-starred chefs, skyline views, celebrity hotspots, and hidden gems. From Tresind Studio to Nobu, guaranteed tables.",
						url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/restaurants`,
						breadcrumb: {
							'@type': 'BreadcrumbList',
							itemListElement: [
								{ '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}` },
								{ '@type': 'ListItem', position: 2, name: 'Nightlife', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife` },
								{ '@type': 'ListItem', position: 3, name: 'Restaurants', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/restaurants` },
							],
						},
					}),
				}}
			/>
			<Restaurants />
		</>
	);
}
