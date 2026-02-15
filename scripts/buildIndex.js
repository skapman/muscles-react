import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import musclesDictionary from '../src/data/muscles-dictionary.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../content')
const outputPath = path.join(__dirname, '../src/data/content-index.json')

/**
 * Enrich muscle entry with data from dictionary
 */
function enrichMuscleEntry(entry) {
  const dictEntry = musclesDictionary[entry.id]
  if (!dictEntry) {
    console.warn(`   ⚠️  Muscle "${entry.id}" not found in muscles-dictionary.json`)
    return entry
  }

  // Get muscle relations from dictionary
  const muscleRelations = dictEntry.related?.muscles || { synergists: [], antagonists: [] }

  return {
    ...entry,
    titleEn: dictEntry.titleEn,
    titleLatin: dictEntry.titleLatin,
    synonyms: dictEntry.synonyms,
    groupId: dictEntry.groupId,
    groupTitle: dictEntry.groupTitle,
    groupTitleEn: dictEntry.groupTitleEn,
    regionTitle: dictEntry.regionTitle,
    regionTitleEn: dictEntry.regionTitleEn,
    zoneTitle: dictEntry.zoneTitle,
    zoneTitleEn: dictEntry.zoneTitleEn,
    svgIds: dictEntry.svgIds,
    // Automatically populate muscle relations from dictionary
    related: {
      ...entry.related,
      muscles: muscleRelations
    }
  }
}

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

    // Check for draft/ and published/ subdirectories
    const publishedDir = path.join(typeDir, 'published')
    const draftDir = path.join(typeDir, 'draft')

    const dirs = []
    if (fs.existsSync(publishedDir)) dirs.push({ path: publishedDir, label: 'published' })
    if (fs.existsSync(draftDir)) dirs.push({ path: draftDir, label: 'draft' })

    // Fallback to reading directly from type directory if no subdirs
    if (dirs.length === 0) {
      dirs.push({ path: typeDir, label: '' })
    }

    let typeFileCount = 0

    for (const dir of dirs) {
      const files = fs.readdirSync(dir.path).filter(f => f.endsWith('.mdx'))

      if (files.length === 0) continue

      for (const file of files) {
        const filePath = path.join(dir.path, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const { data: frontmatter } = matter(content)

        // Validate required fields
        if (!frontmatter.id || !frontmatter.type) {
          console.log(`   ❌ Missing id or type: ${file}`)
          continue
        }

        const slug = file.replace('.mdx', '')

        let entry = {
          ...frontmatter,
          slug,
          path: `${type}/${slug}`,
          related: frontmatter.related || {}
        }

        // Enrich muscle entries with dictionary data
        if (frontmatter.type === 'muscle') {
          entry = enrichMuscleEntry(entry)
        }

        index[frontmatter.id] = entry
        typeFileCount++
        totalFiles++
        console.log(`   ✓ ${frontmatter.id}`)
      }
    }

    if (typeFileCount > 0) {
      console.log(`📁 ${type}/ - ${typeFileCount} file(s)`)
    } else {
      console.log(`📁 ${type}/ - no published files`)
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
