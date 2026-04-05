import type { Metadata } from 'next';
import VenueDetail from '@/features/nightlife/pages/VenueDetail';
import { getStaticVenueById, getVenueSeoDescription } from '@/features/nightlife/lib/venueDiscovery';

type VenuePageProps = {
	params: Promise<{ id: string }>;
};

function getBaseUrl() {
	return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
	const { id } = await params;
	const venue = getStaticVenueById(id);

	if (!venue) {
		return {
			title: 'Venue | Dubai À La Carte',
			description: 'Explore curated nightlife, dining, and concierge experiences in Dubai.',
		};
	}

	const title = `${venue.name} | Dubai Venue Guide | Dubai À La Carte`;
	const description = getVenueSeoDescription(venue);
	const url = new URL(`/venue/${venue.id}`, getBaseUrl());

	return {
		title,
		description,
		alternates: {
			canonical: url.toString(),
		},
		openGraph: {
			title,
			description,
			url: url.toString(),
			type: 'article',
			siteName: 'Dubai À La Carte',
			images: [
				{
					url: venue.hero_image,
					alt: venue.name,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [venue.hero_image],
		},
		keywords: [
			venue.name,
			venue.area,
			venue.location,
			venue.category.replace(/-/g, ' '),
			venue.cuisine || 'Dubai nightlife',
			'Dubai concierge',
			'luxury venue Dubai',
		],
	};
}

export default function VenuePage() {
	return <VenueDetail />;
}
