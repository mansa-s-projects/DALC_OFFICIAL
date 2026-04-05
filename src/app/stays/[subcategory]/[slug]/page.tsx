import { redirect } from 'next/navigation';

type StaysDetailPageProps = {
	params: Promise<{ subcategory: string; slug: string }>;
};

export default async function StaysDetailRedirectPage({ params }: StaysDetailPageProps) {
	const { subcategory, slug } = await params;
	redirect(`/travel/${subcategory}/${slug}`);
}
