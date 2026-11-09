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
