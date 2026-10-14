// Same cases as the Laravel LoanMathTest. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capacity, compare, monthlyRate, repayment } from './loanMath.js';

const loan = (o = {}) => ({ provider: 'Bank A', amount: 100000, rate: 12, rate_period: 'year', computation: 'reducing', term: 12, collateral: 'no', fees: 0, ...o });

test('reducing balance matches the amortization formula', () => {
    const r = repayment(100000, 0.01, 12, 'reducing');
    assert.equal(r.monthly, 8884.88);
    assert.equal(r.interest, 6618.55);
});

test('flat rate and "unsure" charge interest on the full principal', () => {
    const flat = repayment(100000, 0.01, 12, 'flat');
    assert.equal(flat.interest, 12000);
    assert.equal(flat.monthly, 9333.33);
    assert.deepEqual(repayment(100000, 0.01, 12, 'unsure'), flat);
});

test('zero rate splits principal evenly', () => {
    assert.deepEqual(repayment(120000, 0, 12, 'reducing'), { monthly: 10000, interest: 0, method: 'reducing' });
});

test('monthly rate by period', () => {
    assert.equal(monthlyRate(12, 'year'), 0.01);
    assert.equal(monthlyRate(2, 'month'), 0.02);
});

test('compare picks lowest cost including fees', () => {
    const r = compare([loan({ rate: 10, fees: 5000 }), loan({ provider: 'Coop B', rate: 12 })]);
    assert.equal(r.best, 1);
    assert.equal(r.runner_up, 0);
});

test('compare ranks by cost per peso when amounts differ', () => {
    assert.equal(compare([loan({ amount: 200000, rate: 10 }), loan({ amount: 50000, rate: 12 })]).best, 0);
});

test('capacity from cash flow', () => {
    const c = capacity(50000, 32000, 5000, '4-6');
    assert.equal(c.available, 13000);
    assert.equal(c.payment, 9100);
    assert.equal(c.loan, 273000);
    assert.equal(c.debt_ratio, 28.2);
});

test('capacity is zero when cash flow is negative', () => {
    const c = capacity(20000, 25000, 0, 'lt1');
    assert.equal(c.payment, 0);
    assert.equal(c.loan, 0);
});
