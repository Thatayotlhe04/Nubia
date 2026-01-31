import React, { useState } from 'react';

const resources = [
  {
    category: 'Textbooks & References',
    items: [
      {
        title: 'Introduction to Corporate Finance (Open Textbook)',
        description: 'Free, comprehensive open textbook covering corporate finance fundamentals - time value of money, capital budgeting, and more',
        type: 'Textbook',
        link: 'https://open.umn.edu/opentextbooks/textbooks/47'
      },
      {
        title: 'Principles of Finance (OpenStax)',
        description: 'Free peer-reviewed textbook covering financial management, markets, institutions, and investment analysis',
        type: 'Textbook',
        link: 'https://openstax.org/details/books/principles-finance'
      },
      {
        title: 'Corporate Finance Institute - Free Resources',
        description: 'Free learning materials on financial analysis, valuation, and corporate finance concepts',
        type: 'Reference',
        link: 'https://corporatefinanceinstitute.com/resources/'
      },
      {
        title: 'Damodaran Online - Valuation & Corporate Finance',
        description: 'Free course materials, datasets, and lecture notes from NYU Professor Aswath Damodaran',
        type: 'Textbook',
        link: 'https://pages.stern.nyu.edu/~adamodar/'
      },
      {
        title: 'Financial Accounting (Lumen Learning)',
        description: 'Free open educational resource covering accounting principles and financial statements',
        type: 'Textbook',
        link: 'https://courses.lumenlearning.com/wm-financialaccounting/'
      },
      {
        title: 'Introduction to Financial Analysis (Saylor Academy)',
        description: 'Free self-paced course with textbook materials on financial statement analysis',
        type: 'Textbook',
        link: 'https://learn.saylor.org/course/BUS103'
      }
    ]
  },
  {
    category: 'Online Learning Platforms',
    items: [
      {
        title: 'Khan Academy - Finance & Capital Markets',
        description: 'Free video lessons on finance fundamentals, stocks, bonds, and more',
        type: 'Video Lectures',
        link: 'https://www.khanacademy.org/economics-finance-domain/core-finance'
      },
      {
        title: 'Coursera - Financial Markets (Yale)',
        description: 'Free course by Professor Robert Shiller on financial markets',
        type: 'Online Course',
        link: 'https://www.coursera.org/learn/financial-markets-global'
      },
      {
        title: 'Investopedia',
        description: 'Comprehensive financial dictionary and educational articles',
        type: 'Reference',
        link: 'https://www.investopedia.com'
      }
    ]
  },
  {
    category: 'Financial Calculators',
    items: [
      {
        title: 'Calculator.net Financial Calculators',
        description: 'Collection of free financial calculators for various calculations',
        type: 'Tool',
        link: 'https://www.calculator.net/financial-calculator.html'
      },
      {
        title: 'Bankrate Financial Calculators',
        description: 'Mortgage, loan, and investment calculators',
        type: 'Tool',
        link: 'https://www.bankrate.com/calculators/'
      }
    ]
  },
  {
    category: 'Formula Sheets & Cheat Sheets',
    items: [
      {
        title: 'Time Value of Money Formula Sheet',
        description: 'Quick reference for PV, FV, annuity, and perpetuity formulas',
        type: 'PDF',
        internal: true
      },
      {
        title: 'NPV & IRR Decision Rules',
        description: 'Summary of capital budgeting decision criteria',
        type: 'PDF',
        internal: true
      },
      {
        title: 'Financial Ratios Cheat Sheet',
        description: 'Liquidity, profitability, and leverage ratios at a glance',
        type: 'PDF',
        internal: true
      }
    ]
  },
  {
    category: 'UB Specific Resources',
    items: [
      {
        title: 'UB Library Database Access',
        description: 'Access academic journals and research papers through UB Library',
        type: 'Database',
        link: 'https://library.ub.bw'
      },
      {
        title: 'Past Examination Papers',
        description: 'Previous years exam papers for finance courses',
        type: 'Archive',
        note: 'Available at the UB Library or Department'
      }
    ]
  },
  {
    category: 'Practice Problems',
    items: [
      {
        title: 'CFA Institute Learning Resources',
        description: 'Free study materials from CFA Institute',
        type: 'Practice',
        link: 'https://www.cfainstitute.org/en/programs/cfa/curriculum'
      },
      {
        title: 'Finance Practice Problems',
        description: 'Collection of practice problems with solutions',
        type: 'Practice',
        internal: true
      }
    ]
  }
];

const typeIcons = {
  'Textbook': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'Video Lectures': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  'Online Course': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'Reference': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  'Tool': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  'PDF': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'Database': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  'Archive': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  'Practice': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
};

function ResourceCard({ item }) {
  const icon = typeIcons[item.type] || typeIcons['Reference'];
  
  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-4 hover:border-nubia-accent/50 transition-colors group">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-nubia-accent-subtle rounded-lg flex items-center justify-center text-nubia-accent">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-sans text-sm font-medium text-nubia-text truncate">{item.title}</h4>
            <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-nubia-bg rounded text-nubia-text-muted">
              {item.type}
            </span>
          </div>
          <p className="text-xs text-nubia-text-secondary line-clamp-2 mb-2">{item.description}</p>
          
          {item.link && !item.internal && (
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-nubia-accent hover:text-nubia-accent-hover transition-colors"
            >
              <span>Visit Resource</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {item.internal && (
            <span className="inline-flex items-center gap-1 text-xs text-nubia-text-muted">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Coming soon</span>
            </span>
          )}
          
          {item.note && (
            <p className="text-xs text-nubia-text-muted italic">{item.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...resources.map(r => r.category)];

  const filteredResources = resources
    .map(category => ({
      ...category,
      items: category.items.filter(item => {
        const matchesSearch = searchQuery === '' || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || category.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    }))
    .filter(category => category.items.length > 0);

  return (
    <div className="py-8 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">Academic Resources</h1>
        </div>
        <p className="text-nubia-text-secondary">
          Curated collection of textbooks, online courses, calculators, and study materials to help you excel in your finance studies.
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nubia-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-nubia-surface border border-nubia-border rounded-lg text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-nubia-surface border border-nubia-border rounded-lg text-nubia-text focus:border-nubia-accent focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-nubia-text-muted mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-nubia-text-muted">No resources found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredResources.map(category => (
            <div key={category.category}>
              <h2 className="font-sans text-lg font-semibold text-nubia-text mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-nubia-accent"></span>
                {category.category}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {category.items.map((item, idx) => (
                  <ResourceCard key={idx} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Contribute Section */}
      <div className="mt-12 p-5 bg-nubia-surface-alt border border-nubia-border rounded-lg">
        <h2 className="font-sans text-lg font-semibold text-nubia-text mb-2">📚 Suggest a Resource</h2>
        <p className="text-sm text-nubia-text-secondary mb-3">
          Know of a great resource that should be on this list? We'd love to hear from you!
        </p>
        <a 
          href="mailto:getnubiafsc@gmail.com?subject=Resource Suggestion for Nubia"
          className="inline-flex items-center gap-2 px-4 py-2 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Email Suggestion</span>
        </a>
      </div>
    </div>
  );
}

export default Resources;
