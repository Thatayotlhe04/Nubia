import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudyInsightsCard from '../components/insights/StudyInsightsCard';

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

// Stacking Feature Cards Component
function StackingFeatureCards({ features }) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Card color palette - warm, vibrant colors with dark mode support
  const cardColors = [
    { bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900', border: 'border-amber-200 dark:border-amber-800', icon: 'bg-amber-500 text-white', textColor: 'text-gray-800 dark:text-amber-100' },
    { bg: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900', border: 'border-rose-200 dark:border-rose-800', icon: 'bg-rose-500 text-white', textColor: 'text-gray-800 dark:text-rose-100' },
    { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900', border: 'border-emerald-200 dark:border-emerald-800', icon: 'bg-emerald-500 text-white', textColor: 'text-gray-800 dark:text-emerald-100' },
    { bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900', border: 'border-orange-200 dark:border-orange-800', icon: 'bg-orange-500 text-white', textColor: 'text-gray-800 dark:text-orange-100' },
    { bg: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900', border: 'border-teal-200 dark:border-teal-800', icon: 'bg-teal-500 text-white', textColor: 'text-gray-800 dark:text-teal-100' },
    { bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900', border: 'border-purple-200 dark:border-purple-800', icon: 'bg-purple-500 text-white', textColor: 'text-gray-800 dark:text-purple-100' },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const containerTop = rect.top;
      const containerHeight = rect.height;
      
      const scrollStart = windowHeight * 0.7;
      const scrollEnd = -containerHeight + windowHeight * 0.3;
      
      if (containerTop <= scrollStart && containerTop >= scrollEnd) {
        const progress = (scrollStart - containerTop) / (scrollStart - scrollEnd);
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      } else if (containerTop > scrollStart) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Desktop: render as grid
  if (!isMobile) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {features.map((feature, index) => {
          const colors = cardColors[index % cardColors.length];
          return (
            <div 
              key={index} 
              className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 md:p-7 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex flex-col gap-4">
                <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center shadow-sm`}>
                  <div className="scale-125">{feature.icon}</div>
                </div>
                <div>
                  <h3 className={`font-sans text-lg font-bold ${colors.textColor} mb-2`}>
                    {feature.title}
                  </h3>
                  <p className="font-serif text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Mobile: stacking cards animation
  const cardCount = features.length;
  const progressPerCard = 1 / cardCount;

  return (
    <div 
      ref={containerRef}
      className="relative mb-6"
      style={{ height: `${cardCount * 160 + 250}px` }}
    >
      <div className="sticky top-20" style={{ height: '300px' }}>
        {features.map((feature, index) => {
          const colors = cardColors[index % cardColors.length];
          
          const cardStart = index * progressPerCard;
          const cardEnd = (index + 1) * progressPerCard;
          const rawProgress = (scrollProgress - cardStart) / progressPerCard;
          const cardProgress = Math.max(0, Math.min(1, rawProgress));
          
          const isActive = scrollProgress >= cardStart && scrollProgress < cardEnd;
          const isPast = scrollProgress >= cardEnd;
          const isFuture = scrollProgress < cardStart;
          
          const easeOut = (t) => 1 - Math.pow(1 - t, 3);
          const easedProgress = easeOut(cardProgress);
          
          let translateY = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = cardCount - index;
          let blur = 0;

          if (isFuture) {
            const futureIndex = index - Math.floor(scrollProgress / progressPerCard);
            translateY = 60 + (futureIndex * 8);
            scale = 0.95;
            opacity = 0.4;
            blur = 1;
          } else if (isActive) {
            translateY = (1 - easedProgress) * 50;
            scale = 0.95 + (easedProgress * 0.05);
            opacity = 0.6 + (easedProgress * 0.4);
            zIndex = cardCount + 10;
            blur = (1 - easedProgress) * 1;
          } else if (isPast) {
            const stackIndex = Math.floor(scrollProgress / progressPerCard) - index - 1;
            translateY = -(stackIndex + 1) * 4;
            scale = 1 - ((stackIndex + 1) * 0.02);
            opacity = 1 - ((stackIndex + 1) * 0.08);
            zIndex = cardCount - stackIndex;
          }

          return (
            <div
              key={index}
              className="absolute inset-x-2 will-change-transform"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: Math.max(0.6, Math.min(1, opacity)),
                zIndex,
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
                transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, filter 0.15s ease-out',
              }}
            >
              <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 shadow-xl`}>
                <div className="flex flex-col gap-4">
                  <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center shadow-sm`}>
                    <div className="scale-125">{feature.icon}</div>
                  </div>
                  <div>
                    <h3 className={`font-sans text-lg font-bold ${colors.textColor} mb-2`}>
                      {feature.title}
                    </h3>
                    <p className="font-serif text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {features.map((_, index) => {
          const cardStart = index * progressPerCard;
          const isActive = scrollProgress >= cardStart && scrollProgress < (index + 1) * progressPerCard;
          const isPast = scrollProgress >= (index + 1) * progressPerCard;
          
          return (
            <div
              key={index}
              className={`rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-2 h-2 bg-orange-500 shadow-sm' 
                  : isPast 
                    ? 'w-1.5 h-1.5 bg-orange-500/50' 
                    : 'w-1.5 h-1.5 bg-nubia-border'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const features = [
    {
      title: "Topic Explanations",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: "Core concepts written in clear academic language, aligned with your course syllabus."
    },
    {
      title: "Verified Formulas",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      description: "Mathematical expressions with complete variable definitions and usage context."
    },
    {
      title: "Interactive Calculators",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      description: "Hands-on tools for practicing calculations and checking your own work."
    },
    {
      title: "Worked Examples",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      description: "Step-by-step solutions using scenarios relevant to Botswana and local coursework."
    },
    {
      title: "Academic Resources",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      description: "Curated links to trusted textbooks, lecture materials, and supplementary readings."
    },
    {
      title: "Personal Uploads",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      description: "Attach your own notes and materials to topics for a personal study archive."
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Warm gradient background accent */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 via-amber-200/20 to-transparent dark:from-orange-900/20 dark:via-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-br from-rose-200/20 via-pink-200/10 to-transparent dark:from-rose-900/10 dark:via-pink-900/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <header className="mb-10 md:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 rounded-xl">
            <NubiaLogo className="w-12 h-8 md:w-14 md:h-9" />
          </div>
          <div>
            <h1 className="font-sans text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
              Nubia
            </h1>
            <p className="font-sans text-sm text-orange-600 dark:text-orange-400 font-medium">Finance Study Companion</p>
          </div>
        </div>
        <p className="nubia-body text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
          A self-contained finance study environment designed for Batswana university students. 
          Nubia brings together core concepts, verified formulas, interactive calculators, and 
          curated academic resources in one structured workspace.
        </p>
      </header>

      {/* Study Insights Card - Today's Progress */}
      <section className="mb-10 md:mb-12">
        <StudyInsightsCard />
      </section>

      {/* Search Section */}
      <section className="mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950 rounded-2xl p-6 md:p-8 border border-orange-200/50 dark:border-orange-800/50">
          <h2 className="font-sans text-lg font-semibold text-gray-800 dark:text-orange-100 mb-2">Search Finance Topics</h2>
          <p className="font-sans text-sm text-gray-600 dark:text-orange-200/70 mb-4">
            Find topic explanations, formulas, calculators, and academic resources.
          </p>
          <form onSubmit={handleSearch} className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for topics like 'Time Value of Money', 'NPV', 'Bond Pricing'..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800 rounded-xl text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-400 dark:focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* What Nubia Offers */}
      <section className="mb-12 md:mb-16">
        <h2 className="nubia-heading-3 mb-6">What Nubia Offers</h2>
        <p className="nubia-prose mb-8">
          Nubia centralizes everything you need to master finance coursework at the university level. 
          Rather than piecing together resources from scattered websites, access all essential 
          study materials from a single, reliable platform.
        </p>
        
        <StackingFeatureCards features={features} />
        
        <p className="nubia-caption text-nubia-text-muted">
          By consolidating these elements, Nubia reduces the need to jump between random websites 
          and helps you maintain focus during study sessions.
        </p>
      </section>

      {/* Quick Links */}
      <section className="mb-12">
        <h2 className="font-sans text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/overview" 
            className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-200/50 dark:border-amber-800/50 rounded-xl p-4 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md hover:scale-[1.02] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-sans text-sm font-semibold text-gray-800 dark:text-gray-100">Overview</h3>
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">Platform features</p>
          </Link>

          <Link 
            to="/overview#reviews" 
            className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50 border border-rose-200/50 dark:border-rose-800/50 rounded-xl p-4 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md hover:scale-[1.02] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-sans text-sm font-semibold text-gray-800 dark:text-gray-100">Reviews</h3>
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">Student feedback</p>
          </Link>

          <Link 
            to="/overview#about" 
            className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md hover:scale-[1.02] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-sans text-sm font-semibold text-gray-800 dark:text-gray-100">About</h3>
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">About Nubia</p>
          </Link>

          <Link 
            to="/summarizer" 
            className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border border-purple-200/50 dark:border-purple-800/50 rounded-xl p-4 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md hover:scale-[1.02] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-sans text-sm font-semibold text-gray-800 dark:text-gray-100">PDF Summarizer</h3>
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">AI-powered tool</p>
          </Link>
        </div>
      </section>

      {/* Footer note */}
      <footer className="text-center py-8 border-t border-nubia-border-subtle">
        <div className="flex items-center justify-center gap-2 mb-2">
          <NubiaLogo className="w-6 h-4 text-nubia-accent" />
          <span className="font-sans text-sm font-medium text-nubia-text">Nubia</span>
        </div>
        <p className="font-sans text-xs text-nubia-text-muted mb-3">
          Built for University Students · © {new Date().getFullYear()}
        </p>
        {/* Social Links */}
        <div className="flex items-center justify-center gap-3">
          <a 
            href="https://instagram.com/nubia_.v1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-nubia-surface-alt flex items-center justify-center text-nubia-text-secondary hover:text-pink-500 hover:bg-pink-500/10 transition-all"
            aria-label="Follow us on Instagram"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
