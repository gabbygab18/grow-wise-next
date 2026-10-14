'use client';

import Link from 'next/link';
import { useSite } from '@/lib/site';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { PHOTO_CREDITS } from '@/lib/photos';
import CtaBand from '@/components/CtaBand';
import ScrollTop from '@/components/ScrollTop';

const NAV = [
    { href: '/', label: 'Home', match: (u) => u === '/' },
    { href: '/menu', label: 'Tools', match: (u) => /^\/(menu|start|compare-loans|borrowing-capacity|debt-literacy)/.test(u) },
    { href: '/learn', label: 'Learn', match: (u) => u.startsWith('/learn') },
];

/** Wordmark: ink "Grow", emerald "Wise" (a logotype, so the 2:1 emerald is allowed here only). */
function Wordmark({ dark = false }) {
    return (
        <span className="flex items-center gap-2">
            <i className="bxf bx-leaf -rotate-12 text-[26px] text-brand" aria-hidden="true" />
            <span className={cn('font-display text-lg font-bold tracking-[-0.03em] sm:text-xl', dark ? 'text-white' : 'text-ink')}>
                Grow<span className="text-brand">Wise</span>
            </span>
        </span>
    );
}

function Header() {
    const { url, business } = useSite();
    const path = url.split('?')[0];

    return (
        <header className="sticky top-0 z-40 border-b border-hairline bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
                <Link href="/" aria-label="GrowWise home">
                    <Wordmark />
                </Link>

                <nav className="ml-auto flex items-center gap-1 sm:ml-8" aria-label="Main">
                    {NAV.map((item) => {
                        const active = item.match(path);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'relative rounded-[6px] px-3 py-1.5 text-sm transition-colors',
                                    active ? 'text-ink' : 'text-muted hover:bg-canvas-soft hover:text-ink',
                                )}
                            >
                                {item.label}
                                {active && <span className="absolute inset-x-3 -bottom-[13px] h-[2px] bg-brand" aria-hidden="true" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-3 sm:ml-auto sm:flex">
                    {business ? (
                        <span className="eyebrow max-w-[200px]" title={business.name}>
                            <span className="truncate">{business.name}</span>
                        </span>
                    ) : (
                        <Button href="/start" size="sm">
                            Get started
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

const FOOTER_LINKS = [
    {
        title: 'Tools',
        links: [
            ['/compare-loans', 'Compare loan options'],
            ['/borrowing-capacity', 'Check borrowing capacity'],
            ['/debt-literacy', 'Assess debt literacy'],
            ['/learn', 'Learn about debt'],
        ],
    },
    {
        title: 'Popular terms',
        links: [
            ['/learn/interest-rate', 'Interest rate'],
            ['/learn/collateral', 'Collateral'],
            ['/learn/amortization', 'Amortization'],
            ['/learn/working-capital', 'Working capital'],
        ],
    },
];

function Footer() {
    return (
        <footer className="mt-24 border-t border-hairline bg-white text-[13px] text-muted">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
                <div>
                    <Link href="/" aria-label="GrowWise home" className="inline-block">
                        <Wordmark />
                    </Link>
                    <p className="mt-3 max-w-xs leading-relaxed">
                        Smarter finance, stronger tomorrow. Simple tools that help small business owners borrow with confidence.
                    </p>
                </div>
                {FOOTER_LINKS.map((col) => (
                    <nav key={col.title} aria-label={col.title}>
                        <h2 className="text-[13px] font-medium tracking-normal text-ink">{col.title}</h2>
                        <ul className="mt-3 space-y-2.5">
                            {col.links.map(([href, label]) => (
                                <li key={href}>
                                    <Link href={href} className="transition-colors hover:text-ink hover:underline">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
                <div>
                    <h2 className="text-[13px] font-medium tracking-normal text-ink">About the numbers</h2>
                    <p className="mt-3 leading-relaxed">
                        Results are estimates based on what you enter and the assumptions shown with each result. Lenders make final
                        decisions using their own requirements.
                    </p>
                </div>
            </div>
            <div className="border-t border-hairline-cool">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-[12px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p>© {new Date().getFullYear()} GrowWise. Estimates are for planning only and are not financial advice.</p>
                    <p>
                        Photos from{' '}
                        <a href="https://unsplash.com" className="underline hover:text-ink" target="_blank" rel="noreferrer">
                            Unsplash
                        </a>{' '}
                        by{' '}
                        {PHOTO_CREDITS.map((c, i) => (
                            <span key={c.handle}>
                                {i > 0 && ', '}
                                <a href={`https://unsplash.com/@${c.handle}`} className="underline hover:text-ink" target="_blank" rel="noreferrer">
                                    @{c.handle}
                                </a>
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default function SiteLayout({ title, cta = true, children }) {
    return (
        <div className="flex min-h-screen flex-col">
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[6px] focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
                Skip to content
            </a>
            <Header />
            <main id="main" className="flex-1">
                {children}
            </main>
            {cta && <CtaBand />}
            <Footer />
            <ScrollTop />
        </div>
    );
}
