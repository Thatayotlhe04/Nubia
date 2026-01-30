import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { NubiaLogo } from '../../pages/Home';

function MenuDrawer({ isOpen, onClose, topics = [], loading = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({ home: true, topics: false, tools: false });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const scrollToSection = (sectionId) => {
    onClose();
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const goHome = () => {
    onClose();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPage = (path) => {
    onClose();
    navigate(path);
  };

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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer - slides from left */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 md:w-80 bg-nubia-surface border-r border-nubia-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nubia-border">
          <div className="flex items-center gap-2">
            <NubiaLogo className="w-8 h-5 text-nubia-accent" />
            <span className="font-sans text-base font-semibold text-nubia-text">Nubia</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-nubia-surface-alt transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-nubia-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Menu Content */}
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {/* Home Section */}
          <div className="border-b border-nubia-border">
            <button
              onClick={() => toggleSection('home')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-nubia-surface-alt transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-sans text-sm font-medium text-nubia-text">Home</span>
              </div>
              <svg className={`w-4 h-4 text-nubia-text-muted transition-transform ${expandedSections.home ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.home && (
              <div className="px-4 pb-3 space-y-1">
                <button onClick={goHome} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <span>Overview</span>
                </button>
                <button onClick={() => scrollToSection('resources')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <span>Academic Resources</span>
                </button>
                <button onClick={() => scrollToSection('feedback')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <span>Feedback</span>
                </button>
                <button onClick={() => scrollToSection('reviews')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <span>Student Reviews</span>
                </button>
                <button onClick={() => scrollToSection('about')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <span>About</span>
                </button>
              </div>
            )}
          </div>

          {/* Study Topics Section */}
          <div className="border-b border-nubia-border">
            <button
              onClick={() => toggleSection('topics')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-nubia-surface-alt transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-sans text-sm font-medium text-nubia-text">Study Topics</span>
              </div>
              <svg className={`w-4 h-4 text-nubia-text-muted transition-transform ${expandedSections.topics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.topics && (
              <div className="px-4 pb-3">
                {loading ? (
                  <div className="space-y-2 py-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 bg-nubia-surface-alt rounded animate-pulse" />
                    ))}
                  </div>
                ) : Object.keys(groupedTopics).length === 0 ? (
                  <p className="text-sm text-nubia-text-muted py-2 px-3">No topics available</p>
                ) : (
                  Object.entries(groupedTopics).map(([category, categoryTopics]) => (
                    <div key={category} className="mb-3">
                      <p className="text-xs font-semibold text-nubia-text-muted uppercase tracking-wider px-3 py-1">
                        {formatCategory(category)}
                      </p>
                      <div className="space-y-1">
                        {categoryTopics.map(topic => (
                          <NavLink
                            key={topic.id}
                            to={`/topic/${topic.id}`}
                            onClick={onClose}
                            className={({ isActive }) => 
                              `block px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive 
                                  ? 'bg-nubia-accent-subtle text-nubia-accent font-medium' 
                                  : 'text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt'
                              }`
                            }
                          >
                            {topic.title}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Tools Section */}
          <div className="border-b border-nubia-border">
            <button
              onClick={() => toggleSection('tools')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-nubia-surface-alt transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-sans text-sm font-medium text-nubia-text">Tools</span>
              </div>
              <svg className={`w-4 h-4 text-nubia-text-muted transition-transform ${expandedSections.tools ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.tools && (
              <div className="px-4 pb-3 space-y-1">
                <button onClick={() => goToPage('/calculators')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Interactive Calculators</span>
                </button>
                <button onClick={() => goToPage('/examples')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Worked Examples</span>
                </button>
                <button onClick={() => goToPage('/uploads')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>My Uploads</span>
                </button>
                <button onClick={() => goToPage('/resources')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Academic Resources</span>
                </button>
                <button onClick={() => goToPage('/search')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search Resources</span>
                </button>
                <button onClick={() => goToPage('/summarizer')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt rounded-md transition-colors text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF Summarizer</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Contact Section */}
          <div className="p-4">
            <h3 className="font-sans text-xs font-semibold text-nubia-text-muted uppercase tracking-wider mb-3 px-3">
              Contact
            </h3>
            <div className="space-y-3 px-3">
              <a 
                href="mailto:tsenangthatayotlhe04@gmail.com"
                className="flex items-center gap-3 text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all text-xs">tsenangthatayotlhe04@gmail.com</span>
              </a>
              <a 
                href="tel:+26777625997"
                className="flex items-center gap-3 text-sm text-nubia-text-secondary hover:text-nubia-accent transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+267 77 625 997</span>
              </a>
            </div>
            
            {/* Version Badge */}
            <div className="mt-6 pt-4 border-t border-nubia-border">
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                  Early Access Beta
                </span>
                <span className="text-[10px] text-nubia-text-muted">v1.0.0</span>
              </div>
              <p className="text-[10px] text-nubia-text-muted text-center mt-2">
                © 2026 Nubia • Built for University Students
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuDrawer;
