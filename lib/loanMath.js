/*
 * The money math behind the tools, ported from App\Support\LoanMath (Laravel).
 * Pure functions, no I/O; covered by lib/loanMath.test.mjs (`npm test`).
 */

/** Assumptions behind "Check my borrowing capacity". Tune here; the result page lists them. */
export const CAPACITY = {
    repaymentShare: 0.7, // share of free monthly cash flow suggested for a new loan
    assumedAnnualRate: 12, // % per year, reducing balance
    termByYears: { lt1: 12, '1-3': 24, '4-6': 36, gt6: 48 }, // months
};

export const BUSINESS_TYPES = { retail: 'Retail', services: 'Services', food_beverage: 'Food and beverage' };
export const YEARS_OPERATING = { lt1: 'Less than 1 year', '1-3': '1–3 years', '4-6': '4–6 years', gt6: 'More than 6 years' };

const round2 = (n) => Math.round(n * 100) / 100;

/** Interest rate as a monthly fraction: 12 % per year -> 0.01. */
export function monthlyRate(rate, period) {
    return period === 'month' ? rate / 100 : rate / 100 / 12;
}

/**
 * Monthly payment and total interest for one loan.
 * "unsure" is priced as flat rate: at the same quoted rate a flat-rate loan
 * always costs more, so the estimate errs on the safe side.
 */
export function repayment(principal, mRate, months, method) {
    const m = method === 'reducing' ? 'reducing' : 'flat';
    let monthly;
    let interest;

    if (m === 'flat') {
        interest = principal * mRate * months;
        monthly = (principal + interest) / months;
    } else if (mRate === 0) {
        interest = 0;
        monthly = principal / months;
    } else {
        monthly = (principal * mRate) / (1 - (1 + mRate) ** -months);
        interest = monthly * months - principal;
    }

    return { monthly: round2(monthly), interest: round2(interest), method: m };
}

/**
 * Price each offer and pick the cheapest. Ranked by total cost (interest +
 * fees) per peso borrowed, so a bigger loan isn't "worse" just for being bigger.
 */
export function compare(loans) {
    const rows = loans.map((loan) => {
        const amount = Number(loan.amount);
        const fees = Number(loan.fees || 0);
        const r = repayment(amount, monthlyRate(Number(loan.rate), loan.rate_period), Number(loan.term), loan.computation);
        const cost = r.interest + fees;

        return {
            provider: loan.provider,
            amount,
            rate: Number(loan.rate),
            rate_period: loan.rate_period,
            computation: loan.computation,
            computed_as: r.method,
            term: Number(loan.term),
            collateral: loan.collateral,
            fees,
            monthly: r.monthly,
            interest: r.interest,
            total_cost: round2(cost),
            total_repayment: round2(amount + cost),
            cost_per_100: round2((cost / amount) * 100),
        };
    });

    const order = rows.map((_, i) => i).sort((a, b) => rows[a].cost_per_100 - rows[b].cost_per_100 || rows[a].monthly - rows[b].monthly);

    return { rows, best: order[0], runner_up: order[1] ?? null };
}

/** Rough borrowing capacity from monthly cash flow. */
export function capacity(income, expenses, existing, years, assume = CAPACITY) {
    const available = income - expenses - existing;
    const months = assume.termByYears[years] ?? 12;
    const i = assume.assumedAnnualRate / 100 / 12;

    const payment = Math.max(0, Math.floor(available * assume.repaymentShare));
    let loan = i > 0 ? (payment * (1 - (1 + i) ** -months)) / i : payment * months;
    loan = Math.floor(loan / 1000) * 1000;

    return {
        income,
        expenses,
        existing,
        available: round2(available),
        payment,
        loan,
        months,
        rate: assume.assumedAnnualRate,
        share: assume.repaymentShare,
        debt_ratio: income > 0 ? Math.round(((existing + payment) / income) * 1000) / 10 : null,
    };
}
