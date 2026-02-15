import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import musclesDictionary from '../src/data/muscles-dictionary.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const draftDir = path.join(__dirname, '../content/muscles/draft')
const publishedDir = path.join(__dirname, '../content/muscles/published')
const forceAll = process.argv.includes('--force-all')

const EMPTY_MARKER = '<!-- Добавь контент здесь -->'

/**
 * Generate frontmatter block for a muscle
 */
function generateFrontmatter(muscle) {
  const synergists = muscle.related?.muscles?.synergists || []
  const antagonists = muscle.related?.muscles?.antagonists || []

  return `---
id: ${muscle.id}
type: muscle
title: ${muscle.title}
titleShort: ${muscle.titleShort}
layer: muscles
tags: []
related:
  muscles:
    synergists: [${synergists.map(id => `${id}`).join(', ')}]
    antagonists: [${antagonists.map(id => `${id}`).join(', ')}]
  exercises: []
  goals: []
  pain: []
image: ${muscle.id}.jpg
status: draft
---`
}

/**
 * Generate complete file content with template
 */
function generateFullFile(muscle) {
  return `${generateFrontmatter(muscle)}

${EMPTY_MARKER}
`
}

/**
 * Update only frontmatter block, preserve article content
 */
function updateFrontmatter(existingContent, muscle) {
  const frontmatterRegex = /^---[\s\S]*?---/
  const newFrontmatter = generateFrontmatter(muscle)
  return existingContent.replace(frontmatterRegex, newFrontmatter)
}

/**
 * Check if file is empty (contains only template marker)
 */
function isEmpty(content) {
  return content.includes(EMPTY_MARKER)
}

/**
 * Find existing file in draft or published directories
 */
function getExistingFile(muscleId) {
  const draftPath = path.join(draftDir, `${muscleId}.mdx`)
  const publishedPath = path.join(publishedDir, `${muscleId}.mdx`)

  if (fs.existsSync(publishedPath)) {
    return { path: publishedPath, status: 'published' }
  }
  if (fs.existsSync(draftPath)) {
    return { path: draftPath, status: 'draft' }
  }
  return null
}

// Create directories if they don't exist
fs.mkdirSync(draftDir, { recursive: true })
fs.mkdirSync(publishedDir, { recursive: true })

const results = {
  created: [],
  updated: [],
  rewritten: [],
  protected: [],
  skipped: []
}

console.log('🔨 Generating muscle files...\n')

// Process each muscle from dictionary
for (const muscle of Object.values(musclesDictionary)) {
  const existing = getExistingFile(muscle.id)

  if (!existing) {
    // File doesn't exist - create new draft
    const filePath = path.join(draftDir, `${muscle.id}.mdx`)
    fs.writeFileSync(filePath, generateFullFile(muscle))
    results.created.push(muscle.id)
    continue
  }

  if (existing.status === 'published') {
    // Published files are never touched
    results.protected.push(muscle.id)
    continue
  }

  // Draft file exists - update frontmatter
  const content = fs.readFileSync(existing.path, 'utf-8')

  if (forceAll && isEmpty(content)) {
    // --force-all flag and file is empty - rewrite completely
    fs.writeFileSync(existing.path, generateFullFile(muscle))
    results.rewritten.push(muscle.id)
  } else {
    // Default behavior - update only frontmatter
    const updated = updateFrontmatter(content, muscle)
    fs.writeFileSync(existing.path, updated)
    results.updated.push(muscle.id)
  }
}

// Print results
console.log('📊 Результат генерации:\n')
console.log('='.repeat(50))

if (results.created.length) {
  console.log(`\n✓ Создано (${results.created.length}):`)
  results.created.forEach(id => console.log(`   + ${id}.mdx`))
}

if (results.updated.length) {
  console.log(`\n✓ Обновлён frontmatter (${results.updated.length}):`)
  results.updated.forEach(id => console.log(`   ~ ${id}.mdx`))
}

if (results.rewritten.length) {
  console.log(`\n✓ Перезаписано полностью (${results.rewritten.length}):`)
  results.rewritten.forEach(id => console.log(`   ⟳ ${id}.mdx`))
}

if (results.protected.length) {
  console.log(`\n→ Защищено published (${results.protected.length}):`)
  results.protected.forEach(id => console.log(`   🔒 ${id}.mdx`))
}

if (results.skipped.length) {
  console.log(`\n⚠️  Пропущено (${results.skipped.length}):`)
  results.skipped.forEach(id => console.log(`   ! ${id}.mdx`))
}

console.log('\n' + '='.repeat(50))
console.log(`\n✅ Готово! Всего мышц в словаре: ${Object.keys(musclesDictionary).length}`)
console.log(`   📝 Draft: ${results.created.length + results.updated.length + results.rewritten.length}`)
console.log(`   ✓ Published: ${results.protected.length}\n`)
