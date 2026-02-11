/**
 * Positioning Utilities
 * Helper functions for element positioning and layout calculations
 */

/**
 * Get element bounding rectangle
 * @param {HTMLElement} element - Target element
 * @returns {DOMRect}
 */
export function getElementBounds(element) {
    return element.getBoundingClientRect();
}

/**
 * Position one element over another
 * @param {HTMLElement} container - Element to position
 * @param {HTMLElement} target - Target element to position over
 * @param {Object} offset - Optional offset {x, y}
 */
export function positionOverElement(container, target, offset = { x: 0, y: 0 }) {
    const targetRect = getElementBounds(target);
    const parent = container.parentElement;
    const parentRect = parent ? getElementBounds(parent) : { left: 0, top: 0 };

    container.style.position = 'absolute';
    container.style.left = `${targetRect.left - parentRect.left + offset.x}px`;
    container.style.top = `${targetRect.top - parentRect.top + offset.y}px`;
    container.style.width = `${targetRect.width}px`;
    container.style.height = `${targetRect.height}px`;
}

/**
 * Convert percentage to pixels
 * @param {number} percent - Percentage value (0-100)
 * @param {number} containerSize - Container size in pixels
 * @returns {number} Pixel value
 */
export function percentToPixels(percent, containerSize) {
    return (percent / 100) * containerSize;
}

/**
 * Convert pixels to percentage
 * @param {number} pixels - Pixel value
 * @param {number} containerSize - Container size in pixels
 * @returns {number} Percentage value (0-100)
 */
export function pixelsToPercent(pixels, containerSize) {
    return (pixels / containerSize) * 100;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Percentage of element that must be visible (0-1)
 * @returns {boolean}
 */
export function isInViewport(element, threshold = 0) {
    const rect = getElementBounds(element);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    if (threshold === 0) {
        return vertInView && horInView;
    }

    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;

    return (visibleArea / totalArea) >= threshold;
}

/**
 * Center element in container
 * @param {HTMLElement} element - Element to center
 * @param {HTMLElement} container - Container element
 */
export function centerInContainer(element, container) {
    const elementRect = getElementBounds(element);
    const containerRect = getElementBounds(container);

    const left = (containerRect.width - elementRect.width) / 2;
    const top = (containerRect.height - elementRect.height) / 2;

    element.style.position = 'absolute';
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
}

/**
 * Get distance between two elements
 * @param {HTMLElement} element1 - First element
 * @param {HTMLElement} element2 - Second element
 * @returns {number} Distance in pixels
 */
export function getDistanceBetweenElements(element1, element2) {
    const rect1 = getElementBounds(element1);
    const rect2 = getElementBounds(element2);

    const center1 = {
        x: rect1.left + rect1.width / 2,
        y: rect1.top + rect1.height / 2
    };

    const center2 = {
        x: rect2.left + rect2.width / 2,
        y: rect2.top + rect2.height / 2
    };

    const dx = center2.x - center1.x;
    const dy = center2.y - center1.y;

    return Math.sqrt(dx * dx + dy * dy);
}
