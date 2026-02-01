/**
 * Authentication Context Provider
 *
 * Provides optional authentication state throughout the app.
 * - Lazy loads auth state (doesn't block initial render)
 * - Works with or without Supabase configuration
 * - Guest users have full access to public features
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state lazily
  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      // Supabase not configured - run in guest mode
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setAuthError(error.message);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setAuthError(null);

        // Handle specific events
        if (event === 'SIGNED_IN') {
          // User just signed in - trigger migration check
          window.dispatchEvent(new CustomEvent('nubia:auth:signin', {
            detail: { user: session.user }
          }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Authentication is not configured');
    }

    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    return data;
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Authentication is not configured');
    }

    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    return data;
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  /**
   * Send password reset email
   */
  const resetPassword = useCallback(async (email) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Authentication is not configured');
    }

    setAuthError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    isGuest: !user,
    isConfigured: isSupabaseConfigured(),
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to check if user is authenticated
 * Returns false during loading to prevent flash of protected content
 */
export function useIsAuthenticated() {
  const { isAuthenticated, loading } = useAuth();
  return !loading && isAuthenticated;
}

export default AuthContext;
