'use server';

import { redirect } from 'next/navigation';
import { saveState } from '@/lib/session';
import { BUSINESS_TYPES, YEARS_OPERATING } from '@/lib/loanMath';
import { QUESTIONS } from '@/lib/content';

/*
 * Server actions replace the Laravel controllers' POST routes. Each one is a
 * public endpoint, so every input is validated here with the same rules and
 * messages the Laravel version used. On success: save inputs, redirect. On
 * failure: return { errors } keyed like Laravel ("loans.0.amount").
 */

const isNum = (v) => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v));
const req = (v) => v !== undefined && v !== null && String(v).trim() !== '';

function money(errors, key, label, v, { required = true, min = 0, max = 1e9 } = {}) {
    if (!req(v)) {
        if (required) errors[key] = `The ${label} field is required.`;
        return;
    }
    if (!isNum(v)) errors[key] = `The ${label} field must be a number.`;
    else if (Number(v) < min) errors[key] = `The ${label} field must be at least ${min}.`;
    else if (Number(v) > max) errors[key] = `The ${label} field must not be greater than ${max}.`;
}

export async function startBusiness(data) {
    const name = String(data?.name ?? '').trim();
    if (!name) return { errors: { name: 'The name field is required.' } };
    if (name.length > 120) return { errors: { name: 'The name field must not be greater than 120 characters.' } };

    await saveState({ business: { name } });
    redirect('/menu');
}

export async function compareLoans(data) {
    const loans = Array.isArray(data?.loans) ? data.loans : [];
    const errors = {};
    if (loans.length < 2 || loans.length > 3) errors.loans = 'Enter 2 or 3 loan options to compare.';

    const clean = loans.slice(0, 3).map((l, i) => {
        const k = (f) => `loans.${i}.${f}`;
        const provider = String(l?.provider ?? '').trim();
        if (!provider) errors[k('provider')] = 'The loan provider field is required.';
        else if (provider.length > 80) errors[k('provider')] = 'The loan provider field must not be greater than 80 characters.';
        money(errors, k('amount'), 'loan amount', l?.amount, { min: 1 });
        money(errors, k('rate'), 'interest rate', l?.rate, { max: 100 });
        if (!req(l?.term)) errors[k('term')] = 'The loan term field is required.';
        else if (!Number.isInteger(Number(l.term)) || l.term < 1 || l.term > 360) errors[k('term')] = 'The loan term field must be a whole number from 1 to 360.';
        money(errors, k('fees'), 'other fees', l?.fees, { required: false });
        if (!['year', 'month'].includes(l?.rate_period)) errors[k('rate_period')] = 'The selected rate period is invalid.';
        if (!['reducing', 'flat', 'unsure'].includes(l?.computation)) errors[k('computation')] = 'The selected interest computation is invalid.';
        if (!['yes', 'no', 'unsure'].includes(l?.collateral)) errors[k('collateral')] = 'The selected collateral option is invalid.';
        return {
            provider,
            amount: l?.amount,
            rate: l?.rate,
            rate_period: l?.rate_period,
            computation: l?.computation,
            term: l?.term,
            collateral: l?.collateral,
            fees: l?.fees ?? '',
        };
    });

    if (Object.keys(errors).length) return { errors };
    await saveState({ loans: clean });
    redirect('/compare-loans/result');
}

export async function calculateCapacity(data) {
    const errors = {};
    if (!(data?.business_type in BUSINESS_TYPES)) errors.business_type = 'The business type field is required.';
    if (!(data?.years_operating in YEARS_OPERATING)) errors.years_operating = 'The years in operation field is required.';
    money(errors, 'income', 'income', data?.income);
    money(errors, 'expenses', 'expenses', data?.expenses);
    money(errors, 'existing', 'existing loan payments', data?.existing, { required: false });
    if (Object.keys(errors).length) return { errors };

    const input = {
        business_type: data.business_type,
        years_operating: data.years_operating,
        income: data.income,
        expenses: data.expenses,
        existing: data.existing ?? '',
    };
    await saveState({ capacity: input });
    redirect('/borrowing-capacity/result');
}

export async function submitQuiz(answers) {
    const ok = answers && typeof answers === 'object' && QUESTIONS.every((q) => ['A', 'B', 'C', 'D'].includes(answers[q.id]));
    if (!ok) return { errors: { answers: 'Please answer every question before submitting.' } };

    await saveState({ quiz: Object.fromEntries(QUESTIONS.map((q) => [q.id, answers[q.id]])) });
    redirect('/debt-literacy/result');
}
