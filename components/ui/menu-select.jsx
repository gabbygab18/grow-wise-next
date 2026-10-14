'use client';

import { useState } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

/**
 * Select built on the ScrollX dropdown-menu (the one ported from the Isla
 * build via lct-trading): spring-in panel, staggered items, sliding hover.
 *
 * Unlike the lct version, the trigger IS the button (Radix asChild), so there
 * is one tab stop and the field's <label htmlFor> points straight at it.
 *
 * options: { value: label } or [{ value, label }]
 */
export default function MenuSelect({ id, value, onChange, options, placeholder = 'Select an option', invalid, describedBy, className, label }) {
    const [open, setOpen] = useState(false);
    const list = Array.isArray(options) ? options : Object.entries(options).map(([v, l]) => ({ value: v, label: l }));
    const current = list.find((o) => o.value === value);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
            <DropdownMenuPrimitive.Trigger asChild>
                <button
                    id={id}
                    type="button"
                    aria-label={label}
                    aria-invalid={invalid ? 'true' : undefined}
                    aria-describedby={describedBy}
                    className={cn(
                        'flex h-[42px] w-full min-w-0 items-center justify-between gap-2 rounded-[6px] border bg-white pl-3 pr-2.5 text-left text-[15px] transition-[border-color,box-shadow]',
                        'focus-visible:outline-none',
                        open ? 'border-ink shadow-[0_0_0_3px_rgb(62_207_142/0.35)]' : invalid ? 'border-danger' : 'border-hairline hover:border-hairline-strong focus-visible:border-ink focus-visible:shadow-[0_0_0_3px_rgb(62_207_142/0.35)]',
                        className,
                    )}
                >
                    <span className={cn('truncate', current ? 'text-ink' : 'text-muted')}>{current?.label ?? placeholder}</span>
                    <i className={cn('bxf bx-chevron-down shrink-0 text-[20px] text-muted transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
                </button>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuContent align="start" sideOffset={6} maxHeight="22rem" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]">
                {list.map((o) => (
                    <DropdownMenuItem
                        key={o.value}
                        onSelect={() => {
                            setOpen(false);
                            if (o.value !== value) onChange(o.value);
                        }}
                        aria-checked={o.value === value}
                        className="rounded-[6px] px-3 py-2.5 text-[14px] focus:bg-canvas-soft"
                    >
                        <span className={cn('flex-1', o.value === value ? 'font-medium text-ink' : 'text-ink-2')}>{o.label}</span>
                        {o.value === value && <i className="bxf bx-check text-[18px] text-brand-ink" aria-hidden="true" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
