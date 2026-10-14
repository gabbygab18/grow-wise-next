'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useSite } from '@/lib/site';
import { IconBadge } from '@/components/Kit';
import { Photo } from '@/lib/photos';
import Transition from '@/components/ui/transition';
import Marquee from '@/components/Marquee';

const FEATURES = [
    { icon: 'bx-chart-line', title: 'Make informed decisions', text: 'Clear numbers to plan and borrow wisely.' },
    { icon: 'bx-shield-quarter', title: 'Manage your finances', text: 'See what your cash flow can safely carry.' },
    { icon: 'bx-leaf', title: 'Achieve sustainable growth', text: 'Borrow for growth, not for pressure.' },
    { icon: 'bx-store-alt', title: 'Built for every business', text: "Whether you're just starting or scaling." },
];

const BARS = [38, 52, 46, 68, 74, 92];
const EASE = [0.22, 1, 0.36, 1];

/** Hero: a real owner at work, with the two numbers GrowWise gives her floating over the photo. */
function HeroVisual({ delay = 0 }) {
    return (
        <div className="relative mx-auto w-full max-w-[500px]">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, clipPath: 'inset(8% 8% 8% 8% round 12px)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 12px)' }}
                transition={{ duration: 1, delay, ease: EASE }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[var(--shadow-lift)] md:aspect-[4/5]"
            >
                <Photo name="seller" priority sizes="(min-width: 768px) 500px, 100vw" className="object-[62%_center]" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: delay + 0.5, ease: EASE }}
                className="panel absolute -bottom-8 -left-10 hidden w-[250px] p-4 sm:block"
                aria-hidden="true"
            >
                <p className="font-display text-sm font-medium leading-tight text-ink">
                    Better decisions. <span className="text-brand-ink">Greater growth.</span>
                </p>
                <div className="mt-3 flex h-20 items-end gap-1.5 rounded-xl bg-canvas-soft p-2.5">
                    {BARS.map((h, i) => (
                        <motion.span
                            key={i}
                            className="flex-1 rounded-t-[4px] bg-brand"
                            style={{ opacity: 0.45 + i * 0.11 }}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 0.7, delay: delay + 0.8 + i * 0.07, ease: EASE }}
                        />
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: delay + 1.1, ease: EASE }}
                className="panel absolute -bottom-6 left-4 flex items-center gap-3 px-4 py-3 sm:-right-8 sm:bottom-auto sm:left-auto sm:top-6"
                aria-hidden="true"
            >
                <IconBadge icon="bx-check-shield" solid className="h-9 w-9 text-lg" />
                <div className="text-xs">
                    <p className="font-semibold text-ink">Repayment fits</p>
                    <p className="text-muted">within your cash flow</p>
                </div>
            </motion.div>
        </div>
    );
}

const TYPES = [
    {
        photo: 'retail',
        name: 'Retail',
        text: 'Sari-sari stores, shops and online sellers: plan a restocking loan around your daily sales.',
    },
    {
        photo: 'services',
        name: 'Services',
        text: 'Tailoring, repairs, salons: time new equipment so repayments fit a slow month too.',
    },
    {
        photo: 'food',
        name: 'Food and beverage',
        text: 'Carinderias, cafés and stalls: compare offers before you expand.',
    },
];

function BusinessTypes() {
    const { business } = useSite();

    return (
        <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="types-title">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <AnimatedHeading as="h2" id="types-title" className="max-w-xl text-[clamp(1.9rem,4vw,2.75rem)]">
                    Built for businesses <span className="text-brand-ink">like yours.</span>
                </AnimatedHeading>
                <p className="max-w-sm text-[15px] text-muted">
                    Whatever you sell, the questions before a loan are the same: what will it cost, and can the business carry it?
                </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-[1.25fr_1fr] md:grid-rows-2">
                {TYPES.map((t, i) => (
                    <Reveal key={t.name} index={i + 1} from="up" className={i === 0 ? 'md:row-span-2' : ''}>
                        <Link
                            href={business ? '/menu' : '/start'}
                            className="group relative block h-full min-h-[260px] overflow-hidden rounded-xl md:min-h-[240px]"
                        >
                            <Photo
                                name={t.photo}
                                sizes={i === 0 ? '(min-width: 768px) 620px, 100vw' : '(min-width: 768px) 500px, 100vw'}
                                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2416]/90 via-[#0b2416]/35 to-transparent" aria-hidden="true" />
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                                <div>
                                    <h3 className="text-xl text-white sm:text-2xl">{t.name}</h3>
                                    <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/85">{t.text}</p>
                                </div>
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-white text-xl text-ink transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                                    <i className="bxf bx-arrow-right-stroke" />
                                </span>
                            </div>
                        </Link>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

const TERMS = ['Amortization', 'Collateral', 'Interest rate', 'Grace period', 'Principal', 'Refinancing', 'Working capital', 'Maturity date', 'Secured loan', 'Outstanding balance', 'Fixed interest rate', 'Zero-based budgeting'];

/*
 * The curtain is a first-visit moment, once per browser session. The server
 * can't see sessionStorage, so it always renders the curtain hidden by CSS;
 * this inline script runs before first paint and turns it on (html[data-intro]).
 * The flag is cleared when the curtain lifts, so client-side visits back to
 * Home don't replay it.
 */
const INTRO_SCRIPT = "try{if(!sessionStorage.getItem('gw-intro-seen')){sessionStorage.setItem('gw-intro-seen','1');document.documentElement.dataset.intro='1'}}catch(e){}";
const introOn = () => typeof document !== 'undefined' && document.documentElement.dataset.intro === '1';
const introDone = () => {
    delete document.documentElement.dataset.intro;
};

function CurtainMark() {
    return (
        <span className="flex items-center gap-3 text-white">
            <i className="bxf bx-leaf -rotate-12 text-[52px] text-brand" />
            <span className="font-display text-[44px] font-bold tracking-[-0.04em]">
                Grow<span className="text-brand">Wise</span>
            </span>
        </span>
    );
}

export default function Home() {
    // Only animation delays depend on this, never markup, so hydration stays clean.
    const d = introOn() ? 1.7 : 0; // hero waits for the curtain to lift

    return (
        <SiteLayout>
            <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
            <Transition onFinished={introDone} introDuration={1.1} transitionDuration={0.9} type="curved" direction="bottom" intro={<CurtainMark />}>
            <section className="relative overflow-hidden">
                <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-20">
                    <div>
                        <Reveal visible>
                            <span className="eyebrow">Your business, our priority</span>
                        </Reveal>
                        <AnimatedHeading as="h1" immediate delay={d} className="mt-5 text-[clamp(2.25rem,5.5vw,3.75rem)] text-ink">
                            Grow your business with <span className="text-brand-ink">smarter financial decisions.</span>
                        </AnimatedHeading>
                        <Reveal visible className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                            Compare loan offers, see how much your business can safely borrow, and build the know-how to borrow
                            with confidence.
                        </Reveal>
                        <Reveal visible className="mt-8">
                            <Button href="/start" layered size="lg" trailing="bx-arrow-right-stroke">
                                Get started
                            </Button>
                        </Reveal>
                    </div>
                    <HeroVisual delay={d} />
                </div>
            </section>

            <section className="relative border-y border-hairline bg-canvas-soft">
                <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
                    {FEATURES.map((f, i) => (
                        <Reveal key={f.title} index={i + 1} from="up" className="flex flex-col items-center px-4 py-4 text-center">
                            <IconBadge icon={f.icon} className="mb-3" />
                            <h2 className="text-base text-ink">{f.title}</h2>
                            <p className="mt-1 text-[13px] text-muted">{f.text}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-16 flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6" aria-label="Debt terms">
                <Link href="/learn" className="shrink-0 text-sm font-medium text-ink underline decoration-hairline-strong underline-offset-4 hover:decoration-ink">
                    26 debt terms, explained simply
                </Link>
                <Marquee items={TERMS} className="min-w-0 flex-1" />
            </section>

            <BusinessTypes />
            </Transition>
        </SiteLayout>
    );
}
