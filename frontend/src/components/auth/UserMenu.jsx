/**
 * User Menu Component
 *
 * Displays user avatar/icon with dropdown menu.
 * Shows sign-in button for guests, user menu for authenticated users.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * UserMenu Component
 * @param {Object} props
 * @param {Function} props.onOpenAuth - Callback to open auth modal
 */
function UserMenu({ onOpenAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, isAuthenticated, signOut, loading } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Don't render anything during initial auth check
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-nubia-surface-alt animate-pulse" />
    );
  }

  // Guest user - show sign in button
  if (!isAuthenticated) {
    return (
      <button
        onClick={() => onOpenAuth('signin')}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-nubia-text-secondary hover:text-nubia-text border border-nubia-border rounded-md hover:border-nubia-accent hover:bg-nubia-surface-alt transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  // Authenticated user - show avatar with dropdown
  const userInitial = user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-nubia-accent/50 transition-all"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-nubia-accent flex items-center justify-center text-white font-medium text-sm">
          {userInitial}
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-nubia-surface border border-nubia-border rounded-lg shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-nubia-border">
            <p className="text-sm font-medium text-nubia-text truncate">
              {user?.email}
            </p>
            <p className="text-xs text-nubia-text-secondary mt-0.5">
              Signed in
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Future: navigate to settings/profile
              }}
              className="w-full px-4 py-2 text-left text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Notes
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-nubia-text-secondary hover:text-nubia-text hover:bg-nubia-surface-alt transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
