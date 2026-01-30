import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

// Nubia Logo Component - Pulse/Heartbeat style
export function NubiaLogo({ className = "w-8 h-8" }) {
  return (
    <svg 
      viewBox="0 0 40 24" 
      fill="none" 
      className={className}
      aria-label="Nubia logo"
    >
      {/* Pulse line */}
      <path 
        d="M2 12H8L11 6L15 18L19 8L23 14L26 12H38" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      {/* Small accent dot */}
      <circle cx="15" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, children }) {
  return (
    <div className="nubia-card p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-nubia-surface-alt flex items-center justify-center text-nubia-accent">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sans text-base font-medium text-nubia-text mb-2">{title}</h3>
          <div className="font-serif text-sm text-nubia-text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Component
function Section({ id, title, children, className = "" }) {
  return (
    <section id={id} className={`mb-12 md:mb-16 ${className}`}>
      <h2 className="nubia-heading-3 mb-4 md:mb-6">{title}</h2>
      {children}
    </section>
  );
}

// Review Card Component
function ReviewCard({ name, course, text, date }) {
  return (
    <div className="nubia-card p-4 md:p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-nubia-accent flex items-center justify-center flex-shrink-0">
          <span className="font-sans text-sm font-semibold text-white">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-sans text-sm font-medium text-nubia-text truncate">{name}</h4>
            <span className="font-sans text-xs text-nubia-text-faint flex-shrink-0">{date}</span>
          </div>
          <p className="font-sans text-xs text-nubia-text-muted mb-2">{course}</p>
          <p className="font-serif text-sm text-nubia-text-secondary leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

// Default topics when backend is unavailable
const defaultTopics = [
  { id: 'time-value-of-money', title: 'Time Value of Money', description: 'Understanding present value, future value, and the fundamental principle that money today is worth more than the same amount in the future.', category: 'core-concepts' },
  { id: 'compound-interest', title: 'Compound Interest', description: 'Learn how interest accumulates on both principal and previously earned interest over time.', category: 'core-concepts' },
  { id: 'present-value', title: 'Present Value', description: 'Calculate the current worth of future cash flows discounted at an appropriate rate.', category: 'core-concepts' },
  { id: 'future-value', title: 'Future Value', description: 'Determine the value of current assets at a specified date in the future based on an assumed growth rate.', category: 'core-concepts' },
  { id: 'annuities', title: 'Annuities', description: 'Analyze series of equal payments made at regular intervals, including ordinary annuities and annuities due.', category: 'core-concepts' },
  { id: 'perpetuities', title: 'Perpetuities', description: 'Value infinite streams of equal periodic payments.', category: 'core-concepts' },
  { id: 'net-present-value', title: 'Net Present Value (NPV)', description: 'Evaluate investment opportunities by calculating the difference between present value of cash inflows and outflows.', category: 'capital-budgeting' },
  { id: 'internal-rate-of-return', title: 'Internal Rate of Return (IRR)', description: 'Find the discount rate that makes the NPV of an investment equal to zero.', category: 'capital-budgeting' },
  { id: 'bond-valuation', title: 'Bond Valuation', description: 'Calculate the fair price of bonds using present value of future coupon payments and face value.', category: 'fixed-income' },
  { id: 'stock-valuation', title: 'Stock Valuation', description: 'Value equity securities using dividend discount models and other approaches.', category: 'equity' },
  { id: 'capm', title: 'Capital Asset Pricing Model (CAPM)', description: 'Understand the relationship between systematic risk and expected return for assets.', category: 'risk-return' },
  { id: 'portfolio-theory', title: 'Portfolio Theory', description: 'Learn how to construct optimal portfolios that maximize return for a given level of risk.', category: 'risk-return' },
];

function Home() {
  const { topics: backendTopics } = useOutletContext();
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [topicsExpanded, setTopicsExpanded] = useState(false);

  // Use backend topics if available, otherwise use defaults
  const topics = (backendTopics && backendTopics.length > 0) ? backendTopics : defaultTopics;

  // Load user reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('nubia-reviews');
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews);
        setReviews(parsed);
      } catch (e) {
        console.error('Error loading reviews:', e);
      }
    }
  }, []);

  // Group topics by category
  const groupedTopics = (topics || []).reduce((acc, topic) => {
    const category = topic.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(topic);
    return acc;
  }, {});

  const formatCategory = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      const newReview = {
        id: Date.now(),
        name: 'Anonymous',
        course: 'UB Student',
        text: reviewText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      // Save to localStorage
      localStorage.setItem('nubia-reviews', JSON.stringify(updatedReviews));
      setReviewText('');
      setSubmitStatus('Thank you for your feedback!');
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <header className="mb-12 md:mb-16">
        <div className="flex items-center gap-3 mb-4">
          <NubiaLogo className="w-12 h-8 md:w-14 md:h-9 text-nubia-accent" />
          <h1 className="nubia-heading-1 text-3xl md:text-4xl">
            Nubia
          </h1>
        </div>
        <p className="nubia-body text-base md:text-lg text-nubia-text-secondary leading-relaxed">
          A self-contained finance study environment designed for Batswana university students. 
          Nubia brings together core concepts, verified formulas, interactive calculators, and 
          curated academic resources in one structured workspace, so you can focus on learning 
          instead of searching.
        </p>
      </header>

      {/* Section 1: A Complete Study Environment */}
      <Section id="study-environment" title="A Complete Study Environment">
        <div className="nubia-prose mb-6">
          <p>
            Nubia centralizes everything you need to master finance coursework at the University of Botswana. 
            Rather than piecing together resources from scattered websites, you can access all essential 
            study materials from a single, reliable platform.
          </p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <FeatureCard 
            title="Topic Explanations"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          >
            Core concepts written in clear academic language, aligned with your course syllabus.
          </FeatureCard>
          
          <FeatureCard 
            title="Verified Formulas"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          >
            Mathematical expressions with complete variable definitions and usage context.
          </FeatureCard>
          
          <FeatureCard 
            title="Interactive Calculators"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            }
          >
            Hands-on tools for practicing calculations and checking your own work.
          </FeatureCard>
          
          <FeatureCard 
            title="Worked Examples"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          >
            Step-by-step solutions using scenarios relevant to Botswana and local coursework.
          </FeatureCard>
          
          <FeatureCard 
            title="Academic Resources"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          >
            Curated links to trusted textbooks, lecture materials, and supplementary readings.
          </FeatureCard>
          
          <FeatureCard 
            title="Personal Uploads"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
          >
            Attach your own notes and materials to topics for a personal study archive.
          </FeatureCard>
        </div>
        
        <p className="nubia-caption text-nubia-text-muted">
          By consolidating these elements, Nubia reduces the need to jump between random websites 
          and helps you maintain focus during study sessions.
        </p>
      </Section>

      {/* Section 2: Integrated Academic Resources */}
      <Section id="resources" title="Integrated Academic Resources">
        <div className="nubia-prose">
          <p>
            Each topic in Nubia includes a Resources section linking to trusted external materials. 
            These resources are selected based on academic credibility and relevance to your examinations.
          </p>
          
          <div className="mt-6 p-4 md:p-5 bg-nubia-surface-alt rounded-lg border border-nubia-border-subtle">
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-3">What you will find:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Textbook chapters from established finance publishers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Lecture notes and course materials from academic institutions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Supplementary PDFs and video explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-nubia-accent mt-0.5">—</span>
                <span>Past examination resources where available</span>
              </li>
            </ul>
          </div>
          
          <p className="mt-6">
            All external links open in a new tab, keeping Nubia as your central workspace. 
            Resources are organized by topic, so you always know where to find deeper reading 
            for the concept you are studying.
          </p>
          
          <p className="mt-4 text-nubia-text-muted text-sm">
            Quality, relevance, and exam alignment take priority over volume. Nubia links only 
            to materials that add genuine value to your preparation.
          </p>
        </div>
      </Section>

      {/* Section 3: Built-In Resource Search */}
      <Section id="search" title="Built-In Resource Search">
        <div className="nubia-prose">
          <p>
            Nubia includes a straightforward search feature that helps you discover topic-specific 
            academic resources without leaving the platform.
          </p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-nubia-surface rounded-lg border border-nubia-border">
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-2">How it works</h4>
              <p className="text-sm text-nubia-text-secondary">
                Enter a topic or concept, and Nubia returns curated results filtered by academic 
                relevance. Results link to verified materials rather than general web pages.
              </p>
            </div>
            <div className="p-4 bg-nubia-surface rounded-lg border border-nubia-border">
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-2">Limitations</h4>
              <p className="text-sm text-nubia-text-secondary">
                Search results are limited to curated academic resources. This is intentional to 
                maintain quality and relevance for your studies.
              </p>
            </div>
          </div>
          
          <p className="mt-6">
            This approach ensures you receive consistent, academically sound results instead of 
            the variable quality found in open web searches.
          </p>
        </div>
      </Section>

      {/* Section 4: Personal Study Uploads */}
      <Section id="uploads" title="Personal Study Uploads">
        <div className="nubia-prose">
          <p>
            Nubia allows you to upload your own study materials and attach them to specific topics. 
            This transforms the platform into a personal academic archive that grows alongside your coursework.
          </p>
          
          <div className="mt-6 p-4 md:p-5 bg-nubia-surface-alt rounded-lg border border-nubia-border-subtle">
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-3">You can upload:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Notes</span>
              </div>
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>PDFs</span>
              </div>
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Images</span>
              </div>
              <div className="flex items-center gap-2 text-nubia-text-secondary">
                <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Videos</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 border-l-2 border-nubia-accent bg-nubia-surface">
            <p className="text-sm text-nubia-text-secondary">
              <strong className="text-nubia-text">Privacy note:</strong> Your uploaded content is private by default. 
              Nubia is not a social platform or content-sharing network. The purpose is personal organization 
              and learning continuity, not public visibility.
            </p>
          </div>
          
          <p className="mt-6">
            By keeping your materials attached to relevant topics, you build a structured study system 
            that remains useful across semesters and exam periods.
          </p>
        </div>
      </Section>

      {/* Section 5: Why Nubia Avoids Random Web Searching */}
      <Section id="structured-learning" title="Why Nubia Avoids Random Web Searching">
        <div className="nubia-prose">
          <p>
            Open web searches for finance concepts often return inconsistent, outdated, or 
            incorrectly explained material. Students waste time evaluating sources instead of learning.
          </p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-nubia-surface-alt flex items-center justify-center">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-1">Correctness</h4>
              <p className="text-xs text-nubia-text-secondary">Verified formulas and explanations you can trust</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-nubia-surface-alt flex items-center justify-center">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-1">Structure</h4>
              <p className="text-xs text-nubia-text-secondary">Organized by topic for logical study flow</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-nubia-surface-alt flex items-center justify-center">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-sans text-sm font-semibold text-nubia-text mb-1">Relevance</h4>
              <p className="text-xs text-nubia-text-secondary">Aligned with UB finance curriculum</p>
            </div>
          </div>
          
          <p className="mt-6">
            Nubia prioritizes academic integrity and time efficiency. By staying within one system, 
            you reduce confusion and maintain consistent study momentum.
          </p>
        </div>
      </Section>

      {/* Section 6: Feedback and Continuous Improvement */}
      <Section id="feedback" title="Feedback and Continuous Improvement">
        <div className="nubia-prose">
          <p>
            Nubia improves through student feedback. If you encounter issues or have suggestions, 
            your input helps refine the platform for all users.
          </p>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-nubia-surface rounded-lg border border-nubia-border">
              <svg className="w-5 h-5 text-nubia-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-sans text-sm font-semibold text-nubia-text">Report incorrect content</h4>
                <p className="text-sm text-nubia-text-secondary">Flag errors in formulas, explanations, or calculations</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-nubia-surface rounded-lg border border-nubia-border">
              <svg className="w-5 h-5 text-nubia-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div>
                <h4 className="font-sans text-sm font-semibold text-nubia-text">Report broken links</h4>
                <p className="text-sm text-nubia-text-secondary">Let us know when external resources become unavailable</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-nubia-surface rounded-lg border border-nubia-border">
              <svg className="w-5 h-5 text-nubia-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <h4 className="font-sans text-sm font-semibold text-nubia-text">Suggest resources</h4>
                <p className="text-sm text-nubia-text-secondary">Recommend high-quality academic materials for inclusion</p>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-nubia-text-muted text-sm">
            Use the feedback form available on each topic page to submit your observations. 
            Constructive feedback contributes to gradual, meaningful improvements.
          </p>
        </div>
      </Section>

      {/* Topic listing - Collapsible */}
      <Section id="topics" title="Available Topics">
        <div>
          <button
            onClick={() => setTopicsExpanded(!topicsExpanded)}
            className="flex items-center gap-2 text-nubia-accent hover:text-nubia-accent/80 transition-colors mb-4"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${topicsExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-sans text-sm font-medium">
              {topicsExpanded ? 'Hide Topics' : `Show ${topics.length} Available Topics`}
            </span>
          </button>
          
          {topicsExpanded && (
            Object.keys(groupedTopics).length === 0 ? (
              <div className="py-12 text-center">
                <p className="nubia-caption">Loading topics...</p>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                {Object.entries(groupedTopics).map(([category, categoryTopics]) => (
                  <div key={category}>
                    <h3 className="font-sans text-sm font-semibold text-nubia-text-muted uppercase tracking-wider mb-4">
                      {formatCategory(category)}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {categoryTopics.map(topic => (
                        <Link
                          key={topic.id}
                          to={`/topic/${topic.id}`}
                          className="group nubia-card p-5 hover:border-nubia-border-strong transition-colors"
                        >
                          <h4 className="font-sans text-base font-medium text-nubia-text group-hover:text-nubia-accent transition-colors">
                            {topic.title}
                          </h4>
                          <p className="mt-2 font-serif text-sm text-nubia-text-secondary line-clamp-2">
                            {topic.description}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 font-sans text-sm text-nubia-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            Study topic
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </Section>

      {/* Student Reviews Section */}
      <Section id="reviews" title="Student Reviews">
        <div>
          <p className="nubia-prose mb-6">
            Read what fellow students have to say about their experience with Nubia, 
            or share your own feedback to help improve the platform.
          </p>
          
          {/* Review Form */}
          <div className="nubia-card p-4 md:p-5 mb-6">
            <h4 className="font-sans text-sm font-semibold text-nubia-text mb-3">Share Your Experience</h4>
            <p className="font-sans text-xs text-nubia-text-muted mb-4">Your feedback is anonymous and helps improve Nubia for all students.</p>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share how Nubia has helped your studies..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-nubia-border rounded-lg bg-nubia-surface focus:outline-none focus:ring-1 focus:ring-nubia-accent resize-none"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 font-sans text-sm font-medium text-white bg-nubia-accent rounded-lg hover:bg-nubia-accent-hover transition-colors"
                >
                  Submit Anonymously
                </button>
                {submitStatus && (
                  <span className="font-sans text-sm text-green-600">{submitStatus}</span>
                )}
              </div>
            </form>
          </div>
          
          {/* Reviews List - Horizontal Scroll */}
          {reviews.length === 0 ? (
            <div className="nubia-card p-6 text-center">
              <p className="font-sans text-sm text-nubia-text-muted">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                {reviews.map(review => (
                  <div key={review.id} className="w-72 flex-shrink-0">
                    <ReviewCard {...review} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* About Section */}
      <Section id="about" title="About Nubia">
        <div className="nubia-prose">
          <div className="nubia-card p-5 md:p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-nubia-accent flex items-center justify-center">
                  <span className="font-sans text-2xl font-bold text-white">TT</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-sans text-lg font-semibold text-nubia-text mb-2">
                  Thatayotlhe Tsenang
                </h3>
                <p className="font-sans text-sm text-nubia-text-muted mb-4">
                  Creator and Developer
                </p>
                <p className="text-sm text-nubia-text-secondary leading-relaxed mb-4">
                  Nubia was created by Thatayotlhe Tsenang, a 21-year-old student at the University of Botswana. 
                  With a passion for both web development and financial engineering, Thatayotlhe built Nubia to 
                  address a real need: providing Batswana finance students with a reliable, structured, and 
                  locally relevant study companion.
                </p>
                <p className="text-sm text-nubia-text-secondary leading-relaxed mb-4">
                  The platform combines technical expertise in modern web technologies with a deep understanding 
                  of the challenges finance students face when preparing for coursework and examinations. 
                  Nubia represents the intersection of these skills: clean, functional design meets rigorous 
                  academic content.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-sans bg-nubia-surface-alt text-nubia-text-secondary rounded">
                    Web Development
                  </span>
                  <span className="px-2 py-1 text-xs font-sans bg-nubia-surface-alt text-nubia-text-secondary rounded">
                    Financial Engineering
                  </span>
                  <span className="px-2 py-1 text-xs font-sans bg-nubia-surface-alt text-nubia-text-secondary rounded">
                    University of Botswana
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 border-l-2 border-nubia-accent bg-nubia-surface">
            <p className="text-sm text-nubia-text-secondary italic">
              "I built Nubia because I wanted something I could rely on during my own studies. 
              If it helps even one other student understand finance concepts better, then the 
              effort was worth it."
            </p>
            <p className="mt-2 font-sans text-xs text-nubia-text-muted">— Thatayotlhe Tsenang</p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-nubia-border">
        <div className="space-y-6">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <NubiaLogo className="w-10 h-6 text-nubia-accent" />
              <div>
                <span className="font-sans text-sm font-medium text-nubia-text">Nubia</span>
                <p className="font-sans text-xs text-nubia-text-muted">Finance Study Companion</p>
              </div>
            </div>
            
            {/* Contact */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <a 
                href="mailto:tsenangthatayotlhe04@gmail.com"
                className="flex items-center gap-2 text-nubia-text-secondary hover:text-nubia-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>tsenangthatayotlhe04@gmail.com</span>
              </a>
              <a 
                href="tel:+26777625997"
                className="flex items-center gap-2 text-nubia-text-secondary hover:text-nubia-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+267 77 625 997</span>
              </a>
            </div>
          </div>
          
          {/* Disclaimer */}
          <p className="nubia-caption text-center md:text-left">
            Designed for University of Botswana students. 
            Verify calculations and consult professionals for financial decisions.
          </p>
          
          {/* Copyright */}
          <div className="pt-4 border-t border-nubia-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-sans text-xs text-nubia-text-muted">
              © {currentYear} Nubia. All rights reserved.
            </p>
            <p className="font-sans text-xs text-nubia-text-faint">
              Created by Thatayotlhe Tsenang
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
