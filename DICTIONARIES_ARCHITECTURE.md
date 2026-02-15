
# Fascia — Централизованные словари данных

## 📋 Оглавление

1. [Контекст и принципы](#контекст-и-принципы)
2. [Структура файлов](#структура-файлов)
3. [Словарь мышц](#словарь-мышц)
4. [Словарь тегов](#словарь-тегов)
5. [Изменения в buildIndex.js](#изменения-в-buildindexjs)
6. [Изменения в validate.js](#изменения-в-validatejs)
7. [Скрипт генерации контента](#скрипт-генерации-контента)
8. [Скрипт статуса контента](#скрипт-статуса-контента)
9. [План выполнения](#план-выполнения)

---

## Контекст и принципы

### Зачем нужны словари

В проекте Fascia реализован контентный пайплайн на основе MDX файлов с frontmatter и скрипта индексации [`scripts/buildIndex.js`](scripts/buildIndex.js). Централизованные словари — единый источник правды для названий, иерархий и тегов.

**Принцип:** словари — входные данные для [`buildIndex.js`](scripts/buildIndex.js). При индексации скрипт обогащает каждую запись данными из словарей автоматически. В MDX frontmatter автор указывает только `id` — всё остальное подтягивается.

### Почему файлы а не база данных

Контент статичный, авторский, деплоится вместе с кодом. Весь индекс весит несколько сотен килобайт и живёт в памяти. База данных понадобится только когда появится:
- Пользовательский контент
- Полнотекстовый поиск на большом объёме
- Персонализация

---

## Структура файлов

```
src/data/
├── content-index.json        ← генерируется buildIndex.js, не редактировать вручную
├── muscles-dictionary.json   ← редактировать вручную
└── tags-dictionary.json      ← редактировать вручную

content/
├── muscles/
│   ├── published/    ← готовый контент, никогда не трогается скриптом
│   └── draft/        ← черновики, создаются и обновляются скриптом
├── exercises/
├── goals/
└── pain/
```

---

## Словарь мышц

### Назначение

Единый источник правды для всех мышц. Содержит сквозную иерархию:
**мышца → группа мышц → анатомическая зона**

### Структура данных

```json
{
  "muscle-id": {
    "id": "muscle-id",
    "title": "Полное название на русском",
    "titleShort": "Короткое название",
    "titleEn": "English Name",
    "titleLatin": "Anatomical Latin Name",
    "synonyms": ["синоним1", "синоним2"],
    "groupId": "parent-group-id или null",
    "groupTitle": "Название группы или null",
    "groupTitleEn": "Group Name или null",
    "zoneTitle": "Анатомическая зона",
    "zoneTitleEn": "Anatomical Zone",
    "svgIds": ["svg-element-id-1", "svg-element-id-2"]
  }
}
```

### Иерархия мышц

Основана на анатомической структуре и SVG визуализации:

#### Upper Body (Верхняя часть тела)

**Neck (Шея)**
- `sternocleidomastoid` — Грудино-ключично-сосцевидная мышца
- `splenius` — Ременная мышца

**Shoulders (Плечи)**
- `deltoid-anterior` — Передняя дельтовидная (группа: deltoid)
- `deltoid-medial-lateral` — Средняя дельтовидная (группа: deltoid)
- `deltoid-posterior` — Задняя дельтовидная (группа: deltoid)
- `supraspinatus` — Надостная мышца
- `infraspinatus-teres-minor` — Подостная и малая круглая (составная группа, один SVG)
- `subscapularis` — Подлопаточная мышца

**Upper Arms (Плечи/Руки)**
- `biceps-brachii` — Двуглавая мышца плеча
- `brachialis` — Плечевая мышца
- `triceps-brachii` — Трёхглавая мышца плеча

**Forearms (Предплечья)**
- `brachioradialis` — Плечелучевая мышца
- `wrist-extensors` — Разгибатели запястья (составная группа)
- `wrist-flexors` — Сгибатели запястья (составная группа)
- `pronators` — Пронаторы (составная группа)
- `supinators` — Супинаторы (составная группа)

#### Torso (Торс)

**Back (Спина)**
- `trapezius-upper` — Верхняя трапеция (группа: trapezius)
- `trapezius-middle` — Средняя трапеция (группа: trapezius)
- `trapezius-lower` — Нижняя трапеция (группа: trapezius)
- `latissimus-dorsi-teres-major` — Широчайшая и большая круглая (составная группа, один SVG)
- `rhomboids` — Ромбовидные мышцы
- `erector-spinae` — Разгибатели спины
- `levator-scapulae` — Мышца поднимающая лопатку
- `quadratus-lumborum` — Квадратная мышца поясницы

**Chest (Грудь)**
- `pectoralis-major` — Большая грудная мышца
- `pectoralis-minor` — Малая грудная мышца
- `serratus-anterior` — Передняя зубчатая мышца

**Waist (Талия/Кор)**
- `rectus-abdominis` — Прямая мышца живота
- `obliques` — Косые мышцы живота

#### Lower Body (Нижняя часть тела)

**Hips (Бёдра/Таз)**
- `gluteus` — Ягодичная мышца (большая ягодичная)
- `abductors` — Отводящие мышцы бедра (составная группа)
- `hip-flexors` — Сгибатели бедра (составная группа)
- `hip-adductors` — Приводящие мышцы бедра (составная группа)
- `deep-external-rotators` — Глубокие наружные ротаторы (составная группа)

**Thighs (Бёдра)**
- `quadriceps` — Четырёхглавая мышца бедра (составная группа)
- `hamstrings` — Задняя группа мышц бедра (составная группа)
- `sartorius` — Портняжная мышца

**Calves (Голени)**
- `gastrocnemius` — Икроножная мышца
- `soleus` — Камбаловидная мышца
- `tibialis-anterior` — Передняя большеберцовая мышца

### Правила для групп

1. **Составные группы** (Infraspinatus & Teres Minor, Latissimus & Teres Major, Wrist Extensors/Flexors) — несколько анатомических мышц объединённых в один SVG элемент. В словаре записываются как единая сущность с `groupId: null`.

2. **Классические группы** (Trapezius, Deltoid) — имеют части (Upper/Middle/Lower или Anterior/Medial/Posterior) с `groupId` указывающим на родительскую группу.

3. **Standalone мышцы** — не входят в группы, `groupId: null`.

### Пример записей

```json
{
  "deltoid-anterior": {
    "id": "deltoid-anterior",
    "title": "Передняя дельтовидная мышца",
    "titleShort": "Передняя дельта",
    "titleEn": "Anterior Deltoid",
    "titleLatin": "Deltoideus pars clavicularis",
    "synonyms": ["передняя дельта", "передний пучок дельты"],
    "groupId": "deltoid",
    "groupTitle": "Дельтовидная мышца",
    "groupTitleEn": "Deltoid",
    "zoneTitle": "Верхняя часть тела",
    "zoneTitleEn": "Upper Body",
    "svgIds": ["deltoid-anterior-left", "deltoid-anterior-right"]
  },
  "gluteus": {
    "id": "gluteus",
    "title": "Ягодичная мышца",
    "titleShort": "Ягодичная",
    "titleEn": "Gluteus Maximus",
    "titleLatin": "Gluteus maximus",
    "synonyms": ["ягодичная", "ягодицы", "глютеус", "gluteus"],
    "groupId": null,
    "groupTitle": null,
    "groupTitleEn": null,
    "zoneTitle": "Нижняя часть тела",
    "zoneTitleEn": "Lower Body",
    "svgIds": ["gluteus-left", "gluteus-right"]
  },
  "wrist-extensors": {
    "id": "wrist-extensors",
    "title": "Разгибатели запястья",
    "titleShort": "Разгибатели запястья",
    "titleEn": "Wrist Extensors",
    "titleLatin": "Extensores carpi",
    "synonyms": ["разгибатели кисти", "экстензоры запястья"],
    "groupId": null,
    "groupTitle": null,
    "groupTitleEn": null,
    "zoneTitle": "Верхняя часть тела",
    "zoneTitleEn": "Upper Body",
    "svgIds": ["wrist-extensors-left", "wrist-extensors-right"]
  }
}
```

---

## Словарь тегов

### Назначение

Нормализованный список допустимых тегов. Решает проблему произвольных строк в frontmatter — "ягодицы" и "ягодица" становятся одним тегом.

### Структура данных

```json
{
  "tag-id": {
    "id": "tag-id",
    "titleEn": "English Translation",
    "aliases": ["алиас1", "алиас2"],
    "category": "bodyPart|exerciseType|goal|condition|equipment"
  }
}
```

### Категории тегов

- **bodyPart** — части тела (ягодицы, плечи, грудь, спина, ноги, пресс, кор)
- **exerciseType** — типы упражнений (базовое, изоляция, кардио, статика, собственный вес)
- **goal** — цели тренировок (гипертрофия, сила, выносливость, эстетика, рельеф, жиросжигание)
- **condition** — состояния (реабилитация, хроническая боль, травма)
- **equipment** — оборудование (штанга, гантели, тренажёр, резинка)

### Существующие теги из проекта

Анализ 35 MDX файлов выявил следующие теги:

**Body Parts:**
- ягодицы, бёдра, плечи, дельты, спина, грудь, пресс, кор, живот
- ноги, икры, трицепс, бицепс, косые, лопатки, жим, подтягивания

**Regions:**
- верхняя часть тела, нижняя часть тела

**Exercise Types:**
- базовое, изоляция, кардио, статика, собственный вес

**Goals:**
- гипертрофия, масса, объём, сила, выносливость, эстетика, рельеф, жиросжигание

**Difficulty:**
- beginner, intermediate, advanced

**Activities:**
- бег

### Пример записей

```json
{
  "ягодицы": {
    "id": "ягодицы",
    "titleEn": "Glutes",
    "aliases": ["ягодица", "глютеус"],
    "category": "bodyPart"
  },
  "базовое": {
    "id": "базовое",
    "titleEn": "Compound",
    "aliases": ["базовое упражнение", "compound"],
    "category": "exerciseType"
  },
  "гипертрофия": {
    "id": "гипертрофия",
    "titleEn": "Hypertrophy",
    "aliases": ["масса", "объём", "рост мышц"],
    "category": "goal"
  },
  "beginner": {
    "id": "beginner",
    "titleEn": "Beginner",
    "aliases": ["новичок", "начинающий"],
    "category": "goal"
  }
}
```

---

## Изменения в buildIndex.js

### Текущая структура

Скрипт читает MDX файлы из плоских директорий:
- `content/muscles/*.mdx`
- `content/exercises/*.mdx`
- `content/goals/*.mdx`
- `content/pain/*.mdx`

### Новая структура

Для мышц читать из двух поддиректорий:
- `content/muscles/published/*.mdx` — готовый контент
- `content/muscles/draft/*.mdx` — черновики

Фильтровать по полю `status` в frontmatter.

### Функция обогащения

```javascript
import musclesDictionary from '../src/data/muscles-dictionary.json' assert { type: 'json' }

/**
 * Enrich muscle entry with data from dictionary
 */
function enrichMuscleEntry(entry) {
  const dictEntry = musclesDictionary[entry.id]

  if (!dictEntry) {
    console.warn(`⚠️  Мышца "${entry.id}" отсутствует в muscles-dictionary.json`)
    return entry
  }

  return {
    ...entry,
    titleEn: dictEntry.titleEn,
    titleLatin: dictEntry.titleLatin,
    synonyms: dictEntry.synonyms,
    groupId: dictEntry.groupId,
    groupTitle: dictEntry.groupTitle,
    groupTitleEn: dictEntry.groupTitleEn,
    zoneTitle: dictEntry.zoneTitle,
    zoneTitleEn: dictEntry.zoneTitleEn,
    svgIds: dictEntry.svgIds
  }
}
```

### Интеграция в buildIndex

```javascript
// После парсинга frontmatter
if (frontmatter.type === 'muscle') {
  index[frontmatter.id] = enrichMuscleEntry({
    ...frontmatter,
    slug,
    path: `${type}/${slug}`,
    related: frontmatter.related || {}
  })
} else {
  index[frontmatter.id] = {
    ...frontmatter,
    slug,
    path: `${type}/${slug}`,
    related: frontmatter.related || {}
  }
}
```

### Чтение из draft/published

```javascript
const types = ['muscles', 'exercises', 'goals', 'pain']

for (const type of types) {
  const typeDir = path.join(contentDir, type)

  if (!fs.existsSync(typeDir)) {
    console.log(`⚠️  Directory not found: ${type}/`)
    continue
  }

  let files = []

  // For muscles, read from both draft/ and published/
  if (type === 'muscles') {
    const publishedDir = path.join(typeDir, 'published')
    const draftDir = path.join(typeDir, 'draft')

    if (fs.existsSync(publishedDir)) {
      const publishedFiles = fs.readdirSync(publishedDir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => path.join(publishedDir, f))
      files.push(...publishedFiles)
    }

    if (fs.existsSync(draftDir)) {
      const draftFiles = fs.readdirSync(draftDir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => path.join(draftDir, f))
      files.push(...draftFiles)
    }
  } else {
    // Other types read from flat directory
    files = fs.readdirSync(typeDir)
      .filter(f => f.endsWith('.mdx'))
      .map(f => path.join(typeDir, f))
  }

  // Process files...
}
```

---

## Изменения в validate.js

### Новые функции валидации

```javascript
import musclesDictionary from '../src/data/muscles-dictionary.json' assert { type: 'json' }
import tagsDictionary from '../src/data/tags-dictionary.json' assert { type: 'json' }

/**
 * Validate that muscle exists in dictionary (critical error)
 */
function validateMuscleInDictionary(id, prefix, errors) {
  if (!musclesDictionary[id]) {
    errors.push(`${prefix} мышца "${id}" отсутствует в muscles-dictionary.json`)
  }
}

/**
 * Validate that related muscle IDs exist in dictionary
 */
function validateMuscleRelationIds(muscles, prefix, errors) {
  if (!muscles) return

  const ids = [
    ...(muscles.synergists || []),
    ...(muscles.antagonists || [])
  ]

  for (const id of ids) {
    if (!musclesDictionary[id]) {
      errors.push(`${prefix} связанная мышца "${id}" отсутствует в muscles-dictionary.json`)
    }
  }
}

/**
 * Validate tags against dictionary (critical error)
 */
function validateTags(tags, prefix, errors) {
  if (!tags || !Array.isArray(tags)) return

  for (const tag of tags) {
    if (!tagsDictionary[tag]) {
      errors.push(`${prefix} тег "${tag}" отсутствует в tags-dictionary.json`)
    }
  }
}
```

### Интеграция в validateFrontmatter

```javascript
function validateFrontmatter() {
  // ... existing code ...

  for (const file of files) {
    // ... existing validation ...

    // NEW: Validate muscle in dictionary
    if (fm.type === 'muscle') {
      validateMuscleInDictionary(fm.id, prefix, criticalErrors)

      // NEW: Validate muscle relations
      if (fm.related?.muscles) {
        validateMuscleRelationIds(fm.related.muscles, prefix, criticalErrors)
      }
    }

    // NEW: Validate tags for all types
    validateTags(fm.tags, prefix, criticalErrors)
  }

  return { criticalErrors, warnings }
}
```

### Обновление путей для мышц

```javascript
for (const type of types) {
  const typeDir = path.join(contentDir, type)
  if (!fs.existsSync(typeDir)) continue

  let files = []

  // For muscles, validate both draft/ and published/
  if (type === 'muscles') {
    const publishedDir = path.join(typeDir, 'published')
    const draftDir = path.join(typeDir, 'draft')

    if (fs.existsSync(publishedDir)) {
      files.push(...fs.readdirSync(publishedDir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => ({ file: f, dir: publishedDir, label: 'published' })))
    }

    if (fs.existsSync(draftDir)) {
      files.push(...fs.readdirSync(draftDir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => ({ file: f, dir: draftDir, label: 'draft' })))
    }
  } else {
    files = fs.readdirSync(typeDir)
      .filter(f => f.endsWith('.mdx'))
      .map(f => ({ file: f, dir: typeDir, label: '' }))
  }

  for (const { file, dir, label } of files) {
    const filePath = path.join(dir, file)
    const prefix = label ? `[${type}/${label}/${file}]` : `[${type}/${file}]`
    // ... validation logic ...
  }
}
```

---

## Скрипт генерации контента

### Назначение

Автоматически создаёт MDX-заготовки для всех мышц из словаря у которых ещё нет файла. При повторном запуске обновляет frontmatter в существующих черновиках не трогая текст статьи.

### Режимы работы

```bash
npm run generate:muscles
# По умолчанию:
# - Создаёт файлы в draft/ для мышц которых нет ни в draft/ ни в published/
# - Обновляет только frontmatter-блок в существующих draft-файлах
# - Published файлы не трогает никогда

npm run generate:muscles -- --force-all
# Всё то же самое + перезаписывает draft-файл целиком если он пустой
```

### Логика работы

1. **Проверка существования** — для каждой мышцы из словаря проверяет наличие файла в `published/` или `draft/`
2. **Создание новых** — если файла нет, создаёт в `draft/` с шаблоном
3. **Обновление frontmatter** — для существующих draft-файлов обновляет только frontmatter-блок
4. **Защита published** — файлы в `published/` никогда не трогаются
5. **Полная перезапись** — с флагом `--force-all` перезаписывает пустые draft-файлы целиком

### Шаблон файла

```markdown
---
id: muscle-id
type: muscle
title: Полное название
titleShort: Короткое название
layer: muscles
tags: []
related:
  muscles:
    synergists: []
    antagonists: []
  exercises: []
  goals: []
  pain: []
image: muscle-id.jpg
status: draft
---

<!-- Добавь контент здесь -->
```

Маркер `<!-- Добавь контент здесь -->` используется для определения пустых файлов.

### Структура скрипта

```javascript
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import musclesDictionary from '../src/data/muscles-dictionary.json' assert { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const draftDir = path.join(__dirname, '../content/muscles/draft')
const publishedDir = path.join(__dirname, '../content/muscles/published')
const forceAll = process.argv.includes('--force-all')

const EMPTY_MARKER = '<!-- Добавь контент здесь -->'

function generateFrontmatter(muscle) { /* ... */ }
function generateFullFile(muscle) { /* ... */ }
function updateFrontmatter(existingContent, muscle) { /* ... */ }
function isEmpty(content) { /* ... */ }
function getExistingFile(muscleId) { /* ... */ }

// Main logic
const results = { created: [], updated: [], skipped: [], protected: [] }

for (const muscle of Object.values(musclesDictionary)) {
  const existing = getExistingFile(muscle.id)

  if (!existing) {
    // Create new file
  } else if (existing.status === 'published') {
    // Protect published
  } else {
    // Update draft frontmatter
  }
}

// Report results
```

---

## Скрипт статуса контента

### Назначение

Показывает прогресс наполнения сервиса без открытия файлов. Визуальный dashboard для отслеживания готовности контента.

### Вывод

```
📊 Fascia — статус контента

────────────────────────────────────────────────────
Мышцы        ███░░░░░░░░░░░░░░░░░░   10/60   16%
             draft: 50
Упражнения   ██░░░░░░░░░░░░░░░░░░░   20/100  20%
             draft: 80
Цели         ████░░░░░░░░░░░░░░░░░    5/10   50%
             draft: 5
Боли         ░░░░░░░░░░░░░░░░░░░░░    0/15    0%
             draft: 15
────────────────────────────────────────────────────
```

### Логика

1. Подсчитывает файлы в `published/` и `draft/` для каждого типа контента
2. Для мышц использует словарь как источник правды для общего количества
3. Для остальных типов считает сумму published + draft
4. Рисует прогресс-бар с процентами

### Структура скрипта

```javascript
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import musclesDictionary from '../src/data/muscles-dictionary.json' assert { type: 'json' }

function countFiles(dir) {
  const published = fs.readdirSync(path.join(dir, 'published'))
    .filter(f => f.endsWith('.mdx')).length
  const draft = fs.readdirSync(path.join(dir, 'draft'))
    .filter(f => f.endsWith('.mdx')).length
  return { published, draft, total: published + draft }
}

function bar(published, total, width = 20) {
  if (total === 0) return '─'.repeat(width)
  const filled = Math.round((published / total) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

const types = [
  { label: 'Мышцы', dir: 'muscles', total: Object.keys(musclesDictionary).length },
  { label: 'Упражнения', dir: 'exercises', total: null },
  { label: 'Цели', dir: 'goals', total: null },
  { label: 'Боли', dir: 'pain', total: null },
]

// Print status for each type
```

---

## План выполнения

### Этап 1: Создание словарей (Foundation)

1. ✅ Проанализировать существующие мышцы и теги
2. 📝 Создать [`src/data/muscles-dictionary.json`](src/data/muscles-dictionary.json) с полной иерархией (~60 мышц)
3. 📝 Создать [`src/data/tags-dictionary.json`](src/data/tags-dictionary.json) с нормализованными тегами

### Этап 2: Реорганизация контента

4. 📝 Создать структуру папок:
   - `content/muscles/published/`
   - `content/muscles/draft/`
5. 📝 Переместить существующие 10 MDX файлов в `published/`

### Этап 3: Автоматизация

6. 📝 Создать [`scripts/generateMuscles.js`](scripts/generateMuscles.js)
7. 📝 Создать [`scripts/status.js`](scripts/status.js)
8. 📝 Обновить [`scripts/buildIndex.js`](scripts/buildIndex.js):
   - Чтение из draft/published
   - Функция `enrichMuscleEntry()`
9. 📝 Обновить [`scripts/validate.js`](scripts/validate.js):
   - Валидация против словарей
   - Обновлённые пути

### Этап 4: Интеграция

10. 📝 Добавить npm скрипты в [`package.json`](package.json):
    - `generate:muscles`
    - `status`
11. 📝 Запустить `npm run generate:muscles` — создать заготовки для всех мышц
12. 📝 Запустить `npm run status` — проверить статус
13. 📝 Запустить `npm run build:index && npm run validate` — проверить пайплайн

### Этап 5: Верификация

14. 📝 Проверить [`src/data/content-index.json`](src/data/content-index.json) на наличие обогащённых данных:
    - `titleEn`, `titleLatin`
    - `groupId`, `groupTitle`, `groupTitleEn`
    - `zoneTitle`, `zoneTitleEn`
    - `svgIds`, `synonyms`

---

## Диаграмма потока данных

```mermaid
graph TD
    A[muscles-dictionary.json] --> B[buildIndex.js]
    C[tags-dictionary.json] --> B
    D[content/muscles/published/*.mdx] --> B
    E[content/muscles/draft/*.mdx] --> B
    B --> F[content-index.json]

    A --> G[generateMuscles.js]
    G --> E

    A --> H[validate.js]
    C --> H
    D --> H
    E --> H

    A --> I[status.js]
    D --> I
    E --> I

    style A fill:#e1f5ff
    style C fill:#e1f5ff
    style F fill:#fff4e1
    style B fill:#f0f0f0
    style G fill:#f0f0f
