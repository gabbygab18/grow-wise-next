import { redirect } from 'next/navigation';
import Result from '@/components/pages/Capacity/Result';
import { getState } from '@/lib/session';
import { BUSINESS_TYPES, YEARS_OPERATING, capacity as estimate } from '@/lib/loanMath';

export const metadata = { title: 'Your borrowing capacity' };

export default async function Page() {
    const { capacity } = await getState();
    if (!capacity) redirect('/borrowing-capacity');

    const result = estimate(Number(capacity.income), Number(capacity.expenses), Number(capacity.existing || 0), capacity.years_operating);

    return (
        <Result
            result={result}
            profile={{ type: BUSINESS_TYPES[capacity.business_type], years: YEARS_OPERATING[capacity.years_operating] }}
        />
    );
}
