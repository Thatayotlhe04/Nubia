import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import MenuDrawer from './MenuDrawer';
import { getTopics } from '../../utils/api';

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
    </div>
  );
}

export default Layout;
