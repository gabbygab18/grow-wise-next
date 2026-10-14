import 'server-only';
import { cookies } from 'next/headers';

/*
 * The visitor's GrowWise state lives in one httpOnly cookie (no database):
 *   { business: { name, business_type, years_operating },
 *     loans: [...inputs], capacity: {...inputs}, quiz: { A|B|C|D by question id } }
 * Only inputs are stored; result pages recompute from them on the server.
 */
const NAME = 'growwise';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getState() {
    const raw = (await cookies()).get(NAME)?.value;
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

/** Merge a patch into the state. Server actions only (cookies can't be set during render). */
export async function saveState(patch) {
    const next = { ...(await getState()), ...patch };
    (await cookies()).set(NAME, JSON.stringify(next), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: MAX_AGE,
    });
}
