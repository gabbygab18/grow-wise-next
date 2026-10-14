import { notFound } from 'next/navigation';
import Show from '@/components/pages/Learn/Show';
import { TERMS } from '@/lib/content';

const find = (slug) => TERMS.findIndex((t) => t.slug === slug);

export function generateStaticParams() {
    return TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const term = TERMS[find(slug)];
    return term ? { title: term.term, description: term.definition } : {};
}

export default async function Page({ params }) {
    const { slug } = await params;
    const i = find(slug);
    if (i < 0) notFound();

    const pick = (t) => (t ? { term: t.term, slug: t.slug } : null);
    return <Show term={TERMS[i]} prev={pick(TERMS[i - 1])} next={pick(TERMS[i + 1])} />;
}
