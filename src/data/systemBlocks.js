/**
 * System Blocks Data
 * Contains information blocks for simplified systems (pain, nervous, respiratory, cardiovascular, gadgets)
 */

import blocksData from './blocks.json' with { type: 'json' };

export const systemBlocks = blocksData;

/**
 * Get blocks for a specific layer
 * @param {string} layerId - Layer identifier
 * @returns {Array} Array of blocks or empty array
 */
export function getBlocksForLayer(layerId) {
    return systemBlocks[layerId] || [];
}

/**
 * Get specific block by ID
 * @param {string} layerId - Layer identifier
 * @param {string} blockId - Block identifier
 * @returns {Object|null} Block data or null
 */
export function getBlock(layerId, blockId) {
    const blocks = systemBlocks[layerId] || [];
    return blocks.find(block => block.id === blockId) || null;
}

/**
 * Get all pain issues
 * @returns {Array} Array of pain/injury blocks
 */
export function getPainIssues() {
    return systemBlocks.pain || [];
}

/**
 * Find blocks affecting a specific muscle
 * @param {string} muscleId - Muscle identifier
 * @returns {Array} Array of blocks affecting this muscle
 */
export function getBlocksAffectingMuscle(muscleId) {
    const painBlocks = systemBlocks.pain || [];
    return painBlocks.filter(block =>
        block.affectedAreas?.some(area => area.muscleId === muscleId)
    );
}
