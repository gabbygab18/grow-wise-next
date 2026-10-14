'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import { BackLink } from '@/components/Kit';
import { Photo } from '@/lib/photos';
import { termIcon } from '@/lib/termIcons';
import TryIt from '@/components/TryIt';

// Each term gets one of the owner photos, chosen by its letter so it stays put.
const PHOTO_CYCLE = ['seller', 'services', 'food', 'retail', 'store'];
const EASE = [0.16, 1, 0.3, 1];

function Neighbour({ term, dir }) {
    if (!term) return <span />;
    const prev = dir === 'prev';

    return (
        <Link
            href={`/learn/${term.slug}`}
            className={`group flex items-center gap-3 rounded-xl border border-hairline bg-white px-4 py-3 text-sm transition-colors hover:border-hairline-strong ${prev ? '' : 'flex-row-reverse text-right'}`}
        >
            <i className={`bxf ${prev ? 'bx-arrow-left-stroke group-hover:-translate-x-0.5' : 'bx-arrow-right-stroke group-hover:translate-x-0.5'} text-xl text-ink transition-transform`} aria-hidden="true" />
            <span>
                <span className="block text-xs text-muted">{prev ? 'Previous' : 'Next'}</span>
                <span className="font-medium">{term.term}</span>
            </span>
        </Link>
    );
}

export default function Show({ term, prev, next }) {
    const photo = PHOTO_CYCLE[(term.letter.charCodeAt(0) - 65) % PHOTO_CYCLE.length];

    return (
        <SiteLayout title={term.term}>
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <BackLink href="/learn#az">Back to A–Z</BackLink>
            </div>

            <article key={term.slug} className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-10">
                <AnimatedHeading as="h1" immediate className="text-[clamp(2.5rem,6vw,4.25rem)] tracking-[-0.04em]" text={term.term} />
                <Reveal visible className="mt-4 max-w-2xl text-[19px] leading-relaxed text-muted">
                    {term.definition}
                </Reveal>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1.65fr_1fr] lg:items-start">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, clipPath: 'inset(6% 6% 6% 6% round 16px)' }}
                            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
                            transition={{ duration: 1, ease: EASE }}
                            className="relative aspect-[16/10] overflow-hidden rounded-2xl"
                        >
                            <Photo name={photo} decorative priority sizes="(min-width: 1024px) 720px, 100vw" />
                            <motion.span
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 }}
                                className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[30px] text-brand-ink shadow-[var(--shadow-lift)]"
                                aria-hidden="true"
                            >
                                <i className={`bxf ${termIcon(term.slug)}`} />
                            </motion.span>
                        </motion.div>

                        <Reveal from="up" className="mt-10 max-w-[65ch]">
                            <h2 className="text-2xl">Why it matters</h2>
                            <p className="mt-3 text-[17px] leading-relaxed text-ink-2">
                                Lenders use words like <strong className="font-medium">{term.term.toLowerCase()}</strong> in quotations and loan
                                agreements. Knowing exactly what they mean helps you read an offer with confidence, avoid unnecessary costs, and
                                build a more sustainable business.
                            </p>
                        </Reveal>

                        <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
                            <Neighbour term={prev} dir="prev" />
                            <Neighbour term={next} dir="next" />
                        </div>
                    </div>

                    <motion.aside
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                        className="rounded-2xl border border-hairline bg-canvas-soft p-7 lg:sticky lg:top-24"
                        aria-labelledby="put-to-work"
                    >
                        <h2 id="put-to-work" className="text-2xl">
                            Put this to work
                        </h2>
                        <p className="mt-3 text-[15px] leading-relaxed text-muted">
                            See how {term.term.toLowerCase()} shows up in your own numbers before you sign anything.
                        </p>
                        <div className="mt-6 flex flex-col gap-3">
                            <Button href="/compare-loans" block layered size="lg" trailing="bx-arrow-right-stroke">
                                Compare loan offers
                            </Button>
                            <Button href="/debt-literacy" block orb variant="secondary" size="lg">
                                Test your knowledge
                            </Button>
                        </div>
                    </motion.aside>
                </div>

                <TryIt slug={term.slug} term={term.term} />
            </article>
        </SiteLayout>
    );
}
