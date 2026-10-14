'use client';

import { cn } from '@/lib/utils';

/*
 * Photos are self-hosted copies from Unsplash (Unsplash License: free to use,
 * no permission needed). Credits are shown in the footer anyway. Each ships at
 * 800w and 1600w WebP in public/images/photos.
 */
export const PHOTOS = {
    seller: {
        alt: 'A small business owner checks an order on her phone beside packed boxes and a laptop',
        ratio: [1600, 1067],
        credit: { handle: 'kurniawann', url: 'https://unsplash.com/photos/k63Or81F8-M' },
    },
    retail: {
        alt: 'Neighbours gathered outside a small sari-sari store decorated with flowers',
        ratio: [1600, 1185],
        credit: { handle: 'hdbernd', url: 'https://unsplash.com/photos/ubIdn_STaC8' },
    },
    services: {
        alt: 'A clothing designer takes a client call at her laptop in her studio',
        ratio: [1600, 900],
        credit: { handle: 'silverkblack', url: 'https://unsplash.com/photos/kk4J92iaSBk' },
    },
    food: {
        alt: 'Two café owners smile while holding a “Yes, we’re open” sign',
        ratio: [1600, 900],
        credit: { handle: 'silverkblack', url: 'https://unsplash.com/photos/61StbpYJ4gY' },
    },
    cafe: {
        alt: 'A young owner smiles in her plant-filled café',
        ratio: [1600, 899],
        credit: { handle: 'yobbyrony', url: 'https://unsplash.com/photos/FXX2BeiSHyw' },
    },
    store: {
        alt: 'Shelves of snacks and household goods inside a small neighbourhood store',
        ratio: [1600, 1123],
        credit: { handle: 'hdbernd', url: 'https://unsplash.com/photos/Q6lJLndyw-4' },
    },
};

export const PHOTO_CREDITS = Object.values(PHOTOS)
    .map((p) => p.credit)
    .filter((c, i, all) => all.findIndex((o) => o.handle === c.handle) === i);

/** Responsive photo. `priority` for the one above the fold, lazy otherwise. */
export function Photo({ name, className, sizes = '(min-width: 768px) 50vw, 100vw', priority = false, decorative = false, style }) {
    const p = PHOTOS[name];
    return (
        <img
            src={`/images/photos/${name}-800.webp`}
            srcSet={`/images/photos/${name}-800.webp 800w, /images/photos/${name}-1600.webp 1600w`}
            sizes={sizes}
            width={p.ratio[0]}
            height={p.ratio[1]}
            alt={decorative ? '' : p.alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            className={cn('block h-full w-full object-cover', className)}
            style={style}
        />
    );
}
