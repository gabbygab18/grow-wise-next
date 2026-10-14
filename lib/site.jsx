'use client';

import { createContext, useContext, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'motion/react';

const SiteContext = createContext({ business: null });

/** Root providers: the visitor's business (from the cookie) and motion preferences. */
export function SiteProvider({ business, children }) {
    return (
        <SiteContext.Provider value={{ business }}>
            {/* reducedMotion="user": motion components honour the OS setting. */}
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </SiteContext.Provider>
    );
}

/** Stand-in for Inertia's usePage(): current path + the visitor's business. */
export function useSite() {
    const { business } = useContext(SiteContext);
    return { url: usePathname() ?? '/', business };
}

/**
 * Stand-in for Inertia's useForm(): same data / setData / errors / processing
 * shape, but submit() calls a server action. The action either redirects or
 * returns { errors } keyed like Laravel ("loans.0.amount").
 */
export function useActionForm(initial) {
    const [data, setDataState] = useState(initial);
    const [errors, setErrors] = useState({});
    const [processing, startTransition] = useTransition();

    const setData = (key, value) => setDataState((d) => (typeof key === 'string' ? { ...d, [key]: value } : key));

    const submit = (action, { scrollTop = false } = {}) =>
        startTransition(async () => {
            const res = await action(data);
            const next = res?.errors ?? {};
            setErrors(next);
            if (scrollTop && Object.keys(next).length) window.scrollTo({ top: 0, behavior: 'smooth' });
        });

    return { data, setData, errors, processing, submit };
}
