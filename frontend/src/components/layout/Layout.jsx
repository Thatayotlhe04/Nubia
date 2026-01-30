import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import MenuDrawer from './MenuDrawer';
import { getTopics } from '../../utils/api';

// Floating Back Button Component
function FloatingBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show on home page
  if (location.pathname === '/') return null;
  
  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-nubia-surface border border-nubia-border rounded-full shadow-lg flex items-center justify-center text-nubia-text hover:text-nubia-accent hover:border-nubia-accent transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label="Go back"
      title="Go back"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

function Layout() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTopics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-nubia-bg">
      <Header 
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
      />
      
      <main className="nubia-main flex-1">
        <div className="nubia-content">
          <Outlet context={{ topics }} />
        </div>
      </main>
      
      {/* Menu Drawer */}
      <MenuDrawer 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)}
        topics={topics}
        loading={loading}
      />
      
      {/* Floating Back Button */}
      <FloatingBackButton />
    </div>
  );
}

export default Layout;
