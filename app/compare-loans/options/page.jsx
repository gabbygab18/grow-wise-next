import Options from '@/components/pages/Loans/Options';
import { getState } from '@/lib/session';

export const metadata = { title: 'Enter your loan options' };

export default async function Page() {
    const { loans } = await getState();
    // Coming back from the result keeps what was typed.
    return <Options saved={Array.isArray(loans) ? loans : null} />;
}
