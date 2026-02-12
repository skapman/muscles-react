import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigation } from '@context/NavigationContext';
import { useApp } from '@context/AppContext';

/**
 * BurgerMenu Component
 * Slide-in navigation menu with theme toggle
 */
export function BurgerMenu() {
  const { menuOpen, closeMenu } = useNavigation();
  const { theme, toggleTheme } = useApp();
  const location = useLocation();

  // Menu items configuration
  const menuItems = [
    { icon: '🏠', label: 'Главная', path: '/', section: 'main' },
    { icon: '🎯', label: 'Цели', path: '/goals', section: 'main' },
    { icon: '💪', label: 'Упражнения', path: '/exercises', section: 'main' },
    { icon: '📊', label: 'Граф связей', path: '/graph', section: 'main' },
    { icon: '⭐', label: 'Избранное', path: '/favorites', section: 'main' },
    { type: 'divider' },
    { icon: '⚙️', label: 'Настройки', path: '/settings', section: 'system' },
    { icon: 'ℹ️', label: 'О проекте', path: '/about', section: 'system' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop overlay */}
      {menuOpen && (
        <div
          className="burger-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Menu panel */}
      <nav
        className={`burger-menu ${menuOpen ? 'open' : ''}`}
        aria-label="Главное меню"
      >
        <div className="burger-menu-content">
          {/* Menu items */}
          <ul className="menu-items">
            {menuItems.map((item, index) => {
              if (item.type === 'divider') {
                return <li key={`divider-${index}`} className="menu-divider" />;
              }

              return (
                <li key={item.path} className="menu-item">
                  <Link
                    to={item.path}
                    className={`menu-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Theme toggle at bottom */}
          <div className="menu-footer">
            <div className="menu-divider" />
            <button
              className="theme-toggle-menu"
              onClick={toggleTheme}
              aria-label={`Переключить тему на ${theme === 'dark' ? 'светлую' : 'тёмную'}`}
            >
              <span className="theme-icon">🌓</span>
              <span className="theme-label">
                {theme === 'dark' ? 'Тёмная тема' : 'Светлая тема'}
              </span>
              <div className="theme-switch">
                <div className={`theme-switch-track ${theme}`}>
                  <div className="theme-switch-thumb" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <style>{`
        /* Backdrop */
        .burger-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Menu panel */
        .burger-menu {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .burger-menu.open {
          transform: translateX(0);
        }

        .burger-menu-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 72px 0 16px;
          overflow-y: auto;
        }

        /* Menu items */
        .menu-items {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .menu-item {
          margin: 0;
        }

        .menu-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 20px;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.01em;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 3px solid transparent;
          position: relative;
        }

        .menu-link:hover {
          background: var(--bg-tertiary);
          border-left-color: var(--accent-primary);
          padding-left: 24px;
        }

        .menu-link.active {
          background: linear-gradient(90deg, var(--accent-primary) 0%, transparent 100%);
          color: white;
          border-left-color: var(--accent-primary);
          font-weight: 600;
        }

        .menu-icon {
          font-size: 18px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .menu-label {
          flex: 1;
          white-space: nowrap;
        }

        .menu-divider {
          height: 1px;
          background: var(--border-color);
          margin: 8px 16px;
          opacity: 0.5;
        }

        /* Menu footer with theme toggle */
        .menu-footer {
          margin-top: auto;
          padding: 0;
          border-top: 1px solid var(--border-color);
        }

        .theme-toggle-menu {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 14px 20px;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .theme-toggle-menu:hover {
          background: var(--bg-tertiary);
        }

        .theme-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .theme-label {
          flex: 1;
          text-align: left;
        }

        /* Theme switch */
        .theme-switch {
          display: flex;
          align-items: center;
        }

        .theme-switch-track {
          position: relative;
          width: 44px;
          height: 22px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-color);
        }

        .theme-switch-track.dark {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .theme-switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .theme-switch-track.dark .theme-switch-thumb {
          transform: translateX(22px);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .burger-menu {
            width: 85vw;
            max-width: 280px;
          }

          .burger-menu-content {
            padding-top: 68px;
          }

          .menu-link {
            padding: 14px 18px;
            font-size: 16px;
            gap: 12px;
          }

          .menu-icon {
            font-size: 20px;
          }

          .theme-toggle-menu {
            padding: 16px 18px;
            font-size: 15px;
          }
        }

        /* Desktop optimizations */
        @media (min-width: 769px) {
          .burger-menu {
            width: 280px;
          }
        }

        /* Accessibility */
        .menu-link:focus,
        .theme-toggle-menu:focus {
          outline: 2px solid var(--accent-primary);
          outline-offset: -2px;
        }

        .menu-link:focus:not(:focus-visible),
        .theme-toggle-menu:focus:not(:focus-visible) {
          outline: none;
        }

        /* Scrollbar styling */
        .burger-menu-content::-webkit-scrollbar {
          width: 6px;
        }

        .burger-menu-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .burger-menu-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .burger-menu-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }
      `}</style>
    </>
  );
}
