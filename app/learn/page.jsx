import Index from '@/components/pages/Learn/Index';
import { TERMS } from '@/lib/content';

export const metadata = { title: 'Debt terms made simple' };

export default function Page() {
    return <Index terms={TERMS} />;
}
