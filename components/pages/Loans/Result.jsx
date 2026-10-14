'use client';

import { motion } from 'motion/react';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import LeanCard from '@/components/scrollxui/LeanCard';
import Button from '@/components/ui/Button';
import { BackLink, IconBadge, Steps } from '@/components/Kit';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';
import { LOAN_COLORS, LoanBalanceChart, LoanCostChart } from '@/components/charts';

const COMPUTATION = { reducing: 'Reducing balance', flat: 'Flat rate', unsure: 'Not sure (estimated as flat rate)' };
const COLLATERAL = { yes: 'Yes', no: 'No', unsure: 'Not sure' };

const ROWS = [
    { icon: 'bx-bank', label: 'Loan amount', value: (l) => money(l.amount) },
    { icon: 'bx-chart-line', label: 'Interest rate', value: (l) => `${l.rate}% per ${l.rate_period}` },
    { icon: 'bx-calculator', label: 'Interest computation', value: (l) => COMPUTATION[l.computation] },
    { icon: 'bx-calendar', label: 'Loan term', value: (l) => `${l.term} month${l.term === 1 ? '' : 's'}` },
    { icon: 'bx-wallet', label: 'Monthly payment (approx.)', value: (l) => money(l.monthly), strong: true },
    { icon: 'bx-trending-up', label: 'Total interest', value: (l) => money(l.interest) },
    { icon: 'bx-receipt', label: 'Other fees', value: (l) => money(l.fees) },
    { icon: 'bx-coins', label: 'Total cost of borrowing', value: (l) => money(l.total_cost), strong: true },
    { icon: 'bx-dollar-circle', label: 'Total amount to repay', value: (l) => money(l.total_repayment) },
    { icon: 'bx-shield-quarter', label: 'Collateral required', value: (l) => COLLATERAL[l.collateral] },
];

/** Plain-language reasons behind the pick, built only from the numbers shown. */
function reasons(rows, best, runner) {
    const b = rows[best];
    const r = rows[runner];
    const out = [];
    const sameAmount = b.amount === r.amount;

    if (b.cost_per_100 === r.cost_per_100) {
        out.push(`${b.provider} and ${r.provider} cost about the same. Decide on the monthly payment, collateral and how much you trust the lender.`);
    } else if (sameAmount) {
        out.push(`It costs ${money(r.total_cost - b.total_cost)} less in total (interest + fees) than ${r.provider}.`);
    } else {
        out.push(`Per ₱100 borrowed it costs ${money(b.cost_per_100)}, compared with ${money(r.cost_per_100)} for ${r.provider}.`);
    }
    if (b.monthly > r.monthly) {
        out.push(`Its monthly payment is ${money(b.monthly - r.monthly)} higher, so make sure it fits your monthly cash flow.`);
    }
    if (b.collateral === 'yes' && r.collateral !== 'yes') {
        out.push('It requires collateral — weigh the risk to the asset you pledge.');
    }
    if (rows.some((l) => l.computation === 'unsure')) {
        out.push('For offers marked “Not sure”, interest was estimated as flat rate, the more expensive method. Confirm with the lender.');
    }
    return out;
}

export default function Result({ result }) {
    const { rows, best, runner_up: runner } = result;
    const winner = rows[best];

    return (
        <SiteLayout title="Loan options comparison">
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <BackLink href="/compare-loans/options">Edit loan options</BackLink>
                    <Steps steps={['Enter loan options', 'Compare', 'Result']} current={2} />
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mt-8 overflow-hidden rounded-2xl bg-night p-6 text-white shadow-[var(--shadow-deep)] sm:p-10"
                    aria-labelledby="pick"
                >
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
                        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand text-4xl text-ink" aria-hidden="true">
                            <i className="bxf bx-trophy" />
                        </span>
                        <div>
                            <p className="text-sm text-white/60">Based on the information you provided,</p>
                            <h1 id="pick" className="mt-1 text-[clamp(1.6rem,3.5vw,2.25rem)]">
                                {winner.provider} is the better option for your business.
                            </h1>
                            <ul className="mt-4 space-y-2 text-[15px] text-white/80">
                                {reasons(rows, best, runner).map((r) => (
                                    <li key={r} className="flex gap-2">
                                        <i className="bxf bx-check-circle mt-0.5 text-lg" aria-hidden="true" />
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.section>

                <div className={cn('mt-6 grid gap-4', rows.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
                    {rows.map((l, i) => (
                        <LeanCard key={i} index={i + 1} bare className={cn('panel relative p-5', i === best && 'ring-2 ring-brand')}>
                            <div className="flex items-center justify-between gap-2">
                                <p className="flex min-w-0 items-center gap-2 font-display text-lg font-medium">
                                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: LOAN_COLORS[i] }} aria-hidden="true" />
                                    <span className="truncate">{l.provider}</span>
                                </p>
                                {i === best && <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[12px] text-ink">Recommended</span>}
                            </div>
                            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <dt className="text-muted">Monthly</dt>
                                    <dd className="num font-display text-xl font-medium text-ink">{money(l.monthly)}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted">Total cost</dt>
                                    <dd className="num font-display text-xl font-medium text-ink">{money(l.total_cost)}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted">Rate</dt>
                                    <dd className="num">{l.rate}% / {l.rate_period}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted">Term</dt>
                                    <dd className="num">{l.term} months</dd>
                                </div>
                            </dl>
                        </LeanCard>
                    ))}
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.25fr] lg:items-start">
                    <Reveal from="up" className="panel p-5 sm:p-6">
                        <h2 className="text-lg">Total cost of borrowing</h2>
                        <p className="mb-5 mt-1 text-sm text-muted">Interest plus fees, on top of the amount you borrow.</p>
                        <LoanCostChart rows={rows} best={best} />
                    </Reveal>
                    <Reveal from="up" index={1} className="panel p-5 sm:p-6">
                        <h2 className="text-lg">Amount left to repay</h2>
                        <p className="mb-4 mt-1 text-sm text-muted">Steeper lines mean bigger monthly payments; each dot is the month it’s paid off.</p>
                        <LoanBalanceChart rows={rows} />
                    </Reveal>
                </div>

                <section className="mt-10" aria-labelledby="table-title">
                    <AnimatedHeading as="h2" id="table-title" className="text-2xl" text="Loan options comparison" />
                    <p className="mt-1 text-sm text-muted">A side-by-side view of the loan options you entered.</p>
                    <div className="panel mt-5 overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-ink">
                                    <th scope="col" className="px-5 py-3.5 font-medium text-muted">Details</th>
                                    {rows.map((l, i) => (
                                        <th key={i} scope="col" className={cn('px-5 py-3.5 font-medium', i === best && 'bg-brand/15')}>
                                            {l.provider}
                                            {i === best && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-normal text-ink">Best</span>}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((row) => (
                                    <tr key={row.label} className="border-t border-hairline">
                                        <th scope="row" className="px-5 py-3 font-medium text-ink">
                                            <span className="flex items-center gap-3">
                                                <IconBadge icon={row.icon} className="h-8 w-8 text-base" />
                                                {row.label}
                                            </span>
                                        </th>
                                        {rows.map((l, i) => (
                                            <td key={i} className={cn('num px-5 py-3', i === best && 'bg-brand/[0.06]', row.strong && 'font-semibold')}>
                                                {row.value(l)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-xs text-muted">
                        Estimates only. Actual payments depend on the lender’s computation, schedule and charges.
                    </p>
                </section>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Button href="/compare-loans/options" variant="secondary" icon="bx-edit">
                        Edit loan options
                    </Button>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button href="/borrowing-capacity" orb>
                            Can I afford it?
                        </Button>
                        <Button href="/menu" layered trailing="bx-arrow-right-stroke">
                            Back to options
                        </Button>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
