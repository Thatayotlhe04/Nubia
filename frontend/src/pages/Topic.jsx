import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopic } from '../utils/api';
import TopicContent from '../components/content/TopicContent';
import { FormulaBlock } from '../components/content/FormulaBlock';
import ExampleBlock from '../components/content/ExampleBlock';
import Calculator from '../components/calculator/Calculator';
import FeedbackForm from '../components/feedback/FeedbackForm';

// Fallback topic content when backend is unavailable
const fallbackTopics = {
  'time-value-of-money': {
    id: 'time-value-of-money',
    title: 'Time Value of Money',
    description: 'Understanding present value, future value, and the fundamental principle that money today is worth more than the same amount in the future.',
    content: `The Time Value of Money (TVM) is one of the most fundamental concepts in finance. It states that a sum of money is worth more now than the same sum will be at a future date due to its earnings potential in the interim.

## Why Money Has Time Value

There are several reasons why money has time value:

1. **Opportunity Cost**: Money received today can be invested to earn returns
2. **Inflation**: The purchasing power of money typically decreases over time
3. **Risk**: Future payments carry uncertainty
4. **Preference for Current Consumption**: People generally prefer to consume now rather than later

## Key Concepts

### Present Value (PV)
The current worth of a future sum of money given a specified rate of return. Present value calculations discount future cash flows to today's dollars.

### Future Value (FV)
The value of a current asset at a future date based on an assumed growth rate. Future value shows how much an investment made today will grow over time.

### Discount Rate
The interest rate used to discount future cash flows back to their present value. This rate reflects the opportunity cost of capital.

## Applications in Finance

Time value of money concepts are used extensively in:
- Investment analysis and capital budgeting
- Loan amortization calculations
- Retirement planning
- Bond and stock valuation
- Real estate investment analysis`,
    formulas: [
      {
        id: 'fv-formula',
        name: 'Future Value (Simple)',
        latex: 'FV = PV \\times (1 + r)^n',
        description: 'Calculates the future value of a present sum',
        variables: [
          { symbol: 'FV', description: 'Future Value' },
          { symbol: 'PV', description: 'Present Value' },
          { symbol: 'r', description: 'Interest rate per period' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      },
      {
        id: 'pv-formula',
        name: 'Present Value (Simple)',
        latex: 'PV = \\frac{FV}{(1 + r)^n}',
        description: 'Calculates the present value of a future sum',
        variables: [
          { symbol: 'PV', description: 'Present Value' },
          { symbol: 'FV', description: 'Future Value' },
          { symbol: 'r', description: 'Discount rate per period' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      }
    ],
    examples: [
      {
        id: 'tvm-example-1',
        title: 'Future Value Calculation',
        problem: 'You invest P10,000 today at an annual interest rate of 8%. What will your investment be worth in 5 years?',
        solution: `**Given:**
- PV = P10,000
- r = 8% = 0.08
- n = 5 years

**Solution:**
Using the Future Value formula:
FV = PV × (1 + r)^n
FV = 10,000 × (1 + 0.08)^5
FV = 10,000 × (1.08)^5
FV = 10,000 × 1.4693
FV = **P14,693.28**

Your investment will grow to P14,693.28 in 5 years.`
      },
      {
        id: 'tvm-example-2',
        title: 'Present Value Calculation',
        problem: 'You need P50,000 in 3 years for a down payment. If you can earn 6% annually, how much should you invest today?',
        solution: `**Given:**
- FV = P50,000
- r = 6% = 0.06
- n = 3 years

**Solution:**
Using the Present Value formula:
PV = FV / (1 + r)^n
PV = 50,000 / (1 + 0.06)^3
PV = 50,000 / (1.06)^3
PV = 50,000 / 1.191
PV = **P41,981.08**

You need to invest P41,981.08 today to have P50,000 in 3 years.`
      }
    ],
    calculator: {
      type: 'tvm',
      title: 'Time Value of Money Calculator',
      inputs: [
        { name: 'pv', label: 'Present Value (PV)', type: 'number', default: 10000 },
        { name: 'rate', label: 'Interest Rate (%)', type: 'number', default: 8 },
        { name: 'periods', label: 'Number of Periods', type: 'number', default: 5 }
      ],
      calculate: 'fv = pv * Math.pow(1 + rate/100, periods)'
    }
  },
  'compound-interest': {
    id: 'compound-interest',
    title: 'Compound Interest',
    description: 'Learn how interest accumulates on both principal and previously earned interest over time.',
    content: `Compound interest is the interest calculated on the initial principal and also on the accumulated interest from previous periods. It's often called "interest on interest" and makes wealth grow at a faster rate than simple interest.

## Simple vs Compound Interest

**Simple Interest**: Interest is calculated only on the original principal amount.

**Compound Interest**: Interest is calculated on the principal plus any interest already earned. This creates exponential growth over time.

## Compounding Frequency

Interest can be compounded at different frequencies:
- **Annually**: Once per year (n = 1)
- **Semi-annually**: Twice per year (n = 2)
- **Quarterly**: Four times per year (n = 4)
- **Monthly**: Twelve times per year (n = 12)
- **Daily**: 365 times per year (n = 365)
- **Continuously**: Infinite compounding

The more frequently interest is compounded, the greater the final amount will be.

## The Power of Compounding

Albert Einstein allegedly called compound interest the "eighth wonder of the world." The key to maximizing compound interest is:
1. Start early
2. Be patient (time is your greatest asset)
3. Reinvest earnings
4. Seek higher rates when possible

## Effective Annual Rate (EAR)

When comparing investments with different compounding frequencies, use the Effective Annual Rate to make fair comparisons.`,
    formulas: [
      {
        id: 'compound-formula',
        name: 'Compound Interest Formula',
        latex: 'A = P \\left(1 + \\frac{r}{n}\\right)^{nt}',
        description: 'Calculates the future value with compound interest',
        variables: [
          { symbol: 'A', description: 'Final amount' },
          { symbol: 'P', description: 'Principal (initial investment)' },
          { symbol: 'r', description: 'Annual interest rate (decimal)' },
          { symbol: 'n', description: 'Number of times interest compounds per year' },
          { symbol: 't', description: 'Time in years' }
        ]
      },
      {
        id: 'ear-formula',
        name: 'Effective Annual Rate',
        latex: 'EAR = \\left(1 + \\frac{r}{n}\\right)^n - 1',
        description: 'The actual annual rate when accounting for compounding',
        variables: [
          { symbol: 'EAR', description: 'Effective Annual Rate' },
          { symbol: 'r', description: 'Nominal annual interest rate' },
          { symbol: 'n', description: 'Number of compounding periods per year' }
        ]
      }
    ],
    examples: [
      {
        id: 'ci-example-1',
        title: 'Monthly Compounding',
        problem: 'You deposit P5,000 in a savings account that pays 6% annual interest, compounded monthly. How much will you have after 10 years?',
        solution: `**Given:**
- P = P5,000
- r = 6% = 0.06
- n = 12 (monthly compounding)
- t = 10 years

**Solution:**
A = P(1 + r/n)^(nt)
A = 5,000(1 + 0.06/12)^(12×10)
A = 5,000(1 + 0.005)^120
A = 5,000(1.005)^120
A = 5,000 × 1.8194
A = **P9,096.98**

Your deposit will grow to P9,096.98 in 10 years with monthly compounding.`
      }
    ],
    calculator: {
      type: 'compound',
      title: 'Compound Interest Calculator',
      inputs: [
        { name: 'principal', label: 'Principal (P)', type: 'number', default: 5000 },
        { name: 'rate', label: 'Annual Rate (%)', type: 'number', default: 6 },
        { name: 'compounds', label: 'Compounds per Year', type: 'number', default: 12 },
        { name: 'years', label: 'Time (Years)', type: 'number', default: 10 }
      ]
    }
  },
  'present-value': {
    id: 'present-value',
    title: 'Present Value',
    description: 'Calculate the current worth of future cash flows discounted at an appropriate rate.',
    content: `Present Value (PV) is the current value of a future sum of money or stream of cash flows given a specified rate of return. It answers the question: "What is a future payment worth today?"

## The Discounting Process

Present value calculations "discount" future cash flows back to today. This process is the reverse of compounding and reflects:
- The opportunity cost of waiting for money
- The risk associated with future payments
- The time preference for current consumption

## Discount Rate Selection

Choosing the appropriate discount rate is crucial:
- **Risk-free rate**: For guaranteed future payments (e.g., government bonds)
- **Required return**: For investments, based on risk level
- **Cost of capital**: For corporate finance decisions
- **Inflation rate**: For maintaining purchasing power

## Applications

Present value is essential for:
- Valuing bonds and other fixed-income securities
- Evaluating investment opportunities
- Comparing payment options (lump sum vs. installments)
- Determining fair prices for assets
- Legal settlements and insurance calculations`,
    formulas: [
      {
        id: 'pv-single',
        name: 'Present Value of a Single Sum',
        latex: 'PV = \\frac{FV}{(1 + r)^n}',
        description: 'Present value of a single future cash flow',
        variables: [
          { symbol: 'PV', description: 'Present Value' },
          { symbol: 'FV', description: 'Future Value' },
          { symbol: 'r', description: 'Discount rate per period' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      },
      {
        id: 'pv-multiple',
        name: 'Present Value of Multiple Cash Flows',
        latex: 'PV = \\sum_{t=1}^{n} \\frac{CF_t}{(1 + r)^t}',
        description: 'Sum of present values of multiple future cash flows',
        variables: [
          { symbol: 'PV', description: 'Total Present Value' },
          { symbol: 'CF_t', description: 'Cash flow at time t' },
          { symbol: 'r', description: 'Discount rate' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      }
    ],
    examples: [
      {
        id: 'pv-example-1',
        title: 'Single Future Payment',
        problem: 'You will receive P100,000 in 8 years. If your required return is 10% per year, what is this payment worth today?',
        solution: `**Given:**
- FV = P100,000
- r = 10% = 0.10
- n = 8 years

**Solution:**
PV = FV / (1 + r)^n
PV = 100,000 / (1 + 0.10)^8
PV = 100,000 / (1.10)^8
PV = 100,000 / 2.1436
PV = **P46,651**

The P100,000 payment in 8 years is worth P46,651 today at a 10% discount rate.`
      }
    ],
    calculator: {
      type: 'pv',
      title: 'Present Value Calculator',
      inputs: [
        { name: 'fv', label: 'Future Value', type: 'number', default: 100000 },
        { name: 'rate', label: 'Discount Rate (%)', type: 'number', default: 10 },
        { name: 'periods', label: 'Number of Periods', type: 'number', default: 8 }
      ]
    }
  },
  'future-value': {
    id: 'future-value',
    title: 'Future Value',
    description: 'Determine the value of current assets at a specified date in the future based on an assumed growth rate.',
    content: `Future Value (FV) calculates what an investment made today will be worth at a specified future date, assuming a certain rate of return. It's the opposite of present value.

## Understanding Future Value

Future value helps answer questions like:
- How much will my savings grow to?
- What will my investment be worth at retirement?
- How much do I need to invest today to reach a goal?

## Factors Affecting Future Value

1. **Principal Amount**: The larger the initial investment, the larger the future value
2. **Interest Rate**: Higher rates lead to faster growth
3. **Time Period**: Longer time horizons allow more compounding
4. **Compounding Frequency**: More frequent compounding increases returns

## Rule of 72

A quick way to estimate how long it takes for an investment to double:
**Years to double ≈ 72 / Interest Rate**

For example, at 8% interest, money doubles in approximately 72/8 = 9 years.`,
    formulas: [
      {
        id: 'fv-single',
        name: 'Future Value of a Single Sum',
        latex: 'FV = PV \\times (1 + r)^n',
        description: 'Future value of a lump sum investment',
        variables: [
          { symbol: 'FV', description: 'Future Value' },
          { symbol: 'PV', description: 'Present Value (initial investment)' },
          { symbol: 'r', description: 'Interest rate per period' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      }
    ],
    examples: [
      {
        id: 'fv-example-1',
        title: 'Investment Growth',
        problem: 'You invest P25,000 at 7% annual interest. What will it be worth in 15 years?',
        solution: `**Given:**
- PV = P25,000
- r = 7% = 0.07
- n = 15 years

**Solution:**
FV = PV × (1 + r)^n
FV = 25,000 × (1 + 0.07)^15
FV = 25,000 × (1.07)^15
FV = 25,000 × 2.759
FV = **P68,974.38**

Your P25,000 investment will grow to P68,974.38 in 15 years.`
      }
    ],
    calculator: {
      type: 'fv',
      title: 'Future Value Calculator',
      inputs: [
        { name: 'pv', label: 'Present Value', type: 'number', default: 25000 },
        { name: 'rate', label: 'Interest Rate (%)', type: 'number', default: 7 },
        { name: 'periods', label: 'Number of Periods', type: 'number', default: 15 }
      ]
    }
  },
  'annuities': {
    id: 'annuities',
    title: 'Annuities',
    description: 'Analyze series of equal payments made at regular intervals, including ordinary annuities and annuities due.',
    content: `An annuity is a series of equal payments made at regular intervals over a specified period. Understanding annuities is crucial for analyzing loans, retirement plans, and many other financial instruments.

## Types of Annuities

### Ordinary Annuity (Annuity in Arrears)
Payments occur at the **end** of each period. Examples:
- Most loan payments
- Bond coupon payments
- Salary payments

### Annuity Due (Annuity in Advance)
Payments occur at the **beginning** of each period. Examples:
- Rent payments
- Insurance premiums
- Lease payments

The key difference: An annuity due is worth more because each payment is received/made one period earlier.

## Annuity Applications

- **Loan Amortization**: Calculating monthly payments
- **Retirement Planning**: Determining how much to save regularly
- **Investment Analysis**: Valuing regular income streams
- **Lease vs. Buy Decisions**: Comparing payment options`,
    formulas: [
      {
        id: 'pv-annuity',
        name: 'Present Value of Ordinary Annuity',
        latex: 'PV = PMT \\times \\frac{1 - (1 + r)^{-n}}{r}',
        description: 'Present value of a series of equal payments',
        variables: [
          { symbol: 'PV', description: 'Present Value' },
          { symbol: 'PMT', description: 'Payment per period' },
          { symbol: 'r', description: 'Interest rate per period' },
          { symbol: 'n', description: 'Number of payments' }
        ]
      },
      {
        id: 'fv-annuity',
        name: 'Future Value of Ordinary Annuity',
        latex: 'FV = PMT \\times \\frac{(1 + r)^n - 1}{r}',
        description: 'Future value of a series of equal payments',
        variables: [
          { symbol: 'FV', description: 'Future Value' },
          { symbol: 'PMT', description: 'Payment per period' },
          { symbol: 'r', description: 'Interest rate per period' },
          { symbol: 'n', description: 'Number of payments' }
        ]
      },
      {
        id: 'pmt-formula',
        name: 'Payment Amount',
        latex: 'PMT = PV \\times \\frac{r}{1 - (1 + r)^{-n}}',
        description: 'Calculate the periodic payment for a loan',
        variables: [
          { symbol: 'PMT', description: 'Payment per period' },
          { symbol: 'PV', description: 'Loan amount (Present Value)' },
          { symbol: 'r', description: 'Interest rate per period' },
          { symbol: 'n', description: 'Number of payments' }
        ]
      }
    ],
    examples: [
      {
        id: 'ann-example-1',
        title: 'Loan Payment Calculation',
        problem: 'You take out a P200,000 car loan at 9% annual interest for 5 years with monthly payments. What is your monthly payment?',
        solution: `**Given:**
- PV = P200,000 (loan amount)
- Annual rate = 9%, so monthly rate r = 0.09/12 = 0.0075
- n = 5 × 12 = 60 monthly payments

**Solution:**
PMT = PV × r / [1 - (1 + r)^(-n)]
PMT = 200,000 × 0.0075 / [1 - (1.0075)^(-60)]
PMT = 1,500 / [1 - 0.6387]
PMT = 1,500 / 0.3613
PMT = **P4,152.15**

Your monthly car payment will be P4,152.15.`
      },
      {
        id: 'ann-example-2',
        title: 'Retirement Savings',
        problem: 'You want to save P2,000 per month for 30 years at 8% annual return. How much will you have at retirement?',
        solution: `**Given:**
- PMT = P2,000 per month
- Monthly rate r = 0.08/12 = 0.00667
- n = 30 × 12 = 360 months

**Solution:**
FV = PMT × [(1 + r)^n - 1] / r
FV = 2,000 × [(1.00667)^360 - 1] / 0.00667
FV = 2,000 × [10.936 - 1] / 0.00667
FV = 2,000 × 1,490.36
FV = **P2,980,720**

You will have approximately P2.98 million at retirement!`
      }
    ],
    calculator: {
      type: 'annuity',
      title: 'Annuity Calculator',
      inputs: [
        { name: 'pmt', label: 'Payment Amount', type: 'number', default: 2000 },
        { name: 'rate', label: 'Annual Rate (%)', type: 'number', default: 8 },
        { name: 'years', label: 'Years', type: 'number', default: 30 },
        { name: 'frequency', label: 'Payments per Year', type: 'number', default: 12 }
      ]
    }
  },
  'perpetuities': {
    id: 'perpetuities',
    title: 'Perpetuities',
    description: 'Value infinite streams of equal periodic payments.',
    content: `A perpetuity is an annuity that has no end—it pays forever. While truly infinite payment streams don't exist in practice, perpetuity formulas are useful for valuing long-lived assets.

## Real-World Applications

- **Preferred Stock**: Pays fixed dividends indefinitely
- **Consol Bonds**: British government bonds with no maturity date
- **Endowments**: Funds designed to pay out forever
- **Real Estate**: Valuing property with ongoing rental income
- **Stock Valuation**: Gordon Growth Model treats dividends as a growing perpetuity

## Types of Perpetuities

### Ordinary Perpetuity
Fixed payment amount that never changes.

### Growing Perpetuity
Payments grow at a constant rate forever. Commonly used in stock valuation when dividends are expected to grow.

## Key Insight

The present value formula for perpetuities is remarkably simple because as n approaches infinity, the complex annuity formula simplifies dramatically.`,
    formulas: [
      {
        id: 'perpetuity-basic',
        name: 'Present Value of Perpetuity',
        latex: 'PV = \\frac{PMT}{r}',
        description: 'Present value of an infinite stream of equal payments',
        variables: [
          { symbol: 'PV', description: 'Present Value' },
          { symbol: 'PMT', description: 'Payment per period' },
          { symbol: 'r', description: 'Discount rate per period' }
        ]
      },
      {
        id: 'perpetuity-growing',
        name: 'Present Value of Growing Perpetuity',
        latex: 'PV = \\frac{PMT}{r - g}',
        description: 'Present value when payments grow at rate g (where r > g)',
        variables: [
          { symbol: 'PV', description: 'Present Value' },
          { symbol: 'PMT', description: 'First payment' },
          { symbol: 'r', description: 'Discount rate' },
          { symbol: 'g', description: 'Growth rate of payments' }
        ]
      }
    ],
    examples: [
      {
        id: 'perp-example-1',
        title: 'Preferred Stock Valuation',
        problem: 'A preferred stock pays an annual dividend of P8. If your required return is 10%, what should you pay for this stock?',
        solution: `**Given:**
- PMT = P8 (annual dividend)
- r = 10% = 0.10

**Solution:**
PV = PMT / r
PV = 8 / 0.10
PV = **P80**

The preferred stock is worth P80 if your required return is 10%.`
      },
      {
        id: 'perp-example-2',
        title: 'Growing Perpetuity (Stock Valuation)',
        problem: 'A stock just paid a P5 dividend, expected to grow at 3% forever. If the required return is 12%, what is the stock worth?',
        solution: `**Given:**
- D₀ = P5 (just paid)
- D₁ = P5 × 1.03 = P5.15 (next dividend)
- g = 3% = 0.03
- r = 12% = 0.12

**Solution:**
Using Gordon Growth Model:
PV = D₁ / (r - g)
PV = 5.15 / (0.12 - 0.03)
PV = 5.15 / 0.09
PV = **P57.22**

The stock is worth P57.22 today.`
      }
    ],
    calculator: {
      type: 'perpetuity',
      title: 'Perpetuity Calculator',
      inputs: [
        { name: 'pmt', label: 'Payment Amount', type: 'number', default: 8 },
        { name: 'rate', label: 'Discount Rate (%)', type: 'number', default: 10 },
        { name: 'growth', label: 'Growth Rate (%, 0 for no growth)', type: 'number', default: 0 }
      ]
    }
  },
  'net-present-value': {
    id: 'net-present-value',
    title: 'Net Present Value (NPV)',
    description: 'Evaluate investment opportunities by calculating the difference between present value of cash inflows and outflows.',
    content: `Net Present Value (NPV) is the gold standard for evaluating investment opportunities. It calculates the difference between the present value of cash inflows and the present value of cash outflows over a period of time.

## NPV Decision Rule

- **NPV > 0**: Accept the project (adds value to the firm)
- **NPV < 0**: Reject the project (destroys value)
- **NPV = 0**: Indifferent (project earns exactly the required return)

## Why NPV is Superior

NPV is considered the best capital budgeting technique because:
1. **Time value**: Accounts for the time value of money
2. **All cash flows**: Considers all cash flows over the project's life
3. **Dollar value**: Provides the actual dollar amount of value created
4. **Additive**: NPVs can be added for multiple projects

## Steps to Calculate NPV

1. Estimate all future cash flows
2. Determine the appropriate discount rate
3. Calculate the present value of each cash flow
4. Sum all present values
5. Subtract the initial investment`,
    formulas: [
      {
        id: 'npv-formula',
        name: 'Net Present Value',
        latex: 'NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1 + r)^t} = -C_0 + \\sum_{t=1}^{n} \\frac{CF_t}{(1 + r)^t}',
        description: 'Sum of all discounted cash flows minus initial investment',
        variables: [
          { symbol: 'NPV', description: 'Net Present Value' },
          { symbol: 'CF_t', description: 'Cash flow at time t' },
          { symbol: 'C_0', description: 'Initial investment (cash outflow)' },
          { symbol: 'r', description: 'Discount rate (cost of capital)' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      }
    ],
    examples: [
      {
        id: 'npv-example-1',
        title: 'Project Evaluation',
        problem: 'A project requires P100,000 initial investment and will generate cash flows of P30,000, P40,000, P50,000, and P40,000 over 4 years. The cost of capital is 12%. Should you accept this project?',
        solution: `**Given:**
- C₀ = P100,000 (initial investment)
- CF₁ = P30,000, CF₂ = P40,000, CF₃ = P50,000, CF₄ = P40,000
- r = 12% = 0.12

**Solution:**
NPV = -C₀ + CF₁/(1+r)¹ + CF₂/(1+r)² + CF₃/(1+r)³ + CF₄/(1+r)⁴

NPV = -100,000 + 30,000/1.12 + 40,000/1.2544 + 50,000/1.4049 + 40,000/1.5735

NPV = -100,000 + 26,786 + 31,888 + 35,590 + 25,424

NPV = **P19,688**

**Decision**: Accept the project! The positive NPV of P19,688 means the project adds value.`
      }
    ],
    calculator: {
      type: 'npv',
      title: 'NPV Calculator',
      inputs: [
        { name: 'initial', label: 'Initial Investment', type: 'number', default: 100000 },
        { name: 'rate', label: 'Discount Rate (%)', type: 'number', default: 12 },
        { name: 'cashflows', label: 'Cash Flows (comma-separated)', type: 'text', default: '30000,40000,50000,40000' }
      ]
    }
  },
  'internal-rate-of-return': {
    id: 'internal-rate-of-return',
    title: 'Internal Rate of Return (IRR)',
    description: 'Find the discount rate that makes the NPV of an investment equal to zero.',
    content: `The Internal Rate of Return (IRR) is the discount rate that makes the net present value of all cash flows from an investment equal to zero. It represents the expected compound annual rate of return.

## IRR Decision Rule

- **IRR > Required Return**: Accept the project
- **IRR < Required Return**: Reject the project
- **IRR = Required Return**: Indifferent

## Calculating IRR

IRR cannot be solved algebraically for most real-world problems. It requires:
- Trial and error
- Financial calculator
- Spreadsheet functions (=IRR())
- Iterative numerical methods

## Advantages of IRR

1. Easy to understand (expressed as a percentage)
2. Accounts for time value of money
3. Considers all cash flows
4. Popular with practitioners

## Limitations of IRR

1. **Multiple IRRs**: Non-conventional cash flows may have multiple IRRs
2. **Scale ignored**: Doesn't account for project size
3. **Reinvestment assumption**: Assumes cash flows are reinvested at IRR
4. **Mutually exclusive projects**: May conflict with NPV ranking`,
    formulas: [
      {
        id: 'irr-formula',
        name: 'IRR Definition',
        latex: '0 = \\sum_{t=0}^{n} \\frac{CF_t}{(1 + IRR)^t}',
        description: 'IRR is the rate that makes NPV equal to zero',
        variables: [
          { symbol: 'IRR', description: 'Internal Rate of Return' },
          { symbol: 'CF_t', description: 'Cash flow at time t' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      }
    ],
    examples: [
      {
        id: 'irr-example-1',
        title: 'IRR Calculation',
        problem: 'A project costs P50,000 and generates P20,000 per year for 3 years. If the required return is 10%, should you accept based on IRR?',
        solution: `**Given:**
- C₀ = P50,000
- CF₁ = CF₂ = CF₃ = P20,000
- Required return = 10%

**Solution:**
We need to find IRR where:
0 = -50,000 + 20,000/(1+IRR) + 20,000/(1+IRR)² + 20,000/(1+IRR)³

Using trial and error or a financial calculator:
IRR ≈ **9.7%**

**Decision**: Reject the project. IRR (9.7%) < Required Return (10%).

Note: Even though you get your money back plus some return, the 9.7% is less than the 10% you could earn elsewhere.`
      }
    ],
    calculator: {
      type: 'irr',
      title: 'IRR Calculator',
      inputs: [
        { name: 'initial', label: 'Initial Investment', type: 'number', default: 50000 },
        { name: 'cashflows', label: 'Cash Flows (comma-separated)', type: 'text', default: '20000,20000,20000' }
      ]
    }
  },
  'bond-valuation': {
    id: 'bond-valuation',
    title: 'Bond Valuation',
    description: 'Calculate the fair price of bonds using present value of future coupon payments and face value.',
    content: `Bond valuation applies time value of money concepts to determine the fair price of a bond. A bond's value equals the present value of all future cash flows: periodic coupon payments plus the face value at maturity.

## Bond Components

- **Face Value (Par)**: Amount paid at maturity (typically P1,000)
- **Coupon Rate**: Annual interest rate stated on the bond
- **Coupon Payment**: Face Value × Coupon Rate (often paid semi-annually)
- **Maturity**: When the face value is repaid
- **Yield to Maturity (YTM)**: Total return if held to maturity

## Bond Price vs. Interest Rates

**Inverse relationship**: When interest rates rise, bond prices fall, and vice versa.

- **Premium Bond**: Price > Par (coupon rate > market rate)
- **Discount Bond**: Price < Par (coupon rate < market rate)
- **Par Bond**: Price = Par (coupon rate = market rate)

## Types of Bonds

1. **Zero-coupon bonds**: No periodic payments, sold at discount
2. **Coupon bonds**: Regular interest payments
3. **Callable bonds**: Issuer can redeem early
4. **Convertible bonds**: Can convert to stock`,
    formulas: [
      {
        id: 'bond-price',
        name: 'Bond Valuation Formula',
        latex: 'P = \\sum_{t=1}^{n} \\frac{C}{(1 + r)^t} + \\frac{F}{(1 + r)^n}',
        description: 'Price equals PV of coupons plus PV of face value',
        variables: [
          { symbol: 'P', description: 'Bond price' },
          { symbol: 'C', description: 'Coupon payment per period' },
          { symbol: 'F', description: 'Face value' },
          { symbol: 'r', description: 'Yield per period' },
          { symbol: 'n', description: 'Number of periods to maturity' }
        ]
      },
      {
        id: 'bond-price-annuity',
        name: 'Bond Price (Using Annuity)',
        latex: 'P = C \\times \\frac{1 - (1+r)^{-n}}{r} + \\frac{F}{(1+r)^n}',
        description: 'Simplified formula using annuity factor',
        variables: [
          { symbol: 'P', description: 'Bond price' },
          { symbol: 'C', description: 'Coupon payment' },
          { symbol: 'F', description: 'Face value' },
          { symbol: 'r', description: 'Yield per period' },
          { symbol: 'n', description: 'Number of periods' }
        ]
      }
    ],
    examples: [
      {
        id: 'bond-example-1',
        title: 'Bond Pricing',
        problem: 'A bond has a face value of P1,000, 8% coupon rate (annual payments), 10 years to maturity. If the market yield is 10%, what is the bond worth?',
        solution: `**Given:**
- F = P1,000
- Coupon rate = 8%, so C = P1,000 × 0.08 = P80
- n = 10 years
- r = 10% = 0.10

**Solution:**
P = C × [1 - (1+r)^(-n)]/r + F/(1+r)^n
P = 80 × [1 - (1.10)^(-10)]/0.10 + 1,000/(1.10)^10
P = 80 × [1 - 0.3855]/0.10 + 1,000/2.594
P = 80 × 6.145 + 385.54
P = 491.60 + 385.54
P = **P877.14**

The bond trades at a **discount** because the coupon rate (8%) is less than the market yield (10%).`
      }
    ],
    calculator: {
      type: 'bond',
      title: 'Bond Valuation Calculator',
      inputs: [
        { name: 'faceValue', label: 'Face Value', type: 'number', default: 1000 },
        { name: 'couponRate', label: 'Coupon Rate (%)', type: 'number', default: 8 },
        { name: 'yield', label: 'Market Yield (%)', type: 'number', default: 10 },
        { name: 'years', label: 'Years to Maturity', type: 'number', default: 10 }
      ]
    }
  },
  'stock-valuation': {
    id: 'stock-valuation',
    title: 'Stock Valuation',
    description: 'Value equity securities using dividend discount models and other approaches.',
    content: `Stock valuation estimates the intrinsic value of a company's shares. Unlike bonds, stocks have uncertain future cash flows, making valuation more challenging.

## Valuation Approaches

### 1. Dividend Discount Models (DDM)
Value stock based on expected future dividends.

### 2. Relative Valuation
Compare price multiples (P/E, P/B) to similar companies.

### 3. Discounted Cash Flow (DCF)
Value based on projected free cash flows.

## Dividend Discount Models

**Zero Growth DDM**: For stocks with constant dividends (like preferred stock)

**Constant Growth DDM (Gordon Model)**: Most commonly used, assumes dividends grow at a constant rate forever.

**Multi-Stage DDM**: Different growth rates for different periods (high growth, then stable growth).

## Required Inputs

- **Expected dividends**: Future dividend payments
- **Growth rate (g)**: Expected dividend growth rate
- **Required return (r)**: Based on stock's risk (often using CAPM)

**Important**: The growth rate must be less than the required return (g < r).`,
    formulas: [
      {
        id: 'gordon-model',
        name: 'Gordon Growth Model',
        latex: 'P_0 = \\frac{D_1}{r - g} = \\frac{D_0(1 + g)}{r - g}',
        description: 'Stock price with constantly growing dividends',
        variables: [
          { symbol: 'P_0', description: 'Current stock price' },
          { symbol: 'D_1', description: 'Expected dividend next year' },
          { symbol: 'D_0', description: 'Most recent dividend' },
          { symbol: 'r', description: 'Required return' },
          { symbol: 'g', description: 'Dividend growth rate' }
        ]
      },
      {
        id: 'zero-growth',
        name: 'Zero Growth Model',
        latex: 'P_0 = \\frac{D}{r}',
        description: 'Stock price when dividends are constant (perpetuity)',
        variables: [
          { symbol: 'P_0', description: 'Stock price' },
          { symbol: 'D', description: 'Constant dividend' },
          { symbol: 'r', description: 'Required return' }
        ]
      }
    ],
    examples: [
      {
        id: 'stock-example-1',
        title: 'Gordon Growth Model',
        problem: 'A stock just paid a dividend of P4. Dividends are expected to grow at 5% per year. If your required return is 12%, what should you pay for this stock?',
        solution: `**Given:**
- D₀ = P4 (just paid)
- g = 5% = 0.05
- r = 12% = 0.12

**Solution:**
First, find D₁ (next dividend):
D₁ = D₀ × (1 + g) = 4 × 1.05 = P4.20

Then apply Gordon Model:
P₀ = D₁ / (r - g)
P₀ = 4.20 / (0.12 - 0.05)
P₀ = 4.20 / 0.07
P₀ = **P60**

The stock is worth P60 per share.`
      }
    ],
    calculator: {
      type: 'stock',
      title: 'Stock Valuation Calculator',
      inputs: [
        { name: 'dividend', label: 'Current Dividend', type: 'number', default: 4 },
        { name: 'growth', label: 'Growth Rate (%)', type: 'number', default: 5 },
        { name: 'required', label: 'Required Return (%)', type: 'number', default: 12 }
      ]
    }
  },
  'capm': {
    id: 'capm',
    title: 'Capital Asset Pricing Model (CAPM)',
    description: 'Understand the relationship between systematic risk and expected return for assets.',
    content: `The Capital Asset Pricing Model (CAPM) describes the relationship between systematic risk and expected return. It's used to estimate the cost of equity and evaluate investment performance.

## Key Concepts

### Systematic Risk (Market Risk)
Risk that affects the entire market and cannot be diversified away. Examples: recessions, interest rate changes, political events.

### Unsystematic Risk (Specific Risk)
Risk specific to individual securities that can be eliminated through diversification.

### Beta (β)
Measures a stock's sensitivity to market movements:
- β = 1: Moves with the market
- β > 1: More volatile than market
- β < 1: Less volatile than market
- β < 0: Moves opposite to market (rare)

## CAPM Assumptions

1. Investors are rational and risk-averse
2. Markets are efficient
3. Investors can borrow/lend at the risk-free rate
4. No taxes or transaction costs
5. All investors have the same expectations

## Applications

- **Cost of Equity**: Required return for equity investors
- **Capital Budgeting**: Discount rate for projects
- **Performance Evaluation**: Alpha measures performance vs. CAPM prediction`,
    formulas: [
      {
        id: 'capm-formula',
        name: 'CAPM Equation',
        latex: 'E(R_i) = R_f + \\beta_i [E(R_m) - R_f]',
        description: 'Expected return based on systematic risk',
        variables: [
          { symbol: 'E(R_i)', description: 'Expected return on asset i' },
          { symbol: 'R_f', description: 'Risk-free rate' },
          { symbol: '\\beta_i', description: 'Beta of asset i' },
          { symbol: 'E(R_m)', description: 'Expected market return' },
          { symbol: 'E(R_m) - R_f', description: 'Market risk premium' }
        ]
      },
      {
        id: 'beta-formula',
        name: 'Beta Calculation',
        latex: '\\beta_i = \\frac{Cov(R_i, R_m)}{Var(R_m)}',
        description: 'Beta from covariance and variance',
        variables: [
          { symbol: '\\beta_i', description: 'Beta of asset i' },
          { symbol: 'Cov(R_i, R_m)', description: 'Covariance of asset with market' },
          { symbol: 'Var(R_m)', description: 'Variance of market returns' }
        ]
      }
    ],
    examples: [
      {
        id: 'capm-example-1',
        title: 'Required Return Using CAPM',
        problem: 'The risk-free rate is 4%, the expected market return is 11%, and a stock has a beta of 1.3. What is the required return on this stock?',
        solution: `**Given:**
- Rf = 4% = 0.04
- E(Rm) = 11% = 0.11
- β = 1.3

**Solution:**
E(Ri) = Rf + β[E(Rm) - Rf]
E(Ri) = 0.04 + 1.3[0.11 - 0.04]
E(Ri) = 0.04 + 1.3[0.07]
E(Ri) = 0.04 + 0.091
E(Ri) = 0.131 = **13.1%**

The required return on this stock is 13.1%.

Note: The market risk premium is 7% (11% - 4%), and because β > 1, the stock's risk premium (9.1%) exceeds the market's.`
      }
    ],
    calculator: {
      type: 'capm',
      title: 'CAPM Calculator',
      inputs: [
        { name: 'riskFree', label: 'Risk-Free Rate (%)', type: 'number', default: 4 },
        { name: 'marketReturn', label: 'Expected Market Return (%)', type: 'number', default: 11 },
        { name: 'beta', label: 'Beta', type: 'number', default: 1.3 }
      ]
    }
  },
  'portfolio-theory': {
    id: 'portfolio-theory',
    title: 'Portfolio Theory',
    description: 'Learn how to construct optimal portfolios that maximize return for a given level of risk.',
    content: `Modern Portfolio Theory (MPT), developed by Harry Markowitz, provides a framework for constructing portfolios that maximize expected return for a given level of risk, or minimize risk for a given expected return.

## Key Concepts

### Diversification
"Don't put all your eggs in one basket." Combining assets reduces risk without necessarily reducing expected return.

### Correlation
The key to diversification. Assets with low or negative correlation provide better risk reduction when combined.
- ρ = +1: Perfect positive correlation (no diversification benefit)
- ρ = 0: No correlation
- ρ = -1: Perfect negative correlation (maximum diversification)

### Efficient Frontier
The set of optimal portfolios that offer the highest expected return for a defined level of risk.

## Portfolio Return and Risk

Portfolio return is the weighted average of individual returns. Portfolio risk depends on:
1. Individual asset weights
2. Individual asset variances
3. Covariances between assets

## The Optimal Portfolio

The optimal portfolio depends on investor preferences:
- **Risk-averse investors**: Choose portfolios lower on the efficient frontier
- **Risk-tolerant investors**: Choose portfolios higher on the efficient frontier`,
    formulas: [
      {
        id: 'portfolio-return',
        name: 'Portfolio Expected Return',
        latex: 'E(R_p) = \\sum_{i=1}^{n} w_i E(R_i)',
        description: 'Weighted average of individual expected returns',
        variables: [
          { symbol: 'E(R_p)', description: 'Expected portfolio return' },
          { symbol: 'w_i', description: 'Weight of asset i' },
          { symbol: 'E(R_i)', description: 'Expected return of asset i' }
        ]
      },
      {
        id: 'two-asset-variance',
        name: 'Two-Asset Portfolio Variance',
        latex: '\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1w_2\\sigma_1\\sigma_2\\rho_{12}',
        description: 'Portfolio variance for two assets',
        variables: [
          { symbol: '\\sigma_p^2', description: 'Portfolio variance' },
          { symbol: 'w_1, w_2', description: 'Asset weights' },
          { symbol: '\\sigma_1, \\sigma_2', description: 'Asset standard deviations' },
          { symbol: '\\rho_{12}', description: 'Correlation between assets' }
        ]
      },
      {
        id: 'sharpe-ratio',
        name: 'Sharpe Ratio',
        latex: 'Sharpe = \\frac{E(R_p) - R_f}{\\sigma_p}',
        description: 'Risk-adjusted return measure',
        variables: [
          { symbol: 'Sharpe', description: 'Sharpe Ratio' },
          { symbol: 'E(R_p)', description: 'Expected portfolio return' },
          { symbol: 'R_f', description: 'Risk-free rate' },
          { symbol: '\\sigma_p', description: 'Portfolio standard deviation' }
        ]
      }
    ],
    examples: [
      {
        id: 'port-example-1',
        title: 'Two-Asset Portfolio',
        problem: 'You invest 60% in Stock A (expected return 12%, std dev 20%) and 40% in Stock B (expected return 8%, std dev 15%). Correlation is 0.3. Calculate portfolio return and risk.',
        solution: `**Given:**
- w₁ = 0.60, E(R₁) = 12%, σ₁ = 20%
- w₂ = 0.40, E(R₂) = 8%, σ₂ = 15%
- ρ₁₂ = 0.3

**Portfolio Return:**
E(Rp) = w₁E(R₁) + w₂E(R₂)
E(Rp) = 0.60(12%) + 0.40(8%)
E(Rp) = 7.2% + 3.2% = **10.4%**

**Portfolio Variance:**
σp² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂σ₁σ₂ρ₁₂
σp² = (0.6)²(0.20)² + (0.4)²(0.15)² + 2(0.6)(0.4)(0.20)(0.15)(0.3)
σp² = 0.0144 + 0.0036 + 0.00432
σp² = 0.02232

**Portfolio Standard Deviation:**
σp = √0.02232 = **14.94%**

Notice: Portfolio risk (14.94%) is less than the weighted average of individual risks (18%) due to diversification!`
      }
    ],
    calculator: {
      type: 'portfolio',
      title: 'Two-Asset Portfolio Calculator',
      inputs: [
        { name: 'w1', label: 'Weight Asset 1 (%)', type: 'number', default: 60 },
        { name: 'r1', label: 'Return Asset 1 (%)', type: 'number', default: 12 },
        { name: 'sd1', label: 'Std Dev Asset 1 (%)', type: 'number', default: 20 },
        { name: 'r2', label: 'Return Asset 2 (%)', type: 'number', default: 8 },
        { name: 'sd2', label: 'Std Dev Asset 2 (%)', type: 'number', default: 15 },
        { name: 'corr', label: 'Correlation', type: 'number', default: 0.3 }
      ]
    }
  }
};

function Topic() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTopic() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTopic(topicId);
        setTopic(data);
      } catch (err) {
        console.error('Failed to load topic from API, using fallback:', err);
        // Use fallback topic content when API is unavailable
        if (fallbackTopics[topicId]) {
          setTopic(fallbackTopics[topicId]);
        } else {
          setError('Topic not found.');
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadTopic();
  }, [topicId]);

  // Loading state
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-nubia-surface-alt rounded animate-pulse" />
          <div className="h-6 w-96 bg-nubia-surface-alt rounded animate-pulse" />
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-5 bg-nubia-surface-alt rounded animate-pulse" style={{ width: `${90 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <p className="font-sans text-base text-nubia-error mb-4">{error}</p>
          <Link to="/" className="nubia-button">
            Return to overview
          </Link>
        </div>
      </div>
    );
  }

  // Not found state
  if (!topic) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <h1 className="nubia-heading-2 mb-2">Topic not found</h1>
          <p className="nubia-body-small mb-6">
            The topic you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="nubia-button">
            Return to overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link 
          to="/" 
          className="font-sans text-sm text-nubia-text-muted hover:text-nubia-text transition-colors"
        >
          ← Back to overview
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="nubia-heading-1 mb-3">
          {topic.title}
        </h1>
        <p className="font-serif text-lg text-nubia-text-secondary max-w-reading">
          {topic.description}
        </p>
      </header>

      {/* Content */}
      <section className="nubia-section">
        <TopicContent content={topic.content} />
      </section>

      {/* Formulas */}
      {topic.formulas && topic.formulas.length > 0 && (
        <section className="nubia-section">
          <h2 className="nubia-heading-2 mb-6">Formulas</h2>
          <div className="space-y-6">
            {topic.formulas.map(formula => (
              <FormulaBlock key={formula.id} formula={formula} />
            ))}
          </div>
        </section>
      )}

      {/* Calculator */}
      {topic.calculator && (
        <section className="nubia-section">
          <h2 className="nubia-heading-2 mb-6">Calculator</h2>
          <Calculator config={topic.calculator} />
        </section>
      )}

      {/* Worked Examples */}
      {topic.examples && topic.examples.length > 0 && (
        <section className="nubia-section">
          <h2 className="nubia-heading-2 mb-6">Worked Examples</h2>
          <div className="space-y-6">
            {topic.examples.map(example => (
              <ExampleBlock key={example.id} example={example} />
            ))}
          </div>
        </section>
      )}

      {/* Feedback */}
      <FeedbackForm pageContext={`topic:${topicId}`} />
    </article>
  );
}

export default Topic;
