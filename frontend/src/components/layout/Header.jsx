import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NubiaLogo } from '../../pages/Home';

function Header({ onToggleMenu, menuOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  return (
    <header className="h-14 flex items-center px-4 md:px-6 border-b border-nubia-border bg-nubia-surface flex-shrink-0">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Menu toggle - hamburger on left */}
        <button
          onClick={onToggleMenu}
          className="p-2 -ml-2 rounded-md hover:bg-nubia-surface-alt transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg 
            className="w-5 h-5 text-nubia-text-secondary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-2.5 group">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <NubiaLogo className="w-6 h-4 md:w-7 md:h-5 text-white" />
          </div>
          <span className="font-sans text-base md:text-lg font-semibold text-nubia-text tracking-tight">
            Nubia
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-rose-500/20 text-rose-600 border border-rose-500/30 rounded">
            Beta
          </span>
          <span className="hidden md:inline font-sans text-sm text-nubia-text-muted">
            Finance Study Companion
          </span>
        </Link>
      </div>
      
      {/* Search Bar - Desktop */}
      <div className="hidden md:flex ml-auto items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nubia-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search finance topics..."
            className="w-48 lg:w-64 pl-9 pr-3 py-1.5 bg-nubia-bg border border-nubia-border rounded-md text-sm text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none transition-colors"
          />
        </form>
        <span className="hidden lg:inline font-sans text-xs text-nubia-text-faint">
          University of Botswana
        </span>
      </div>

      {/* Search Icon - Mobile */}
      <div className="ml-auto flex md:hidden items-center gap-2">
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="p-2 rounded-md hover:bg-nubia-surface-alt transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5 text-nubia-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="absolute top-14 left-0 right-0 bg-nubia-surface border-b border-nubia-border p-3 md:hidden z-40">
          <form onSubmit={handleSearch} className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nubia-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search finance topics..."
              autoFocus
              className="w-full pl-9 pr-12 py-2 bg-nubia-bg border border-nubia-border rounded-md text-sm text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-nubia-accent text-white rounded text-xs font-medium"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export default Header;
