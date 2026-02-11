import { useState, useEffect, useRef } from 'react';

/**
 * Load SVG from URL
 */
async function loadSVG(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load SVG: ${response.statusText}`);
  }
  const text = await response.text();
  return text;
}

/**
 * Parse SVG string to DOM element
 */
function parseSVG(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = doc.documentElement;

  // Check for parsing errors
  const parserError = svgElement.querySelector('parsererror');
  if (parserError) {
    throw new Error('SVG parsing error');
  }

  return svgElement;
}

/**
 * useSVG hook - loads and manages SVG elements
 * @param {string} url - URL to SVG file
 * @returns {Object} { loading, error, svgElement, containerRef }
 */
export function useSVG(url) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [svgElement, setSvgElement] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const svgString = await loadSVG(url);

        if (cancelled) return;

        const element = parseSVG(svgString);
        setSvgElement(element);

        // Inject into container if available
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(element.cloneNode(true));
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading SVG:', err);
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Re-inject SVG when container ref changes
  useEffect(() => {
    if (svgElement && containerRef.current && !loading) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(svgElement.cloneNode(true));
    }
  }, [svgElement, loading]);

  return {
    loading,
    error,
    svgElement,
    containerRef
  };
}
