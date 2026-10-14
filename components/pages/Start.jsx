'use client';

import { useActionForm, useSite } from '@/lib/site';
import { startBusiness } from '@/app/actions';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Button from '@/components/ui/Button';
import { BackLink, Field } from '@/components/Kit';
import { Photo } from '@/lib/photos';

export default function Start() {
    const { business } = useSite();
    const { data, setData, submit: send, processing, errors } = useActionForm({ name: business?.name ?? '' });

    const submit = (e) => {
        e.preventDefault();
        send(startBusiness);
    };

    return (
        <SiteLayout title="Get started" cta={false}>
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <BackLink href="/" />
            </div>
            <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-16">
                <div>
                    <span className="eyebrow">Step 1 of 2</span>
                    <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(2rem,4.5vw,3rem)]">
                        First, let’s get to know <span className="text-brand-ink">your business.</span>
                    </AnimatedHeading>
                    <form onSubmit={submit} className="panel mt-8 space-y-5 p-6 sm:p-8" noValidate>
                        <Field id="name" label="Business name" hint="Enter the name you use for your business." error={errors.name}>
                            <input
                                id="name"
                                className="gw-input"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Aling Nena’s Sari-Sari Store"
                                maxLength={120}
                                autoComplete="organization"
                                autoFocus
                                required
                                aria-invalid={errors.name ? 'true' : undefined}
                                aria-describedby={errors.name ? 'name-error' : 'name-hint'}
                            />
                        </Field>
                        <Button type="submit" block layered loading={processing} trailing="bx-arrow-right-stroke">
                            Continue
                        </Button>
                    </form>
                </div>
                <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-[var(--shadow-lift)] md:aspect-[4/5]">
                        <Photo name="store" priority sizes="(min-width: 768px) 560px, 100vw" />
                    </div>
                    <p className="panel absolute -bottom-5 left-5 flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink">
                        <i className="bxf bx-store-alt text-lg text-brand-ink" aria-hidden="true" />
                        Every big business started small.
                    </p>
                </div>
            </section>
        </SiteLayout>
    );
}
