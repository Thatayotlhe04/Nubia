/**
 * Authentication Modal Component
 *
 * A clean, non-intrusive modal for login/signup.
 * Emphasizes that auth is optional and explains the benefits.
 */
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AuthModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal closes
 * @param {string} props.initialMode - 'signin' or 'signup'
 */
function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp, resetPassword, isConfigured } = useAuth();

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialMode]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await signUp(email, password);
        setSuccess('Check your email to confirm your account!');
      } else if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccess('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [mode, email, password, confirmPassword, signIn, signUp, resetPassword, onClose]);

  if (!isOpen) return null;

  if (!isConfigured) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-nubia-surface border border-nubia-border rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-nubia-text mb-4">
              Coming Soon
            </h2>
            <p className="text-nubia-text-secondary mb-6">
              User accounts are coming soon! For now, your notes are saved locally in your browser.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-nubia-accent text-white rounded-md hover:bg-nubia-accent-hover transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-nubia-surface border border-nubia-border rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nubia-border">
          <h2 className="text-lg font-semibold text-nubia-text">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-nubia-surface-alt transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-nubia-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Benefits reminder */}
        {mode !== 'reset' && (
          <div className="px-4 pt-4">
            <div className="p-3 bg-nubia-surface-alt rounded-lg text-sm">
              <p className="text-nubia-text-secondary">
                {mode === 'signin'
                  ? 'Sign in to sync your notes across devices.'
                  : 'Creating an account lets you save notes and sync across devices. It\'s optional!'}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-md text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-md text-sm text-green-400">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nubia-text mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-nubia-text mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-nubia-text mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-3 py-2 bg-nubia-bg border border-nubia-border rounded-md text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none transition-colors"
                placeholder="Confirm password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-nubia-accent text-white font-medium rounded-md hover:bg-nubia-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Email'}
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="px-4 pb-4 text-center text-sm">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => setMode('reset')}
                className="text-nubia-text-secondary hover:text-nubia-accent transition-colors"
              >
                Forgot password?
              </button>
              <span className="mx-2 text-nubia-text-muted">|</span>
              <button
                onClick={() => setMode('signup')}
                className="text-nubia-text-secondary hover:text-nubia-accent transition-colors"
              >
                Create account
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button
              onClick={() => setMode('signin')}
              className="text-nubia-text-secondary hover:text-nubia-accent transition-colors"
            >
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button
              onClick={() => setMode('signin')}
              className="text-nubia-text-secondary hover:text-nubia-accent transition-colors"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
