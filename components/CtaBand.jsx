'use client';

import { useSite } from '@/lib/site';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import { Photo } from '@/lib/photos';
import { cn } from '@/lib/utils';

/**
 * Last word before the footer. Like lct-trading's CtaBand, every section gets
 * its own pitch, photo and layout, so the close never repeats and always
 * points at the next sensible step from where the reader is.
 *
 * layout: split (text | photo), flip (photo | text),
 *         cover (photo behind, wash from the left), center (photo behind, centred)
 */
function presets(started) {
    return {
        home: {
            layout: 'split',
            photo: 'cafe',
            eyebrow: 'No sign-up, no paperwork',
            title: ['Know what you can afford ', 'before you borrow.'],
            lede: 'Compare real offers, see what repayment your monthly cash flow can carry, and learn the terms lenders use.',
            primary: started ? { label: 'Choose a tool', href: '/menu' } : { label: 'Get started', href: '/start' },
            secondary: { label: 'Compare loan offers', href: '/compare-loans' },
            points: ['No account needed', 'Results in minutes', 'Plain-language guidance'],
        },
        menu: {
            layout: 'center',
            photo: 'food',
            eyebrow: 'Not sure where to start?',
            title: ['Start with what your business ', 'can carry.'],
            lede: 'Two minutes with your monthly income and expenses tells you the repayment that fits, before any lender does.',
            primary: { label: 'Check borrowing capacity', href: '/borrowing-capacity' },
            secondary: { label: 'Learn the terms first', href: '/learn' },
        },
        loans: {
            layout: 'cover',
            photo: 'retail',
            eyebrow: 'The cheaper loan is half the answer',
            title: ['Now make sure your cash flow ', 'can carry it.'],
            lede: 'The lowest total cost only helps if the monthly payment fits. Check it against your real income and expenses.',
            primary: { label: 'Check borrowing capacity', href: '/borrowing-capacity' },
            secondary: { label: 'What is an interest rate?', href: '/learn/interest-rate' },
        },
        capacity: {
            layout: 'flip',
            photo: 'services',
            eyebrow: 'You know your number',
            title: ['Put it next to ', 'the offers on your table.'],
            lede: 'Enter the loans you are considering and see which one costs less in total, and which payment fits the amount you just found.',
            primary: { label: 'Compare loan offers', href: '/compare-loans' },
            secondary: { label: 'Test your debt knowledge', href: '/debt-literacy' },
        },
        assessment: {
            layout: 'split',
            photo: 'seller',
            eyebrow: 'Knowledge, meet numbers',
            title: ['Use what you know on ', 'a real offer.'],
            lede: 'Interest, fees, flat or reducing: put two or three offers side by side and let the totals speak.',
            primary: { label: 'Compare loan offers', href: '/compare-loans' },
            secondary: { label: 'Browse debt terms A–Z', href: '/learn' },
        },
        learn: {
            layout: 'center',
            photo: 'store',
            eyebrow: 'From words to pesos',
            title: ['See these terms in ', 'your own numbers.'],
            lede: 'Find the repayment your business can afford, then test yourself on interest, terms and responsible borrowing.',
            primary: { label: 'Check borrowing capacity', href: '/borrowing-capacity' },
            secondary: { label: 'Take the quiz', href: '/debt-literacy' },
        },
    };
}

function variantFor(path) {
    if (path.startsWith('/compare-loans')) return 'loans';
    if (path.startsWith('/borrowing-capacity')) return 'capacity';
    if (path.startsWith('/debt-literacy')) return 'assessment';
    if (path.startsWith('/learn')) return 'learn';
    if (path.startsWith('/menu')) return 'menu';
    return 'home';
}

export default function CtaBand() {
    const { url, business } = useSite();
    const c = presets(Boolean(business))[variantFor(url.split('?')[0])];
    const behind = c.layout === 'cover' || c.layout === 'center';

    const copy = (
        <div className={cn('relative z-10 p-8 sm:p-12', c.layout === 'center' && 'mx-auto max-w-2xl text-center', c.layout === 'cover' && 'max-w-2xl')}>
            <p className={cn('flex items-center gap-2 text-[13px] text-white/70', c.layout === 'center' && 'justify-center')}>
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                {c.eyebrow}
            </p>
            <AnimatedHeading as="h2" id="cta-title" className={cn('mt-4 text-[clamp(2rem,4.2vw,3rem)] tracking-[-0.035em] text-white', c.layout !== 'center' && 'max-w-lg')}>
                {c.title[0]}
                <span className="text-brand">{c.title[1]}</span>
            </AnimatedHeading>
            <p className={cn('mt-4 text-[16px] leading-relaxed text-white/75', c.layout === 'center' ? 'mx-auto max-w-lg' : 'max-w-md')}>{c.lede}</p>
            <div className={cn('mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap', c.layout === 'center' && 'sm:justify-center')}>
                <Button href={c.primary.href} variant="onBrand" layered size="lg" trailing="bx-arrow-right-stroke">
                    {c.primary.label}
                </Button>
                <Button href={c.secondary.href} variant="onBrandGhost" orb size="lg">
                    {c.secondary.label}
                </Button>
            </div>
            {c.points && (
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/60">
                    {c.points.map((t) => (
                        <li key={t} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                            {t}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:px-6" aria-labelledby="cta-title">
            <Reveal
                from="up"
                className={cn(
                    'relative isolate overflow-hidden rounded-2xl bg-night text-white shadow-[var(--shadow-deep)]',
                    !behind && 'grid md:grid-cols-[1.15fr_1fr]',
                    c.layout === 'flip' && 'md:grid-cols-[1fr_1.3fr]',
                    behind && 'shadow-[var(--shadow-deep),inset_0_-3px_0_var(--color-brand)]',
                    c.layout === 'center' && 'py-6 sm:py-10',
                )}
            >
                {behind ? (
                    <>
                        <div className="absolute inset-0 -z-10" aria-hidden="true">
                            <Photo name={c.photo} decorative sizes="(min-width: 1152px) 1152px, 100vw" />
                        </div>
                        <div
                            className={cn(
                                'absolute inset-0 -z-10',
                                c.layout === 'cover'
                                    ? 'bg-[linear-gradient(90deg,rgb(28_28_28/0.96)_0%,rgb(28_28_28/0.88)_45%,rgb(28_28_28/0.35)_100%)] max-md:bg-[linear-gradient(180deg,rgb(28_28_28/0.92),rgb(28_28_28/0.7))]'
                                    : 'bg-[rgb(28_28_28/0.84)]',
                            )}
                            aria-hidden="true"
                        />
                        {copy}
                    </>
                ) : (
                    <>
                        {copy}
                        <div className={cn('relative min-h-[240px]', c.layout === 'flip' && 'md:order-first')}>
                            <Photo name={c.photo} decorative sizes="(min-width: 768px) 45vw, 100vw" className="absolute inset-0" />
                            <div
                                className={cn(
                                    'absolute inset-0 bg-gradient-to-b from-night via-transparent to-transparent',
                                    c.layout === 'flip' ? 'md:bg-gradient-to-l' : 'md:bg-gradient-to-r',
                                )}
                                aria-hidden="true"
                            />
                        </div>
                    </>
                )}
            </Reveal>
        </section>
    );
}
