'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useActionForm } from '@/lib/site';
import { compareLoans } from '@/app/actions';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Button from '@/components/ui/Button';
import { BackLink, Choice, Field, MoneyInput, Steps } from '@/components/Kit';
import { LOAN_COLORS } from '@/lib/palette';
import MenuSelect from '@/components/ui/menu-select';

const MAX = 3;
const blank = () => ({
    provider: '', amount: '', rate: '', rate_period: 'year', computation: 'unsure', term: '', collateral: 'unsure', fees: '',
});

const COMPUTATION = { reducing: 'Reducing balance', flat: 'Flat rate', unsure: 'Not sure' };
const COLLATERAL = { yes: 'Yes', no: 'No', unsure: 'Not sure' };

function LoanCard({ index, loan, errors, onChange, onRemove }) {
    const id = (f) => `loan-${index}-${f}`;
    const err = (f) => errors[`loans.${index}.${f}`];

    return (
        <motion.fieldset
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="panel flex flex-col gap-5 p-5 sm:p-6"
        >
            <div className="flex items-center justify-between">
                <legend className="contents">
                    <span className="flex items-center gap-2 font-display text-lg font-medium">
                        <span className="flex h-7 w-7 items-center justify-center rounded-[6px] text-sm text-ink ring-1 ring-hairline" style={{ boxShadow: `inset 0 -3px 0 ${LOAN_COLORS[index]}` }}>{index + 1}</span>
                        Loan option {index + 1}
                    </span>
                </legend>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="flex h-9 w-9 items-center justify-center rounded-[6px] text-xl text-muted transition-colors hover:bg-red-50 hover:text-danger"
                        aria-label={`Remove loan option ${index + 1}`}
                    >
                        <i className="bxf bx-trash" aria-hidden="true" />
                    </button>
                )}
            </div>

            <Field id={id('provider')} label="Loan provider name" error={err('provider')}>
                <input
                    id={id('provider')}
                    className="gw-input"
                    value={loan.provider}
                    onChange={(e) => onChange('provider', e.target.value)}
                    placeholder={`e.g. Bank ${String.fromCharCode(65 + index)}`}
                    maxLength={80}
                    aria-invalid={err('provider') ? 'true' : undefined}
                />
            </Field>

            <Field id={id('amount')} label="Loan amount offered" error={err('amount')}>
                <MoneyInput id={id('amount')} value={loan.amount} onChange={(e) => onChange('amount', e.target.value)} placeholder="100,000" error={err('amount')} />
            </Field>

            <Field id={id('rate')} label="Interest rate (%)" error={err('rate')}>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                        id={id('rate')}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="100"
                        step="any"
                        className="gw-input num"
                        value={loan.rate}
                        onChange={(e) => onChange('rate', e.target.value)}
                        placeholder="12"
                        aria-invalid={err('rate') ? 'true' : undefined}
                    />
                    <MenuSelect
                        id={id('rate_period')}
                        className="w-[132px]"
                        value={loan.rate_period}
                        onChange={(v) => onChange('rate_period', v)}
                        options={{ year: 'Per year', month: 'Per month' }}
                        label={`Interest rate period, loan option ${index + 1}`}
                    />
                </div>
            </Field>

            <Choice
                name={id('computation')}
                legend="Interest computation"
                options={COMPUTATION}
                value={loan.computation}
                onChange={(v) => onChange('computation', v)}
                hint="Check the lender’s quotation or loan agreement. Flat rate and reducing balance cost differently at the same rate."
                error={err('computation')}
            />

            <Field id={id('term')} label="Loan term (months)" error={err('term')}>
                <input
                    id={id('term')}
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="360"
                    step="1"
                    className="gw-input num"
                    value={loan.term}
                    onChange={(e) => onChange('term', e.target.value)}
                    placeholder="12"
                    aria-invalid={err('term') ? 'true' : undefined}
                />
            </Field>

            <Choice name={id('collateral')} legend="Is collateral required?" options={COLLATERAL} value={loan.collateral} onChange={(v) => onChange('collateral', v)} error={err('collateral')} />

            <Field id={id('fees')} label="Other fees" hint="Include known processing fees and other upfront charges, if any." error={err('fees')}>
                <MoneyInput id={id('fees')} value={loan.fees} onChange={(e) => onChange('fees', e.target.value)} placeholder="0" error={err('fees')} />
            </Field>
        </motion.fieldset>
    );
}

export default function Options({ saved }) {
    const { data, setData, submit: send, processing, errors } = useActionForm({ loans: saved ?? [blank(), blank()] });

    const update = (i, field, value) => setData('loans', data.loans.map((l, j) => (j === i ? { ...l, [field]: value } : l)));
    const remove = (i) => setData('loans', data.loans.filter((_, j) => j !== i));
    const add = () => setData('loans', [...data.loans, blank()]);

    const submit = (e) => {
        e.preventDefault();
        send(compareLoans, { scrollTop: true });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <SiteLayout title="Enter your loan options">
            <form onSubmit={submit} noValidate className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <BackLink href="/compare-loans" />
                    <Steps steps={['Enter loan options', 'Compare', 'Result']} current={0} />
                </div>

                <div className="mt-8">
                    <AnimatedHeading as="h1" immediate className="text-[clamp(1.75rem,4vw,2.5rem)]" text="Enter your loan options" />
                    <p className="mt-2 max-w-xl text-[15px] text-muted">
                        Enter the details of the loan options you’re considering. You can compare up to {MAX} options.
                    </p>
                </div>

                {hasErrors && (
                    <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
                        <i className="bxf bx-alert-circle text-lg" aria-hidden="true" />
                        Some details need fixing. Check the highlighted fields below.
                    </div>
                )}

                <div className={`mt-8 grid gap-5 ${data.loans.length === 3 ? 'lg:grid-cols-3' : ''} md:grid-cols-2`}>
                    <AnimatePresence initial={false}>
                        {data.loans.map((loan, i) => (
                            <LoanCard
                                key={i}
                                index={i}
                                loan={loan}
                                errors={errors}
                                onChange={(f, v) => update(i, f, v)}
                                onRemove={data.loans.length > 2 ? () => remove(i) : null}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {data.loans.length < MAX ? (
                        <button
                            type="button"
                            onClick={add}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-dashed border-hairline-strong px-4 text-sm font-medium text-brand-ink transition-colors hover:border-brand hover:bg-white"
                        >
                            <i className="bxf bx-plus text-lg" aria-hidden="true" />
                            Add another option
                        </button>
                    ) : (
                        <span className="text-sm text-muted">You’ve added the maximum of {MAX} options.</span>
                    )}
                    <Button type="submit" layered size="lg" loading={processing} trailing="bx-arrow-right-stroke">
                        Compare
                    </Button>
                </div>
            </form>
        </SiteLayout>
    );
}
