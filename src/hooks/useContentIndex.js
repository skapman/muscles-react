import contentIndex from '../data/content-index.json'

/**
 * Hook for accessing content index
 * Provides helper functions for working with content data
 */
export function useContentIndex() {
  return contentIndex
}

/**
 * Get all nodes of a specific type
 * @param {string} type - 'muscle', 'exercise', 'goal', or 'pain'
 * @returns {Array} Array of entries of the specified type
 */
export function getNodesByType(type) {
  return Object.values(contentIndex).filter(entry => entry.type === type)
}

/**
 * Get a single entry by ID
 * @param {string} id - The entry ID
 * @returns {Object|null} The entry or null if not found
 */
export function getEntryById(id) {
  return contentIndex[id] || null
}

/**
 * Get all related nodes for a given entry
 * @param {string} id - The entry ID
 * @returns {Array} Array of related entries (only existing ones)
 */
export function getRelatedNodes(id) {
  const entry = contentIndex[id]
  if (!entry?.related) return []

  const related = []

  // Iterate through all related types (muscles, exercises, goals, pain)
  for (const ids of Object.values(entry.related)) {
    if (!Array.isArray(ids)) continue

    for (const relId of ids) {
      // Only add if the related entry exists (graceful handling of missing content)
      if (contentIndex[relId]) {
        related.push(contentIndex[relId])
      }
    }
  }

  return related
}

/**
 * Get related nodes grouped by type
 * @param {string} id - The entry ID
 * @returns {Object} Object with keys: muscles, exercises, goals, pain
 */
export function getRelatedNodesByType(id) {
  const entry = contentIndex[id]
  if (!entry?.related) return { muscles: [], exercises: [], goals: [], pain: [] }

  const result = {
    muscles: [],
    exercises: [],
    goals: [],
    pain: []
  }

  for (const [type, ids] of Object.entries(entry.related)) {
    if (!Array.isArray(ids)) continue

    for (const relId of ids) {
      if (contentIndex[relId]) {
        result[type].push(contentIndex[relId])
      }
    }
  }

  return result
}

/**
 * Build graph data for D3.js visualization
 * Creates nodes and links from the content index
 * @returns {Object} { nodes: Array, links: Array }
 */
export function buildGraphData() {
  // Build nodes array
  const nodes = Object.values(contentIndex).map(entry => ({
    id: entry.id,
    label: entry.titleShort || entry.title,
    type: entry.type,
    layer: entry.layer,
    title: entry.title
  }))

  // Build links array (deduplicated)
  const links = []
  const seen = new Set()

  for (const entry of Object.values(contentIndex)) {
    if (!entry.related) continue

    for (const relIds of Object.values(entry.related)) {
      if (!Array.isArray(relIds)) continue

      for (const relId of relIds) {
        // Only create link if target exists
        if (!contentIndex[relId]) continue

        // Create a unique key for this link (sorted to avoid duplicates)
        const key = [entry.id, relId].sort().join('--')

        if (!seen.has(key)) {
          seen.add(key)
          links.push({
            source: entry.id,
            target: relId,
            from: entry.id,  // Legacy support
            to: relId        // Legacy support
          })
        }
      }
    }
  }

  return { nodes, links }
}

/**
 * Search entries by title or tags
 * @param {string} query - Search query
 * @returns {Array} Array of matching entries
 */
export function searchEntries(query) {
  if (!query || query.trim().length === 0) return []

  const lowerQuery = query.toLowerCase().trim()

  return Object.values(contentIndex).filter(entry => {
    // Search in title
    if (entry.title?.toLowerCase().includes(lowerQuery)) return true
    if (entry.titleShort?.toLowerCase().includes(lowerQuery)) return true

    // Search in tags
    if (entry.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true

    return false
  })
}

/**
 * Get statistics about content
 * @returns {Object} Statistics object
 */
export function getContentStats() {
  const entries = Object.values(contentIndex)

  return {
    total: entries.length,
    muscles: entries.filter(e => e.type === 'muscle').length,
    exercises: entries.filter(e => e.type === 'exercise').length,
    goals: entries.filter(e => e.type === 'goal').length,
    pain: entries.filter(e => e.type === 'pain').length,
    published: entries.filter(e => e.status === 'published').length,
    draft: entries.filter(e => e.status === 'draft').length
  }
}
