'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Square icon tile used on cards and rows. `solid` = the emerald accent. */
export function IconBadge({ icon, className, solid = false }) {
    return (
        <span
            className={cn(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[20px]',
                solid ? 'bg-brand text-ink' : 'border border-hairline bg-canvas-soft text-ink',
                className,
            )}
            aria-hidden="true"
        >
            <i className={cn('bxf', icon)} />
        </span>
    );
}

export function BackLink({ href, children = 'Back' }) {
    return (
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink">
            <i className="bxf bx-arrow-left-stroke text-lg" aria-hidden="true" />
            {children}
        </Link>
    );
}

/** Progress for the multi-screen tools: done (emerald), current (ink), upcoming (hairline). */
export function Steps({ steps, current }) {
    return (
        <ol className="flex items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm" aria-label="Progress">
            {steps.map((label, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={active ? 'step' : undefined}>
                        <span
                            className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium',
                                done && 'bg-brand text-ink',
                                active && 'bg-ink text-white',
                                !done && !active && 'border border-hairline bg-white text-muted',
                            )}
                        >
                            {done ? <i className="bxf bx-check text-sm" aria-hidden="true" /> : i + 1}
                        </span>
                        <span className={cn('hidden sm:inline', active ? 'text-ink' : 'text-muted')}>{label}</span>
                        {i < steps.length - 1 && <span className="h-px w-5 bg-hairline sm:w-10" aria-hidden="true" />}
                    </li>
                );
            })}
        </ol>
    );
}

/** Label + control + hint/error, wired for screen readers. */
export function Field({ id, label, hint, error, children, className }) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <label htmlFor={id} className="block text-sm font-medium text-ink">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${id}-error`} className="text-[13px] text-danger" role="alert">
                    {error}
                </p>
            ) : (
                hint && (
                    <p id={`${id}-hint`} className="text-[13px] text-muted">
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}

/** Peso input: numeric keyboard, ₱ prefix. */
export function MoneyInput({ id, error, className, ...props }) {
    return (
        <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted" aria-hidden="true">
                ₱
            </span>
            <input
                id={id}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                className={cn('gw-input num pl-7', className)}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            />
        </div>
    );
}

/** Radio set rendered as segmented options; native inputs underneath for keyboard and forms. */
export function Choice({ name, legend, options, value, onChange, hint, error }) {
    return (
        <fieldset className="space-y-2">
            <legend className="mb-1.5 text-sm font-medium text-ink">{legend}</legend>
            <div className="flex flex-wrap gap-2">
                {Object.entries(options).map(([key, label]) => (
                    <label
                        key={key}
                        className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-[6px] border px-3 py-2 text-sm transition-colors',
                            'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/60',
                            value === key ? 'border-ink bg-canvas-soft text-ink' : 'border-hairline bg-white text-ink hover:border-hairline-strong',
                        )}
                    >
                        <input type="radio" name={name} value={key} checked={value === key} onChange={() => onChange(key)} className="accent-[#24b47e]" />
                        {label}
                    </label>
                ))}
            </div>
            {error ? <p className="text-[13px] text-danger" role="alert">{error}</p> : hint && <p className="text-[13px] text-muted">{hint}</p>}
        </fieldset>
    );
}
