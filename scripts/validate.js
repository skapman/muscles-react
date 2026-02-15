import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import musclesDictionary from '../src/data/muscles-dictionary.json' with { type: 'json' }
import tagsDictionary from '../src/data/tags-dictionary.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../content')
const indexPath = path.join(__dirname, '../src/data/content-index.json')
const muscleGroupsPath = path.join(__dirname, '../src/data/muscleGroups.json')

const VALID_TYPES = ['muscle', 'exercise', 'goal', 'pain']
const VALID_STATUSES = ['draft', 'published']
const VALID_RELATED_KEYS = ['muscles', 'exercises', 'goals', 'pain']

const REQUIRED_FIELDS = {
  muscle:   ['id', 'type', 'title', 'titleShort', 'layer', 'tags', 'status'],
  exercise: ['id', 'type', 'title', 'titleShort', 'tags', 'status'],
  goal:     ['id', 'type', 'title', 'titleShort', 'tags', 'status'],
  pain:     ['id', 'type', 'title', 'titleShort', 'tags', 'status'],
}

/**
 * Validate that muscle exists in dictionary
 */
function validateMuscleInDictionary(id, prefix, errors) {
  if (!musclesDictionary[id]) {
    errors.push(`${prefix} muscle "${id}" not found in muscles-dictionary.json`)
  }
}

/**
 * Validate muscle relation IDs exist in dictionary
 */
function validateMuscleRelationIds(muscles, prefix, errors) {
  if (!muscles) return

  const ids = [
    ...(muscles.synergists || []),
    ...(muscles.antagonists || [])
  ]

  for (const id of ids) {
    if (!musclesDictionary[id]) {
      errors.push(`${prefix} related muscle "${id}" not found in muscles-dictionary.json`)
    }
  }
}

/**
 * Validate tags against dictionary
 */
function validateTags(tags, prefix, errors) {
  if (!tags || !Array.isArray(tags)) return

  for (const tag of tags) {
    if (!tagsDictionary[tag]) {
      errors.push(`${prefix} tag "${tag}" not found in tags-dictionary.json`)
    }
  }
}

/**
 * Get all MDX files from a type directory (including draft/published subdirs)
 */
function getAllMDXFiles(typeDir) {
  const files = []

  // Check for draft/ and published/ subdirectories
  const publishedDir = path.join(typeDir, 'published')
  const draftDir = path.join(typeDir, 'draft')

  if (fs.existsSync(publishedDir)) {
    const publishedFiles = fs.readdirSync(publishedDir)
      .filter(f => f.endsWith('.mdx'))
      .map(f => ({ file: f, path: path.join(publishedDir, f), subdir: 'published' }))
    files.push(...publishedFiles)
  }

  if (fs.existsSync(draftDir)) {
    const draftFiles = fs.readdirSync(draftDir)
      .filter(f => f.endsWith('.mdx'))
      .map(f => ({ file: f, path: path.join(draftDir, f), subdir: 'draft' }))
    files.push(...draftFiles)
  }

  // Fallback to reading directly from type directory if no subdirs
  if (files.length === 0 && fs.existsSync(typeDir)) {
    const directFiles = fs.readdirSync(typeDir)
      .filter(f => f.endsWith('.mdx'))
      .map(f => ({ file: f, path: path.join(typeDir, f), subdir: '' }))
    files.push(...directFiles)
  }

  return files
}

/**
 * Validate frontmatter in all MDX files
 * Returns { criticalErrors, warnings }
 */
function validateFrontmatter() {
  console.log('📋 Validating frontmatter...\n')

  const criticalErrors = []
  const warnings = []
  const types = ['muscles', 'exercises', 'goals', 'pain']
  const seenIds = new Set()

  // Load muscleGroups.json for parentId validation
  let muscleGroups = {}
  if (fs.existsSync(muscleGroupsPath)) {
    muscleGroups = JSON.parse(fs.readFileSync(muscleGroupsPath, 'utf-8'))
  }
  const validParentIds = new Set(Object.keys(muscleGroups))

  for (const type of types) {
    const typeDir = path.join(contentDir, type)
    if (!fs.existsSync(typeDir)) continue

    const files = getAllMDXFiles(typeDir)

    for (const { file, path: filePath, subdir } of files) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data: fm } = matter(content)
      const prefix = subdir ? `[${type}/${subdir}/${file}]` : `[${type}/${file}]`

      // CRITICAL: Check type
      if (!VALID_TYPES.includes(fm.type)) {
        criticalErrors.push(`${prefix} invalid type: "${fm.type}"`)
      }

      // CRITICAL: Check status
      if (!VALID_STATUSES.includes(fm.status)) {
        criticalErrors.push(`${prefix} invalid status: "${fm.status}"`)
      }

      // CRITICAL: Check required fields
      const required = REQUIRED_FIELDS[fm.type] || []
      for (const field of required) {
        if (!fm[field]) {
          criticalErrors.push(`${prefix} missing required field: "${field}"`)
        }
      }

      // CRITICAL: Check ID uniqueness
      if (fm.id) {
        if (seenIds.has(fm.id)) {
          criticalErrors.push(`${prefix} duplicate id: "${fm.id}"`)
        }
        seenIds.add(fm.id)
      }

      // CRITICAL: Check parentId for muscles
      if (fm.type === 'muscle' && fm.parentId) {
        if (!validParentIds.has(fm.parentId)) {
          criticalErrors.push(`${prefix} parentId "${fm.parentId}" not found in muscleGroups.json`)
        }
      }

      // CRITICAL: Check related structure
      if (fm.related) {
        for (const key of Object.keys(fm.related)) {
          if (!VALID_RELATED_KEYS.includes(key)) {
            criticalErrors.push(`${prefix} invalid key in related: "${key}"`)
          }
        }
      }

      // CRITICAL: Check tags is array
      if (fm.tags && !Array.isArray(fm.tags)) {
        criticalErrors.push(`${prefix} tags must be an array`)
      }

      // CRITICAL: Validate muscle exists in dictionary
      if (fm.type === 'muscle') {
        validateMuscleInDictionary(fm.id, prefix, criticalErrors)
      }

      // CRITICAL: Validate muscle relations exist in dictionary
      if (fm.type === 'muscle' && fm.related?.muscles) {
        validateMuscleRelationIds(fm.related.muscles, prefix, criticalErrors)
      }

      // CRITICAL: Validate tags against dictionary
      validateTags(fm.tags, prefix, criticalErrors)

      // WARNING: Missing image
      if (!fm.image) {
        warnings.push(`${prefix} missing image field (article will display without image)`)
      }
    }
  }

  return { criticalErrors, warnings }
}

/**
 * Validate links in content-index.json
 * Returns { criticalErrors, warnings }
 */
function validateLinks() {
  console.log('🔗 Validating links in index...\n')

  if (!fs.existsSync(indexPath)) {
    return {
      criticalErrors: ['content-index.json not found. Run "npm run build:index" first.'],
      warnings: []
    }
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
  const allIds = new Set(Object.keys(index))
  const criticalErrors = []
  const warnings = []

  for (const [id, entry] of Object.entries(index)) {
    if (!entry.related) continue

    for (const [relType, relIds] of Object.entries(entry.related)) {
      // Special handling for muscles which has synergists/antagonists structure
      if (relType === 'muscles' && typeof relIds === 'object' && !Array.isArray(relIds)) {
        // Validate synergists
        if (relIds.synergists && Array.isArray(relIds.synergists)) {
          for (const relId of relIds.synergists) {
            if (!allIds.has(relId)) {
              warnings.push(`[${id}] → related.muscles.synergists contains non-existent id: "${relId}"`)
            }
          }
        }
        // Validate antagonists
        if (relIds.antagonists && Array.isArray(relIds.antagonists)) {
          for (const relId of relIds.antagonists) {
            if (!allIds.has(relId)) {
              warnings.push(`[${id}] → related.muscles.antagonists contains non-existent id: "${relId}"`)
            }
          }
        }
        continue
      }

      // Standard array validation for other relation types
      if (!Array.isArray(relIds)) {
        criticalErrors.push(`[${id}] related.${relType} is not an array`)
        continue
      }

      for (const relId of relIds) {
        if (!allIds.has(relId)) {
          // WARNING: Non-existent related - content not created yet
          warnings.push(`[${id}] → related.${relType} contains non-existent id: "${relId}"`)
        }
      }
    }
  }

  return { criticalErrors, warnings }
}

/**
 * Validate ContentLink components in MDX files
 * Returns { criticalErrors, warnings }
 */
function validateContentLinks() {
  console.log('🔗 Validating ContentLink in MDX...\n')

  if (!fs.existsSync(indexPath)) {
    return {
      criticalErrors: ['content-index.json not found. Run "npm run build:index" first.'],
      warnings: []
    }
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
  const allIds = new Set(Object.keys(index))
  const criticalErrors = []
  const warnings = []
  const types = ['muscles', 'exercises', 'goals', 'pain']

  const contentLinkRegex = /<ContentLink\s+id=["']([^"']+)["']/g

  for (const type of types) {
    const typeDir = path.join(contentDir, type)
    if (!fs.existsSync(typeDir)) continue

    const files = getAllMDXFiles(typeDir)

    for (const { file, path: filePath, subdir } of files) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const prefix = subdir ? `[${type}/${subdir}/${file}]` : `[${type}/${file}]`

      let match
      while ((match = contentLinkRegex.exec(content)) !== null) {
        const linkedId = match[1]
        if (!allIds.has(linkedId)) {
          // CRITICAL: Broken link visible to user in article text
          criticalErrors.push(`${prefix} <ContentLink id="${linkedId}"> references non-existent id`)
        }
      }
    }
  }

  return { criticalErrors, warnings }
}

/**
 * Run all validations
 */
function validate() {
  console.log('🔍 Running validation...\n')
  console.log('='.repeat(50))
  console.log('\n')

  const frontmatter = validateFrontmatter()
  const links = validateLinks()
  const contentLinks = validateContentLinks()

  const allCriticalErrors = [
    ...frontmatter.criticalErrors,
    ...links.criticalErrors,
    ...contentLinks.criticalErrors
  ]

  const allWarnings = [
    ...frontmatter.warnings,
    ...links.warnings,
    ...contentLinks.warnings
  ]

  console.log('='.repeat(50))
  console.log('\n')

  // Show critical errors first
  if (allCriticalErrors.length > 0) {
    console.error('❌ CRITICAL ERRORS (will break UI/data):\n')
    allCriticalErrors.forEach(e => console.error('  ✗', e))
    console.log('\n')
    process.exit(1)
  }

  // Show warnings
  if (allWarnings.length > 0) {
    console.warn('⚠️  Warnings (non-critical):\n')
    allWarnings.forEach(e => console.warn('  ⚠️ ', e))
    console.log('\n')
    console.log('ℹ️  These are OK - content will work but may be incomplete')
    console.log('   • Non-existent related IDs → fewer graph connections')
    console.log('   • Missing images → articles without pictures')
    console.log('\n')
  }

  // Success
  if (allCriticalErrors.length === 0) {
    console.log('✅ Validation passed!\n')
    if (allWarnings.length === 0) {
      console.log('  ✓ No critical errors')
      console.log('  ✓ No warnings')
    } else {
      console.log('  ✓ No critical errors')
      console.log(`  ⚠️  ${allWarnings.length} warning(s) - safe to proceed`)
    }
    console.log('\n')
  }
}

// Run validation
try {
  validate()
} catch (error) {
  console.error('❌ Error during validation:', error)
  process.exit(1)
}
