import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { SiteProvider } from '@/lib/site';
import { getState } from '@/lib/session';
import './globals.css';

const satoshi = localFont({
    src: [
        { path: './fonts/satoshi-400.woff2', weight: '400', style: 'normal' },
        { path: './fonts/satoshi-500.woff2', weight: '500', style: 'normal' },
        { path: './fonts/satoshi-700.woff2', weight: '700', style: 'normal' },
        { path: './fonts/satoshi-900.woff2', weight: '900', style: 'normal' },
    ],
    variable: '--font-satoshi',
    display: 'swap',
});

const poppins = Poppins({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-poppins', display: 'swap' });

export const metadata = {
    title: { template: '%s · GrowWise', default: 'GrowWise · Smarter Financial Decisions' },
    description:
        'GrowWise helps small business owners compare loan offers, check borrowing capacity, test their debt literacy, and learn key debt terms.',
    icons: {
        icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%233ecf8e' d='M20 3c-7 0-13 3.5-14.6 10.4C4.7 12.2 4 11 3 10c0 4 1.6 6.6 4 8-.4 1-.7 2-1 3h2c.3-.9.6-1.8 1-2.6C17 19 21 12 20 3z'/%3E%3C/svg%3E",
    },
};

export const viewport = { themeColor: '#3ecf8e' };

export default async function RootLayout({ children }) {
    const { business } = await getState();

    return (
        <html lang="en" data-scroll-behavior="smooth" className={`${satoshi.variable} ${poppins.variable}`}>
            <body>
                <SiteProvider business={business ?? null}>{children}</SiteProvider>
            </body>
        </html>
    );
}
