import Form from '@/components/pages/Capacity/Form';
import { getState } from '@/lib/session';
import { BUSINESS_TYPES, YEARS_OPERATING } from '@/lib/loanMath';

export const metadata = { title: 'Check my borrowing capacity' };

export default async function Page() {
    const { capacity } = await getState();
    return <Form businessTypes={BUSINESS_TYPES} yearsOptions={YEARS_OPERATING} saved={capacity ?? null} />;
}
