'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion } from 'motion/react';
import * as d3 from 'd3';
import { Choice } from '@/components/Kit';
import { moneyWhole } from '@/lib/format';
import { cn } from '@/lib/utils';

/*
 * "Try it" widgets for the debt-term pages: each term gets a small hands-on
 * demo with real peso numbers. Nine widget types cover all 26 terms; the
 * slug picks the widget and its framing (see WIDGETS at the bottom).
 *
 * Every number here is an example the reader controls. Anything that varies by
 * lender (rates for secured vs unsecured, grace length) is labelled as such.
 */

const EASE = [0.16, 1, 0.3, 1];
const peso = moneyWhole;

/** Payment for a reducing-balance loan; same formula as App\Support\LoanMath. */
const pmt = (p, monthlyRate, n) => (monthlyRate === 0 ? p / n : (p * monthlyRate) / (1 - (1 + monthlyRate) ** -n));

/** Tween a displayed number toward its target (instant under reduced motion). */
function useTween(value) {
    const [shown, setShown] = useState(value);
    const from = useRef(value);
    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            from.current = value;
            // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced motion: snap straight to the target
            setShown(value);
            return undefined;
        }
        const controls = animate(from.current, value, { duration: 0.5, ease: EASE, onUpdate: setShown });
        from.current = value;
        return () => controls.stop();
    }, [value]);
    return shown;
}

function Num({ value, format = peso, className }) {
    const v = useTween(value);
    return <span className={cn('num', className)}>{format(v)}</span>;
}

/* ------------------------------------------------------------ controls */

function Slider({ id, label, value, min, max, step = 1, onChange, format = (v) => v }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div>
            <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={id} className="text-sm font-medium text-ink">
                    {label}
                </label>
                <span className="num text-sm text-ink">{format(value)}</span>
            </div>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                aria-valuetext={String(format(value))}
                className="gw-range mt-2.5"
                style={{ '--p': `${pct}%` }}
            />
        </div>
    );
}

/** One result line in the dark panel. */
function Stat({ label, children, lead = false, live = false }) {
    return (
        <div className={cn(lead ? 'pb-4' : 'flex items-baseline justify-between gap-4 border-t border-white/10 py-3')} aria-live={live ? 'polite' : undefined}>
            <p className={cn(lead ? 'text-[12px] text-white/60' : 'text-[13px] text-white/70')}>{label}</p>
            <p className={cn(lead ? 'mt-1 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-medium tracking-[-0.03em] text-white' : 'text-[15px] font-medium text-white')}>{children}</p>
        </div>
    );
}

function Shell({ controls, result, note }) {
    return (
        <div className="grid gap-5 md:grid-cols-[1fr_1.05fr]">
            <div className="space-y-6">{controls}</div>
            <div className="flex flex-col rounded-xl bg-night p-5 text-white sm:p-6">
                {result}
                {note && <p className="mt-auto pt-4 text-[12px] leading-relaxed text-white/55">{note}</p>}
            </div>
        </div>
    );
}

/** Horizontal part-to-whole bar on the dark panel. */
function SplitBar({ parts }) {
    const total = d3.sum(parts, (p) => Math.max(0, p.value)) || 1;
    return (
        <div className="my-4">
            <div className="flex h-3 gap-[2px] overflow-hidden rounded-[4px] bg-white/10">
                {parts.map((p) => (
                    <motion.span
                        key={p.label}
                        className="h-full"
                        style={{ background: p.color }}
                        animate={{ width: `${(Math.max(0, p.value) / total) * 100}%` }}
                        transition={{ duration: 0.5, ease: EASE }}
                    />
                ))}
            </div>
            <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/70">
                {parts.map((p) => (
                    <li key={p.label} className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-[2px]" style={{ background: p.color }} />
                        {p.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const C = { principal: '#a3a3a3', interest: '#3ecf8e', fees: '#e0821f', alt: '#8b7ae0' };

/* ------------------------------------------------------------- widgets */

/** Simple interest: what borrowing (or investing) costs or earns. */
function InterestWidget({ mode = 'borrow' }) {
    const [amount, setAmount] = useState(mode === 'bond' ? 500000 : 50000);
    const [rate, setRate] = useState(mode === 'yield' ? 6 : 12);
    const [years, setYears] = useState(1);
    const interest = amount * (rate / 100) * years;

    const words = {
        borrow: { amount: 'You borrow (principal)', rate: 'Interest rate per year', cost: 'Interest you pay', total: 'Total to repay', interest: 'Interest' },
        principal: { amount: 'Principal (amount borrowed)', rate: 'Interest rate per year', cost: 'Interest on that principal', total: 'Principal + interest', interest: 'Interest' },
        yield: { amount: 'You invest', rate: 'Yield per year', cost: 'You earn', total: 'Your money grows to', interest: 'Return' },
        bond: { amount: 'Raised from investors', rate: 'Interest (coupon) per year', cost: 'Interest paid to investors', total: 'Total repaid to investors', interest: 'Interest' },
    }[mode];

    return (
        <Shell
            controls={
                <>
                    <Slider id="ti-amount" label={words.amount} value={amount} min={5000} max={mode === 'bond' ? 2000000 : 500000} step={5000} onChange={setAmount} format={peso} />
                    <Slider id="ti-rate" label={words.rate} value={rate} min={1} max={36} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
                    <Slider id="ti-years" label="Years" value={years} min={1} max={5} onChange={setYears} format={(v) => `${v} year${v > 1 ? 's' : ''}`} />
                </>
            }
            result={
                <>
                    <Stat lead live label={words.cost}>
                        <Num value={interest} />
                    </Stat>
                    <SplitBar parts={[{ label: mode === 'yield' ? 'Invested' : 'Principal', value: amount, color: C.principal }, { label: words.interest, value: interest, color: C.interest }]} />
                    <Stat label={words.total}>
                        <Num value={amount + interest} />
                    </Stat>
                    <Stat label="Per year">
                        <Num value={interest / years} />
                    </Stat>
                </>
            }
            note={`Simple interest: ${peso(amount)} × ${rate}% × ${years} = ${peso(interest)}. Many loans compute interest monthly on a reducing balance instead.`}
        />
    );
}

/** Reducing-balance schedule with a month scrubber. */
function AmortizationWidget({ focus = 'payment' }) {
    const [amount, setAmount] = useState(100000);
    const [rate, setRate] = useState(12);
    const [months, setMonths] = useState(12);
    const [at, setAt] = useState(6);
    const month = Math.min(at, months);

    const schedule = useMemo(() => {
        const i = rate / 100 / 12;
        const pay = pmt(amount, i, months);
        const rows = [];
        for (let m = 1, balance = amount; m <= months; m++) {
            const interest = balance * i;
            const principal = pay - interest;
            balance = Math.max(0, balance - principal);
            rows.push({ m, pay, interest, principal, balance });
        }
        return rows;
    }, [amount, rate, months]);

    const row = schedule[month - 1];
    const paidPrincipal = amount - row.balance;
    const maturity = new Date();
    maturity.setMonth(maturity.getMonth() + months);
    const maturityLabel = maturity.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });

    const W = 100;
    const x = d3.scaleBand().domain(schedule.map((r) => r.m)).range([0, W]).padding(0.15);
    const y = d3.scaleLinear().domain([0, schedule[0].pay]).range([0, 56]);

    const lead = {
        payment: ['Monthly payment', <Num key="p" value={row.pay} />],
        balance: [`Outstanding balance after month ${month}`, <Num key="b" value={row.balance} />],
        maturity: ['Maturity date (fully paid)', <span key="d">{maturityLabel}</span>],
    }[focus];

    return (
        <Shell
            controls={
                <>
                    <Slider id="ti-amt" label="Loan amount" value={amount} min={10000} max={1000000} step={10000} onChange={setAmount} format={peso} />
                    <Slider id="ti-r" label="Interest rate per year" value={rate} min={0} max={36} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
                    <Slider id="ti-n" label="Loan term" value={months} min={3} max={60} onChange={setMonths} format={(v) => `${v} months`} />
                    <Slider id="ti-at" label="Look at month" value={month} min={1} max={months} onChange={setAt} format={(v) => `Month ${v}`} />
                </>
            }
            result={
                <>
                    <Stat lead live label={lead[0]}>
                        {lead[1]}
                    </Stat>
                    <svg viewBox={`0 0 ${W} 60`} preserveAspectRatio="none" className="my-3 h-20 w-full" aria-hidden="true">
                        {schedule.map((r) => (
                            <g key={r.m} opacity={r.m === month ? 1 : r.m < month ? 0.55 : 0.3}>
                                <rect x={x(r.m)} width={x.bandwidth()} y={60 - y(r.principal)} height={y(r.principal)} fill={C.principal} />
                                <rect x={x(r.m)} width={x.bandwidth()} y={60 - y(r.pay)} height={Math.max(0, y(r.interest) - 0.6)} fill={C.interest} />
                            </g>
                        ))}
                    </svg>
                    <ul className="mb-2 flex gap-4 text-[12px] text-white/70">
                        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-[2px]" style={{ background: C.interest }} />Interest part</li>
                        <li className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-[2px]" style={{ background: C.principal }} />Principal part</li>
                    </ul>
                    {focus !== 'payment' && (
                        <Stat label="Monthly payment">
                            <Num value={row.pay} />
                        </Stat>
                    )}
                    <Stat label={`Month ${month}: interest / principal`}>
                        <Num value={row.interest} /> / <Num value={row.principal} />
                    </Stat>
                    {focus !== 'balance' && (
                        <Stat label={`Still owed after month ${month}`}>
                            <Num value={row.balance} />
                        </Stat>
                    )}
                    <Stat label="Principal paid so far">
                        <Num value={paidPrincipal} />
                    </Stat>
                    {focus !== 'maturity' && <Stat label="Maturity date">{maturityLabel}</Stat>}
                </>
            }
            note="Each payment is the same, but early payments are mostly interest. As the balance shrinks, more of each payment goes to principal."
        />
    );
}

/** Fixed vs variable rate, or refinancing an existing loan. */
function RatesWidget({ mode = 'variable' }) {
    const [amount, setAmount] = useState(200000);
    const [rate, setRate] = useState(12);
    const [change, setChange] = useState(3);
    const [newRate, setNewRate] = useState(9);
    const [fees, setFees] = useState(5000);
    const months = 36;

    if (mode === 'refinance') {
        const nowPay = pmt(amount, rate / 1200, months);
        const newPay = pmt(amount, newRate / 1200, months);
        const save = nowPay - newPay;
        const net = save * months - fees;
        const breakEven = save > 0 ? Math.ceil(fees / save) : null;
        return (
            <Shell
                controls={
                    <>
                        <Slider id="ti-bal" label="Balance left on current loan" value={amount} min={20000} max={1000000} step={10000} onChange={setAmount} format={peso} />
                        <Slider id="ti-old" label="Current rate per year" value={rate} min={1} max={36} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
                        <Slider id="ti-new" label="New loan rate per year" value={newRate} min={1} max={36} step={0.5} onChange={setNewRate} format={(v) => `${v}%`} />
                        <Slider id="ti-fee" label="Fees to switch" value={fees} min={0} max={50000} step={500} onChange={setFees} format={peso} />
                    </>
                }
                result={
                    <>
                        <Stat lead live label={net >= 0 ? 'You save over 36 months' : 'Switching costs you'}>
                            <Num value={Math.abs(net)} className={net >= 0 ? '' : 'text-[#ffb27a]'} />
                        </Stat>
                        <Stat label="Monthly payment now">
                            <Num value={nowPay} />
                        </Stat>
                        <Stat label="Monthly payment after refinancing">
                            <Num value={newPay} />
                        </Stat>
                        <Stat label="Fees paid back after">{breakEven ? `${breakEven} month${breakEven > 1 ? 's' : ''}` : 'Never at this rate'}</Stat>
                    </>
                }
                note="Refinancing only pays off if the monthly savings cover the switching fees before the loan ends."
            />
        );
    }

    const i = rate / 1200;
    const fixedPay = pmt(amount, i, months);
    let bal = amount;
    for (let m = 0; m < 12; m++) bal -= fixedPay - bal * i;
    const variablePay = pmt(bal, Math.max(0, rate + change) / 1200, months - 12);
    const fixedTotal = fixedPay * months;
    const variableTotal = fixedPay * 12 + variablePay * (months - 12);

    return (
        <Shell
            controls={
                <>
                    <Slider id="ti-a" label="Loan amount (3 years)" value={amount} min={20000} max={1000000} step={10000} onChange={setAmount} format={peso} />
                    <Slider id="ti-s" label="Starting rate per year" value={rate} min={1} max={30} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
                    <Slider id="ti-c" label="Variable rate changes after year 1 by" value={change} min={-4} max={8} step={0.5} onChange={setChange} format={(v) => `${v > 0 ? '+' : ''}${v} pts`} />
                </>
            }
            result={
                <>
                    <Stat lead live label={variableTotal >= fixedTotal ? 'Variable costs more by' : 'Variable saves you'}>
                        <Num value={Math.abs(variableTotal - fixedTotal)} />
                    </Stat>
                    <Stat label="Fixed rate: every month">
                        <Num value={fixedPay} />
                    </Stat>
                    <Stat label="Variable: months 1–12">
                        <Num value={fixedPay} />
                    </Stat>
                    <Stat label="Variable: months 13–36">
                        <Num value={variablePay} className={variablePay > fixedPay ? 'text-[#ffb27a]' : 'text-brand'} />
                    </Stat>
                </>
            }
            note="A fixed rate keeps the same payment for the agreed period. A variable rate can move with the market, up or down."
        />
    );
}

/** Secured vs unsecured: an illustrative pair of offers. */
function SecuredWidget({ start = 'secured' }) {
    const [kind, setKind] = useState(start);
    const [amount, setAmount] = useState(100000);
    // Example offers only; lenders price these differently.
    const offer = kind === 'secured' ? { rate: 10, max: 1000000 } : { rate: 20, max: 300000 };
    const amt = Math.min(amount, offer.max);
    const pay = pmt(amt, offer.rate / 1200, 24);
    const interest = pay * 24 - amt;

    return (
        <Shell
            controls={
                <>
                    <Choice name="ti-kind" legend="Loan type" options={{ secured: 'Secured (with collateral)', unsecured: 'Unsecured (no collateral)' }} value={kind} onChange={setKind} />
                    <Slider id="ti-sa" label="Amount you need" value={amount} min={10000} max={1000000} step={10000} onChange={setAmount} format={peso} />
                </>
            }
            result={
                <>
                    <Stat lead live label="Example monthly payment (24 months)">
                        <Num value={pay} />
                    </Stat>
                    <Stat label="Example rate per year">{offer.rate}%</Stat>
                    <Stat label="Interest over 2 years">
                        <Num value={interest} />
                    </Stat>
                    <Stat label="Example maximum amount">{peso(offer.max)}</Stat>
                    {amount > offer.max && <p className="mt-2 rounded-[6px] bg-white/10 px-3 py-2 text-[12px] text-[#ffb27a]">Above this example&rsquo;s limit; capped at {peso(offer.max)}.</p>}
                    <p className="mt-4 flex gap-2 text-[13px] text-white/80">
                        <i className={`bxf ${kind === 'secured' ? 'bx-key' : 'bx-lock-open'} mt-0.5 text-brand`} aria-hidden="true" />
                        {kind === 'secured'
                            ? 'Lower rate, but the asset you pledge (land, a vehicle, equipment) can be claimed if you default.'
                            : 'Nothing pledged, so the lender takes more risk: usually a higher rate and a smaller limit.'}
                    </p>
                </>
            }
            note="Example rates and limits for illustration only. Real offers depend on the lender and your business."
        />
    );
}

/** Days past due: on time, grace period, delinquent, non-performing. */
function TimelineWidget({ focus = 'grace' }) {
    const [days, setDays] = useState(focus === 'npl' ? 95 : focus === 'delinquency' ? 35 : 4);
    const grace = 7;
    const stages = [
        { to: 0, label: 'Due date', tone: '#3ecf8e', msg: 'Paid on or before the due date: no penalty, nothing on your record.' },
        { to: grace, label: 'Grace period', tone: '#3ecf8e', msg: 'Inside the grace period: you can still pay without penalty, if your loan has one. Check the exact number of days in your agreement.' },
        { to: 29, label: 'Late', tone: '#ffd166', msg: 'Past the grace period: penalties and late fees usually start. Pay now, or call your lender today.' },
        { to: 89, label: `${days}-day delinquency`, tone: '#ffb27a', msg: `The loan is ${days} days delinquent. It may be reported, and the lender will follow up. Ask about a repayment arrangement.` },
        { to: Infinity, label: 'Non-performing', tone: '#ff8a7a', msg: 'Around 90 days or more overdue, banks generally classify the loan as non-performing. Collection and legal steps become likely.' },
    ];
    const stage = stages.find((s) => days <= s.to);
    const pct = Math.min(1, days / 120) * 100;

    return (
        <Shell
            controls={
                <>
                    <Slider id="ti-days" label="Days since the due date" value={days} min={0} max={120} onChange={setDays} format={(v) => `${v} day${v === 1 ? '' : 's'}`} />
                    <div className="rounded-xl border border-hairline bg-canvas-soft p-4 text-[13px] text-muted">
                        {focus === 'hardship'
                            ? 'Facing hardship? The earlier you talk to your lender, the more options you have: restructuring, a longer term, or a payment holiday.'
                            : `This example uses a ${grace}-day grace period. Yours may be different or may not exist.`}
                    </div>
                </>
            }
            result={
                <>
                    <Stat lead live label="Status">
                        <span style={{ color: stage.tone }}>{days === 0 ? 'On time' : stage.label}</span>
                    </Stat>
                    <div className="relative my-4 h-2 rounded-full bg-white/10" aria-hidden="true">
                        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(grace / 120) * 100}%`, background: 'rgb(62 207 142 / 0.35)' }} />
                        {[30, 60, 90].map((d) => (
                            <span key={d} className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/30" style={{ left: `${(d / 120) * 100}%` }} />
                        ))}
                        <motion.span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-night" style={{ background: stage.tone }} animate={{ left: `${pct}%` }} transition={{ duration: 0.35, ease: EASE }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-white/50" aria-hidden="true">
                        <span>Due</span>
                        <span>30</span>
                        <span>60</span>
                        <span>90+</span>
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-white/85">{stage.msg}</p>
                </>
            }
        />
    );
}

/** What you have minus what you owe: equity or working capital. */
function BalanceWidget({ mode = 'equity' }) {
    const isWC = mode === 'working';
    const [a1, setA1] = useState(isWC ? 40000 : 60000);
    const [a2, setA2] = useState(isWC ? 80000 : 150000);
    const [a3, setA3] = useState(isWC ? 20000 : 250000);
    const [l1, setL1] = useState(isWC ? 30000 : 180000);
    const [l2, setL2] = useState(isWC ? 45000 : 40000);
    const have = a1 + a2 + a3;
    const owe = l1 + l2;
    const diff = have - owe;
    const names = isWC
        ? { a: ['Cash on hand', 'Inventory', 'Customer credit (utang) to collect'], l: ['Supplier bills due', 'Loan payments due this year'], result: 'Working capital' }
        : { a: ['Cash', 'Inventory', 'Equipment and property'], l: ['Loans', 'Unpaid supplier bills'], result: 'Owner’s equity' };

    return (
        <Shell
            controls={
                <>
                    <p className="text-[12px] font-medium uppercase tracking-wide text-muted">{isWC ? 'Current assets' : 'What the business owns'}</p>
                    {[a1, a2, a3].map((v, i) => (
                        <Slider key={i} id={`ti-a${i}`} label={names.a[i]} value={v} min={0} max={isWC ? 200000 : 500000} step={5000} onChange={[setA1, setA2, setA3][i]} format={peso} />
                    ))}
                    <p className="pt-2 text-[12px] font-medium uppercase tracking-wide text-muted">{isWC ? 'Current liabilities' : 'What the business owes'}</p>
                    {[l1, l2].map((v, i) => (
                        <Slider key={i} id={`ti-l${i}`} label={names.l[i]} value={v} min={0} max={isWC ? 200000 : 500000} step={5000} onChange={[setL1, setL2][i]} format={peso} />
                    ))}
                </>
            }
            result={
                <>
                    <Stat lead live label={names.result}>
                        <Num value={diff} className={diff < 0 ? 'text-[#ff8a7a]' : ''} />
                    </Stat>
                    <div className="my-4 space-y-2" aria-hidden="true">
                        {[['Owns', have, C.interest], ['Owes', owe, C.fees]].map(([l, v, c]) => (
                            <div key={l} className="flex items-center gap-3 text-[12px] text-white/70">
                                <span className="w-10">{l}</span>
                                <span className="h-2.5 flex-1 overflow-hidden rounded-[3px] bg-white/10">
                                    <motion.span className="block h-full rounded-[3px]" style={{ background: c }} animate={{ width: `${(v / Math.max(have, owe, 1)) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
                                </span>
                            </div>
                        ))}
                    </div>
                    <Stat label="Total owned">
                        <Num value={have} />
                    </Stat>
                    <Stat label="Total owed">
                        <Num value={owe} />
                    </Stat>
                    <p className="mt-3 text-[13px] text-white/80">
                        {diff >= 0
                            ? isWC
                                ? 'Positive: you can cover the bills coming due this year from what you have on hand.'
                                : 'Positive: the business owns more than it owes. That is your share.'
                            : isWC
                              ? 'Negative: bills due soon are bigger than your short-term resources. A new loan would add strain.'
                              : 'Negative: the business owes more than it owns.'}
                    </p>
                </>
            }
        />
    );
}

/** Co-borrowers sharing one debt. */
function JointWidget() {
    const [debt, setDebt] = useState(120000);
    const [people, setPeople] = useState(3);
    const [missed, setMissed] = useState('no');
    const paying = missed === 'yes' ? people - 1 : people;

    return (
        <Shell
            controls={
                <>
                    <Slider id="ti-debt" label="Shared loan" value={debt} min={20000} max={600000} step={10000} onChange={setDebt} format={peso} />
                    <Slider id="ti-people" label="Co-borrowers" value={people} min={2} max={6} onChange={setPeople} format={(v) => `${v} people`} />
                    <Choice name="ti-missed" legend="Does one co-borrower stop paying?" options={{ no: 'No, everyone pays', yes: 'Yes, one stops' }} value={missed} onChange={setMissed} />
                </>
            }
            result={
                <>
                    <Stat lead live label="Each paying member now covers">
                        <Num value={debt / paying} />
                    </Stat>
                    <div className="my-4 flex flex-wrap gap-2" aria-hidden="true">
                        {d3.range(people).map((i) => {
                            const out = missed === 'yes' && i === people - 1;
                            return (
                                <motion.span
                                    key={i}
                                    layout
                                    className={cn('flex h-11 w-11 items-center justify-center rounded-full text-xl', out ? 'bg-white/10 text-white/30' : 'bg-brand text-ink')}
                                >
                                    <i className={`bxf ${out ? 'bx-user-x' : 'bx-user'}`} />
                                </motion.span>
                            );
                        })}
                    </div>
                    <Stat label="Planned share each">
                        <Num value={debt / people} />
                    </Stat>
                    <p className="mt-3 text-[13px] text-white/80">
                        With joint liability, the lender can collect the full amount from the members who are still paying, not just their own share.
                    </p>
                </>
            }
        />
    );
}

/** Tick-off checklist with a readiness meter. */
function ChecklistWidget({ mode = 'qualified' }) {
    const lists = {
        qualified: {
            title: 'How ready is your business to apply?',
            items: ['Operating for at least a year', 'Records of monthly sales and expenses', 'Valid IDs and business permits', 'Current loans paid on time', 'Room in your cash flow for a new payment'],
            done: 'Looks ready. Compare offers before you apply.',
            todo: 'Work on the unticked items first. They are common things lenders check.',
        },
        knowledge: {
            title: 'Before you sign, do you know…',
            items: ['The interest rate, and if it is flat or reducing', 'Every fee, upfront and hidden', 'The total amount you will repay', 'The penalty for paying late', 'The maturity date'],
            done: 'You know your loan. That is real knowledge of debt.',
            todo: 'Ask the lender for each unticked item, in writing, before you sign.',
        },
    }[mode];
    const [checked, setChecked] = useState(() => lists.items.map((_, i) => i < 2));
    const score = checked.filter(Boolean).length;
    const total = lists.items.length;

    return (
        <Shell
            controls={
                <fieldset>
                    <legend className="mb-3 text-sm font-medium text-ink">{lists.title}</legend>
                    <div className="space-y-2">
                        {lists.items.map((item, i) => (
                            <label key={item} className={cn('flex cursor-pointer items-center gap-3 rounded-[6px] border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/60', checked[i] ? 'border-ink bg-canvas-soft' : 'border-hairline hover:border-hairline-strong')}>
                                <input type="checkbox" checked={checked[i]} onChange={() => setChecked(checked.map((c, j) => (j === i ? !c : c)))} className="h-4 w-4 accent-[#24b47e]" />
                                {item}
                            </label>
                        ))}
                    </div>
                </fieldset>
            }
            result={
                <>
                    <Stat lead live label="Checked">
                        {score} of {total}
                    </Stat>
                    <div className="my-4 flex gap-1.5" aria-hidden="true">
                        {lists.items.map((_, i) => (
                            <motion.span key={i} className="h-2.5 flex-1 rounded-[3px]" animate={{ backgroundColor: i < score ? '#3ecf8e' : 'rgba(255,255,255,0.1)' }} transition={{ duration: 0.3, delay: i * 0.04 }} />
                        ))}
                    </div>
                    <p className="text-[14px] leading-relaxed text-white/85">{score === total ? lists.done : lists.todo}</p>
                </>
            }
        />
    );
}

/** Zero-based budget: give every peso a job until nothing is left to assign. */
function BudgetWidget() {
    const [income, setIncome] = useState(60000);
    const cats = ['Rent and utilities', 'Supplies and stock', 'Salaries', 'Loan payment', 'Savings'];
    const colors = ['#a3a3a3', '#8b7ae0', '#5aa9e6', '#e0821f', '#3ecf8e'];
    const [alloc, setAlloc] = useState([12000, 22000, 15000, 6000, 3000]);
    const left = income - d3.sum(alloc);

    return (
        <Shell
            controls={
                <>
                    <Slider id="ti-inc" label="Monthly income" value={income} min={10000} max={200000} step={1000} onChange={setIncome} format={peso} />
                    {cats.map((c, i) => (
                        <Slider key={c} id={`ti-cat${i}`} label={c} value={alloc[i]} min={0} max={100000} step={500} onChange={(v) => setAlloc(alloc.map((a, j) => (j === i ? v : a)))} format={peso} />
                    ))}
                </>
            }
            result={
                <>
                    <Stat lead live label={left >= 0 ? 'Left to assign' : 'Over budget by'}>
                        <Num value={Math.abs(left)} className={left === 0 ? 'text-brand' : left < 0 ? 'text-[#ff8a7a]' : ''} />
                    </Stat>
                    <SplitBar parts={[...cats.map((c, i) => ({ label: c, value: alloc[i], color: colors[i] })), ...(left > 0 ? [{ label: 'Unassigned', value: left, color: 'rgba(255,255,255,0.15)' }] : [])]} />
                    <p className="mt-2 text-[14px] leading-relaxed text-white/85">
                        {left === 0
                            ? 'Every peso has a job. That is a zero-based budget.'
                            : left > 0
                              ? 'Give the remaining pesos a job (savings counts) until this reaches ₱0.'
                              : 'You have planned more than you earn. Trim a category until this reaches ₱0.'}
                    </p>
                </>
            }
        />
    );
}

/* --------------------------------------------------------------- lookup */

const WIDGETS = {
    amortization: () => <AmortizationWidget />,
    bonds: () => <InterestWidget mode="bond" />,
    collateral: () => <SecuredWidget />,
    debt: () => <InterestWidget />,
    equity: () => <BalanceWidget mode="equity" />,
    'fixed-interest-rate': () => <RatesWidget />,
    'grace-period': () => <TimelineWidget focus="grace" />,
    hardship: () => <TimelineWidget focus="hardship" />,
    'interest-rate': () => <InterestWidget />,
    'joint-liability': () => <JointWidget />,
    'knowledge-of-debt': () => <ChecklistWidget mode="knowledge" />,
    loan: () => <AmortizationWidget />,
    'maturity-date': () => <AmortizationWidget focus="maturity" />,
    'non-performing-loan': () => <TimelineWidget focus="npl" />,
    'outstanding-balance': () => <AmortizationWidget focus="balance" />,
    principal: () => <InterestWidget mode="principal" />,
    'qualified-borrower': () => <ChecklistWidget mode="qualified" />,
    refinancing: () => <RatesWidget mode="refinance" />,
    'secured-loan': () => <SecuredWidget start="secured" />,
    'term-loan': () => <AmortizationWidget />,
    'unsecured-loan': () => <SecuredWidget start="unsecured" />,
    'variable-interest-rate': () => <RatesWidget />,
    'working-capital': () => <BalanceWidget mode="working" />,
    'x-day-delinquency': () => <TimelineWidget focus="delinquency" />,
    yield: () => <InterestWidget mode="yield" />,
    'zero-based-budgeting': () => <BudgetWidget />,
};

export default function TryIt({ slug, term }) {
    const Widget = WIDGETS[slug];
    if (!Widget) return null;

    return (
        <section className="panel mt-10 p-5 sm:p-7" aria-labelledby="try-it">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="try-it" className="text-2xl">
                    Try it: {term}
                </h2>
                <p className="text-[13px] text-muted">Change the inputs and watch the result. Example numbers only.</p>
            </div>
            <Widget />
        </section>
    );
}
