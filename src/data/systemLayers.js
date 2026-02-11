/**
 * System Layers Configuration
 * Defines the 6 anatomical/functional layers of the application
 */

import layersData from './layers.json' with { type: 'json' };

export const systemLayers = layersData;

/**
 * Get layer by ID
 * @param {string} layerId - Layer identifier
 * @returns {Object|null} Layer configuration or null
 */
export function getLayer(layerId) {
    return systemLayers[layerId] || null;
}

/**
 * Get all layer IDs in order
 * @returns {string[]} Array of layer IDs
 */
export function getLayerIds() {
    return Object.keys(systemLayers);
}

/**
 * Get layer color
 * @param {string} layerId - Layer identifier
 * @returns {string} Hex color code
 */
export function getLayerColor(layerId) {
    return systemLayers[layerId]?.color || '#00d4ff';
}

/**
 * Check if layer has interactivity
 * @param {string} layerId - Layer identifier
 * @returns {boolean}
 */
export function isInteractiveLayer(layerId) {
    return systemLayers[layerId]?.hasInteractivity || false;
}
