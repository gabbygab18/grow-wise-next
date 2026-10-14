'use client';

import { useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { submitQuiz } from '@/app/actions';
import SiteLayout from '@/components/SiteLayout';
import Button from '@/components/ui/Button';
import { BackLink, IconBadge } from '@/components/Kit';
import { cn } from '@/lib/utils';

const CATEGORY_ICON = {
    'Understanding Debt Basics': 'bx-book-open',
    'Interest and Rates': 'bx-chart-line',
    'Financial Planning': 'bx-calculator',
    'Risk and Responsible Borrowing': 'bx-shield-quarter',
};

export default function Quiz({ questions }) {
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [sending, startTransition] = useTransition();
    const [errors, setErrors] = useState({});

    const q = questions[index];
    const last = index === questions.length - 1;
    const chosen = answers[q.id];

    const next = () => {
        if (!chosen) return;
        if (!last) return setIndex(index + 1);
        startTransition(async () => {
            const res = await submitQuiz(answers);
            setErrors(res?.errors ?? {});
        });
    };

    return (
        <SiteLayout title={`Question ${index + 1} of ${questions.length}`} cta={false}>
            <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                    {index === 0 ? (
                        <BackLink href="/debt-literacy" />
                    ) : (
                        <button type="button" onClick={() => setIndex(index - 1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-ink">
                            <i className="bxf bx-arrow-left-stroke text-lg" aria-hidden="true" />
                            Previous
                        </button>
                    )}
                    <span className="num text-sm font-semibold text-brand-ink" aria-live="polite">
                        {index + 1}/{questions.length}
                    </span>
                </div>

                <div className="mt-4 flex gap-1" aria-hidden="true">
                    {questions.map((item, i) => (
                        <span
                            key={item.id}
                            className={cn('h-1.5 flex-1 rounded-full transition-colors duration-300', i === index ? 'bg-ink' : answers[item.id] ? 'bg-brand' : 'bg-hairline-cool')}
                        />
                    ))}
                </div>

                {errors?.answers && (
                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
                        {errors.answers}
                    </p>
                )}

                <AnimatePresence mode="wait">
                    <motion.fieldset
                        key={q.id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="panel mt-6 p-6 sm:p-8"
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink">{q.category}</p>
                        <legend className="contents">
                            <span className="mt-3 flex items-start gap-4">
                                <IconBadge icon={CATEGORY_ICON[q.category] ?? 'bx-help-circle'} className="hidden sm:inline-flex" />
                                <span className="font-display text-xl font-medium leading-snug sm:text-2xl">{q.question}</span>
                            </span>
                        </legend>
                        <div className="mt-6 space-y-3">
                            {Object.entries(q.options).map(([letter, text]) => (
                                <label
                                    key={letter}
                                    className={cn(
                                        'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-[15px] transition-colors',
                                        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/60',
                                        chosen === letter ? 'border-brand bg-canvas-soft' : 'border-hairline hover:border-hairline-strong hover:bg-canvas-soft',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={letter}
                                        checked={chosen === letter}
                                        onChange={() => setAnswers({ ...answers, [q.id]: letter })}
                                        className="mt-1 accent-[#24b47e]"
                                    />
                                    <span>
                                        <span className="mr-2 font-semibold text-brand-ink">{letter}.</span>
                                        {text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </motion.fieldset>
                </AnimatePresence>

                <div className="mt-6 flex justify-end">
                    <Button onClick={next} disabled={!chosen} loading={sending} layered={!!chosen} trailing="bx-arrow-right-stroke">
                        {last ? 'See my results' : 'Next'}
                    </Button>
                </div>
            </div>
        </SiteLayout>
    );
}
