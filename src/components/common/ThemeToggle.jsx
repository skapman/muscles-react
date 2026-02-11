import React from 'react';
import { useApp } from '@context/AppContext';

/**
 * ThemeToggle Component
 * Toggles between dark and light themes
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span className="theme-icon">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
