import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dictPath = path.join(__dirname, '../src/data/muscles-dictionary.json')

const dict = JSON.parse(fs.readFileSync(dictPath, 'utf-8'))

// Маппинг связей для всех мышц
const relations = {
  "trapezius-upper": {
    "synergists": ["levator-scapulae", "sternocleidomastoid", "deltoid-medial-lateral"],
    "antagonists": ["trapezius-lower", "serratus-anterior", "rhomboids"]
  },
  "trapezius-middle": {
    "synergists": ["rhomboids", "deltoid-posterior", "infraspinatus-teres-minor"],
    "antagonists": ["serratus-anterior", "pectoralis-minor"]
  },
  "trapezius-lower": {
    "synergists": ["serratus-anterior", "rhomboids"],
    "antagonists": ["trapezius-upper", "levator-scapulae"]
  },
  "latissimus-dorsi-teres-major": {
    "synergists": ["triceps-brachii", "deltoid-posterior", "subscapularis"],
    "antagonists": ["deltoid-anterior", "deltoid-medial-lateral", "biceps-brachii", "supraspinatus"]
  },
  "rhomboids": {
    "synergists": ["trapezius-middle", "deltoid-posterior"],
    "antagonists": ["serratus-anterior", "pectoralis-minor", "pectoralis-major"]
  },
  "levator-scapulae": {
    "synergists": ["trapezius-upper", "sternocleidomastoid"],
    "antagonists": ["trapezius-lower", "serratus-anterior"]
  },
  "erector-spinae": {
    "synergists": ["gluteus", "hamstrings", "quadratus-lumborum"],
    "antagonists": ["rectus-abdominis", "obliques", "hip-flexors"]
  },
  "quadratus-lumborum": {
    "synergists": ["erector-spinae", "obliques", "gluteus"],
    "antagonists": ["hip-adductors", "hip-flexors"]
  },
  "pectoralis-major": {
    "synergists": ["deltoid-anterior", "biceps-brachii", "subscapularis"],
    "antagonists": ["trapezius-middle", "rhomboids", "deltoid-posterior", "infraspinatus-teres-minor"]
  },
  "pectoralis-minor": {
    "synergists": ["serratus-anterior"],
    "antagonists": ["trapezius-lower", "trapezius-middle", "rhomboids"]
  },
  "serratus-anterior": {
    "synergists": ["trapezius-lower", "pectoralis-minor"],
    "antagonists": ["trapezius-upper", "rhomboids", "levator-scapulae"]
  },
  "rectus-abdominis": {
    "synergists": ["obliques", "hip-flexors"],
    "antagonists": ["erector-spinae", "quadratus-lumborum"]
  },
  "obliques": {
    "synergists": ["rectus-abdominis", "quadratus-lumborum"],
    "antagonists": ["erector-spinae", "latissimus-dorsi-teres-major"]
  },
  "gluteus": {
    "synergists": ["hamstrings", "erector-spinae", "abductors"],
    "antagonists": ["hip-flexors", "rectus-abdominis"]
  },
  "abductors": {
    "synergists": ["gluteus", "deep-external-rotators"],
    "antagonists": ["hip-adductors"]
  },
  "hip-flexors": {
    "synergists": ["rectus-abdominis", "quadriceps", "sartorius"],
    "antagonists": ["gluteus", "hamstrings", "erector-spinae"]
  },
  "hip-adductors": {
    "synergists": ["hip-flexors", "sartorius"],
    "antagonists": ["abductors", "gluteus", "deep-external-rotators"]
  },
  "deep-external-rotators": {
    "synergists": ["gluteus", "abductors"],
    "antagonists": ["hip-adductors", "hip-flexors"]
  },
  "quadriceps": {
    "synergists": ["hip-flexors", "sartorius"],
    "antagonists": ["hamstrings", "gluteus"]
  },
  "hamstrings": {
    "synergists": ["gluteus", "erector-spinae", "gastrocnemius"],
    "antagonists": ["quadriceps", "hip-flexors"]
  },
  "sartorius": {
    "synergists": ["hip-flexors", "hip-adductors", "quadriceps"],
    "antagonists": ["deep-external-rotators", "abductors"]
  },
  "gastrocnemius": {
    "synergists": ["soleus", "hamstrings"],
    "antagonists": ["tibialis-anterior", "hip-flexors"]
  },
  "soleus": {
    "synergists": ["gastrocnemius"],
    "antagonists": ["tibialis-anterior"]
  },
  "tibialis-anterior": {
    "synergists": ["deep-external-rotators"],
    "antagonists": ["gastrocnemius", "soleus"]
  }
}

// Добавить связи к мышцам
for (const [muscleId, muscleRelations] of Object.entries(relations)) {
  if (dict[muscleId]) {
    dict[muscleId].related = {
      muscles: muscleRelations
    }
  }
}

// Сохранить обновленный словарь
fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2) + '\n')
console.log('✅ Muscle relations added successfully!')
console.log(`   Updated ${Object.keys(relations).length} muscles with relations`)
