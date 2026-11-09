import Home from '@/components/pages/Home';

// Tells Google the site name, so results show "GrowWise" instead of "Netlify".
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GrowWise',
    url: 'https://growwise-next.netlify.app/',
};

export default function Page() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Home />
        </>
    );
}
