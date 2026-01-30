import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

function Sidebar({ topics, loading, isOpen }) {
  const { topicId } = useParams();

  // Group topics by category
  const groupedTopics = topics.reduce((acc, topic) => {
    const category = topic.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(topic);
    return acc;
  }, {});

  // Format category name for display
  const formatCategory = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="nubia-sidebar hidden lg:block">
      <nav className="py-6 h-full overflow-y-auto">
        {/* Home link */}
        <div className="px-4 mb-6">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `nubia-nav-item ${isActive && !topicId ? 'nubia-nav-item-active' : ''}`
            }
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              Overview
            </span>
          </NavLink>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="px-4 py-8">
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="h-10 bg-nubia-surface-alt rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Topics grouped by category */}
        {!loading && Object.entries(groupedTopics).map(([category, categoryTopics]) => (
          <div key={category} className="mb-6">
            <h3 className="nubia-nav-category">
              {formatCategory(category)}
            </h3>
            <ul className="space-y-1 px-2">
              {categoryTopics.map(topic => (
                <li key={topic.id}>
                  <NavLink
                    to={`/topic/${topic.id}`}
                    className={({ isActive }) => 
                      `nubia-nav-item ${isActive ? 'nubia-nav-item-active' : ''}`
                    }
                  >
                    {topic.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Empty state */}
        {!loading && topics.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="nubia-caption">No topics available</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-6 px-4 border-t border-nubia-border-subtle">
          <p className="nubia-caption text-center">
            Built for finance students
          </p>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
