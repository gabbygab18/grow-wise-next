'use client';

import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import { BackLink } from '@/components/Kit';
import { LoansMockup } from '@/components/Mockups';

export default function Intro() {
    return (
        <SiteLayout title="Compare my loan options">
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <BackLink href="/menu" />
            </div>
            <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-14">
                <div>
                    <span className="eyebrow">Loan comparison tool</span>
                    <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)]">
                        Compare my <span className="text-brand-ink">loan options</span>
                    </AnimatedHeading>
                    <Reveal visible className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                        Enter the loan offers you’re considering. We’ll put them side by side — monthly payment, total interest,
                        fees and the full cost of borrowing — so you can see which one is better for your business.
                    </Reveal>
                    <Reveal visible className="mt-6 flex max-w-md gap-3 rounded-xl border border-hairline bg-white p-4 text-[13px] text-muted">
                        <i className="bxf bx-info-circle text-xl text-brand-ink" aria-hidden="true" />
                        <p>
                            <span className="font-semibold text-ink">Have your offers ready.</span> Use the figures from each lender’s
                            quotation or loan agreement for the most accurate comparison.
                        </p>
                    </Reveal>
                    <Reveal visible className="mt-8">
                        <Button href="/compare-loans/options" layered size="lg" trailing="bx-arrow-right-stroke">
                            Get started
                        </Button>
                    </Reveal>
                </div>
                <LoansMockup />
            </section>
        </SiteLayout>
    );
}
