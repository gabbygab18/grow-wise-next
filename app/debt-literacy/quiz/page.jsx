import Quiz from '@/components/pages/Assessment/Quiz';
import { QUESTIONS } from '@/lib/content';

export const metadata = { title: 'Debt literacy quiz' };

export default function Page() {
    // Answers stay on the server; grading happens in the submitQuiz action and the result page.
    const questions = QUESTIONS.map(({ id, category, question, options }) => ({ id, category, question, options }));
    return <Quiz questions={questions} />;
}
