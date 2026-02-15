import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import musclesDictionary from '../src/data/muscles-dictionary.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../content')

/**
 * Count files in draft and published directories
 */
function countFiles(dir) {
  const draftPath = path.join(dir, 'draft')
  const publishedPath = path.join(dir, 'published')

  let published = 0
  let draft = 0

  if (fs.existsSync(publishedPath)) {
    published = fs.readdirSync(publishedPath).filter(f => f.endsWith('.mdx')).length
  }

  if (fs.existsSync(draftPath)) {
    draft = fs.readdirSync(draftPath).filter(f => f.endsWith('.mdx')).length
  }

  return { published, draft, total: published + draft }
}

/**
 * Generate progress bar
 */
function bar(published, total, width = 20) {
  if (total === 0) return '─'.repeat(width)
  const filled = Math.round((published / total) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

const types = [
  { label: 'Мышцы',      dir: 'muscles',   total: Object.keys(musclesDictionary).length },
  { label: 'Упражнения', dir: 'exercises',  total: null },
  { label: 'Цели',       dir: 'goals',      total: null },
  { label: 'Боли',       dir: 'pain',       total: null },
]

console.log('\n📊 Fascia — статус контента\n')
console.log('─'.repeat(52))

for (const type of types) {
  const counts = countFiles(path.join(contentDir, type.dir))
  const total = type.total || counts.total
  const pct = total ? Math.round((counts.published / total) * 100) : 0
  const label = type.label.padEnd(12)
  const progress = `${counts.published}/${total}`.padStart(6)

  console.log(`${label} ${bar(counts.published, total)}  ${progress}  ${pct}%`)
  console.log(`             draft: ${counts.draft}`)
}

console.log('─'.repeat(52))
console.log()
