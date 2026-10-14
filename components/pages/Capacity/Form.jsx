'use client';

import { useActionForm } from '@/lib/site';
import { calculateCapacity } from '@/app/actions';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import { BackLink, Field, MoneyInput } from '@/components/Kit';
import { CapacityMockup } from '@/components/Mockups';
import MenuSelect from '@/components/ui/menu-select';

export default function Form({ businessTypes, yearsOptions, saved }) {
    const { data, setData, submit: send, processing, errors } = useActionForm(
        saved ?? { business_type: '', years_operating: '', income: '', expenses: '', existing: '' },
    );

    const submit = (e) => {
        e.preventDefault();
        send(calculateCapacity);
    };

    return (
        <SiteLayout title="Check my borrowing capacity">
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <BackLink href="/menu" />
            </div>
            <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1.1fr] md:py-14">
                <div>
                    <span className="eyebrow">Borrowing capacity calculator</span>
                    <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)]">
                        Check my <span className="text-brand-ink">borrowing capacity</span>
                    </AnimatedHeading>
                    <Reveal visible className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                        Answer a few questions about your business and finances. We’ll estimate how much your business can afford
                        to repay each month, and what loan amount that could support.
                    </Reveal>
                    <CapacityMockup className="mt-12 hidden md:block" />
                </div>

                <form onSubmit={submit} noValidate className="panel space-y-5 p-6 sm:p-8">
                    <h2 className="font-display text-xl">Tell us about your business</h2>

                    <Field id="business_type" label="1. Business type" error={errors.business_type}>
                        <MenuSelect id="business_type" value={data.business_type} onChange={(v) => setData('business_type', v)} options={businessTypes} placeholder="Select your business type" invalid={errors.business_type} describedBy={errors.business_type ? 'business_type-error' : undefined} />
                    </Field>

                    <Field id="years_operating" label="2. Years in operation" error={errors.years_operating}>
                        <MenuSelect id="years_operating" value={data.years_operating} onChange={(v) => setData('years_operating', v)} options={yearsOptions} placeholder="Select number of years" invalid={errors.years_operating} describedBy={errors.years_operating ? 'years_operating-error' : undefined} />
                    </Field>

                    <Field id="income" label="3. Monthly income" hint="Average monthly sales or revenue." error={errors.income}>
                        <MoneyInput id="income" value={data.income} onChange={(e) => setData('income', e.target.value)} placeholder="Enter amount" error={errors.income} />
                    </Field>

                    <Field id="expenses" label="4. Monthly expenses" hint="Rent, supplies, salaries, utilities and other regular costs." error={errors.expenses}>
                        <MoneyInput id="expenses" value={data.expenses} onChange={(e) => setData('expenses', e.target.value)} placeholder="Enter amount" error={errors.expenses} />
                    </Field>

                    <Field id="existing" label="5. Existing loan payments (monthly, if any)" hint="Leave blank if you have no existing loans." error={errors.existing}>
                        <MoneyInput id="existing" value={data.existing ?? ''} onChange={(e) => setData('existing', e.target.value)} placeholder="0" error={errors.existing} />
                    </Field>

                    <Button type="submit" block layered size="lg" loading={processing} trailing="bx-arrow-right-stroke">
                        Calculate my borrowing capacity
                    </Button>
                </form>
            </section>
        </SiteLayout>
    );
}
