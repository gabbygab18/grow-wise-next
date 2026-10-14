'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { CHART, LOAN_COLORS } from '@/lib/palette';

/*
 * Composited product UI: two stacked panes per tool, showing what the tool
 * actually produces. Static and aria-hidden: the real UI is one click away.
 * One authored moment: the back pane settles, the front pane slides in over it.
 */
const EASE = [0.16, 1, 0.3, 1];

function Pane({ title, className, children, delay = 0, dark = false }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: EASE }}
            className={cn(
                'absolute overflow-hidden rounded-xl border shadow-[var(--shadow-lift)]',
                dark ? 'border-night-soft bg-night text-white' : 'border-hairline bg-white text-ink',
                className,
            )}
        >
            {title && (
                <div className={cn('flex h-9 items-center gap-2 border-b px-3.5 text-[11px]', dark ? 'border-white/10 text-white/60' : 'border-hairline-cool text-muted')}>
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    {title}
                </div>
            )}
            {children}
        </motion.div>
    );
}

function Frame({ children, className }) {
    return (
        <div className={cn('relative mx-auto aspect-[16/10] w-full max-w-[520px]', className)} aria-hidden="true">
            {children}
        </div>
    );
}

export function LoansMockup({ className }) {
    const rows = [
        ['Monthly payment', '₱8,792', '₱6,556'],
        ['Total interest', '₱5,499', '₱18,000'],
        ['Other fees', '₱2,000', '₱1,500'],
        ['Total cost', '₱7,499', '₱19,500'],
    ];
    return (
        <Frame className={className}>
            <Pane title="Loan options comparison" className="inset-x-0 top-0 w-[88%]">
                <table className="w-full text-[12px]">
                    <thead>
                        <tr className="border-b border-hairline-cool text-left text-muted">
                            <th className="px-3.5 py-2 font-normal">Details</th>
                            {['Bank A', 'Coop B'].map((n, i) => (
                                <th key={n} className="px-3.5 py-2 font-medium text-ink">
                                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: LOAN_COLORS[i] }} />
                                    {n}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(([l, a, b], i) => (
                            <tr key={l} className="border-b border-hairline-cool last:border-0">
                                <td className="px-3.5 py-2.5 text-muted">{l}</td>
                                <td className={cn('num px-3.5 py-2.5', i === 3 && 'font-medium')}>{a}</td>
                                <td className={cn('num px-3.5 py-2.5', i === 3 && 'font-medium')}>{b}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Pane>
            <Pane dark delay={0.25} className="bottom-0 right-0 w-[64%] p-4">
                <p className="text-[11px] text-white/60">Recommended</p>
                <p className="mt-1 text-[15px] font-medium leading-snug">Bank A is the better option for your business.</p>
                <p className="mt-3 flex items-center gap-2 text-[12px] text-white/75">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    ₱12,001 less in total than Coop B
                </p>
            </Pane>
        </Frame>
    );
}

export function CapacityMockup({ className }) {
    const parts = [
        [64, CHART.neutral, 'Expenses'],
        [10, CHART.caution, 'Existing loans'],
        [18, CHART.accent, 'New repayment'],
        [8, CHART.track, 'Buffer'],
    ];
    return (
        <Frame className={className}>
            <Pane title="Where your monthly income goes" className="inset-x-0 top-0 w-[90%] p-4 pt-0">
                <div className="mt-4 flex h-6 gap-[2px] overflow-hidden rounded-[4px]">
                    {parts.map(([w, c]) => (
                        <motion.span
                            key={c}
                            className="h-full"
                            style={{ background: c }}
                            initial={{ width: 0 }}
                            animate={{ width: `${w}%` }}
                            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
                        />
                    ))}
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                    {parts.map(([w, c, l]) => (
                        <li key={l} className="flex items-center gap-2 text-muted">
                            <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
                            <span className="flex-1">{l}</span>
                            <span className="num text-ink">{w}%</span>
                        </li>
                    ))}
                </ul>
            </Pane>
            <Pane delay={0.25} className="bottom-0 right-0 w-[60%] p-4">
                <p className="text-[11px] text-muted">Estimated loan amount</p>
                <p className="mt-1 font-display text-[28px] font-medium tracking-[-0.03em]">₱273,000</p>
                <div className="mt-3 flex items-center justify-between border-t border-hairline-cool pt-3 text-[12px]">
                    <span className="text-muted">Monthly repayment</span>
                    <span className="num font-medium">₱9,100</span>
                </div>
            </Pane>
        </Frame>
    );
}

export function QuizMockup({ className }) {
    const options = ['The total amount saved in a bank.', 'The extra cost of borrowing money, as a percentage.', 'The money earned from employment.'];
    return (
        <Frame className={className}>
            <Pane title="Question 6 of 20 · Interest and Rates" className="inset-x-0 top-0 w-[90%] p-4 pt-0">
                <p className="mt-4 text-[15px] font-medium leading-snug">What does an interest rate represent?</p>
                <ul className="mt-3 space-y-2 text-[12px]">
                    {options.map((o, i) => (
                        <li key={o} className={cn('flex items-center gap-2.5 rounded-[6px] border px-3 py-2', i === 1 ? 'border-ink bg-canvas-soft' : 'border-hairline')}>
                            <span className={cn('h-3 w-3 shrink-0 rounded-full border', i === 1 ? 'border-[5px] border-brand-deep' : 'border-hairline-strong')} />
                            {o}
                        </li>
                    ))}
                </ul>
            </Pane>
            <Pane dark delay={0.25} className="bottom-0 right-0 w-[52%] p-4">
                <p className="text-[11px] text-white/60">Your scorecard</p>
                <p className="mt-1 font-display text-[28px] font-medium tracking-[-0.03em]">17/20</p>
                <div className="mt-3 space-y-1.5">
                    {[100, 80, 80, 80].map((w, i) => (
                        <span key={i} className="block h-1.5 overflow-hidden rounded-full bg-white/10">
                            <motion.span className="block h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8, delay: 0.6 + i * 0.08, ease: EASE }} />
                        </span>
                    ))}
                </div>
            </Pane>
        </Frame>
    );
}

export function GlossaryMockup({ className }) {
    const letters = 'ABCDEFGHIJKLMNOPQRST'.split('');
    return (
        <Frame className={className}>
            <Pane title="Debt terms A–Z" className="inset-x-0 top-0 w-[88%] p-4 pt-0">
                <div className="mt-4 grid grid-cols-10 gap-1.5 text-[11px]">
                    {letters.map((l) => (
                        <span key={l} className={cn('flex h-7 items-center justify-center rounded-[6px] border font-medium', l === 'C' ? 'border-ink bg-ink text-white' : 'border-hairline text-ink')}>
                            {l}
                        </span>
                    ))}
                </div>
                <div className="mt-4 space-y-2 text-[12px]">
                    {['Amortization', 'Bonds', 'Collateral'].map((t) => (
                        <div key={t} className="flex items-center justify-between rounded-[6px] border border-hairline-cool px-3 py-2">
                            {t}
                            <i className="bxf bx-arrow-right-stroke text-muted" />
                        </div>
                    ))}
                </div>
            </Pane>
            <Pane delay={0.25} className="bottom-0 right-0 w-[58%] p-4">
                <p className="flex items-center gap-2 text-[11px] text-muted">
                    <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-brand text-[11px] font-medium text-ink">C</span>
                    Collateral
                </p>
                <p className="mt-2 text-[14px] leading-snug">An asset used as security for a loan.</p>
            </Pane>
        </Frame>
    );
}
