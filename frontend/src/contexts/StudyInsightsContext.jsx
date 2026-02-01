import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const StudyInsightsContext = createContext(null);

// Get today's date key for storage
const getTodayKey = () => new Date().toISOString().split('T')[0];

// Default metrics structure
const getDefaultMetrics = () => ({
  sessionTime: 0, // in seconds
  topicsViewed: [],
  formulasOpened: 0,
  calculatorsUsed: 0,
  notesCreated: 0,
  lastActive: Date.now(),
});

export function useStudyInsights() {
  const context = useContext(StudyInsightsContext);
  if (!context) {
    throw new Error('useStudyInsights must be used within a StudyInsightsProvider');
  }
  return context;
}

export function StudyInsightsProvider({ children }) {
  const [todayMetrics, setTodayMetrics] = useState(getDefaultMetrics);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);

  // Load metrics from localStorage on mount
  useEffect(() => {
    const todayKey = getTodayKey();
    const stored = localStorage.getItem(`nubia-insights-${todayKey}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTodayMetrics(parsed);
      } catch (e) {
        console.error('Failed to parse stored insights:', e);
      }
    }
  }, []);

  // Save metrics to localStorage whenever they change
  useEffect(() => {
    const todayKey = getTodayKey();
    localStorage.setItem(`nubia-insights-${todayKey}`, JSON.stringify(todayMetrics));
  }, [todayMetrics]);

  // Track session time (only when active)
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTodayMetrics(prev => ({
          ...prev,
          sessionTime: prev.sessionTime + 1,
          lastActive: Date.now(),
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Detect user inactivity
  useEffect(() => {
    const resetInactivityTimer = () => {
      setIsActive(true);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      // Set inactive after 2 minutes of no activity
      inactivityTimeoutRef.current = setTimeout(() => {
        setIsActive(false);
      }, 120000);
    };

    // Activity events
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
      } else {
        resetInactivityTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize
    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  // Track topic view
  const trackTopicView = useCallback((topicId, topicName) => {
    setTodayMetrics(prev => {
      const viewed = prev.topicsViewed || [];
      // Only add if not already viewed today
      if (!viewed.some(t => t.id === topicId)) {
        return {
          ...prev,
          topicsViewed: [...viewed, { id: topicId, name: topicName, time: Date.now() }],
        };
      }
      return prev;
    });
  }, []);

  // Track formula opened
  const trackFormulaOpened = useCallback(() => {
    setTodayMetrics(prev => ({
      ...prev,
      formulasOpened: prev.formulasOpened + 1,
    }));
  }, []);

  // Track calculator used
  const trackCalculatorUsed = useCallback(() => {
    setTodayMetrics(prev => ({
      ...prev,
      calculatorsUsed: prev.calculatorsUsed + 1,
    }));
  }, []);

  // Track note created
  const trackNoteCreated = useCallback(() => {
    setTodayMetrics(prev => ({
      ...prev,
      notesCreated: prev.notesCreated + 1,
    }));
  }, []);

  // Format session time
  const formatSessionTime = useCallback((seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  }, []);

  const value = {
    metrics: todayMetrics,
    isActive,
    trackTopicView,
    trackFormulaOpened,
    trackCalculatorUsed,
    trackNoteCreated,
    formatSessionTime,
  };

  return (
    <StudyInsightsContext.Provider value={value}>
      {children}
    </StudyInsightsContext.Provider>
  );
}

export default StudyInsightsContext;
