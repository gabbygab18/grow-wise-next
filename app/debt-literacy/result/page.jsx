import { redirect } from 'next/navigation';
import Result from '@/components/pages/Assessment/Result';
import { getState } from '@/lib/session';
import { CATEGORY_NAMES, QUESTIONS } from '@/lib/content';

export const metadata = { title: 'Your debt literacy scorecard' };

export default async function Page() {
    const { quiz } = await getState();
    if (!quiz) redirect('/debt-literacy');

    const breakdown = CATEGORY_NAMES.map((name) => ({ name, correct: 0, total: 0 }));
    const review = [];
    for (const q of QUESTIONS) {
        const cat = breakdown.find((b) => b.name === q.category);
        const given = quiz[q.id];
        cat.total++;
        if (given === q.answer) cat.correct++;
        else review.push({ category: q.category, question: q.question, given: q.options[given] ?? null, answer: q.options[q.answer], explanation: q.explanation });
    }
    const score = breakdown.reduce((n, b) => n + b.correct, 0);

    return <Result score={score} total={QUESTIONS.length} breakdown={breakdown} review={review} />;
}
