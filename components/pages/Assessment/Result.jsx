'use client';

import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import { IconBadge } from '@/components/Kit';
import { CategoryScoreChart, ScoreRing } from '@/components/charts';

const LEVELS = [
    { min: 80, label: 'Strong foundation', text: 'You understand debt well. Keep checking every offer’s full cost before you borrow.' },
    { min: 50, label: 'Room to grow', text: 'You have a good foundation in debt literacy, but there’s still room to grow.' },
    { min: 0, label: 'Let’s build your basics', text: 'A few key ideas are worth learning before your next loan. Start with the terms below.' },
];

/** Where to read next, per weakest category. */
const TAKEAWAY = {
    'Understanding Debt Basics': ['principal, loan term, collateral and default', 'principal'],
    'Interest and Rates': ['interest rates and how they change the total cost of a loan', 'interest-rate'],
    'Financial Planning': ['budgeting for repayments before you borrow', 'zero-based-budgeting'],
    'Risk and Responsible Borrowing': ['spotting risky offers and managing missed payments', 'non-performing-loan'],
};

export default function Result({ score, total, breakdown, review }) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    const level = LEVELS.find((l) => pct >= l.min);
    const weakest = [...breakdown].sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
    const [topic, slug] = TAKEAWAY[weakest?.name] ?? ['the key debt terms', ''];
    const perfect = score === total;

    return (
        <SiteLayout title="Your debt literacy scorecard">
            <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
                <div className="text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-canvas-soft text-3xl text-brand-ink" aria-hidden="true">
                        <i className="bxf bx-trophy" />
                    </span>
                    <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(1.9rem,4vw,2.75rem)]" text="Your debt literacy scorecard" />
                </div>

                <Reveal visible className="panel mx-auto mt-8 flex max-w-2xl flex-col items-center gap-6 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
                    <ScoreRing score={score} total={total} />
                    <div>
                        <span className="eyebrow">{level.label}</span>
                        <p className="mt-3 text-[15px] leading-relaxed text-muted">{level.text}</p>
                        <p className="mt-2 text-sm font-semibold text-ink">{pct}% correct</p>
                    </div>
                </Reveal>

                <Reveal from="up" className="panel mt-6 p-5 sm:p-6">
                    <h2 className="text-lg">Score by category</h2>
                    <p className="mb-5 mt-1 text-sm text-muted">Correct answers out of {breakdown[0]?.total ?? 5} in each area.</p>
                    <CategoryScoreChart breakdown={breakdown} />
                </Reveal>

                <Reveal from="up" className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-6 sm:flex-row sm:items-center">
                    <IconBadge icon="bx-light-bulb" solid className="h-12 w-12 text-2xl" />
                    <div className="flex-1">
                        <p className="font-display text-lg font-medium">Key takeaway</p>
                        <p className="mt-1 text-sm text-muted">
                            {perfect
                                ? 'Perfect score! You’re well prepared to compare loans and borrow responsibly.'
                                : pct >= 50
                                  ? `You’re on the right track. Focus next on ${topic} to make even better financial decisions.`
                                  : `Start with ${topic} — that’s where you missed the most.`}
                        </p>
                    </div>
                    {!perfect && slug && (
                        <Button href={`/learn/${slug}`} orb size="sm">
                            Learn more
                        </Button>
                    )}
                </Reveal>

                {review.length > 0 && (
                    <section className="mt-12" aria-labelledby="rv">
                        <AnimatedHeading as="h2" id="rv" className="text-2xl" text="Questions to revisit" />
                        <div className="mt-5 space-y-3">
                            {review.map((item) => (
                                <details key={item.question} className="panel group p-5 [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex cursor-pointer items-start gap-3">
                                        <i className="bxf bx-x-circle mt-0.5 text-xl text-danger" aria-hidden="true" />
                                        <span className="flex-1">
                                            <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{item.category}</span>
                                            <span className="mt-1 block font-medium">{item.question}</span>
                                        </span>
                                        <i className="bxf bx-chevron-down text-xl text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                                    </summary>
                                    <div className="mt-4 space-y-2 border-t border-hairline pt-4 text-sm">
                                        {item.given && (
                                            <p className="text-muted">
                                                <span className="font-semibold text-ink">Your answer:</span> {item.given}
                                            </p>
                                        )}
                                        <p className="text-brand-ink">
                                            <span className="font-semibold">Correct answer:</span> {item.answer}
                                        </p>
                                        {item.explanation && <p className="rounded-xl bg-canvas-soft px-3 py-2 text-muted">{item.explanation}</p>}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button href="/debt-literacy/quiz" variant="secondary" icon="bx-rotate-ccw">
                        Retake assessment
                    </Button>
                    <Button href="/menu" layered trailing="bx-arrow-right-stroke">
                        Back to main menu
                    </Button>
                </div>
            </div>
        </SiteLayout>
    );
}
