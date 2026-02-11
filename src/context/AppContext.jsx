import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const AppContext = createContext(null);

/**
 * AppProvider Component
 * Provides global app state
 * Optimized with useCallback and useMemo
 */
export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // Layer state
  const [currentLayer, setCurrentLayer] = useState('muscles');

  // Selection state
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Memoized toggle functions
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Memoized selection functions
  const selectEntity = useCallback((type, id, data) => {
    setSelectedEntity({ type, id, data });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    // Theme
    theme,
    toggleTheme,

    // Layer
    currentLayer,
    setCurrentLayer,

    // Selection
    selectedEntity,
    selectEntity,
    clearSelection,

    // Sidebar
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  }), [
    theme,
    toggleTheme,
    currentLayer,
    selectedEntity,
    selectEntity,
    clearSelection,
    sidebarOpen,
    toggleSidebar
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * useApp hook
 * Access app context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
