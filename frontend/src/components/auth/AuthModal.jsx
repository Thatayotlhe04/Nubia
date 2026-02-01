import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin', 'signup', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { signIn, signUp, resetPassword, error, clearError } = useAuth();

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setMessage({ type: '', text: '' });
    clearError();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (mode === 'signin') {
        const result = await signIn(email, password);
        if (result.success) {
          setMessage({ type: 'success', text: 'Welcome back!' });
          setTimeout(handleClose, 1000);
        } else {
          setMessage({ type: 'error', text: result.error });
        }
      } else if (mode === 'signup') {
        const result = await signUp(email, password, displayName);
        if (result.success) {
          if (result.needsConfirmation) {
            setMessage({ type: 'success', text: 'Check your email to confirm your account!' });
          } else {
            setMessage({ type: 'success', text: 'Account created successfully!' });
            setTimeout(handleClose, 1000);
          }
        } else {
          setMessage({ type: 'error', text: result.error });
        }
      } else if (mode === 'reset') {
        const result = await resetPassword(email);
        if (result.success) {
          setMessage({ type: 'success', text: 'Password reset email sent!' });
        } else {
          setMessage({ type: 'error', text: result.error });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-nubia-surface dark:bg-nubia-surface border border-nubia-border rounded-xl shadow-xl animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-nubia-text-muted hover:text-nubia-text transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-nubia-text font-sans">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <p className="text-sm text-nubia-text-secondary mt-1">
            {mode === 'signin' && 'Sign in to sync your progress'}
            {mode === 'signup' && 'Join Nubia to save your progress'}
            {mode === 'reset' && 'Enter your email to reset password'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-nubia-text-secondary mb-1.5">
                Display Name (optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-nubia-bg border border-nubia-border rounded-lg text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-nubia-text-secondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 bg-nubia-bg border border-nubia-border rounded-lg text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none transition-colors"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-nubia-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-nubia-bg border border-nubia-border rounded-lg text-nubia-text placeholder-nubia-text-muted focus:border-nubia-accent focus:outline-none transition-colors"
              />
              {mode === 'signup' && (
                <p className="text-xs text-nubia-text-muted mt-1">At least 6 characters</p>
              )}
            </div>
          )}

          {/* Message */}
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-nubia-accent text-white font-medium rounded-lg hover:bg-nubia-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Link'}
              </>
            )}
          </button>

          {/* Mode switchers */}
          <div className="text-center text-sm space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setMessage({ type: '', text: '' }); }}
                  className="text-nubia-text-secondary hover:text-nubia-accent transition-colors"
                >
                  Forgot password?
                </button>
                <p className="text-nubia-text-muted">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setMessage({ type: '', text: '' }); }}
                    className="text-nubia-accent hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-nubia-text-muted">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setMessage({ type: '', text: '' }); }}
                  className="text-nubia-accent hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => { setMode('signin'); setMessage({ type: '', text: '' }); }}
                className="text-nubia-accent hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>
        </form>

        {/* Optional note */}
        <div className="px-6 pb-6 pt-2 border-t border-nubia-border-subtle">
          <p className="text-xs text-nubia-text-muted text-center">
            ✨ Signing in is optional. All features are available without an account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
