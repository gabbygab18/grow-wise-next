'use client';

import { cn } from '@/lib/utils';

/**
 * Continuously moving strip, after ScrollX's kinetic-testimonials (ported from
 * lct-trading). Decorative: the same items are reachable as real links
 * elsewhere, so the track is hidden from assistive tech. Pauses on hover and
 * stops under reduced motion.
 */
export default function Marquee({ items = [], className }) {
    const doubled = [...items, ...items];

    return (
        <div aria-hidden="true" className={cn('gw-marquee overflow-hidden py-5', className)}>
            <div className="gw-marquee-track flex w-max items-center gap-10 whitespace-nowrap pr-10">
                {doubled.map((item, i) => (
                    <span key={i} className="flex items-center gap-3 text-[15px] text-ink">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
