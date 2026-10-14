'use client';

import { useEffect, useState } from 'react';

const R = 22;
const C = 2 * Math.PI * R;

/**
 * Back-to-top, ported from lct-trading. An emerald ring fills as you read down
 * the page, so it doubles as a "how far am I" meter.
 */
export default function ScrollTop() {
    const [progress, setProgress] = useState(0);
    const show = progress > 0.08;

    useEffect(() => {
        let frame = 0;
        const measure = () => {
            frame = 0;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };
        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const toTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <button
            type="button"
            onClick={toTop}
            aria-label={`Back to top (${Math.round(progress * 100)}% down the page)`}
            tabIndex={show ? 0 : -1}
            className={`group fixed bottom-5 right-4 z-40 grid size-12 place-items-center rounded-full bg-night text-white shadow-[var(--shadow-lift)] transition-[opacity,translate,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink sm:right-6 ${
                show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
        >
            <svg viewBox="0 0 48 48" className="pointer-events-none absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="24" cy="24" r={R} fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="2.5" />
                <circle cx="24" cy="24" r={R} fill="none" stroke="#3ecf8e" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
            </svg>
            <i className="bxf bx-arrow-up-stroke relative text-xl transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
        </button>
    );
}
