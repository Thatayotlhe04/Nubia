import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import 'katex/dist/katex.min.css';

// Finance-focused curated resources (shown as "Nubia Picks")
const curatedResources = [
  {
    id: 'cur-1',
    title: 'Time Value of Money - Khan Academy',
    authors: 'Khan Academy',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial',
    abstract: 'Free video lectures explaining time value of money concepts with visual examples and practice problems.',
    category: 'Finance',
    isCurated: true
  },
  {
    id: 'cur-2',
    title: 'NPV and Capital Budgeting - MIT OpenCourseWare',
    authors: 'MIT OpenCourseWare',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/',
    abstract: 'MIT Finance Theory course covering NPV, IRR, capital budgeting, and investment decisions.',
    category: 'Finance',
    isCurated: true
  },
  {
    id: 'cur-3',
    title: 'CAPM and Asset Pricing - Investopedia',
    authors: 'Investopedia',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://www.investopedia.com/terms/c/capm.asp',
    abstract: 'Comprehensive guide to Capital Asset Pricing Model, beta, systematic risk, and expected returns.',
    category: 'Finance',
    isCurated: true
  },
  {
    id: 'cur-4',
    title: 'Corporate Finance Resources - Damodaran Online',
    authors: 'Aswath Damodaran (NYU Stern)',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://pages.stern.nyu.edu/~adamodar/',
    abstract: 'Free resources from the world-renowned valuation expert including spreadsheets, data, and lectures.',
    category: 'Finance',
    isCurated: true
  },
  {
    id: 'cur-5',
    title: 'Statistics 110: Probability - Harvard',
    authors: 'Joe Blitzstein (Harvard)',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://projects.iq.harvard.edu/stat110',
    abstract: 'Harvard\'s famous probability course with free lecture videos, notes, and practice problems.',
    category: 'Statistics',
    isCurated: true
  },
  {
    id: 'cur-6',
    title: 'Linear Algebra - Gilbert Strang (MIT)',
    authors: 'Gilbert Strang',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    abstract: 'The legendary MIT linear algebra course covering vectors, matrices, eigenvalues, and applications.',
    category: 'Mathematics',
    isCurated: true
  },
  {
    id: 'cur-7',
    title: 'International Taxation - IMF',
    authors: 'International Monetary Fund',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://www.imf.org/en/Topics/fiscal-policies/tax-policy',
    abstract: 'IMF resources on taxation policy, international tax frameworks, and fiscal policy design.',
    category: 'Finance',
    isCurated: true
  },
  {
    id: 'cur-8',
    title: 'Bond Valuation and Fixed Income - CFA Institute',
    authors: 'CFA Institute',
    year: 2024,
    source: 'Nubia Pick',
    url: 'https://www.cfainstitute.org/en/membership/professional-development/refresher-readings',
    abstract: 'Professional-grade materials on bond pricing, duration, yield curves, and fixed income analysis.',
    category: 'Finance',
    isCurated: true
  }
];

// Category colors
const categoryColors = {
  'Finance': 'bg-emerald-900/30 text-emerald-400 border-emerald-700',
  'Economics': 'bg-cyan-900/30 text-cyan-400 border-cyan-700',
  'Mathematics': 'bg-blue-900/30 text-blue-400 border-blue-700',
  'Statistics': 'bg-purple-900/30 text-purple-400 border-purple-700',
  'Physics': 'bg-orange-900/30 text-orange-400 border-orange-700',
  'Business': 'bg-amber-900/30 text-amber-400 border-amber-700',
  'Computer Science': 'bg-pink-900/30 text-pink-400 border-pink-700',
  'Medicine': 'bg-red-900/30 text-red-400 border-red-700',
  'General': 'bg-slate-800/50 text-slate-300 border-slate-600'
};

// Detect category from paper data
function detectCategory(paper) {
  const text = `${paper.title || ''} ${paper.abstract || ''} ${(paper.fieldsOfStudy || []).join(' ')}`.toLowerCase();
  
  if (text.includes('finance') || text.includes('investment') || text.includes('portfolio') || 
      text.includes('stock') || text.includes('bond') || text.includes('asset pricing') ||
      text.includes('capital') || text.includes('valuation') || text.includes('risk management') ||
      text.includes('banking') || text.includes('taxation') || text.includes('corporate') ||
      text.includes('equity') || text.includes('derivative') || text.includes('hedge')) {
    return 'Finance';
  }
  if (text.includes('economics') || text.includes('economic') || text.includes('market') || 
      text.includes('trade') || text.includes('gdp') || text.includes('monetary') ||
      text.includes('fiscal') || text.includes('macroeconomic') || text.includes('microeconomic') ||
      text.includes('inflation') || text.includes('unemployment')) {
    return 'Economics';
  }
  if (text.includes('statistic') || text.includes('probability') || text.includes('regression') ||
      text.includes('bayesian') || text.includes('inference') || text.includes('hypothesis') ||
      text.includes('variance') || text.includes('correlation')) {
    return 'Statistics';
  }
  if (text.includes('mathematic') || text.includes('calculus') || text.includes('algebra') ||
      text.includes('geometry') || text.includes('theorem') || text.includes('equation') ||
      text.includes('integral') || text.includes('differential')) {
    return 'Mathematics';
  }
  if (text.includes('physics') || text.includes('quantum') || text.includes('thermodynamic') ||
      text.includes('mechanics') || text.includes('electromagnetic') || text.includes('relativity')) {
    return 'Physics';
  }
  if (text.includes('computer') || text.includes('algorithm') || text.includes('machine learning') ||
      text.includes('artificial intelligence') || text.includes('programming') || text.includes('neural')) {
    return 'Computer Science';
  }
  if (text.includes('business') || text.includes('management') || text.includes('organization') ||
      text.includes('marketing') || text.includes('strategy')) {
    return 'Business';
  }
  if (text.includes('medical') || text.includes('clinical') || text.includes('disease') ||
      text.includes('patient') || text.includes('treatment') || text.includes('health')) {
    return 'Medicine';
  }
  return 'General';
}

// Semantic Scholar API search (free, no key needed)
async function searchSemanticScholar(query, offset = 0) {
  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&offset=${offset}&limit=15&fields=title,authors,year,abstract,url,citationCount,fieldsOfStudy,openAccessPdf`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    if (!response.ok) {
      console.warn('Semantic Scholar API returned:', response.status);
      return [];
    }
    const data = await response.json();
    return (data.data || []).map(paper => ({
      id: `ss-${paper.paperId}`,
      title: paper.title,
      authors: (paper.authors || []).slice(0, 4).map(a => a.name).join(', '),
      year: paper.year,
      source: 'Semantic Scholar',
      url: paper.openAccessPdf?.url || paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
      abstract: paper.abstract,
      citations: paper.citationCount,
      category: detectCategory(paper),
      fieldsOfStudy: paper.fieldsOfStudy,
      hasOpenAccess: !!paper.openAccessPdf
    }));
  } catch (error) {
    console.error('Semantic Scholar error:', error);
    return [];
  }
}

// OpenAlex API search (free, no key needed)
async function searchOpenAlex(query, page = 1) {
  try {
    const response = await fetch(
      `https://api.openalex.org/works?search=${encodeURIComponent(query)}&page=${page}&per-page=15&mailto=nubia@ub.ac.bw`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    if (!response.ok) {
      console.warn('OpenAlex API returned:', response.status);
      return [];
    }
    const data = await response.json();
    return (data.results || []).map(work => ({
      id: `oa-${work.id}`,
      title: work.title || work.display_name,
      authors: (work.authorships || []).slice(0, 4).map(a => a.author?.display_name).filter(Boolean).join(', '),
      year: work.publication_year,
      source: 'OpenAlex',
      url: work.open_access?.oa_url || (work.doi ? `https://doi.org/${work.doi}` : work.id),
      abstract: null, // OpenAlex doesn't return abstracts in search
      citations: work.cited_by_count,
      category: detectCategory({ title: work.title, abstract: '', fieldsOfStudy: (work.concepts || []).map(c => c.display_name) }),
      hasOpenAccess: work.open_access?.is_oa
    }));
  } catch (error) {
    console.error('OpenAlex error:', error);
    return [];
  }
}

// CrossRef API search (free, no key needed)
async function searchCrossRef(query, offset = 0) {
  try {
    const response = await fetch(
      `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=15&offset=${offset}&mailto=nubia@ub.ac.bw`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    if (!response.ok) {
      console.warn('CrossRef API returned:', response.status);
      return [];
    }
    const data = await response.json();
    return (data.message?.items || []).map(item => ({
      id: `cr-${item.DOI}`,
      title: Array.isArray(item.title) ? item.title[0] : item.title,
      authors: (item.author || []).slice(0, 4).map(a => `${a.given || ''} ${a.family || ''}`).join(', ').trim(),
      year: item.published?.['date-parts']?.[0]?.[0] || item.created?.['date-parts']?.[0]?.[0],
      source: 'CrossRef',
      url: item.URL || `https://doi.org/${item.DOI}`,
      abstract: item.abstract?.replace(/<[^>]*>/g, '').slice(0, 500) || null,
      citations: item['is-referenced-by-count'],
      category: detectCategory({ title: Array.isArray(item.title) ? item.title[0] : item.title, abstract: item.abstract || '', fieldsOfStudy: [] }),
      hasOpenAccess: item['is-oa']
    }));
  } catch (error) {
    console.error('CrossRef error:', error);
    return [];
  }
}

// Result Card Component
function ResultCard({ result }) {
  const colorClass = categoryColors[result.category] || categoryColors['General'];
  
  return (
    <div className="bg-nubia-surface border border-nubia-border rounded-lg p-5 hover:border-nubia-accent/50 transition-all group">
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${colorClass}`}>
          {result.category}
        </span>
        {result.isCurated && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-nubia-accent/20 text-nubia-accent border border-nubia-accent/50 inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Nubia Pick
          </span>
        )}
        {result.hasOpenAccess && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-700 inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
            Open Access
          </span>
        )}
        {result.year && (
          <span className="text-xs text-nubia-text-muted ml-auto">{result.year}</span>
        )}
      </div>
      
      <h3 className="font-sans text-base font-semibold text-nubia-text mb-2 line-clamp-2 group-hover:text-nubia-accent transition-colors">
        {result.title}
      </h3>
      
      {result.authors && (
        <p className="text-xs text-nubia-text-muted mb-2 line-clamp-1">{result.authors}</p>
      )}
      
      {result.abstract && (
        <p className="text-sm text-nubia-text-secondary mb-3 line-clamp-3">{result.abstract}</p>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-nubia-border">
        <div className="flex items-center gap-3 text-xs text-nubia-text-muted">
          <span className="flex items-center gap-1">
            {result.source === 'Semantic Scholar' && (
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            )}
            {result.source === 'OpenAlex' && (
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            )}
            {result.source === 'CrossRef' && (
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            )}
            {result.source === 'Nubia Pick' && (
              <span className="w-2 h-2 rounded-full bg-nubia-accent"></span>
            )}
            {result.source}
          </span>
          {result.citations !== undefined && result.citations > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {result.citations.toLocaleString()} cited
            </span>
          )}
        </div>
        
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-nubia-accent hover:text-nubia-accent-hover transition-colors font-medium"
        >
          <span>View</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-nubia-surface border border-nubia-border rounded-lg p-5 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-16 bg-nubia-surface-alt rounded"></div>
            <div className="h-5 w-20 bg-nubia-surface-alt rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-nubia-surface-alt rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-nubia-surface-alt rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-nubia-surface-alt rounded"></div>
            <div className="h-4 w-5/6 bg-nubia-surface-alt rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSource, setActiveSource] = useState('all');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [apiStatus, setApiStatus] = useState({ semantic: true, openalex: true, crossref: true });

  // Perform search across multiple APIs
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setApiStatus({ semantic: true, openalex: true, crossref: true });

    try {
      // Search all APIs in parallel for speed
      const [semanticResults, openAlexResults, crossRefResults] = await Promise.allSettled([
        searchSemanticScholar(searchQuery),
        searchOpenAlex(searchQuery),
        searchCrossRef(searchQuery)
      ]);

      // Extract results and track API status
      const semantic = semanticResults.status === 'fulfilled' ? semanticResults.value : [];
      const openalex = openAlexResults.status === 'fulfilled' ? openAlexResults.value : [];
      const crossref = crossRefResults.status === 'fulfilled' ? crossRefResults.value : [];

      setApiStatus({
        semantic: semantic.length > 0,
        openalex: openalex.length > 0,
        crossref: crossref.length > 0
      });

      // Combine all results
      const allResults = [...semantic, ...openalex, ...crossref];
      
      // Deduplicate by title similarity (fuzzy matching)
      const seen = new Map();
      const uniqueResults = allResults.filter(result => {
        if (!result.title) return false;
        const normalizedTitle = result.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
        if (seen.has(normalizedTitle)) return false;
        seen.set(normalizedTitle, true);
        return true;
      });

      // Sort by: citations (weighted) + recency + open access bonus
      uniqueResults.sort((a, b) => {
        const citationWeight = 0.7;
        const yearWeight = 0.2;
        const openAccessBonus = 5;
        
        const scoreA = (Math.log10((a.citations || 1) + 1) * citationWeight * 10) + 
                      ((a.year || 2000) - 2000) * yearWeight +
                      (a.hasOpenAccess ? openAccessBonus : 0);
        const scoreB = (Math.log10((b.citations || 1) + 1) * citationWeight * 10) + 
                      ((b.year || 2000) - 2000) * yearWeight +
                      (b.hasOpenAccess ? openAccessBonus : 0);
        return scoreB - scoreA;
      });

      // Find matching curated resources
      const queryLower = searchQuery.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
      
      const matchingCurated = curatedResources.filter(r => {
        const resourceText = `${r.title} ${r.abstract} ${r.category}`.toLowerCase();
        return queryWords.some(word => resourceText.includes(word));
      });

      // Put curated first if they match, then API results
      setResults([...matchingCurated, ...uniqueResults]);
      
    } catch (err) {
      setError('Search failed. Please try again or use the external search links below.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search when query changes (on submit)
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuery(inputValue.trim());
      setSearchParams({ q: inputValue.trim() });
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setInputValue('');
    setResults([]);
    setSearchPerformed(false);
    setSearchParams({});
  };

  // Filter results by source
  const filteredResults = activeSource === 'all' 
    ? results 
    : activeSource === 'curated'
    ? results.filter(r => r.isCurated)
    : results.filter(r => r.source.toLowerCase().includes(activeSource));

  // Finance-focused suggestions
  const suggestions = [
    'Time Value of Money',
    'CAPM Beta',
    'Portfolio Optimization',
    'Corporate Finance',
    'Taxation Policy',
    'Bond Valuation',
    'Risk Management',
    'Derivatives Pricing',
    'Behavioral Finance',
    'Financial Econometrics'
  ];

  return (
    <div className="py-8 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-nubia-text">Academic Search</h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-green-900/30 text-green-400 border border-green-700 rounded animate-pulse">
            Live API
          </span>
        </div>
        <p className="text-nubia-text-secondary text-sm md:text-base">
          Search <span className="text-nubia-accent font-semibold">200M+</span> academic papers in real-time.
          Finance-focused results from
          <span className="text-yellow-400 font-medium"> Semantic Scholar</span>, 
          <span className="text-blue-400 font-medium"> OpenAlex</span>, and 
          <span className="text-purple-400 font-medium"> CrossRef</span>.
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
            placeholder="Search anything: taxation, derivatives, econometrics, calculus, physics..."
            className="w-full pl-12 pr-28 py-4 bg-nubia-surface border border-nubia-border rounded-xl text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:ring-2 focus:ring-nubia-accent/20 focus:outline-none text-base transition-all"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-nubia-accent text-white rounded-lg hover:bg-nubia-accent-hover transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching</span>
              </span>
            ) : 'Search'}
          </button>
        </div>
      </form>

      {/* Suggestions - Only show when no search */}
      {!searchPerformed && (
        <div className="mb-8">
          <p className="text-sm text-nubia-text-muted mb-3 flex items-center gap-1.5"><svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 23c-4.97 0-9-4.03-9-9 0-4.03 2.86-8.18 6.14-10.97.68-.57 1.72-.15 1.82.73.27 2.47 1.37 4.13 2.89 5.34.23.18.56.03.61-.25.21-1.21.69-2.55 1.85-4.14.51-.71 1.58-.56 1.87.27C19.67 8.47 21 11.89 21 14c0 4.97-4.03 9-9 9z"/></svg>Popular finance topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 bg-nubia-surface border border-nubia-border rounded-full text-sm text-nubia-text-secondary hover:border-nubia-accent hover:text-nubia-accent hover:bg-nubia-accent/5 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* API Status indicators when searching */}
      {searchPerformed && !loading && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-xs text-nubia-text-muted">APIs:</span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${apiStatus.semantic ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className="text-xs text-nubia-text-muted">Semantic Scholar</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${apiStatus.openalex ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className="text-xs text-nubia-text-muted">OpenAlex</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${apiStatus.crossref ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className="text-xs text-nubia-text-muted">CrossRef</span>
          </div>
        </div>
      )}

      {/* Source Filter */}
      {searchPerformed && results.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-nubia-text-muted">Filter:</span>
          {[
            { key: 'all', label: 'All Sources' },
            { key: 'semantic', label: 'Semantic Scholar' },
            { key: 'openalex', label: 'OpenAlex' },
            { key: 'crossref', label: 'CrossRef' },
            { key: 'curated', label: 'Nubia Picks' }
          ].map(source => (
            <button
              key={source.key}
              onClick={() => setActiveSource(source.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeSource === source.key
                  ? 'bg-nubia-accent text-white'
                  : 'bg-nubia-surface border border-nubia-border text-nubia-text-secondary hover:border-nubia-accent'
              }`}
            >
              {source.label}
            </button>
          ))}
        </div>
      )}

      {/* Results Count and Clear */}
      {searchPerformed && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-nubia-text-secondary">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-nubia-accent" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching academic databases...
              </span>
            ) : (
              <>
                Found <span className="font-bold text-nubia-text">{filteredResults.length}</span> results for "<span className="text-nubia-accent">{query}</span>"
              </>
            )}
          </p>
          {query && !loading && (
            <button
              onClick={clearSearch}
              className="text-sm text-nubia-text-muted hover:text-nubia-accent transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400 mb-3">{error}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-yellow-900/20 text-yellow-400 border border-yellow-700 rounded text-xs hover:bg-yellow-900/40 transition-colors"
            >
              Try Google Scholar →
            </a>
            <a
              href={`https://www.jstor.org/action/doBasicSearch?Query=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-700 rounded text-xs hover:bg-red-900/40 transition-colors"
            >
              Try JSTOR →
            </a>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Results */}
      {!loading && searchPerformed && (
        <>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 bg-nubia-surface border border-nubia-border rounded-xl">
              <svg className="w-16 h-16 text-nubia-text-muted mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-nubia-text font-semibold text-lg mb-2">No results found</p>
              <p className="text-sm text-nubia-text-muted mb-6">Try different keywords or search directly on these platforms:</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-yellow-900/20 text-yellow-400 border border-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-900/40 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                  Google Scholar
                </a>
                <a
                  href={`https://www.jstor.org/action/doBasicSearch?Query=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-red-900/20 text-red-400 border border-red-700 rounded-lg text-sm font-medium hover:bg-red-900/40 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  JSTOR
                </a>
                <a
                  href={`https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-orange-900/20 text-orange-400 border border-orange-700 rounded-lg text-sm font-medium hover:bg-orange-900/40 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  arXiv
                </a>
                <a
                  href={`https://papers.ssrn.com/sol3/results.cfm?txtKey_Words=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-blue-900/20 text-blue-400 border border-blue-700 rounded-lg text-sm font-medium hover:bg-blue-900/40 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  SSRN
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResults.map(result => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>

              {/* More search options after results */}
              <div className="mt-8 p-5 bg-nubia-surface-alt border border-nubia-border rounded-xl">
                <h3 className="font-sans text-base font-semibold text-nubia-text mb-3 flex items-center gap-2"><svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>Want more results?</h3>
                <p className="text-sm text-nubia-text-secondary mb-4">Search directly on these academic databases:</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-yellow-900/20 text-yellow-400 border border-yellow-700 rounded text-xs hover:bg-yellow-900/40 transition-colors"
                  >
                    Google Scholar →
                  </a>
                  <a
                    href={`https://www.jstor.org/action/doBasicSearch?Query=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-700 rounded text-xs hover:bg-red-900/40 transition-colors"
                  >
                    JSTOR →
                  </a>
                  <a
                    href={`https://www.worldbank.org/en/search?q=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-cyan-900/20 text-cyan-400 border border-cyan-700 rounded text-xs hover:bg-cyan-900/40 transition-colors"
                  >
                    World Bank →
                  </a>
                  <a
                    href={`https://www.imf.org/en/Search#q=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-900/20 text-blue-400 border border-blue-700 rounded text-xs hover:bg-blue-900/40 transition-colors"
                  >
                    IMF →
                  </a>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Welcome state when no search */}
      {!searchPerformed && (
        <div className="mt-8">
          <h2 className="font-sans text-lg font-semibold text-nubia-text mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-nubia-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Nubia Picks - Hand-Curated Resources
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {curatedResources.map(result => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
          
          {/* How it works */}
          <div className="mt-8 p-5 bg-gradient-to-br from-nubia-surface to-nubia-surface-alt border border-nubia-border rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-nubia-accent/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-sans text-lg font-bold text-nubia-text mb-3">How Dynamic Search Works</h3>
                <ul className="text-sm text-nubia-text-secondary space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    <span><strong className="text-nubia-text">Real-time search</strong> across 200M+ academic papers from 3 APIs simultaneously</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    <span><strong className="text-nubia-text">Finance-focused</strong> - results are optimized for finance, economics, and business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    <span>Look for <span className="text-green-400 font-medium">Open Access</span> badges for free full-text PDFs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    <span>Results sorted by <strong className="text-nubia-text">citations + recency</strong> for quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-nubia-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span><strong className="text-nubia-accent">Nubia Picks</strong> are hand-curated by UB students for maximum relevance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
