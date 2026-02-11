import { useState, useEffect } from 'react';

/**
 * useResponsive hook - detects mobile/desktop breakpoints
 * @param {number} breakpoint - breakpoint in pixels (default: 768)
 * @returns {Object} { isMobile, isDesktop, width, height }
 */
export function useResponsive(breakpoint = 768) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < breakpoint,
    isDesktop: window.innerWidth >= breakpoint,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({
        width,
        height,
        isMobile: width < breakpoint,
        isDesktop: width >= breakpoint,
      });
    };

    // Debounce resize events for performance
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [breakpoint]);

  return dimensions;
}
