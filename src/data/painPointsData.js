/**
 * Pain Points Data
 * Educational topics about pain displayed as pulsating circles on the body map
 */

import data from './painPoints.json' with { type: 'json' };

export const painPoints = data;

/**
 * Get pain points (educational topics)
 * @returns {Array} Array of pain point objects
 */
export function getPainPoints() {
    return painPoints;
}
