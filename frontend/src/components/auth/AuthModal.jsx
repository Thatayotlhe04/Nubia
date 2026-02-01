import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin', 'signup', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { signIn, signUp, resetPassword, signInWithGoogle, signInWithApple, error, clearError } = useAuth();
  const [oauthLoading, setOauthLoading] = useState(null); // 'google' or 'apple'

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

        {/* OAuth Buttons */}
        {mode !== 'reset' && (
          <div className="px-6 pb-2 space-y-3">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={async () => {
                setOauthLoading('google');
                const result = await signInWithGoogle();
                if (!result.success) {
                  setMessage({ type: 'error', text: result.error });
                }
                setOauthLoading(null);
              }}
              disabled={oauthLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-gray-800 border border-nubia-border rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'google' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>

            {/* Apple Sign In */}
            <button
              type="button"
              onClick={async () => {
                setOauthLoading('apple');
                const result = await signInWithApple();
                if (!result.success) {
                  setMessage({ type: 'error', text: result.error });
                }
                setOauthLoading(null);
              }}
              disabled={oauthLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-black dark:bg-white border border-nubia-border rounded-lg text-white dark:text-black font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'apple' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              )}
              Continue with Apple
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-nubia-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-nubia-surface text-nubia-text-muted">or continue with email</span>
              </div>
            </div>
          </div>
        )}

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
