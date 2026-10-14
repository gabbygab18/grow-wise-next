import { redirect } from 'next/navigation';
import Result from '@/components/pages/Loans/Result';
import { getState } from '@/lib/session';
import { compare } from '@/lib/loanMath';

export const metadata = { title: 'Loan options comparison' };

export default async function Page() {
    const { loans } = await getState();
    if (!Array.isArray(loans) || loans.length < 2) redirect('/compare-loans/options');

    return <Result result={compare(loans)} />;
}
