import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../content')
const outputPath = path.join(__dirname, '../src/data/content-index.json')

/**
 * Build content index from MDX files
 * Automatically adds bidirectional links
 */
function buildIndex() {
  console.log('🔨 Building content index...\n')

  const index = {}
  const types = ['muscles', 'exercises', 'goals', 'pain']
  let totalFiles = 0

  // 1. Parse all MDX files and extract frontmatter
  for (const type of types) {
    const typeDir = path.join(contentDir, type)

    if (!fs.existsSync(typeDir)) {
      console.log(`⚠️  Directory not found: ${type}/`)
      continue
    }

    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.mdx'))

    if (files.length === 0) {
      console.log(`📁 ${type}/ - no files`)
      continue
    }

    console.log(`📁 ${type}/ - ${files.length} file(s)`)

    for (const file of files) {
      const filePath = path.join(typeDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data: frontmatter } = matter(content)

      // Skip drafts
      if (frontmatter.status !== 'published') {
        console.log(`   ⏭️  Skipped (draft): ${file}`)
        continue
      }

      // Validate required fields
      if (!frontmatter.id || !frontmatter.type) {
        console.log(`   ❌ Missing id or type: ${file}`)
        continue
      }

      const slug = file.replace('.mdx', '')

      index[frontmatter.id] = {
        ...frontmatter,
        slug,
        path: `${type}/${slug}`,
        related: frontmatter.related || {}
      }

      totalFiles++
      console.log(`   ✓ ${frontmatter.id}`)
    }
  }

  console.log(`\n📊 Parsed ${totalFiles} published files\n`)

  // 2. Automatically add bidirectional links
  console.log('🔗 Adding bidirectional links...\n')

  let linksAdded = 0

  for (const entry of Object.values(index)) {
    if (!entry.related) continue

    for (const [relType, relIds] of Object.entries(entry.related)) {
      if (!Array.isArray(relIds)) continue

      for (const relId of relIds) {
        if (!index[relId]) {
          console.log(`   ⚠️  Warning: ${entry.id} references non-existent ${relId}`)
          continue
        }

        // Initialize related object if needed
        if (!index[relId].related) {
          index[relId].related = {}
        }

        // Get the plural form of the type for the related key
        const relatedKey = entry.type === 'pain' ? 'pain' : `${entry.type}s`

        if (!index[relId].related[relatedKey]) {
          index[relId].related[relatedKey] = []
        }

        // Add reverse link if it doesn't exist
        if (!index[relId].related[relatedKey].includes(entry.id)) {
          index[relId].related[relatedKey].push(entry.id)
          linksAdded++
        }
      }
    }
  }

  console.log(`✓ Added ${linksAdded} bidirectional links\n`)

  // 3. Write index to file
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2))

  console.log(`✅ Index built successfully!`)
  console.log(`   📄 ${outputPath}`)
  console.log(`   📊 ${Object.keys(index).length} entries`)
  console.log(`   🔗 ${linksAdded} bidirectional links\n`)

  return index
}

// Run the build
try {
  buildIndex()
} catch (error) {
  console.error('❌ Error building index:', error)
  process.exit(1)
}
