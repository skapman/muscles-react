import React from 'react';
import { useApp } from '@context/AppContext';
import { useResponsive } from '@hooks/useResponsive';

/**
 * Sidebar Component
 * Desktop sidebar for displaying details and information
 * Hidden on mobile (uses BottomSheet instead)
 */
export function Sidebar({ children }) {
  const { sidebarOpen, toggleSidebar } = useApp();
  const { isMobile } = useResponsive();

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      {/* Toggle button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <span className="toggle-icon">
          {sidebarOpen ? '◀' : '▶'}
        </span>
      </button>

      {/* Sidebar content */}
      <div className="sidebar-content">
        <header className="sidebar-header">
          <h1>Интерактивная анатомия мышц</h1>
          <p>Наведите на мышцу для информации, кликните для деталей</p>
        </header>

        <div className="sidebar-body">
          {children || (
            <div className="placeholder">
              <p>Выберите мышцу для просмотра детальной информации</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
