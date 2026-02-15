
# Fascia — План реализации контентного пайплайна

## Контекст проекта

**Fascia** — образовательный веб-сервис по анатомии и фитнесу. Помогает людям понимать как устроено тело, тренироваться безопасно и избегать травм.

**Технологический стек:**
- React 19.2.0 + React Router DOM 7.13.0
- Vite 8.0.0-beta.13
- D3.js 7.9.0 (граф связей)
- Context API (без внешнего state management)
- CSS Modules / обычный CSS

**Текущее состояние проекта:**
- Реализован онбординг с дисклеймером
- Реализовано бургер-меню и навигация
- Реализованы интерактивные SVG-слои тела (6 слоёв: мышцы, боли, нервная система, дыхательная, сердечно-сосудистая, гаджеты)
- Реализован граф связей на D3.js
- Контент сейчас хранится в JS-модулях: `muscleData.js`, `goalData.js`, `exerciseData.js`, `painPointsData.js`
- Большая часть контента — TODO-заглушки

---

## Проблема которую решаем

Текущий способ хранения контента в JS-модулях не масштабируется:
- Смешивает данные и логику
- Неудобно редактировать статьи
- Нет единого индекса для графа и поиска
- Нет системы связей между статьями
- Нельзя удобно добавлять новый контент не касаясь кода

**Цель:** построить пайплайн где добавление новой статьи = создание одного MDX файла с frontmatter. Всё остальное (граф, поиск, кросс-ссылки) подхватывается автоматически.

---

## Четыре типа контента

Сервис содержит четыре типа сущностей, между которыми строятся связи:

1. **muscles** — мышцы (ягодичная, квадрицепс, трапеция...)
2. **exercises** — упражнения (приседания, становая тяга, подтягивания...)
3. **goals** — цели (набор массы, развитие силы, реабилитация...)
4. **pain** — боли и травмы (боль в пояснице, колене, плече...)

Между ними существуют связи:
- Мышца ↔ Упражнения которые её задействуют
- Мышца ↔ Боли которые с ней связаны
- Упражнение ↔ Цели которым оно служит
- Боль ↔ Безопасные упражнения при восстановлении
- и т.д.

Граф связей визуализирует именно эти отношения.

---

## Архитектура пайплайна

```
[Автор пишет MDX файл с односторонними связями]
        ↓
[content/ папка в репозитории]
        ↓
[buildIndex.js — индексация + автодостройка обратных связей]
        ↓
[content-index.json — единый источник правды с двусторонними связями]
        ↓
    ┌───┴────────────────────┐
    ↓                        ↓
[Граф D3.js]          [Статьи / поиск /
[автоузлы]             кросс-ссылки]
```

---

## Файловая структура контента

Создать папку `content/` в корне проекта (рядом с `src/`):

```
content/
├── muscles/
│   ├── gluteus.mdx
│   ├── quadriceps.mdx
│   ├── trapezius.mdx
│   └── ...
├── exercises/
│   ├── squat.mdx
│   ├── deadlift.mdx
│   ├── bench-press.mdx
│   └── ...
├── goals/
│   ├── muscle-mass.mdx
│   ├── strength.mdx
│   ├── rehabilitation.mdx
│   └── ...
└── pain/
    ├── lower-back.mdx
    ├── knee.mdx
    ├── shoulder.mdx
    └── ...
```

Изображения:
```
public/
└── content-images/
    ├── muscles/
    │   ├── gluteus.jpg
    │   ├── deltoid-anterior.jpg
    │   └── ...
    ├── exercises/
    ├── goals/
    └── pain/
```

---

## Схема Frontmatter

Frontmatter — это блок метаданных в начале каждого MDX файла. Он определяет все связи, теги и свойства статьи.

### Для типа `muscle` (с группировкой — например дельта):

```yaml
---
id: deltoid-anterior
type: muscle
title: Передняя дельтовидная мышца
titleShort: Передняя дельта
layer: muscles
parentId: deltoid
tags: [плечо, дельта, верхняя часть тела]
related:
  muscles: [deltoid-middle, deltoid-posterior, pectoralis]
  exercises: [overhead-press, front-raise, bench-press]
  goals: [muscle-mass, strength]
  pain: [shoulder]
image: deltoid-anterior.jpg
status: published
---
```

**Конфиг групп мышц** (отдельный файл `src/data/muscleGroups.json`):
```json
{
  "deltoid": {
    "title": "Дельтовидная мышца",
    "titleEn": "Deltoid",
    "parts": ["anterior", "middle", "posterior"]
  },
  "trapezius": {
    "title": "Трапециевидная мышца",
    "titleEn": "Trapezius",
    "parts": ["upper", "middle", "lower"]
  }
}
```

### Для типа `muscle` (без группировки — например ягодичная):

```yaml
---
id: gluteus
type: muscle
title: Ягодичная мышца
titleShort: Ягодичная
layer: muscles
tags: [ягодицы, бёдра, нижняя часть тела]
related:
  muscles: [quadriceps, erector-spinae, hamstrings]
  exercises: [squat, deadlift, hip-thrust, lunge]
  goals: [muscle-mass, strength, rehabilitation]
  pain: [lower-back, knee]
image: gluteus.jpg
status: published
---
```

### Для типа `exercise`:

```yaml
---
id: squat
type: exercise
title: Приседания со штангой
titleShort: Приседания
tags: [базовое, нижняя часть тела, квадрицепс, ягодицы]
related:
  muscles: [quadriceps, gluteus, hamstrings, erector-spinae]
  exercises: [leg-press, lunge, deadlift]
  goals: [muscle-mass, strength]
  pain: [knee]
equipment: [barbell, rack]
image: squat.jpg
status: published
---
```

### Для типа `goal`:

```yaml
---
id: muscle-mass
type: goal
title: Набор мышечной массы
titleShort: Масса
tags: [гипертрофия, питание, восстановление]
related:
  muscles: [gluteus, quadriceps, pectoralis]
  exercises: [squat, deadlift, bench-press]
  goals: [strength]
  pain: []
image: muscle-mass.jpg
status: published
---
```

### Для типа `pain`:

```yaml
---
id: lower-back
type: pain
title: Боль в пояснице
titleShort: Поясница
tags: [поясница, спина, хроническая, протрузия]
related:
  muscles: [gluteus, erector-spinae, iliopsoas]
  exercises: [bird-dog, deadbug, hip-thrust]
  goals: [rehabilitation]
  pain: [knee]
image: lower-back.jpg
status: published
---
```

**Поля frontmatter:**
- `id` — уникальный идентификатор, используется в URL и для связей. Глобально уникален
- `type` — тип сущности: muscle / exercise / goal / pain
- `title` — полное название
- `titleShort` — короткое название для графа и карточек
- `layer` — к какому слою SVG-визуализации относится (только для muscles, обязательное)
- `parentId` — id родительской группы мышц (только для muscles с группировкой, например deltoid)
- `tags` — теги для фильтрации и поиска
- `related` — связи с другими сущностями по id (указываются только в одну сторону, обратные добавляются автоматически)
- `equipment` — только для exercises, список необходимого оборудования
- `image` — имя файла изображения (относительно `/public/content-images/{type}/`)
- `status` — draft / published (draft не показывается в сервисе но существует в репозитории)

**Важно:** Связи в frontmatter указываются только в одну сторону. Скрипт `buildIndex.js` автоматически достраивает обратные связи в индексе.

---

## Шаг 1 — Подключение MDX в Vite

### Установка зависимостей:

```bash
npm install @mdx-js/rollup @mdx-js/react remark-frontmatter remark-mdx-frontmatter gray-matter
```

### Опционально — оптимизация изображений:

```bash
npm install vite-plugin-image-optimizer
```

### Изменение `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import imageOptimizer from 'vite-plugin-image-optimizer' // опционально

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter
      ]
    }),
    react(),
    // Опционально: оптимизация изображений
    imageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 }
    })
  ]
})
```

### Проверка что работает:

Создать тестовый файл `content/muscles/gluteus.mdx`:

```mdx
---
id: gluteus
type: muscle
title: Ягодичная мышца
titleShort: Ягодичная
layer: muscles
tags: [ягодицы, бёдра]
related:
  muscles: [quadriceps]
  exercises: [squat]
  goals: [muscle-mass]
  pain: [lower-back]
image: gluteus.jpg
status: published
---

## Где находится

Ягодичная мышца — самая крупная мышца тела...

## Что делает

Отвечает за разгибание бедра и стабилизацию таза...

![Ягодичная мышца](/content-images/muscles/gluteus.jpg)
```

Импортировать в любой компонент и проверить рендер:

```javascript
import GluteusArticle, { frontmatter } from '../../content/muscles/gluteus.mdx'

// frontmatter содержит все метаданные
// GluteusArticle рендерит текст статьи как React-компонент
```

---

## Шаг 2 — Скрипт индексации с автодостройкой связей

Создать `scripts/buildIndex.js`:

```javascript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, '../content')
const outputPath = path.join(__dirname, '../src/data/content-index.json')

function buildIndex() {
  const index = {}
  const types = ['muscles', 'exercises', 'goals', 'pain']

  // 1. Парсинг всех MDX файлов
  for (const type of types) {
    const typeDir = path.join(contentDir, type)
    if (!fs.existsSync(typeDir)) continue

    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const filePath = path.join(typeDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data: frontmatter } = matter(content)

      if (frontmatter.status !== 'published') continue

      index[frontmatter.id] = {
        ...frontmatter,
        slug: file.replace('.mdx', ''),
        path: `${type}/${file.replace('.mdx', '')}`,
        related: frontmatter.related || {}
      }
    }
  }

  // 2. Автоматическое добавление обратных связей
  for (const entry of Object.values(index)) {
    if (!entry.related) continue

    for (const [relType, relIds] of Object.entries(entry.related)) {
      for (const relId of relIds) {
        if (index[relId]) {
          // Инициализировать related если нет
          index[relId].related = index[relId].related || {}
          index[relId].related[entry.type] = index[relId].related[entry.type] || []

          // Добавить обратную связь если её нет
          if (!index[relId].related[entry.type].includes(entry.id)) {
            index[relId].related[entry.type].push(entry.id)
          }
        }
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2))
  console.log(`✓ Index built: ${Object.keys(index).length} entries`)
  console.log(`✓ Bidirectional links added automatically`)
  return index
}

buildIndex()
```

Добавить в `package.json`:

```json
{
  "scripts": {
    "dev": "npm run build:index && vite",
    "build": "npm run build:index && npm run validate && vite build",
    "build:index": "node scripts/buildIndex.js",
    "validate": "node scripts/validate.js"
  }
}
```

---

## Шаг 3 — Объединённая валидация

Создать `scripts/validate.js`:

```javascript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

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

// 1. Валидация frontmatter
function validateFrontmatter() {
  const errors = []
  const types = ['muscles', 'exercises', 'goals', 'pain']
  const seenIds = new Set()

  // Загрузить muscleGroups.json для проверки parentId
  let muscleGroups = {}
  if (fs.existsSync(muscleGroupsPath)) {
    muscleGroups = JSON.parse(fs.readFileSync(muscleGroupsPath, 'utf-8'))
  }
  const validParentIds = new Set(Object.keys(muscleGroups))

  for (const type of types) {
    const typeDir = path.join(contentDir, type)
    if (!fs.existsSync(typeDir)) continue

    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const filePath = path.join(typeDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data: fm } = matter(content)
      const prefix = `[${type}/${file}]`

      // Проверка type
      if (!VALID_TYPES.includes(fm.type)) {
        errors.push(`${prefix} invalid type: "${fm.type}"`)
      }

      // Проверка status
      if (!VALID_STATUSES.includes(fm.status)) {
        errors.push(`${prefix} invalid status: "${fm.status}"`)
      }

      // Проверка обязательных полей
      const required = REQUIRED_FIELDS[fm.type] || []
      for (const field of required) {
        if (!fm[field]) {
          errors.push(`${prefix} missing required field: "${field}"`)
        }
      }

      // Проверка уникальности id
      if (seenIds.has(fm.id)) {
        errors.push(`${prefix} duplicate id: "${fm.id}"`)
      }
      seenIds.add(fm.id)

      // Проверка parentId для мышц
      if (fm.type === 'muscle' && fm.parentId) {
        if (!validParentIds.has(fm.parentId)) {
          errors.push(`${prefix} parentId "${fm.parentId}" not found in muscleGroups.json`)
        }
      }

      // Проверка структуры related
      if (fm.related) {
        for (const key of Object.keys(fm.related)) {
          if (!VALID_RELATED_KEYS.includes(key)) {
            errors.push(`${prefix} invalid key in related: "${key}"`)
          }
        }
      }
    }
  }

  return errors
}

// 2. Валидация связей в индексе
function validateLinks() {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
  const allIds = new Set(Object.keys(index))
  const errors = []

  for (const [id, entry] of Object.entries(index)) {
    if (!entry.related) continue

    for (const [relType, relIds] of Object.entries(entry.related)) {
      for (const relId of relIds) {
        if (!allIds.has(relId)) {
          errors.push(`[${id}] → related.${relType} contains non-existent id: "${relId}"`)
        }
      }
    }
  }

  return errors
}

// 3. Валидация ContentLink в MDX
function validateContentLinks() {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
  const allIds = new Set(Object.keys(index))
  const errors = []
  const types = ['muscles', 'exercises', 'goals', 'pain']

  const contentLinkRegex = /<ContentLink\s+id=["']([^"']+)["']/g

  for (const type of types) {
    const typeDir = path.join(contentDir, type)
    if (!fs.existsSync(typeDir)) continue

    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const filePath = path.join(typeDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const prefix = `[${type}/${file}]`

      let match
      while ((match = contentLinkRegex.exec(content)) !== null) {
        const linkedId = match[1]
        if (!allIds.has(linkedId)) {
          errors.push(`${prefix} <ContentLink id="${linkedId}"> references non-existent id`)
        }
      }
    }
  }

  return errors
}

// Запуск всех проверок
function validate() {
  console.log('Running validation...\n')

  const frontmatterErrors = validateFrontmatter()
  const linkErrors = validateLinks()
  const contentLinkErrors = validateContentLinks()

  const allErrors = [...frontmatterErrors, ...linkErrors, ...contentLinkErrors]

  if (allErrors.length > 0) {
    console.error('❌ Validation failed:\n')
    allErrors.forEach(e => console.error(' ✗', e))
    process.exit(1)
  } else {
    console.log('✓ Frontmatter validation passed (including parentId check)')
    console.log('✓ Link validation passed')
    console.log('✓ ContentLink validation passed')
    console.log('\n✅ All validation checks passed')
  }
}

validate()
```

---

## Шаг 4 — Подключение индекса к графу

Текущий граф в `useGraphData.js` читает данные из JS-модулей. Нужно переключить на `content-index.json`.

Создать хук `useContentIndex.js`:

```javascript
import contentIndex from '../data/content-index.json'

export function useContentIndex() {
  return contentIndex
}

export function getNodesByType(type) {
  return Object.values(contentIndex).filter(entry => entry.type === type)
}

export function getRelatedNodes(id) {
  const entry = contentIndex[id]
  if (!entry?.related) return []

  const related = []
  for (const ids of Object.values(entry.related)) {
    for (const relId of ids) {
      if (contentIndex[relId]) {
        related.push(contentIndex[relId])
      }
    }
  }
  return related
}

export function buildGraphData() {
  const nodes = Object.values(contentIndex).map(entry => ({
    id: entry.id,
    label: entry.titleShort || entry.title,
    type: entry.type,
    layer: entry.layer
  }))

  const links = []
  const seen = new Set()

  for (const entry of Object.values(contentIndex)) {
    if (!entry.related) continue
    for (const relIds of Object.values(entry.related)) {
      for (const relId of relIds) {
        const key = [entry.id, relId].sort().join('--')
        if (!seen.has(key) && contentIndex[relId]) {
          seen.add(key)
          links.push({ source: entry.id, target: relId })
        }
      }
    }
  }

  return { nodes, links }
}
```

В `useGraphData.js` заменить источник данных на `buildGraphData()` из этого хука.

---

## Шаг 5 — Рендеринг статей

Создать компонент `ArticleView.jsx`:

```javascript
import { useParams } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import contentIndex from '../data/content-index.json'

// Предзагрузка всех MDX файлов через import.meta.glob
const articles = import.meta.glob('../../content/**/*.mdx', { eager: false })

export default function ArticleView() {
  const { type, slug } = useParams()
  const entry = Object.values(contentIndex).find(
    e => e.slug === slug && e.type === type
  )

  if (!entry) {
    return <div className="article-not-found">Статья не найдена</div>
  }

  // Получаем компонент из предзагруженных модулей
  const articlePath = `../../content/${type}/${slug}.mdx`
  const ArticleModule = articles[articlePath]

  if (!ArticleModule) {
    return <div className="article-not-found">Статья не найдена</div>
  }

  return (
    <div className="article-view">
      <header className="article-header">
        <h1>{entry.title}</h1>
        {entry.tags && (
          <div className="article-tags">
            {entry.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </header>

      <Suspense fallback={<div className="loading">Загрузка...</div>}>
        <ArticleContent module={ArticleModule} />
      </Suspense>

      {/* Связанные материалы */}
      <RelatedPanel related={entry.related} />
    </div>
  )
}

function ArticleContent({ module }) {
  const [Article, setArticle] = useState(null)

  useEffect(() => {
    module().then(mod => setArticle(() => mod.default))
  }, [module])

  if (!Article) return <div className="loading">Загрузка...</div>

  return <Article />
}
```

Добавить роуты в `App.jsx`:

```javascript
<Route path="/muscles/:slug" element={<ArticleView />} />
<Route path="/exercises/:slug" element={<ArticleView />} />
<Route path="/goals/:slug" element={<ArticleView />} />
<Route path="/pain/:slug" element={<ArticleView />} />
```

Заметка:
```const ArticleModule = articles[articlePath]
// Дальше используется как компонент, но это функция-импортёр```

import.meta.glob с eager: false возвращает функции-импортёры, а не сами модули. Коллега правильно показал паттерн через useEffect + useState в ArticleContent — но в коде выше ArticleModule передаётся напрямую без вызова. Это нужно будет проверить при реализации.

---

## Шаг 6 — Кросс-ссылки в тексте

Создать компонент `ContentLink.jsx`:

```javascript
import { Link } from 'react-router-dom'
import contentIndex from '../data/content-index.json'

export default function ContentLink({ id, children }) {
  const entry = contentIndex[id]
  if (!entry) return <span>{children || id}</span>

  return (
    <Link to={`/${entry.type}/${entry.slug}`} className="content-link">
      {children || entry.title}
    </Link>
  )
}
```

Использование в MDX:

```mdx
При слабых ягодичных компенсаторно перегружается
<ContentLink id="lower-back">поясница</ContentLink> —
именно поэтому боль в спине часто лечится через
укрепление <ContentLink id="gluteus">ягодичных мышц</ContentLink>.
```

---

## Миграция существующих данных

После того как пайплайн работает на одном примере — мигрировать данные из существующих JS-модулей.

**Порядок миграции:**

1. `muscleData.js` → `content/muscles/*.mdx` (8 мышц)
2. `goalData.js` → `content/goals/*.mdx` (5 целей)
3. `exerciseData.js` → `content/exercises/*.mdx` (25+ упражнений)
4. `painPointsData.js` → `content/pain/*.mdx` (7 тем)

После миграции каждого модуля — запускать валидацию и проверять граф.

Старые JS-модули не удалять до полной проверки что всё работает.

---

## Итоговый план по дням

| День | Задача | Результат |
|------|--------|-----------|
| 1 | Создать структуру `content/` и `public/content-images/`, написать один тестовый MDX файл | Файл существует |
| 2 | Подключить MDX в Vite, проверить импорт и рендер | MDX рендерится |
| 3 | Написать `buildIndex.js` с автодостройкой связей, проверить на одном файле | JSON индекс генерируется |
| 4 | Написать объединённый `validate.js`, интегрировать в build | Валидация работает |
| 5-6 | Подключить индекс к графу через `useContentIndex.js` | Граф читает из индекса |
| 7 | Реализовать `ArticleView.jsx` и роуты | Статьи открываются по URL |
| 8 | Реализовать `ContentLink.jsx` | Кросс-ссылки работают |
| 9-14 | Мигрировать существующие данные из JS-модулей в MDX | Весь контент в новой системе |

---

## Важные принципы

- Не удалять старые JS-модули до полной миграции и проверки
- Проверять валидацию после каждого нового файла
- Статус `draft` в frontmatter скрывает статью из сервиса но она существует в репозитории
- ID должны быть уникальными глобально — не может быть `muscles/squat` и `exercises/squat`
- **Связи указываются только в одну сторону в frontmatter** — обратные связи добавляются автоматически в `buildIndex.js`
- Изображения хранятся в `public/content-images/{type}/` и ссылаются через `/content-images/{type}/filename.jpg`

---

## Шаблон страницы мышцы

Страница мышцы в Fascia — это не анатомический справочник. Фокус на практическом контексте: почему эта мышца важна, что происходит когда она не работает как надо, неочевидные связи.

### Структура страницы:

**1. Один инсайт наверху** (2-3 предложения)
Не "что это" а "почему тебе это важно знать". Неожиданный факт который меняет угол зрения. Это первое что видит пользователь.

Пример для ягодичной:
> "Большинство болей в пояснице лечатся не через спину, а через ягодичные — именно они стабилизируют таз и разгружают поясничный отдел. Сидячий образ жизни буквально 'выключает' эти мышцы — они перестают активироваться даже при ходьбе."

**2. Синергисты** (мышцы которые работают в связке)
Список с кратким объяснением в каком движении они взаимодействуют. Не просто перечисление — а контекст.

**3. Антагонисты** (мышцы с противоположным действием)
Список с объяснением. Важно для понимания баланса и дисбалансов.

**4. Когда недоразвита**
Что происходит с телом — какие боли, компенсации, риски травм. Формулировки через реальные ощущения а не медицинские термины.

**5. Когда перегружена**
Аналогично — симптомы и последствия через бытовой язык.

**6. Неочевидные факты / инсайты**
2-3 факта которые удивляют. Именно здесь материал для Телеграм-постов.

**7. Граф связей** (автоматически из frontmatter)
Визуализация связей с упражнениями, болями, другими мышцами.

**8. Связанные материалы** (автоматически из frontmatter)
Карточки: упражнения, боли, цели.

---

### Пример заполнения — Ягодичная мышца:

**Синергисты:**
- Квадрицепс — при разгибании колена в приседе
- Бицепс бедра — при разгибании тазобедренного сустава
- Разгибатели спины — при стабилизации корпуса в становой
- Средняя ягодичная — при стабилизации таза во фронтальной плоскости

**Антагонисты:**
- Подвздошно-поясничная мышца — сгибает бедро (ягодичная разгибает)
- Прямая мышца бедра — то же самое

**Когда недоразвита:**
- Поясница берёт на себя работу ягодичных при каждом шаге — хроническая перегрузка и боль
- Колено уходит внутрь при приседе и беге — риск травмы связок
- Таз наклоняется вперёд — поясничный лордоз усиливается
- Снижается мощность толчка в беге и прыжках

**Когда перегружена:**
- Боль и скованность в самой мышце после нагрузки
- Компрессия седалищного нерва — боль отдаёт в ногу (часто путают с грыжей диска)
- Синдром грушевидной мышцы — глубокая боль в ягодице при сидении

**Неочевидные инсайты:**
- Gluteal amnesia — сидячий образ жизни буквально отключает ягодичные, они перестают активироваться даже при ходьбе
- Глубокий присед задействует ягодичную сильнее чем квадрицепс — большинство думают наоборот
- Слабые ягодичные это первое что нужно проверить при болях в колене, пояснице и нестабильности голеностопа

---

### Как работать с шаблоном

Процесс создания страницы мышцы:

1. Выбрать мышцу
2. Запросить у LLM черновик по шаблону выше
3. Проверить на точность, дополнить личным опытом
4. Оформить в MDX с frontmatter
5. Добавить в `content/muscles/`

LLM может быстро заполнить синергисты, антагонисты и базовые блоки "недоразвита/перегружена" по любой мышце. Инсайты требуют проверки и личного взгляда — это редакторская работа.

---

## Итоговая структура проекта

```
project/
├── content/              ← весь контент здесь
│   ├── muscles/
│   ├── exercises/
│   ├── goals/
│   └── pain/
├── public/
│   └── content-images/   ← изображения для статей
│       ├── muscles/
│       ├── exercises/
│       ├── goals/
│       └── pain/
├── scripts/
│   ├── buildIndex.js     ← генерирует индекс + автосвязи
│   └── validate.js       ← проверяет frontmatter, связи, ContentLink
├── src/
│   ├── data/
│   │   ├── content-index.json  ← единый источник правды
│   │   └── muscleGroups.json   ← конфиг групп мышц
│   ├── hooks/
│   │   └── useContentIndex.js  ← хук для работы с индексом
│   ├── components/
│   │   └── common/
│   │       └── ContentLink.jsx ← кросс-ссылки в тексте
│   └── pages/
│       └── ArticleView.jsx     ← рендер статей
└── vite.config.js        ← с подключённым MDX
```

---

## Ключевые улучшения в финальной версии

1. ✅ **Упрощён frontmatter:** `parentId` вместо `group/groupTitle/part`
2. ✅ **Группы мышц:** Вынесены в отдельный `muscleGroups.json`
3. ✅ **Автоматические обратные связи:** В `buildIndex.js` - указываем связи только в одну сторону
4. ✅ **Объединённая валидация:** Один `validate.js` с тремя функциями
5. ✅ **Проверка ContentLink:** Валидация `<ContentLink>` в MDX файлах
6. ✅ **ArticleView через import.meta.glob:** Надёжный динамический импорт
7. ✅ **Обработка изображений:** Структура и опциональная оптимизация

План готов к реализации! 🚀
