import { useState, useEffect, useRef } from 'react';

/**
 * Load SVG from URL
 */
async function loadSVG(url) {
  // Add base URL for production (GitHub Pages)
  const baseUrl = import.meta.env.BASE_URL;
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url.slice(1)}` : url;

  const response = await fetch(fullUrl);
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
 * Add auto-generated IDs to path elements (like in old project)
 * @param {SVGElement} svgElement - SVG element
 * @param {string} url - URL to determine view (front/back)
 */
function addPathIds(svgElement, url) {
  const view = url.includes('front') ? 'front' : 'back';
  const paths = svgElement.querySelectorAll('path');

  paths.forEach((path, index) => {
    if (!path.id) {
      path.id = `${view}-path-${index}`;
    }
  });

  console.log(`Added IDs to ${paths.length} paths in ${view} view`);
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

        // Remove fixed width/height to make SVG responsive
        element.removeAttribute('width');
        element.removeAttribute('height');

        // Add auto-generated IDs to path elements
        addPathIds(element, url);

        setSvgElement(element);
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

  // Inject SVG into container when ready
  useEffect(() => {
    if (svgElement && containerRef.current && !loading) {
      // Always clear and inject new SVG to prevent stale content
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(svgElement.cloneNode(true));
      console.log('✅ SVG injected:', url);
    }
  }, [svgElement, loading, url]);

  return {
    loading,
    error,
    svgElement,
    containerRef
  };
}
