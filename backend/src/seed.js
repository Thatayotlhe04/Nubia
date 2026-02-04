import db from './db.js';

// Wrap entire seed in a transaction for atomicity
db.exec('BEGIN TRANSACTION');

try {

// Clear existing data
db.exec(`
  DELETE FROM feedback;
  DELETE FROM calculators;
  DELETE FROM examples;
  DELETE FROM formulas;
  DELETE FROM topics;
`);

// ============================================
// TOPIC 1: TIME VALUE OF MONEY
// ============================================

const tvmContent = `
The Time Value of Money (TVM) is one of the most fundamental concepts in finance. It establishes that money available today is worth more than the same amount in the future due to its potential earning capacity.

## Why Money Has Time Value

Consider this: if someone offered you P10,000 today or P10,000 one year from now, which would you choose? The rational choice is to take the money today. Here's why:

1. **Earning potential**: Money received today can be invested to earn interest or returns
2. **Inflation**: The purchasing power of money typically decreases over time
3. **Certainty**: A pula today is certain; a pula promised tomorrow carries risk
4. **Opportunity cost**: Money tied up waiting cannot be used for other purposes

## Present Value and Future Value

The TVM framework revolves around two core concepts:

**Present Value (PV)** is the current worth of a future sum of money, given a specified rate of return. It answers: "What is a future amount worth in today's terms?"

**Future Value (FV)** is what a current sum of money will be worth at a specified date in the future, assuming a certain interest rate. It answers: "What will today's money grow to become?"

These two values are mathematically related—if you know one, you can calculate the other.

## The Role of Interest Rate and Time

Two variables connect present and future values:

**Interest rate (r)**: The rate of return or discount rate. In Botswana, this might be the rate offered by a bank deposit account, the yield on a government bond, or the expected return on an investment.

**Time period (n)**: The number of compounding periods between the present and future date. This is typically expressed in years, but can be any consistent time unit.

## Compounding

Compounding is the process whereby interest is earned on previously earned interest. The frequency of compounding affects the final value:

- Annual compounding: interest calculated once per year
- Semi-annual: twice per year
- Quarterly: four times per year
- Monthly: twelve times per year

More frequent compounding results in higher effective returns.

## Assumptions

When applying TVM calculations, we typically assume:

1. The interest rate remains constant over the entire period
2. Interest is reinvested at the same rate (for compounding)
3. There are no taxes or transaction costs
4. Cash flows occur at discrete points in time

## Common Misunderstandings

**Confusing simple and compound interest**: Simple interest is calculated only on the principal, while compound interest includes interest on accumulated interest. Most TVM calculations use compound interest.

**Ignoring compounding frequency**: Annual and monthly compounding of the same nominal rate produce different results. Always clarify the compounding assumption.

**Using inconsistent time units**: If the interest rate is annual, the time period must also be in years. Mixing units produces incorrect results.

**Forgetting to convert percentages**: An interest rate of 8% must be entered as 0.08 in calculations, not 8.
`;

db.prepare(`
  INSERT INTO topics (id, title, description, content, category, display_order)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  'time-value-of-money',
  'Time Value of Money',
  'Understanding the relationship between present and future value of money',
  tvmContent,
  'fundamentals',
  1
);

// TVM Formulas
const tvmFormulas = [
  {
    id: 'fv-single-sum',
    name: 'Future Value of a Single Sum',
    latex: 'FV = PV \\times (1 + r)^n',
    explanation: 'Calculates what a single lump sum invested today will grow to at a future date.',
    variables: JSON.stringify([
      { symbol: 'FV', name: 'Future Value', description: 'The value of the investment at the end of the period' },
      { symbol: 'PV', name: 'Present Value', description: 'The initial investment amount (principal)' },
      { symbol: 'r', name: 'Interest Rate', description: 'The periodic interest rate (as a decimal, e.g., 0.08 for 8%)' },
      { symbol: 'n', name: 'Number of Periods', description: 'The number of compounding periods' }
    ]),
    order: 1
  },
  {
    id: 'pv-single-sum',
    name: 'Present Value of a Single Sum',
    latex: 'PV = \\frac{FV}{(1 + r)^n}',
    explanation: 'Calculates the current worth of a future sum of money, discounted at a given rate.',
    variables: JSON.stringify([
      { symbol: 'PV', name: 'Present Value', description: 'The current value of the future sum' },
      { symbol: 'FV', name: 'Future Value', description: 'The amount to be received in the future' },
      { symbol: 'r', name: 'Discount Rate', description: 'The periodic discount rate (as a decimal)' },
      { symbol: 'n', name: 'Number of Periods', description: 'The number of periods until the future payment' }
    ]),
    order: 2
  }
];

const insertFormula = db.prepare(`
  INSERT INTO formulas (id, topic_id, name, latex, explanation, variables, display_order)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

tvmFormulas.forEach(f => {
  insertFormula.run(f.id, 'time-value-of-money', f.name, f.latex, f.explanation, f.variables, f.order);
});

// TVM Examples
const tvmExamples = [
  {
    id: 'tvm-example-1',
    title: 'Saving for University Fees',
    scenario: 'Thabo, a student at the University of Botswana, receives a gift of P5,000 from his grandmother. He decides to invest it in a fixed deposit account at a local bank offering 7.5% annual interest, compounded annually. He wants to know how much the investment will be worth when he graduates in 4 years.',
    steps: JSON.stringify([
      {
        step: 1,
        description: 'Identify the known values',
        content: 'PV = P5,000 (the initial gift)\nr = 7.5% = 0.075 (annual interest rate)\nn = 4 years'
      },
      {
        step: 2,
        description: 'Write the Future Value formula',
        content: 'FV = PV × (1 + r)ⁿ'
      },
      {
        step: 3,
        description: 'Substitute the values',
        content: 'FV = P5,000 × (1 + 0.075)⁴\nFV = P5,000 × (1.075)⁴'
      },
      {
        step: 4,
        description: 'Calculate the compound factor',
        content: '(1.075)⁴ = 1.3355 (rounded to 4 decimal places)'
      },
      {
        step: 5,
        description: 'Calculate the final answer',
        content: 'FV = P5,000 × 1.3355\nFV = P6,677.35'
      }
    ]),
    final_answer: 'Thabo\'s investment will grow to P6,677.35 after 4 years. The P1,677.35 earned represents compound interest—interest earned on both the original principal and on accumulated interest.',
    order: 1
  },
  {
    id: 'tvm-example-2',
    title: 'Planning for a Business Course',
    scenario: 'Kelebogile wants to enroll in a professional certification course that will cost P12,000 in 3 years. She can invest in a money market account that pays 6% annually. How much must she invest today to have exactly P12,000 when the course begins?',
    steps: JSON.stringify([
      {
        step: 1,
        description: 'Identify the known values',
        content: 'FV = P12,000 (the future cost)\nr = 6% = 0.06 (annual discount rate)\nn = 3 years'
      },
      {
        step: 2,
        description: 'Write the Present Value formula',
        content: 'PV = FV ÷ (1 + r)ⁿ'
      },
      {
        step: 3,
        description: 'Substitute the values',
        content: 'PV = P12,000 ÷ (1 + 0.06)³\nPV = P12,000 ÷ (1.06)³'
      },
      {
        step: 4,
        description: 'Calculate the discount factor',
        content: '(1.06)³ = 1.1910 (rounded to 4 decimal places)'
      },
      {
        step: 5,
        description: 'Calculate the final answer',
        content: 'PV = P12,000 ÷ 1.1910\nPV = P10,075.57'
      }
    ]),
    final_answer: 'Kelebogile needs to invest P10,075.57 today. This amount, growing at 6% annually for 3 years, will equal exactly P12,000 when her course begins.',
    order: 2
  }
];

const insertExample = db.prepare(`
  INSERT INTO examples (id, topic_id, title, scenario, steps, final_answer, display_order)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

tvmExamples.forEach(e => {
  insertExample.run(e.id, 'time-value-of-money', e.title, e.scenario, e.steps, e.final_answer, e.order);
});

// TVM Calculator
db.prepare(`
  INSERT INTO calculators (id, topic_id, title, inputs, formula_key, output_label, output_unit, output_decimals)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'tvm-fv-calculator',
  'time-value-of-money',
  'Future Value Calculator',
  JSON.stringify([
    {
      id: 'pv',
      label: 'Present Value (Principal)',
      type: 'number',
      unit: 'BWP',
      min: 0,
      max: 1000000000,
      step: 0.01,
      default: 5000,
      placeholder: 'e.g., 5000',
      help: 'The initial amount to be invested today'
    },
    {
      id: 'r',
      label: 'Annual Interest Rate',
      type: 'percentage',
      unit: '%',
      min: 0,
      max: 100,
      step: 0.1,
      default: 7.5,
      placeholder: 'e.g., 7.5',
      help: 'The annual rate of return (enter as percentage, e.g., 7.5 for 7.5%)'
    },
    {
      id: 'n',
      label: 'Number of Years',
      type: 'number',
      unit: 'years',
      min: 1,
      max: 100,
      step: 1,
      default: 4,
      placeholder: 'e.g., 4',
      help: 'The number of years the money will be invested'
    }
  ]),
  'fv-single-sum',
  'Future Value',
  'BWP',
  2
);

// ============================================
// TOPIC 2: COMPOUND INTEREST
// ============================================

const compoundContent = `
Compound interest is often called "interest on interest." It is the process by which the interest earned on an investment is added to the principal, so that from that moment on, the interest that has been added also earns interest.

## Simple Interest vs Compound Interest

**Simple Interest** is calculated only on the original principal amount. If you invest P1,000 at 10% simple interest for 3 years, you earn P100 each year, for a total of P300 in interest.

**Compound Interest** is calculated on the principal plus any accumulated interest. The same P1,000 at 10% compound interest would earn:
- Year 1: P100 (on P1,000)
- Year 2: P110 (on P1,100)  
- Year 3: P121 (on P1,210)
- Total: P331 in interest

The difference grows dramatically over longer periods.

## Compounding Frequency

The frequency at which interest is compounded significantly affects the final value. Common compounding periods include:

| Frequency | Periods per Year |
|-----------|-----------------|
| Annual | 1 |
| Semi-annual | 2 |
| Quarterly | 4 |
| Monthly | 12 |
| Daily | 365 |

More frequent compounding yields higher returns because interest begins earning interest sooner.

## Effective Annual Rate

When comparing investments with different compounding frequencies, use the Effective Annual Rate (EAR) to make a fair comparison. The EAR represents the actual annual return accounting for compounding.

For example, a 12% nominal rate compounded monthly has an EAR of approximately 12.68%—higher than the stated rate because of intra-year compounding.

## The Rule of 72

A quick mental approximation: divide 72 by the interest rate to estimate how many years it takes for an investment to double.

At 8% interest: 72 ÷ 8 = 9 years to double
At 12% interest: 72 ÷ 12 = 6 years to double

This is an approximation and works best for rates between 6% and 10%.

## Applications in Botswana

Understanding compound interest is essential for evaluating:
- Fixed deposit accounts at commercial banks
- Treasury bills and government bonds
- Pension fund growth projections
- Long-term savings goals

Always confirm the compounding frequency when comparing financial products. A higher nominal rate with annual compounding may yield less than a lower rate with monthly compounding.
`;

db.prepare(`
  INSERT INTO topics (id, title, description, content, category, display_order)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  'compound-interest',
  'Compound Interest',
  'How interest accumulates over time through compounding',
  compoundContent,
  'fundamentals',
  2
);

// Compound Interest Formulas
const compoundFormulas = [
  {
    id: 'compound-interest-formula',
    name: 'Compound Interest with Periodic Compounding',
    latex: 'FV = PV \\times \\left(1 + \\frac{r}{m}\\right)^{m \\times n}',
    explanation: 'Calculates future value when interest compounds multiple times per year.',
    variables: JSON.stringify([
      { symbol: 'FV', name: 'Future Value', description: 'The value at the end of the investment period' },
      { symbol: 'PV', name: 'Present Value', description: 'The initial principal amount' },
      { symbol: 'r', name: 'Nominal Annual Rate', description: 'The stated annual interest rate (as a decimal)' },
      { symbol: 'm', name: 'Compounding Frequency', description: 'Number of times interest is compounded per year' },
      { symbol: 'n', name: 'Number of Years', description: 'The investment period in years' }
    ]),
    order: 1
  },
  {
    id: 'effective-annual-rate',
    name: 'Effective Annual Rate (EAR)',
    latex: 'EAR = \\left(1 + \\frac{r}{m}\\right)^m - 1',
    explanation: 'Converts a nominal rate with periodic compounding to an equivalent annual rate.',
    variables: JSON.stringify([
      { symbol: 'EAR', name: 'Effective Annual Rate', description: 'The true annual return accounting for compounding' },
      { symbol: 'r', name: 'Nominal Annual Rate', description: 'The stated annual interest rate (as a decimal)' },
      { symbol: 'm', name: 'Compounding Frequency', description: 'Number of times interest is compounded per year' }
    ]),
    order: 2
  }
];

compoundFormulas.forEach(f => {
  insertFormula.run(f.id, 'compound-interest', f.name, f.latex, f.explanation, f.variables, f.order);
});

// Compound Interest Example
const compoundExamples = [
  {
    id: 'compound-example-1',
    title: 'Comparing Bank Deposit Options',
    scenario: 'Lesego has P20,000 to invest for 5 years. Bank A offers 9% compounded annually, while Bank B offers 8.75% compounded monthly. Which bank offers the better return?',
    steps: JSON.stringify([
      {
        step: 1,
        description: 'Calculate Future Value with Bank A (annual compounding)',
        content: 'FV = P20,000 × (1 + 0.09)⁵\nFV = P20,000 × 1.5386\nFV = P30,772.48'
      },
      {
        step: 2,
        description: 'Calculate Future Value with Bank B (monthly compounding)',
        content: 'FV = P20,000 × (1 + 0.0875/12)^(12×5)\nFV = P20,000 × (1.00729)^60\nFV = P20,000 × 1.5457\nFV = P30,914.07'
      },
      {
        step: 3,
        description: 'Calculate EAR for Bank B to verify',
        content: 'EAR = (1 + 0.0875/12)^12 - 1\nEAR = (1.00729)^12 - 1\nEAR = 0.0911 = 9.11%'
      },
      {
        step: 4,
        description: 'Compare the results',
        content: 'Bank A final value: P30,772.48\nBank B final value: P30,914.07\nDifference: P141.59 in favor of Bank B'
      }
    ]),
    final_answer: 'Bank B offers the better return despite the lower nominal rate. The monthly compounding results in an effective annual rate of 9.11%, exceeding Bank A\'s 9%. Lesego would earn P141.59 more with Bank B over 5 years.',
    order: 1
  }
];

compoundExamples.forEach(e => {
  insertExample.run(e.id, 'compound-interest', e.title, e.scenario, e.steps, e.final_answer, e.order);
});

// Compound Interest Calculator
db.prepare(`
  INSERT INTO calculators (id, topic_id, title, inputs, formula_key, output_label, output_unit, output_decimals)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'compound-interest-calculator',
  'compound-interest',
  'Compound Interest Calculator',
  JSON.stringify([
    {
      id: 'pv',
      label: 'Principal Amount',
      type: 'number',
      unit: 'BWP',
      min: 0,
      max: 1000000000,
      step: 0.01,
      default: 20000,
      placeholder: 'e.g., 20000',
      help: 'The initial amount to invest'
    },
    {
      id: 'r',
      label: 'Annual Interest Rate',
      type: 'percentage',
      unit: '%',
      min: 0,
      max: 100,
      step: 0.01,
      default: 8.75,
      placeholder: 'e.g., 8.75',
      help: 'The nominal annual interest rate'
    },
    {
      id: 'm',
      label: 'Compounding Frequency',
      type: 'select',
      options: [
        { value: 1, label: 'Annually (1×/year)' },
        { value: 2, label: 'Semi-annually (2×/year)' },
        { value: 4, label: 'Quarterly (4×/year)' },
        { value: 12, label: 'Monthly (12×/year)' },
        { value: 365, label: 'Daily (365×/year)' }
      ],
      default: 12,
      help: 'How often interest is compounded'
    },
    {
      id: 'n',
      label: 'Investment Period',
      type: 'number',
      unit: 'years',
      min: 1,
      max: 100,
      step: 1,
      default: 5,
      placeholder: 'e.g., 5',
      help: 'Number of years to invest'
    }
  ]),
  'compound-interest-formula',
  'Future Value',
  'BWP',
  2
);

// ============================================
// TOPIC 3: NET PRESENT VALUE
// ============================================

const npvContent = `
Net Present Value (NPV) is a method for evaluating investments and projects by comparing the present value of expected cash inflows to the present value of cash outflows. It is one of the most widely used techniques in capital budgeting.

## The NPV Concept

NPV answers a fundamental question: "Is this investment worth more than it costs?"

If you invest P100,000 today and expect to receive various cash flows over the next five years, those future cash flows must be discounted back to today's value to make a fair comparison with the initial outlay.

## Interpreting NPV Results

**NPV > 0 (Positive)**: The investment creates value. The present value of expected returns exceeds the cost. The project should generally be accepted.

**NPV = 0 (Zero)**: The investment breaks even in present value terms. The project returns exactly the required rate.

**NPV < 0 (Negative)**: The investment destroys value. The cost exceeds the present value of expected returns. The project should generally be rejected.

## Choosing the Discount Rate

The discount rate is critical to NPV analysis. It typically represents:

- The cost of capital (what it costs to finance the project)
- The required rate of return (minimum acceptable return)
- The opportunity cost (what could be earned elsewhere)

In Botswana, the discount rate might reference the Bank of Botswana's policy rate, commercial lending rates, or sector-specific hurdle rates.

## Assumptions and Limitations

NPV analysis assumes:
1. Cash flows can be estimated with reasonable accuracy
2. The discount rate remains constant
3. Cash flows occur at discrete intervals (usually year-end)
4. The discount rate correctly reflects the project's risk

Limitations include:
- Sensitivity to discount rate assumptions
- Difficulty estimating distant cash flows
- Does not account for strategic value or flexibility

## NPV vs Other Methods

Unlike the payback period, NPV accounts for the time value of money. Unlike the internal rate of return (IRR), NPV gives an absolute value rather than a percentage, making it easier to compare projects of different sizes.

NPV is generally considered the most theoretically sound method for investment evaluation because it directly measures value creation.
`;

db.prepare(`
  INSERT INTO topics (id, title, description, content, category, display_order)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  'net-present-value',
  'Net Present Value',
  'Evaluating investments by comparing present values of cash flows',
  npvContent,
  'capital-budgeting',
  3
);

// NPV Formula
insertFormula.run(
  'npv-formula',
  'net-present-value',
  'Net Present Value',
  'NPV = -C_0 + \\sum_{t=1}^{n} \\frac{C_t}{(1 + r)^t}',
  'Calculates the net present value of a series of cash flows.',
  JSON.stringify([
    { symbol: 'NPV', name: 'Net Present Value', description: 'The difference between the present value of inflows and outflows' },
    { symbol: 'C_0', name: 'Initial Investment', description: 'The upfront cost at time zero (positive number)' },
    { symbol: 'C_t', name: 'Cash Flow at Time t', description: 'The expected cash flow in period t' },
    { symbol: 'r', name: 'Discount Rate', description: 'The required rate of return (as a decimal)' },
    { symbol: 'n', name: 'Number of Periods', description: 'The total number of cash flow periods' }
  ]),
  1
);

// NPV Example
insertExample.run(
  'npv-example-1',
  'net-present-value',
  'Evaluating a Small Business Expansion',
  'Mpho operates a small catering business in Gaborone. She is considering purchasing new equipment for P45,000 that would allow her to take on larger contracts. She projects additional annual cash flows of P15,000 for each of the next 4 years. Her required return is 12%. Should she make the investment?',
  JSON.stringify([
    {
      step: 1,
      description: 'Identify the cash flows',
      content: 'Initial investment (C₀) = P45,000\nAnnual cash flows = P15,000 for years 1-4\nDiscount rate (r) = 12% = 0.12'
    },
    {
      step: 2,
      description: 'Calculate present value of each cash flow',
      content: 'Year 1: P15,000 ÷ (1.12)¹ = P13,392.86\nYear 2: P15,000 ÷ (1.12)² = P11,957.91\nYear 3: P15,000 ÷ (1.12)³ = P10,676.71\nYear 4: P15,000 ÷ (1.12)⁴ = P9,532.78'
    },
    {
      step: 3,
      description: 'Sum the present values',
      content: 'Total PV of inflows = P13,392.86 + P11,957.91 + P10,676.71 + P9,532.78\nTotal PV of inflows = P45,560.26'
    },
    {
      step: 4,
      description: 'Calculate NPV',
      content: 'NPV = PV of inflows - Initial investment\nNPV = P45,560.26 - P45,000\nNPV = P560.26'
    }
  ]),
  'The NPV is P560.26, which is positive. This means the investment is expected to return slightly more than Mpho\'s required 12% return. She should proceed with the equipment purchase, though the margin is small and she should consider whether her cash flow projections are conservative enough.',
  1
);

// NPV Calculator config
db.prepare(`
  INSERT INTO calculators (id, topic_id, title, inputs, formula_key, output_label, output_unit, output_decimals)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'npv-calculator',
  'net-present-value',
  'Net Present Value Calculator',
  JSON.stringify([
    {
      id: 'c0',
      label: 'Initial Investment',
      type: 'number',
      unit: 'BWP',
      min: 0,
      max: 1000000000,
      step: 0.01,
      default: 45000,
      placeholder: 'e.g., 45000',
      help: 'The upfront cost of the investment (enter as positive number)'
    },
    {
      id: 'r',
      label: 'Discount Rate',
      type: 'percentage',
      unit: '%',
      min: 0,
      max: 100,
      step: 0.1,
      default: 12,
      placeholder: 'e.g., 12',
      help: 'Your required rate of return'
    },
    {
      id: 'cashflows',
      label: 'Annual Cash Flows',
      type: 'cashflow-series',
      unit: 'BWP',
      min: -1000000000,
      max: 1000000000,
      maxPeriods: 20,
      default: [15000, 15000, 15000, 15000],
      help: 'Expected cash flows for each year (can be positive or negative)'
    }
  ]),
  'npv-formula',
  'Net Present Value',
  'BWP',
  2
);

db.exec('COMMIT');

console.log('Database seeded successfully with 3 topics:');
console.log('1. Time Value of Money');
console.log('2. Compound Interest');
console.log('3. Net Present Value');

} catch (error) {
  db.exec('ROLLBACK');
  console.error('Seed failed, rolled back all changes:', error);
  process.exit(1);
}
