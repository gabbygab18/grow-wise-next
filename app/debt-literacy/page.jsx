import Intro from '@/components/pages/Assessment/Intro';
import { CATEGORY_NAMES, QUESTIONS } from '@/lib/content';

export const metadata = { title: 'Assess my debt literacy' };

export default function Page() {
    return <Intro count={QUESTIONS.length} categories={CATEGORY_NAMES} />;
}
