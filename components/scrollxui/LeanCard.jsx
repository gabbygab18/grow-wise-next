'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * ScrollXUI-style `lean-card` — a minimal card that "leans" in 3D on hover.
 * Ported from the Isla build, where it carried the pricing plans. Used here
 * for the care-plan rate cards, in `bare` mode so style.css keeps the greens.
 */
export default function LeanCard({ as = 'div', children, className, featured = false, bare = false, index = 0, ...props }) {
    const Comp = motion[as] ?? motion.div;

    return (
        <Comp
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ rotateX: 2.5, rotateY: -2.5, y: -6 }}
            style={{ transformPerspective: 900 }}
            className={cn(
                'transition-shadow duration-300',
                // `bare` keeps the component's motion but hands surface styling
                // back to style.css — used for .rate-card, which already owns
                // its green gradient, radius and padding.
                !bare && 'relative flex h-full flex-col rounded-xl border p-8',
                !bare &&
                    (featured
                        ? 'border-night bg-night text-white shadow-[var(--shadow-deep)]'
                        : 'border-hairline bg-white hover:shadow-[var(--shadow-lift)]'),
                className,
            )}
            {...props}
        >
            {children}
        </Comp>
    );
}
