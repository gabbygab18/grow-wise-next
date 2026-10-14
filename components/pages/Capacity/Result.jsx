'use client';

import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import StatsCount from '@/components/ui/statscount';
import { BackLink, IconBadge, Steps } from '@/components/Kit';
import { money } from '@/lib/format';
import { IncomeSplitChart } from '@/components/charts';

export default function Result({ result, profile }) {
    const r = result;
    const none = r.loan <= 0;

    const breakdown = [
        { icon: 'bx-wallet', label: 'Monthly income', value: r.income },
        { icon: 'bx-receipt', label: 'Monthly expenses', value: -r.expenses },
        { icon: 'bx-credit-card', label: 'Existing loan payments', value: -r.existing },
    ];

    const assumptions = [
        `Up to ${Math.round(r.share * 100)}% of your available cash flow goes to the new loan; the rest is a buffer for slow months.`,
        `Interest of ${r.rate}% per year, reducing balance.`,
        `A ${r.months}-month term, based on ${profile.years.toLowerCase()} in operation.`,
        'Your income and expenses stay about the same during the loan.',
    ];

    return (
        <SiteLayout title="Your borrowing capacity">
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <BackLink href="/borrowing-capacity">Edit details</BackLink>
                    <Steps steps={['Enter details', 'Calculate', 'Result']} current={2} />
                </div>

                <section className="mt-8 max-w-3xl">
                    <div>
                        <span className="eyebrow">
                            {profile.type} · {profile.years}
                        </span>
                        {none ? (
                            <>
                                <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(2rem,4.5vw,3rem)]">
                                    Not the right time for a <span className="text-brand-ink">new loan</span> yet.
                                </AnimatedHeading>
                                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                                    Your expenses and existing loan payments already use up your monthly income, so a new repayment
                                    would put your business under strain. Try lowering costs, growing sales, or paying down current
                                    loans first — then check again.
                                </p>
                            </>
                        ) : (
                            <>
                                <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(2rem,4.5vw,3rem)]">
                                    Here’s your estimated <span className="text-brand-ink">borrowing capacity!</span>
                                </AnimatedHeading>
                                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                                    Based on the information you provided, your business may be able to take on a loan of up to:
                                </p>
                            </>
                        )}
                        <div className="panel mt-6 p-6">
                            <StatsCount
                                stats={[
                                    { value: r.loan, prefix: '₱', label: 'Estimated loan amount' },
                                    { value: r.payment, prefix: '₱', label: 'Suggested monthly repayment' },
                                ]}
                            />
                        </div>
                        <p className="mt-3 text-xs text-muted">This is an estimate. Lenders decide final amounts using their own requirements and assessment.</p>
                    </div>
                </section>

                <section className="mt-14" aria-labelledby="bd">
                    <AnimatedHeading as="h2" id="bd" className="text-2xl" text="Your borrowing capacity breakdown" />
                    <Reveal from="up" className="panel mt-5 p-5 sm:p-6">
                        <h3 className="text-lg">Where your monthly income goes</h3>
                        <p className="mb-5 mt-1 text-sm text-muted">Each part as a share of your {money(r.income)} monthly income.</p>
                        <IncomeSplitChart result={r} />
                    </Reveal>
                    <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_1fr]">
                        <Reveal from="up" className="panel divide-y divide-hairline">
                            {breakdown.map((row) => (
                                <div key={row.label} className="flex items-center gap-4 px-5 py-4">
                                    <IconBadge icon={row.icon} />
                                    <span className="flex-1 text-sm font-medium">{row.label}</span>
                                    <span className="num font-semibold">
                                        {row.value < 0 ? '− ' : ''}
                                        {money(Math.abs(row.value))}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-center gap-4 bg-canvas-soft px-5 py-4">
                                <IconBadge icon="bx-coins" solid />
                                <span className="flex-1 text-sm font-semibold">
                                    Available cash flow
                                    <span className="block text-xs font-normal text-muted">left each month for loan repayment</span>
                                </span>
                                <span className={`num font-display text-xl font-medium ${r.available < 0 ? 'text-danger' : 'text-brand-ink'}`}>{money(r.available)}</span>
                            </div>
                        </Reveal>

                        <Reveal from="up" index={1} className="panel p-6">
                            <h3 className="flex items-center gap-2 text-lg">
                                <i className="bxf bx-light-bulb text-brand-ink" aria-hidden="true" /> Key assumptions
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-muted">
                                {assumptions.map((a) => (
                                    <li key={a} className="flex gap-2">
                                        <i className="bxf bx-check mt-0.5 text-lg text-brand-ink" aria-hidden="true" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                            {r.debt_ratio !== null && !none && (
                                <p className="mt-5 rounded-xl bg-canvas-soft px-4 py-3 text-sm">
                                    With this loan, debt payments would take <span className="font-semibold text-brand-ink">{r.debt_ratio}%</span> of your monthly income.
                                </p>
                            )}
                        </Reveal>
                    </div>
                </section>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Button href="/menu" variant="secondary" icon="bx-arrow-left-stroke">
                        Back to main menu
                    </Button>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button href="/borrowing-capacity" orb icon="bx-rotate-ccw">
                            Try again
                        </Button>
                        <Button href="/compare-loans" layered trailing="bx-arrow-right-stroke">
                            Compare loan offers
                        </Button>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
