'use client';

import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import { BackLink } from '@/components/Kit';
import { QuizMockup } from '@/components/Mockups';

export default function Intro({ count, categories }) {
    return (
        <SiteLayout title="Assess my debt literacy">
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <BackLink href="/menu" />
            </div>
            <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-14">
                <div>
                    <span className="eyebrow">Debt literacy assessment</span>
                    <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)]">
                        Assess my <span className="text-brand-ink">debt literacy</span>
                    </AnimatedHeading>
                    <Reveal visible className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                        Test what you know about debt, interest rates and responsible borrowing. Answer {count} quick questions and
                        get a scorecard showing which areas you can improve.
                    </Reveal>
                    <Reveal visible className="mt-6 flex max-w-md flex-wrap gap-2">
                        {categories.map((c) => (
                            <span key={c} className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink">
                                {c}
                            </span>
                        ))}
                    </Reveal>
                    <Reveal visible className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                        <Button href="/debt-literacy/quiz" layered size="lg" trailing="bx-arrow-right-stroke">
                            Start assessment
                        </Button>
                        <span className="flex items-center gap-2 text-sm text-muted">
                            <i className="bxf bx-clock text-lg text-brand-ink" aria-hidden="true" />
                            About 5 minutes
                        </span>
                    </Reveal>
                    <Reveal visible className="mt-8 flex max-w-md items-center gap-3 text-sm text-muted">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas-soft text-xl text-brand-ink" aria-hidden="true">
                            <i className="bxf bx-light-bulb" />
                        </span>
                        Good financial knowledge leads to better decisions!
                    </Reveal>
                </div>
                <QuizMockup />
            </section>
        </SiteLayout>
    );
}
