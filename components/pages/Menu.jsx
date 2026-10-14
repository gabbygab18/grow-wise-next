'use client';

import Link from 'next/link';
import { useSite } from '@/lib/site';
import SiteLayout from '@/components/SiteLayout';
import AnimatedHeading from '@/components/AnimatedHeading';
import LeanCard from '@/components/scrollxui/LeanCard';
import { SpotlightCard } from '@/components/ui/spotlightcard';

const TOOLS = [
    {
        href: '/compare-loans',
        icon: 'bx-git-compare',
        title: 'Compare my loan options',
        text: 'Put your loan offers side by side and see which one really costs less.',
    },
    {
        href: '/borrowing-capacity',
        icon: 'bx-calculator',
        title: 'Check my borrowing capacity',
        text: 'Enter your monthly income and expenses to estimate what repayment your business can afford.',
    },
    {
        href: '/debt-literacy',
        icon: 'bx-task',
        title: 'Assess my debt literacy',
        text: 'Take a short quiz on interest, loan terms and responsible borrowing, and see where to improve.',
    },
    {
        href: '/learn',
        icon: 'bx-book-open',
        title: 'Learn more about debt',
        text: 'A mini dictionary of debt terms, A to Z, in plain words.',
    },
];

export default function Menu() {
    const { business } = useSite();

    return (
        <SiteLayout title="What would you like to do today?">
            <section className="relative mx-auto max-w-5xl px-4 pt-12 sm:px-6 md:pt-16">

                <div className="text-center">
                    <p className="flex items-center justify-center gap-3 font-display text-3xl font-medium text-brand-ink sm:text-4xl">
                        Hi{business?.name ? `, ${business.name}` : ''}!
                    </p>
                    <AnimatedHeading as="h1" immediate className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)]" text="What would you like to do today?" />
                    <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
                        Choose an option below to get started. We’re here to help you make smarter financial decisions for your business.
                    </p>
                </div>

                <ul className="mt-10 grid gap-5 sm:grid-cols-2">
                    {TOOLS.map((tool, i) => (
                        <LeanCard as="li" key={tool.href} index={i + 1} bare className="h-full list-none">
                            <SpotlightCard className="h-full">
                                <Link href={tool.href} className="flex h-full items-center gap-5 p-5 sm:p-6">
                                    <span className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-canvas-soft text-[40px] text-brand-ink" aria-hidden="true">
                                        <i className={`bxf ${tool.icon}`} />
                                        <i className="bxf bx-leaf absolute -bottom-1 -right-1 text-xl text-brand" />
                                    </span>
                                    <span className="flex-1">
                                        <span className="block font-display text-lg font-medium leading-tight text-ink">{tool.title}</span>
                                        <span className="mt-1.5 block text-[13px] leading-relaxed text-muted">{tool.text}</span>
                                    </span>
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-hairline bg-white text-xl text-ink transition-[transform,background-color,border-color] group-hover:border-brand group-hover:bg-brand group-hover:translate-x-1" aria-hidden="true">
                                        <i className="bxf bx-arrow-right-stroke" />
                                    </span>
                                </Link>
                            </SpotlightCard>
                        </LeanCard>
                    ))}
                </ul>
            </section>
        </SiteLayout>
    );
}
