import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext(null);

/**
 * NavigationProvider Component
 * Manages burger menu state and navigation
 */
export function NavigationProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Memoized toggle functions
  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    menuOpen,
    toggleMenu,
    openMenu,
    closeMenu,
  }), [menuOpen, toggleMenu, openMenu, closeMenu]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * useNavigation hook
 * Access navigation context
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
