import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const examples = [
  {
    id: 1,
    category: 'Time Value of Money',
    title: 'Present Value of a Single Amount',
    difficulty: 'Basic',
    question: 'You are promised P10,000 in 5 years. If the discount rate is 8% per annum, what is the present value of this amount?',
    steps: [
      { step: 1, text: 'Identify the given values', math: 'FV = 10,000, \\quad r = 8\\% = 0.08, \\quad n = 5' },
      { step: 2, text: 'Write the Present Value formula', math: 'PV = \\frac{FV}{(1 + r)^n}' },
      { step: 3, text: 'Substitute the values', math: 'PV = \\frac{10,000}{(1 + 0.08)^5}' },
      { step: 4, text: 'Calculate the denominator', math: '(1.08)^5 = 1.4693' },
      { step: 5, text: 'Compute the final answer', math: 'PV = \\frac{10,000}{1.4693} = P6,805.83' }
    ],
    answer: 'P6,805.83'
  },
  {
    id: 2,
    category: 'Time Value of Money',
    title: 'Future Value with Compound Interest',
    difficulty: 'Basic',
    question: 'If you invest P5,000 today at 6% interest compounded annually, how much will you have in 10 years?',
    steps: [
      { step: 1, text: 'Identify the given values', math: 'PV = 5,000, \\quad r = 6\\% = 0.06, \\quad n = 10' },
      { step: 2, text: 'Write the Future Value formula', math: 'FV = PV \\times (1 + r)^n' },
      { step: 3, text: 'Substitute the values', math: 'FV = 5,000 \\times (1 + 0.06)^{10}' },
      { step: 4, text: 'Calculate the growth factor', math: '(1.06)^{10} = 1.7908' },
      { step: 5, text: 'Compute the final answer', math: 'FV = 5,000 \\times 1.7908 = P8,954.24' }
    ],
    answer: 'P8,954.24'
  },
  {
    id: 3,
    category: 'Net Present Value',
    title: 'Investment Project Evaluation',
    difficulty: 'Intermediate',
    question: 'A project requires an initial investment of P100,000 and generates cash flows of P30,000, P40,000, and P50,000 over the next three years. If the required rate of return is 12%, should the company invest?',
    steps: [
      { step: 1, text: 'Identify the cash flows and discount rate', math: 'CF_0 = -100,000, \\quad CF_1 = 30,000, \\quad CF_2 = 40,000, \\quad CF_3 = 50,000, \\quad r = 12\\%' },
      { step: 2, text: 'Write the NPV formula', math: 'NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}' },
      { step: 3, text: 'Calculate PV of Year 1 cash flow', math: 'PV_1 = \\frac{30,000}{(1.12)^1} = P26,785.71' },
      { step: 4, text: 'Calculate PV of Year 2 cash flow', math: 'PV_2 = \\frac{40,000}{(1.12)^2} = P31,887.76' },
      { step: 5, text: 'Calculate PV of Year 3 cash flow', math: 'PV_3 = \\frac{50,000}{(1.12)^3} = P35,589.01' },
      { step: 6, text: 'Sum all present values', math: 'NPV = -100,000 + 26,785.71 + 31,887.76 + 35,589.01 = -P5,737.52' }
    ],
    answer: 'NPV = -P5,737.52. Since NPV is negative, the company should NOT invest in this project.'
  },
  {
    id: 4,
    category: 'Compound Interest',
    title: 'Comparing Compounding Frequencies',
    difficulty: 'Intermediate',
    question: 'You have P20,000 to invest for 3 years at 10% annual interest. Compare the final amounts with annual vs. quarterly compounding.',
    steps: [
      { step: 1, text: 'Annual Compounding Setup', math: 'P = 20,000, \\quad r = 10\\%, \\quad n = 1, \\quad t = 3' },
      { step: 2, text: 'Calculate with annual compounding', math: 'A_{annual} = 20,000 \\times (1 + 0.10)^3 = 20,000 \\times 1.331 = P26,620' },
      { step: 3, text: 'Quarterly Compounding Setup', math: 'P = 20,000, \\quad r = 10\\%, \\quad n = 4, \\quad t = 3' },
      { step: 4, text: 'Apply quarterly compounding formula', math: 'A_{quarterly} = 20,000 \\times (1 + \\frac{0.10}{4})^{4 \\times 3}' },
      { step: 5, text: 'Calculate with quarterly compounding', math: 'A_{quarterly} = 20,000 \\times (1.025)^{12} = 20,000 \\times 1.3449 = P26,897.78' },
      { step: 6, text: 'Find the difference', math: 'Difference = 26,897.78 - 26,620 = P277.78' }
    ],
    answer: 'Annual: P26,620, Quarterly: P26,897.78. Quarterly compounding earns P277.78 more.'
  },
  {
    id: 5,
    category: 'Time Value of Money',
    title: 'Finding the Interest Rate',
    difficulty: 'Intermediate',
    question: 'An investment of P8,000 grows to P12,000 over 5 years. What is the annual interest rate?',
    steps: [
      { step: 1, text: 'Identify the given values', math: 'PV = 8,000, \\quad FV = 12,000, \\quad n = 5' },
      { step: 2, text: 'Start with the FV formula', math: 'FV = PV \\times (1 + r)^n' },
      { step: 3, text: 'Rearrange to solve for r', math: '(1 + r)^n = \\frac{FV}{PV}' },
      { step: 4, text: 'Substitute values', math: '(1 + r)^5 = \\frac{12,000}{8,000} = 1.5' },
      { step: 5, text: 'Take the 5th root', math: '1 + r = (1.5)^{\\frac{1}{5}} = 1.0845' },
      { step: 6, text: 'Solve for r', math: 'r = 1.0845 - 1 = 0.0845 = 8.45\\%' }
    ],
    answer: 'The annual interest rate is 8.45%'
  },
  {
    id: 6,
    category: 'Annuities',
    title: 'Present Value of an Ordinary Annuity',
    difficulty: 'Advanced',
    question: 'Calculate the present value of an annuity that pays P5,000 at the end of each year for 4 years, with a discount rate of 7%.',
    steps: [
      { step: 1, text: 'Identify the given values', math: 'PMT = 5,000, \\quad r = 7\\% = 0.07, \\quad n = 4' },
      { step: 2, text: 'Write the PV of Annuity formula', math: 'PV = PMT \\times \\frac{1 - (1 + r)^{-n}}{r}' },
      { step: 3, text: 'Calculate the discount factor', math: '(1 + 0.07)^{-4} = (1.07)^{-4} = 0.7629' },
      { step: 4, text: 'Calculate the numerator', math: '1 - 0.7629 = 0.2371' },
      { step: 5, text: 'Calculate the annuity factor', math: '\\frac{0.2371}{0.07} = 3.3872' },
      { step: 6, text: 'Compute the final answer', math: 'PV = 5,000 \\times 3.3872 = P16,936.00' }
    ],
    answer: 'P16,936.00'
  }
];

function ExampleCard({ example, isExpanded, onToggle }) {
  const difficultyColors = {
    'Basic': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    'Intermediate': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    'Advanced': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
  };

  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg overflow-hidden">
      {/* Header - Always visible */}
      <button 
        onClick={onToggle}
        className="w-full p-4 md:p-5 text-left hover:bg-nubia-surface-alt transition-colors"
      >
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <span className="text-xs font-medium text-nubia-accent bg-nubia-accent-subtle px-2 py-0.5 rounded">
            {example.category}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded border ${difficultyColors[example.difficulty]}`}>
            {example.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-base md:text-lg font-semibold text-nubia-text">{example.title}</h3>
          <svg 
            className={`w-5 h-5 text-nubia-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-nubia-border p-4 md:p-5">
          {/* Question */}
          <div className="mb-6">
            <h4 className="font-sans text-sm font-semibold text-nubia-text-secondary uppercase tracking-wider mb-2">Question</h4>
            <p className="text-nubia-text">{example.question}</p>
          </div>
          
          {/* Step-by-step Solution */}
          <div className="mb-6">
            <h4 className="font-sans text-sm font-semibold text-nubia-text-secondary uppercase tracking-wider mb-3">Step-by-Step Solution</h4>
            <div className="space-y-4">
              {example.steps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-nubia-accent-subtle flex items-center justify-center">
                    <span className="text-sm font-medium text-nubia-accent">{step.step}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm text-nubia-text-secondary mb-2">{step.text}</p>
                    <div className="bg-nubia-bg rounded-md p-3 overflow-x-auto">
                      <BlockMath math={step.math} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Final Answer */}
          <div className="bg-nubia-accent-subtle border border-nubia-accent/30 rounded-md p-4">
            <h4 className="font-sans text-sm font-semibold text-nubia-accent mb-1">Final Answer</h4>
            <p className="text-nubia-text font-medium">{example.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Examples() {
  const [expandedId, setExpandedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const categories = ['All', ...new Set(examples.map(e => e.category))];
  const difficulties = ['All', 'Basic', 'Intermediate', 'Advanced'];

  const filteredExamples = examples.filter(e => {
    if (filterCategory !== 'All' && e.category !== filterCategory) return false;
    if (filterDifficulty !== 'All' && e.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="py-8 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">Worked Examples</h1>
        </div>
        <p className="text-nubia-text-secondary">
          Study these step-by-step worked examples to understand how to solve finance problems. Click on any example to expand the solution.
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-nubia-text-muted mb-1">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-nubia-surface border border-nubia-border rounded-md text-sm text-nubia-text focus:border-nubia-accent focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-nubia-text-muted mb-1">Difficulty</label>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1.5 bg-nubia-surface border border-nubia-border rounded-md text-sm text-nubia-text focus:border-nubia-accent focus:outline-none"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Examples List */}
      <div className="space-y-4">
        {filteredExamples.length === 0 ? (
          <p className="text-center text-nubia-text-muted py-8">No examples match your filters.</p>
        ) : (
          filteredExamples.map(example => (
            <ExampleCard
              key={example.id}
              example={example}
              isExpanded={expandedId === example.id}
              onToggle={() => setExpandedId(expandedId === example.id ? null : example.id)}
            />
          ))
        )}
      </div>
      
      {/* Study Tip */}
      <div className="mt-8 p-5 bg-nubia-surface-alt border border-nubia-border rounded-lg">
        <h2 className="font-sans text-lg font-semibold text-nubia-text mb-2">📚 Study Tip</h2>
        <p className="text-sm text-nubia-text-secondary">
          Try solving each problem on your own first before looking at the solution. Then compare your approach with the worked example. 
          Pay attention to the formula selection and the order of operations in each step.
        </p>
      </div>
    </div>
  );
}

export default Examples;
