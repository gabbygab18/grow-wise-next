'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import Reveal from '@/components/Reveal';
import Button from '@/components/ui/Button';
import { BackLink } from '@/components/Kit';
import { GlossaryMockup } from '@/components/Mockups';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/animated-tabs';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Index({ terms }) {
    const [letter, setLetter] = useState('All');
    const [query, setQuery] = useState('');

    const letters = useMemo(() => new Set(terms.map((t) => t.letter)), [terms]);
    const q = query.trim().toLowerCase();
    const shown = terms.filter(
        (t) => (letter === 'All' || t.letter === letter) && (!q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)),
    );

    return (
        <SiteLayout title="Debt terms made simple">
            <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
                <BackLink href="/menu" />
            </div>
            <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-14">
                <div>
                    <span className="eyebrow">Learn more about debt</span>
                    <AnimatedHeading as="h1" immediate className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)]">
                        Debt terms <span className="text-brand-ink">made simple</span>
                    </AnimatedHeading>
                    <Reveal visible className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                        Get familiar with key debt-related terms and understand how they can affect your business’s financial journey.
                    </Reveal>
                    <Reveal visible className="mt-8">
                        <Button href="#az" layered size="lg" trailing="bx-arrow-down-stroke">
                            Explore terms
                        </Button>
                    </Reveal>
                    <Reveal visible className="mt-8 flex items-center gap-3 text-sm text-muted">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-canvas-soft text-xl text-ink" aria-hidden="true">
                            <i className="bxf bx-light-bulb" />
                        </span>
                        Knowledge today, stronger decisions tomorrow.
                    </Reveal>
                </div>
                <GlossaryMockup />
            </section>

            <section id="az" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6" aria-labelledby="az-title">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <AnimatedHeading as="h2" id="az-title" className="text-3xl" text="Debt terms A–Z" />
                        <p className="mt-1 text-sm text-muted">Browse through the alphabet to find the term you want to learn about.</p>
                    </div>
                    <label className="relative block sm:w-72">
                        <span className="sr-only">Search terms</span>
                        <i className="bxf bx-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted" aria-hidden="true" />
                        <input type="search" className="gw-input pl-10" placeholder="Search a term" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </label>
                </div>

                <Tabs value={letter} onValueChange={setLetter} className="mt-6">
                    <TabsList aria-label="Filter by letter" className="flex-wrap gap-1.5 border-0">
                        {['All', ...ALPHABET].map((l) => (
                            <TabsTrigger
                                key={l}
                                value={l}
                                disabled={l !== 'All' && !letters.has(l)}
                                className={cn(
                                    'h-9 min-w-9 rounded-[6px] border px-2.5 py-0 text-sm font-medium disabled:opacity-30',
                                    letter === l ? 'border-ink' : 'border-hairline bg-white hover:bg-canvas-soft',
                                )}
                                activeClassName="text-white"
                                fillClassName="rounded-[5px] bg-ink"
                            >
                                {l}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <motion.ul layout className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {shown.map((t) => (
                            <motion.li
                                layout
                                key={t.slug}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.25 }}
                            >
                                <Link
                                    href={`/learn/${t.slug}`}
                                    className="group flex h-full items-start gap-4 rounded-xl border border-hairline bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-[var(--shadow-card)]"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas-soft text-lg font-medium text-ink" aria-hidden="true">
                                        {t.letter}
                                    </span>
                                    <span className="flex-1">
                                        <span className="block font-semibold text-ink">{t.term}</span>
                                        <span className="mt-0.5 line-clamp-2 block text-[13px] text-muted">{t.definition}</span>
                                    </span>
                                    <i className="bxf bx-arrow-right-stroke mt-2 text-xl text-brand-ink transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </Link>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
                {shown.length === 0 && (
                    <p className="mt-6 rounded-xl border border-dashed border-hairline bg-white p-8 text-center text-sm text-muted">
                        No terms match “{query}”. Try another word or clear the search.
                    </p>
                )}
            </section>
        </SiteLayout>
    );
}
