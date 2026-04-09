import type { Metadata } from 'next';
import Script from 'next/script';
import VenueDetail from '@/features/nightlife/pages/VenueDetail';
import { getStaticVenueBySlug, getVenueSeoDescription } from '@/features/nightlife/lib/venueDiscovery';

type VenueSlugPageProps = {
	params: Promise<{ emirate: string; slug: string }>;
};

function getBaseUrl() {
	return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
}

function getAbsoluteUrl(value?: string | null): string | undefined {
	if (!value) {
		return undefined;
	}

	try {
		return new URL(value, getBaseUrl()).toString();
	} catch {
		return undefined;
	}
}

export async function generateMetadata({ params }: VenueSlugPageProps): Promise<Metadata> {
	const { emirate, slug } = await params;
	const venue = getStaticVenueBySlug(slug);

	if (!venue) {
		return {
			title: 'Venue | Dubai À La Carte',
			description: 'Explore curated nightlife, dining, and concierge experiences in Dubai.',
		};
	}

	const title = `${venue.name} | Dubai Venue Guide | Dubai À La Carte`;
	const description = getVenueSeoDescription(venue);
	const url = new URL(`/venue/${emirate}/${slug}`, getBaseUrl());
	const absoluteHeroImage = getAbsoluteUrl(venue.hero_image);

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
			images: absoluteHeroImage
				? [
					{
						url: absoluteHeroImage,
						alt: venue.name,
					},
				]
				: undefined,
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: absoluteHeroImage ? [absoluteHeroImage] : undefined,
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

export default async function VenueSlugPage({ params }: VenueSlugPageProps) {
	const { emirate, slug } = await params;
	const venue = getStaticVenueBySlug(slug);

	const jsonLd = venue
		? {
				"@context": "https://schema.org",
				"@type": venue.category === 'restaurants' || venue.category === 'dining' || venue.category === 'dining-entertainment' ? 'Restaurant' : 'TouristAttraction',
				"name": venue.name,
				"description": getVenueSeoDescription(venue),
				"url": new URL(`/venue/${emirate}/${slug}`, getBaseUrl()).toString(),
				"image": getAbsoluteUrl(venue.hero_image),
				"priceRange": '$$$$'.slice(0, venue.price_tier),
				"openingHours": venue.opening_hours,
				"address": {
					"@type": "PostalAddress",
					"addressLocality": venue.area,
					"addressRegion": emirate,
					"addressCountry": "AE",
				},
		  }
		: null;

	return (
		<>
			{jsonLd && (
				<Script
					id="venue-jsonld"
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}
			<VenueDetail />
		</>
	);
}
