/*
 * Content from the client's WEBSITE DRAFT (was the Laravel DatabaseSeeder).
 * Edit here to change the quiz or the glossary; no database involved.
 *
 * Server-only data: the quiz answers live here and are stripped before any
 * question reaches the browser (see app/debt-literacy/quiz/page.jsx).
 */
import 'server-only';

const LETTERS = ['A', 'B', 'C', 'D'];

const RAW_CATEGORIES = [
    {
        name: 'Understanding Debt Basics',
        description: 'Your understanding of debt, borrowing, and loan terms.',
        questions: [
            ['Which of the following best describes debt?', ['Money borrowed that must be repaid, usually with interest.', 'Money received as a gift with no need to repay.', 'Profit earned from a business investment.', 'Money deposited into a savings account.'], 'A'],
            ['What is the principal amount of a loan?', ['The total interest paid throughout the loan period.', 'The original amount of money borrowed.', 'The penalty for late loan payments.', 'The total amount of money saved before borrowing.'], 'B'],
            ['What does the loan term refer to?', ['The amount of interest charged on a loan.', 'The total income earned by the borrower.', 'The period within which the loan must be repaid.', 'The additional amount charged for late payments.'], 'C'],
            ['What is collateral in a secured loan?', ['The interest charged on the borrowed money.', 'An asset pledged as security that the lender may claim if the borrower defaults, subject to the loan agreement and applicable law.', 'The monthly income earned by the borrower.', 'The total amount of money paid as interest.'], 'B'],
            ['What does loan default generally mean?', ['Paying a loan earlier than scheduled.', 'Borrowing money from a different lender.', "Failing to meet the loan's repayment obligations under its terms.", 'Successfully completing all loan payments.'], 'C'],
        ],
    },
    {
        name: 'Interest and Rates',
        description: 'Your understanding of interest rates and how they affect borrowing costs.',
        questions: [
            ['What does an interest rate represent?', ['The total amount saved in a bank.', 'The extra cost of borrowing money, expressed as a percentage.', 'The amount of money earned from employment.', 'The fee charged for opening a savings account.'], 'B'],
            ['If you borrow ₱10,000 at a simple annual interest rate of 10% for one year, how much interest will you pay?', ['₱500', '₱1,000', '₱1,500', '₱10,000'], 'B', '₱10,000 × 10% = ₱1,000 in interest.'],
            ['Two lenders offer the same loan amount but charge different interest rates. Assuming the other loan terms are the same, which loan will generally cost less?', ['The loan with the higher interest rate.', 'The loan with the lower interest rate.', 'Both loans will always have the same total cost.', 'The loan with the longer application process.'], 'B'],
            ['A lender offers you a ₱20,000 loan with a simple annual interest rate of 5% for one year. How much will you owe in principal and interest at the end of the year, excluding other fees?', ['₱20,500', '₱21,000', '₱22,000', '₱25,000'], 'B', '₱20,000 × 5% = ₱1,000 interest. Total repayment = ₱20,000 + ₱1,000 = ₱21,000.'],
            ['Why is it important to check the effective interest rate and other loan charges before borrowing?', ['To ensure that the loan will automatically be approved.', 'To guarantee that the lender will extend the repayment period.', 'To determine whether the loan has the lowest principal amount.', 'To understand the overall cost of borrowing and compare loan offers more accurately.'], 'D'],
        ],
    },
    {
        name: 'Financial Planning',
        description: 'Your ability to judge borrowing decisions against income, expenses, and repayment capacity.',
        questions: [
            ['Before taking out a loan, what should you do first?', ['Borrow the maximum amount offered by the lender.', 'Choose the lender that approves your application fastest.', 'Assess your income, expenses, and ability to make repayments.', 'Borrow money without checking the loan conditions.'], 'C'],
            ['Your monthly income is ₱20,000, and your essential expenses total ₱14,000. You also pay ₱2,000 toward an existing loan each month. How much remains before other expenses and savings?', ['₱2,000', '₱4,000', '₱6,000', '₱8,000'], 'B', '₱20,000 − ₱14,000 − ₱2,000 = ₱4,000.'],
            ['You are planning to borrow money for a business. Which approach is most financially responsible?', ['Borrow based only on the amount the lender offers.', 'Ignore possible changes in business income.', 'Use the entire loan for personal purchases.', 'Prepare a budget and estimate whether the business can repay the loan.'], 'D'],
            ['You operate a small business and want to borrow money to purchase additional inventory. What should you consider before deciding how much to borrow?', ['The maximum loan amount offered by the lender.', 'The inventory needs, expected sales, operating expenses, and ability to repay the loan.', 'The amount borrowed by other business owners.', 'The amount of money you can spend immediately after receiving the loan.'], 'B'],
            // The draft left this answer blank; C is the only sound choice.
            ['Why should you include loan repayments in your monthly budget?', ['To eliminate all business expenses.', 'To increase the interest charged on your loan.', 'To ensure that repayment obligations are accounted for alongside other financial needs.', 'To guarantee that your income will increase every month.'], 'C'],
        ],
    },
    {
        name: 'Risk and Responsible Borrowing',
        description: 'Your ability to spot borrowing risks and manage debt responsibly.',
        questions: [
            ['What is one possible consequence of repeatedly missing loan payments?', ['Your outstanding debt will automatically disappear.', 'Your lender will always reduce your interest rate.', 'You may incur penalties and damage your credit history.', 'You will automatically qualify for a larger loan.'], 'C'],
            ['A lender offers you a loan but refuses to explain its interest rate, fees, and repayment terms. What should you do?', ['Accept the loan immediately.', 'Borrow the money because approval is guaranteed.', 'Sign the agreement and ask questions later.', 'Request complete loan details and avoid committing until you understand the terms.'], 'D'],
            ['You realize that you may not be able to make your next loan payment on time. What is the most responsible action?', ['Ignore the payment due date.', 'Borrow from another lender without reviewing your finances.', 'Contact your lender as early as possible to discuss possible repayment arrangements.', 'Stop paying all your debts without informing your lenders.'], 'C'],
            ['You receive an online loan offer promising immediate approval but requiring an upfront payment before the loan is released. What should you do?', ['Pay immediately to avoid losing the offer.', 'Borrow money from another person to pay the fee.', 'Provide your personal information without checking the lender.', "Verify the lender's legitimacy and check for warning signs before proceeding."], 'D'],
            ['What is the most responsible way to manage multiple loans?', ['Prioritize repayment obligations, monitor due dates, and develop a realistic repayment plan.', 'Pay whichever loan is easiest to remember and ignore the others.', 'Take out additional loans whenever payments become difficult.', 'Stop tracking outstanding balances once payments begin.'], 'A'],
        ],
    },
];

/** Questions with stable ids ("1".."20"), in quiz order. Includes answers: server only. */
export const QUESTIONS = RAW_CATEGORIES.flatMap((cat, c) =>
    cat.questions.map(([question, options, answer, explanation], q) => ({
        id: String(c * 5 + q + 1),
        category: cat.name,
        categorySort: c,
        question,
        options: Object.fromEntries(options.map((o, i) => [LETTERS[i], o])),
        answer,
        explanation: explanation ?? null,
    })),
);

export const CATEGORY_NAMES = RAW_CATEGORIES.map((c) => c.name);

const RAW_TERMS = {
    Amortization: 'Paying off a loan through regular payments of principal and interest.',
    Bonds: 'A type of loan where you borrow money from investors and promise to repay it with interest.',
    Collateral: 'An asset used as security for a loan.',
    Debt: 'Money you owe to another party, usually with an obligation to repay it.',
    Equity: "The owner's share of a business after subtracting its liabilities from its assets.",
    'Fixed Interest Rate': 'An interest rate that stays the same throughout an agreed period.',
    'Grace Period': 'A period when a borrower is temporarily allowed to delay payment.',
    Hardship: 'A financial difficulty that makes loan repayment challenging.',
    'Interest Rate': 'The percentage charged for borrowing money.',
    'Joint Liability': 'A situation where two or more borrowers share responsibility for a debt.',
    'Knowledge of Debt': 'Understanding how borrowing, interest, and repayment work.',
    Loan: 'Money borrowed that must be repaid under agreed conditions.',
    'Maturity Date': 'The date when a loan must be fully repaid.',
    'Non-Performing Loan': 'A loan whose payments are significantly overdue.',
    'Outstanding Balance': 'The amount of debt that remains unpaid.',
    Principal: 'The original amount of money borrowed, excluding interest.',
    'Qualified Borrower': "A person or business that meets the lender's requirements for a loan.",
    Refinancing: 'Replacing an existing loan with a new loan, often with different terms.',
    'Secured Loan': 'A loan backed by collateral.',
    'Term Loan': 'A loan repaid over a specified period.',
    'Unsecured Loan': 'A loan that does not require collateral.',
    'Variable Interest Rate': 'An interest rate that can change over time.',
    'Working Capital': "Money available to cover a business's daily operating expenses.",
    'X-Day Delinquency': 'A term used to describe a loan payment that is overdue by a specified number of days.',
    Yield: 'The return earned from an investment, usually expressed as a percentage.',
    'Zero-Based Budgeting': 'A budgeting method where every amount of income is assigned a specific purpose, helping manage expenses and debt repayments.',
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Glossary, sorted by term. */
export const TERMS = Object.entries(RAW_TERMS)
    .map(([term, definition]) => ({ term, slug: slugify(term), letter: term[0].toUpperCase(), definition }))
    .sort((a, b) => a.term.localeCompare(b.term));
