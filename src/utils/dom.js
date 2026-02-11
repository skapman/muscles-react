/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Wait for element to appear in DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Maximum wait time in ms
 * @returns {Promise<Element>}
 */
export function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found after ${timeout}ms`));
        }, timeout);
    });
}

/**
 * Create element with options
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options
 * @param {string} [options.className] - CSS class name(s)
 * @param {string} [options.id] - Element ID
 * @param {string} [options.innerHTML] - Inner HTML content
 * @param {Object} [options.attributes] - HTML attributes
 * @param {Object} [options.styles] - Inline styles
 * @param {Object} [options.dataset] - Data attributes
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
        element.className = options.className;
    }

    if (options.id) {
        element.id = options.id;
    }

    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    if (options.styles) {
        Object.entries(options.styles).forEach(([key, value]) => {
            element.style[key] = value;
        });
    }

    if (options.dataset) {
        Object.entries(options.dataset).forEach(([key, value]) => {
            element.dataset[key] = value;
        });
    }

    return element;
}

/**
 * Toggle class on element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name to toggle
 * @param {boolean} [force] - Force add (true) or remove (false)
 */
export function toggleClass(element, className, force) {
    if (force === undefined) {
        element.classList.toggle(className);
    } else {
        element.classList.toggle(className, force);
    }
}

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
export function isVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           style.opacity !== '0';
}

/**
 * Remove all children from element
 * @param {HTMLElement} element - Parent element
 */
export function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Add event listener with automatic cleanup
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function addEventListenerWithCleanup(element, event, handler) {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
}
