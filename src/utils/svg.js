/**
 * SVG Utilities for React
 */

/**
 * Load SVG from URL
 * @param {string} url - URL to SVG file
 * @returns {Promise<string>} SVG content as string
 */
export async function loadSVG(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load SVG: ${response.statusText}`);
  }
  return await response.text();
}

/**
 * Parse SVG string to DOM element
 * @param {string} svgString - SVG content as string
 * @returns {SVGElement} Parsed SVG element
 */
export function parseSVG(svgString) {
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
 * Inject SVG into container ref
 * @param {SVGElement} svgElement - SVG element to inject
 * @param {React.RefObject} containerRef - Container ref
 */
export function injectSVGIntoRef(svgElement, containerRef) {
  if (containerRef.current) {
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(svgElement.cloneNode(true));
  }
}

/**
 * Get all muscle elements from SVG
 * @param {SVGElement} svgElement - SVG element
 * @returns {NodeList} List of muscle elements
 */
export function getMuscleElements(svgElement) {
  return svgElement.querySelectorAll('[data-muscle-id]');
}

/**
 * Get muscle ID from element
 * @param {Element} element - SVG element
 * @returns {string|null} Muscle ID or null
 */
export function getMuscleId(element) {
  return element.getAttribute('data-muscle-id');
}

/**
 * Highlight muscle element
 * @param {Element} element - Muscle element
 * @param {boolean} highlight - Whether to highlight
 */
export function highlightMuscle(element, highlight = true) {
  if (highlight) {
    element.classList.add('highlighted');
  } else {
    element.classList.remove('highlighted');
  }
}

/**
 * Add hover class to muscle element
 * @param {Element} element - Muscle element
 * @param {boolean} hover - Whether to add hover class
 */
export function hoverMuscle(element, hover = true) {
  if (hover) {
    element.classList.add('hovered');
  } else {
    element.classList.remove('hovered');
  }
}

/**
 * Get bounding box of SVG element
 * @param {Element} element - SVG element
 * @returns {DOMRect} Bounding box
 */
export function getElementBounds(element) {
  return element.getBoundingClientRect();
}

/**
 * Get center point of SVG element
 * @param {Element} element - SVG element
 * @returns {Object} {x, y} coordinates
 */
export function getElementCenter(element) {
  const bounds = getElementBounds(element);
  return {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2
  };
}

/**
 * Clear all highlights from SVG
 * @param {SVGElement} svgElement - SVG element
 */
export function clearAllHighlights(svgElement) {
  const muscles = getMuscleElements(svgElement);
  muscles.forEach(muscle => {
    muscle.classList.remove('highlighted', 'hovered');
  });
}

/**
 * Add event listener to all muscles
 * @param {SVGElement} svgElement - SVG element
 * @param {string} eventType - Event type (click, mouseenter, etc.)
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function addMuscleEventListeners(svgElement, eventType, handler) {
  const muscles = getMuscleElements(svgElement);

  muscles.forEach(muscle => {
    muscle.addEventListener(eventType, handler);
  });

  // Return cleanup function
  return () => {
    muscles.forEach(muscle => {
      muscle.removeEventListener(eventType, handler);
    });
  };
}

/**
 * Set SVG viewBox to fit content
 * @param {SVGElement} svgElement - SVG element
 */
export function fitViewBox(svgElement) {
  const bbox = svgElement.getBBox();
  svgElement.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
}

/**
 * Scale SVG to fit container
 * @param {SVGElement} svgElement - SVG element
 * @param {number} width - Container width
 * @param {number} height - Container height
 */
export function scaleToFit(svgElement, width, height) {
  svgElement.setAttribute('width', width);
  svgElement.setAttribute('height', height);
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
}
