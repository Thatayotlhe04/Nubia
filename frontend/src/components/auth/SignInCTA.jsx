/**
 * Sign In CTA Component
 *
 * A subtle, non-intrusive call-to-action that encourages
 * guest users to sign in for enhanced features.
 *
 * Design principles:
 * - Never blocks content
 * - Can be dismissed
 * - Explains the value proposition
 * - No dark patterns
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * SignInCTA Component
 * @param {Object} props
 * @param {Function} props.onOpenAuth - Callback to open auth modal
 * @param {string} props.context - Context for the CTA (e.g., 'notes', 'uploads')
 * @param {string} props.variant - 'inline' (default), 'banner', or 'minimal'
 */
function SignInCTA({ onOpenAuth, context = 'default', variant = 'inline' }) {
  const { isAuthenticated, loading, isConfigured } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for dismissed state (per context)
  useEffect(() => {
    const dismissed = localStorage.getItem(`nubia-cta-dismissed-${context}`);
    if (dismissed) {
      setIsDismissed(true);
    }
  }, [context]);

  // Don't show if user is authenticated, loading, or dismissed
  if (loading || isAuthenticated || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    // Remember dismissal for 24 hours
    localStorage.setItem(`nubia-cta-dismissed-${context}`, Date.now().toString());
    setTimeout(() => {
      localStorage.removeItem(`nubia-cta-dismissed-${context}`);
    }, 24 * 60 * 60 * 1000);
  };

  // Context-specific messaging
  const messages = {
    notes: {
      title: 'Save your notes across devices',
      description: 'Sign in to sync your notes to the cloud. Your local notes will be preserved.',
      action: 'Sign in to sync',
    },
    uploads: {
      title: 'Access uploads anywhere',
      description: 'Create an account to access your uploaded files from any device.',
      action: 'Sign in to sync',
    },
    default: {
      title: 'Save your progress',
      description: 'Create a free account to save notes and sync across devices.',
      action: 'Sign in',
    },
  };

  const msg = messages[context] || messages.default;

  // Minimal variant - just a small text link
  if (variant === 'minimal') {
    return (
      <button
        onClick={() => onOpenAuth('signin')}
        className="text-xs text-nubia-text-muted hover:text-nubia-accent transition-colors inline-flex items-center gap-1"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        {msg.action} to sync
      </button>
    );
  }

  // Banner variant - full-width subtle banner
  if (variant === 'banner') {
    return (
      <div className="bg-nubia-surface-alt border-b border-nubia-border px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-nubia-text-secondary">
            <span className="hidden sm:inline">{msg.description}</span>
            <span className="sm:hidden">{msg.title}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-3 py-1 text-sm font-medium text-nubia-accent hover:text-nubia-accent-hover transition-colors"
            >
              {msg.action}
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-nubia-text-muted hover:text-nubia-text transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant - card style
  return (
    <div className="p-4 bg-nubia-surface-alt border border-nubia-border rounded-lg relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-nubia-text-muted hover:text-nubia-text transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="flex-shrink-0 w-8 h-8 bg-nubia-accent/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-nubia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-nubia-text mb-1">
            {msg.title}
          </h3>
          <p className="text-xs text-nubia-text-secondary mb-3">
            {msg.description}
          </p>
          <button
            onClick={() => onOpenAuth('signin')}
            className="px-3 py-1.5 text-xs font-medium bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors"
          >
            {msg.action}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignInCTA;
