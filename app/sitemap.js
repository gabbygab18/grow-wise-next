import { TERMS } from '@/lib/content';

const BASE = 'https://growwise-next.netlify.app';

// Result/quiz pages depend on visitor input, so only entry pages are listed.
const PAGES = ['', '/start', '/menu', '/borrowing-capacity', '/compare-loans', '/debt-literacy', '/learn'];

export default function sitemap() {
    return [...PAGES, ...TERMS.map((t) => `/learn/${t.slug}`)].map((p) => ({ url: BASE + p }));
}
