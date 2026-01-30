import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

// Credible finance resources database
const credibleResources = [
  // Time Value of Money
  {
    id: 'tvm-1',
    topic: 'Time Value of Money',
    title: 'Understanding Present and Future Value',
    description: 'Comprehensive guide explaining the core concepts of time value of money, including present value, future value, and discount rates.',
    keywords: ['present value', 'future value', 'tvm', 'time value', 'discount rate', 'pv', 'fv'],
    formula: 'PV = \\frac{FV}{(1+r)^n}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/t/timevalueofmoney.asp',
    credibility: 'Investopedia is a leading financial education website reviewed by certified financial planners.',
    type: 'Article'
  },
  {
    id: 'tvm-2',
    topic: 'Time Value of Money',
    title: 'Time Value of Money - Khan Academy',
    description: 'Free video lectures explaining time value of money concepts with visual examples and practice problems.',
    keywords: ['present value', 'future value', 'tvm', 'time value', 'video', 'lecture'],
    source: 'Khan Academy',
    sourceUrl: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial',
    credibility: 'Khan Academy is a nonprofit educational organization providing free courses used by millions worldwide.',
    type: 'Video Course'
  },
  {
    id: 'tvm-3',
    topic: 'Time Value of Money',
    title: 'Corporate Finance Institute - TVM Guide',
    description: 'Professional-level explanation of time value of money used in corporate finance and investment analysis.',
    keywords: ['present value', 'future value', 'corporate finance', 'investment', 'valuation'],
    source: 'Corporate Finance Institute (CFI)',
    sourceUrl: 'https://corporatefinanceinstitute.com/resources/valuation/time-value-of-money/',
    credibility: 'CFI provides accredited financial analyst certifications recognized globally.',
    type: 'Professional Guide'
  },

  // Compound Interest
  {
    id: 'ci-1',
    topic: 'Compound Interest',
    title: 'Compound Interest Formula and Calculator',
    description: 'Detailed explanation of compound interest with interactive calculator and real-world examples.',
    keywords: ['compound interest', 'compounding', 'interest rate', 'principal', 'annual', 'monthly'],
    formula: 'A = P(1 + \\frac{r}{n})^{nt}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/c/compoundinterest.asp',
    credibility: 'Investopedia content is reviewed by qualified financial professionals.',
    type: 'Article'
  },
  {
    id: 'ci-2',
    topic: 'Compound Interest',
    title: 'The Power of Compound Interest - SEC',
    description: 'Official U.S. Securities and Exchange Commission guide on understanding compound interest for investors.',
    keywords: ['compound interest', 'investing', 'savings', 'sec', 'government'],
    source: 'U.S. Securities and Exchange Commission',
    sourceUrl: 'https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/compound-interest',
    credibility: 'Official U.S. government regulatory body for securities markets.',
    type: 'Government Resource'
  },

  // Net Present Value
  {
    id: 'npv-1',
    topic: 'Net Present Value',
    title: 'NPV - Net Present Value Definition and Formula',
    description: 'Complete guide to NPV calculation, interpretation, and use in capital budgeting decisions.',
    keywords: ['npv', 'net present value', 'capital budgeting', 'investment', 'cash flow', 'discount'],
    formula: 'NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/n/npv.asp',
    credibility: 'Investopedia is a trusted financial education resource.',
    type: 'Article'
  },
  {
    id: 'npv-2',
    topic: 'Net Present Value',
    title: 'NPV and IRR - Harvard Business School',
    description: 'Academic perspective on net present value and internal rate of return from a leading business school.',
    keywords: ['npv', 'irr', 'internal rate of return', 'harvard', 'academic', 'business'],
    source: 'Harvard Business School Online',
    sourceUrl: 'https://online.hbs.edu/blog/post/how-to-calculate-npv',
    credibility: 'Harvard Business School is one of the world\'s leading business education institutions.',
    type: 'Academic Article'
  },
  {
    id: 'npv-3',
    topic: 'Net Present Value',
    title: 'Capital Budgeting Techniques - CFA Institute',
    description: 'Professional guide on NPV, IRR, and payback period from the CFA Institute curriculum.',
    keywords: ['npv', 'capital budgeting', 'cfa', 'irr', 'payback', 'investment analysis'],
    source: 'CFA Institute',
    sourceUrl: 'https://www.cfainstitute.org/en/membership/professional-development/refresher-readings/capital-budgeting',
    credibility: 'CFA Institute sets the global standard for investment professional credentials.',
    type: 'Professional Certification Material'
  },

  // Annuities
  {
    id: 'ann-1',
    topic: 'Annuities',
    title: 'Understanding Annuities: Types and Calculations',
    description: 'Comprehensive guide to ordinary annuities, annuities due, and perpetuities with formulas.',
    keywords: ['annuity', 'ordinary annuity', 'annuity due', 'perpetuity', 'payment', 'pmt'],
    formula: 'PV_{annuity} = PMT \\times \\frac{1-(1+r)^{-n}}{r}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/a/annuity.asp',
    credibility: 'Investopedia provides peer-reviewed financial education content.',
    type: 'Article'
  },
  {
    id: 'ann-2',
    topic: 'Annuities',
    title: 'Present Value of Annuity - Corporate Finance Institute',
    description: 'Professional explanation of annuity valuation methods used in finance.',
    keywords: ['annuity', 'present value', 'future value', 'valuation', 'pmt'],
    source: 'Corporate Finance Institute',
    sourceUrl: 'https://corporatefinanceinstitute.com/resources/valuation/present-value-annuity/',
    credibility: 'CFI is a globally recognized provider of financial analyst certification.',
    type: 'Professional Guide'
  },

  // Interest Rates
  {
    id: 'ir-1',
    topic: 'Interest Rates',
    title: 'Effective Annual Rate vs Nominal Rate',
    description: 'Understanding the difference between stated (nominal) interest rates and effective annual rates.',
    keywords: ['ear', 'apr', 'nominal rate', 'effective rate', 'annual', 'interest'],
    formula: 'EAR = (1 + \\frac{r}{n})^n - 1',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/e/effectiveinterest.asp',
    credibility: 'Investopedia content is reviewed by industry professionals.',
    type: 'Article'
  },
  {
    id: 'ir-2',
    topic: 'Interest Rates',
    title: 'Federal Reserve Education - Interest Rates',
    description: 'Official Federal Reserve educational materials on how interest rates work in the economy.',
    keywords: ['interest rate', 'federal reserve', 'monetary policy', 'central bank', 'economy'],
    source: 'Federal Reserve Bank',
    sourceUrl: 'https://www.federalreserveeducation.org/about-the-fed/structure-and-functions/monetary-policy',
    credibility: 'Official educational resource from the U.S. central bank.',
    type: 'Government Resource'
  },

  // Bond Valuation
  {
    id: 'bond-1',
    topic: 'Bond Valuation',
    title: 'Bond Valuation: Calculation and Formula',
    description: 'How to calculate the present value of bonds using coupon payments and face value.',
    keywords: ['bond', 'valuation', 'coupon', 'yield', 'face value', 'par value', 'fixed income'],
    formula: 'P = \\sum_{t=1}^{n} \\frac{C}{(1+r)^t} + \\frac{FV}{(1+r)^n}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/b/bond-valuation.asp',
    credibility: 'Investopedia is a trusted financial education platform.',
    type: 'Article'
  },
  {
    id: 'bond-2',
    topic: 'Bond Valuation',
    title: 'Fixed Income Securities - CFA Institute',
    description: 'Professional-level bond analysis and valuation from the CFA curriculum.',
    keywords: ['bond', 'fixed income', 'yield curve', 'duration', 'cfa', 'valuation'],
    source: 'CFA Institute',
    sourceUrl: 'https://www.cfainstitute.org/en/membership/professional-development/refresher-readings/fixed-income-securities',
    credibility: 'CFA Institute is the gold standard for investment professionals.',
    type: 'Professional Certification Material'
  },

  // Stock Valuation
  {
    id: 'stock-1',
    topic: 'Stock Valuation',
    title: 'Stock Valuation Methods: DCF and DDM',
    description: 'Overview of stock valuation techniques including discounted cash flow and dividend discount models.',
    keywords: ['stock', 'valuation', 'dcf', 'ddm', 'dividend', 'equity', 'shares'],
    formula: 'P_0 = \\frac{D_1}{r-g}',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/s/stockvaluation.asp',
    credibility: 'Investopedia provides peer-reviewed financial content.',
    type: 'Article'
  },

  // Risk and Return
  {
    id: 'risk-1',
    topic: 'Risk and Return',
    title: 'Understanding Risk and Return',
    description: 'Fundamental concepts of investment risk, expected return, and the risk-return tradeoff.',
    keywords: ['risk', 'return', 'portfolio', 'diversification', 'variance', 'standard deviation'],
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/r/riskreturntradeoff.asp',
    credibility: 'Investopedia content is reviewed by certified financial professionals.',
    type: 'Article'
  },
  {
    id: 'risk-2',
    topic: 'Risk and Return',
    title: 'Portfolio Theory - Nobel Prize Lecture',
    description: 'Harry Markowitz\'s Nobel Prize lecture on portfolio selection and modern portfolio theory.',
    keywords: ['portfolio', 'markowitz', 'diversification', 'efficient frontier', 'mpt'],
    source: 'Nobel Prize Organization',
    sourceUrl: 'https://www.nobelprize.org/prizes/economic-sciences/1990/markowitz/lecture/',
    credibility: 'Official Nobel Prize organization - highest academic recognition.',
    type: 'Academic Lecture'
  },

  // Financial Statements
  {
    id: 'fs-1',
    topic: 'Financial Statements',
    title: 'How to Read Financial Statements',
    description: 'Guide to understanding balance sheets, income statements, and cash flow statements.',
    keywords: ['financial statements', 'balance sheet', 'income statement', 'cash flow', 'accounting'],
    source: 'SEC Investor.gov',
    sourceUrl: 'https://www.investor.gov/introduction-investing/investing-basics/how-read-financial-statements',
    credibility: 'Official U.S. Securities and Exchange Commission investor education.',
    type: 'Government Resource'
  },

  // CAPM
  {
    id: 'capm-1',
    topic: 'Capital Asset Pricing Model',
    title: 'CAPM - Capital Asset Pricing Model',
    description: 'Explanation of CAPM formula, beta, and systematic risk in portfolio management.',
    keywords: ['capm', 'beta', 'systematic risk', 'market risk', 'expected return', 'sml'],
    formula: 'E(R_i) = R_f + \\beta_i(E(R_m) - R_f)',
    source: 'Investopedia',
    sourceUrl: 'https://www.investopedia.com/terms/c/capm.asp',
    credibility: 'Investopedia is a leading financial education resource.',
    type: 'Article'
  },

  // Cost of Capital
  {
    id: 'wacc-1',
    topic: 'Cost of Capital',
    title: 'WACC - Weighted Average Cost of Capital',
    description: 'How to calculate a company\'s cost of capital using debt and equity components.',
    keywords: ['wacc', 'cost of capital', 'cost of equity', 'cost of debt', 'capital structure'],
    formula: 'WACC = \\frac{E}{V}R_e + \\frac{D}{V}R_d(1-T)',
    source: 'Corporate Finance Institute',
    sourceUrl: 'https://corporatefinanceinstitute.com/resources/valuation/what-is-wacc-formula/',
    credibility: 'CFI is a globally recognized financial education provider.',
    type: 'Professional Guide'
  }
];

// Search function
function searchResources(query) {
  if (!query || query.trim() === '') return [];
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  
  return credibleResources
    .map(resource => {
      let score = 0;
      const searchableText = `${resource.title} ${resource.description} ${resource.topic} ${resource.keywords.join(' ')}`.toLowerCase();
      
      searchTerms.forEach(term => {
        // Exact keyword match (highest score)
        if (resource.keywords.some(k => k.toLowerCase() === term)) {
          score += 10;
        }
        // Keyword contains term
        else if (resource.keywords.some(k => k.toLowerCase().includes(term))) {
          score += 5;
        }
        // Title match
        if (resource.title.toLowerCase().includes(term)) {
          score += 8;
        }
        // Topic match
        if (resource.topic.toLowerCase().includes(term)) {
          score += 7;
        }
        // Description match
        if (resource.description.toLowerCase().includes(term)) {
          score += 3;
        }
      });
      
      return { ...resource, score };
    })
    .filter(resource => resource.score > 0)
    .sort((a, b) => b.score - a.score);
}

const typeColors = {
  'Article': 'bg-blue-900/30 text-blue-400 border-blue-700',
  'Video Course': 'bg-purple-900/30 text-purple-400 border-purple-700',
  'Professional Guide': 'bg-green-900/30 text-green-400 border-green-700',
  'Government Resource': 'bg-amber-900/30 text-amber-400 border-amber-700',
  'Academic Article': 'bg-indigo-900/30 text-indigo-400 border-indigo-700',
  'Professional Certification Material': 'bg-teal-900/30 text-teal-400 border-teal-700',
  'Academic Lecture': 'bg-rose-900/30 text-rose-400 border-rose-700'
};

function SearchResultCard({ resource }) {
  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-5 hover:border-nubia-accent/50 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <span className="text-xs font-medium text-nubia-accent bg-nubia-accent-subtle px-2 py-0.5 rounded">
          {resource.topic}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${typeColors[resource.type] || 'bg-gray-900/30 text-gray-400 border-gray-700'}`}>
          {resource.type}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="font-sans text-lg font-semibold text-nubia-text mb-2">{resource.title}</h3>
      
      {/* Description */}
      <p className="text-sm text-nubia-text-secondary mb-3">{resource.description}</p>
      
      {/* Formula if present */}
      {resource.formula && (
        <div className="bg-nubia-bg rounded-md p-3 mb-3 overflow-x-auto">
          <InlineMath math={resource.formula} />
        </div>
      )}
      
      {/* Source & Credibility */}
      <div className="border-t border-nubia-border pt-3 mt-3">
        <div className="flex items-start gap-2 mb-2">
          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-nubia-text">{resource.source}</p>
            <p className="text-xs text-nubia-text-muted">{resource.credibility}</p>
          </div>
        </div>
        
        {/* Link */}
        <a 
          href={resource.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-nubia-accent hover:text-nubia-accent-hover transition-colors mt-2"
        >
          <span>Visit Source</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  const results = useMemo(() => searchResources(query), [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputValue);
    setSearchParams(inputValue ? { q: inputValue } : {});
  };

  // Popular search suggestions
  const suggestions = [
    'Present Value',
    'NPV',
    'Compound Interest',
    'Bond Valuation',
    'CAPM',
    'Risk and Return',
    'WACC'
  ];

  return (
    <div className="py-8 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">Search Finance Resources</h1>
        </div>
        <p className="text-nubia-text-secondary">
          Find credible, peer-reviewed finance resources from trusted sources like Investopedia, CFA Institute, and government agencies.
        </p>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nubia-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for topics like 'present value', 'NPV', 'compound interest'..."
            className="w-full pl-12 pr-24 py-3 bg-nubia-surface border border-nubia-border rounded-lg text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none text-base"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Quick Search Suggestions */}
      {!query && (
        <div className="mb-8">
          <p className="text-sm text-nubia-text-muted mb-3">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  setInputValue(suggestion);
                  setQuery(suggestion);
                  setSearchParams({ q: suggestion });
                }}
                className="px-3 py-1.5 bg-nubia-surface border border-nubia-border rounded-full text-sm text-nubia-text-secondary hover:border-nubia-accent hover:text-nubia-accent transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-nubia-text-secondary">
              Found <span className="font-semibold text-nubia-text">{results.length}</span> {results.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
            {results.length > 0 && (
              <button
                onClick={() => {
                  setQuery('');
                  setInputValue('');
                  setSearchParams({});
                }}
                className="text-sm text-nubia-accent hover:text-nubia-accent-hover transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
          
          {results.length === 0 ? (
            <div className="text-center py-12 bg-nubia-surface border border-nubia-border rounded-lg">
              <svg className="w-16 h-16 text-nubia-text-muted mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-nubia-text font-medium mb-2">No results found</p>
              <p className="text-sm text-nubia-text-muted mb-4">Try different keywords or check the spelling</p>
              <div className="text-sm text-nubia-text-secondary">
                <p className="mb-2">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.slice(0, 4).map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setInputValue(s);
                        setQuery(s);
                        setSearchParams({ q: s });
                      }}
                      className="text-nubia-accent hover:underline"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(resource => (
                <SearchResultCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Info Section */}
      <div className="mt-8 p-5 bg-nubia-surface-alt border border-nubia-border rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h2 className="font-sans text-lg font-semibold text-nubia-text mb-2">Credible Sources Only</h2>
            <p className="text-sm text-nubia-text-secondary mb-3">
              All search results come from verified, credible sources including:
            </p>
            <ul className="text-sm text-nubia-text-secondary space-y-1">
              <li>• <strong>Investopedia</strong> - Peer-reviewed by certified financial planners</li>
              <li>• <strong>CFA Institute</strong> - Global standard for investment professionals</li>
              <li>• <strong>Corporate Finance Institute</strong> - Accredited financial certifications</li>
              <li>• <strong>Government Resources</strong> - SEC, Federal Reserve educational materials</li>
              <li>• <strong>Academic Institutions</strong> - Harvard Business School, Nobel Prize lectures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
