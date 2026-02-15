# 🔄 Data Migration Prompt for LLM Assistant

## Context

You are helping migrate content from JavaScript modules to MDX files for the Fascia anatomy/fitness web service. The infrastructure is already built and working - you just need to create MDX files from existing data.

## Current State

✅ **Already working:**
- MDX infrastructure configured
- Build scripts (buildIndex.js, validate.js)
- Article rendering system
- One test file exists: `content/muscles/gluteus.mdx`

📦 **Data to migrate:**
- 8 muscles from `src/data/muscleData.js` (7 remaining - gluteus already done)
- 5 goals from `src/data/goalData.js`
- 25+ exercises from `src/data/exerciseData.js`
- Pain points from `src/data/painPointsData.js`

## Your Task

Migrate ALL remaining data from JS modules to MDX files following the exact structure below.

---

## MDX File Structure

### For Muscles (content/muscles/*.mdx)

```mdx
---
id: muscle-id-here
type: muscle
title: Полное название мышцы
titleShort: Короткое название
layer: muscles
tags: [тег1, тег2, тег3]
related:
  muscles: [id1, id2]
  exercises: [id1, id2]
  goals: [id1, id2]
  pain: [id1, id2]
image: muscle-id.jpg
status: published
---

## Описание

Краткое описание мышцы (2-3 предложения).

## Функция

Что делает эта мышца.

## Расположение

Где находится в теле.
```

**Important for muscles:**
- Use existing `id` from muscleData.js (e.g., "trapezius-upper")
- `layer` is always "muscles"
- `related` - leave empty arrays `[]` for now, we'll add connections later
- `status` is always "published"

### For Goals (content/goals/*.mdx)

```mdx
---
id: goal-id-here
type: goal
title: Название цели
titleShort: Короткое название
tags: [тег1, тег2, тег3]
related:
  muscles: [id1, id2]
  exercises: [id1, id2]
  goals: [id1, id2]
  pain: []
image: goal-id.jpg
status: published
---

## Описание

Описание цели из goalData.js.

## Целевые мышцы

Список primaryMuscles из данных.

## Программа тренировок

Информация из program секции.

## Советы

Список tips из данных.
```

**Important for goals:**
- Use existing `id` from goalData.js
- Extract `primaryMuscles` and `primaryExercises` for `related` section
- Convert structured data to readable MDX text

### For Exercises (content/exercises/*.mdx)

```mdx
---
id: exercise-id-here
type: exercise
title: Название упражнения
titleShort: Короткое название
tags: [тип, сложность, оборудование]
related:
  muscles: [id1, id2]
  exercises: [id1, id2]
  goals: []
  pain: []
equipment: [barbell, bench]
image: exercise-id.jpg
status: published
---

## Описание

Описание упражнения из exerciseData.js.

## Целевые мышцы

**Основные:** список primaryMuscles
**Вспомогательные:** список secondaryMuscles

## Техника выполнения

Информация из technique секции.

## Частые ошибки

Список commonMistakes если есть.
```

**Important for exercises:**
- Use existing `id` from exerciseData.js
- `equipment` field is required (copy from data)
- Extract `primaryMuscles` for `related.muscles`
- `related.exercises` can include `variations` if they exist

---

## Step-by-Step Instructions

### Step 1: Migrate Muscles (7 files)

From `src/data/muscleData.js`, create MDX files for:

1. `trapezius-upper.mdx`
2. `trapezius-middle.mdx`
3. `trapezius-lower.mdx`
4. `pectoralis-major.mdx`
5. `rectus-abdominis.mdx`
6. `obliques.mdx`
7. `deltoid-anterior.mdx`
8. `deltoid-medial-lateral.mdx`
9. `deltoid-posterior.mdx`

**Note:** Most have "TODO" descriptions - that's OK, write minimal content like:
```mdx
## Описание

[Name] - мышца [region] области.

## Функция

TODO: Добавить описание функции.
```

### Step 2: Migrate Goals (5 files)

From `src/data/goalData.js`, create MDX files for:

1. `bench-100kg.mdx`
2. `build-chest.mdx`
3. `six-pack-abs.mdx`
4. `pullups-10-reps.mdx`
5. `run-5km.mdx`

These have full data - convert all fields to readable MDX.

### Step 3: Migrate Exercises (25+ files)

From `src/data/exerciseData.js`, create MDX files for ALL exercises:

1. `bench-press.mdx`
2. `incline-bench-press.mdx`
3. `close-grip-bench-press.mdx`
4. `dumbbell-press.mdx`
5. `dumbbell-fly.mdx`
6. `cable-crossover.mdx`
7. `push-ups.mdx`
8. `dips.mdx`
9. `pull-ups.mdx`
10. `assisted-pull-ups.mdx`
11. `lat-pulldown.mdx`
12. `inverted-rows.mdx`
13. `hanging-leg-raises.mdx`
14. `cable-crunches.mdx`
15. `plank.mdx`
16. `russian-twists.mdx`
17. `running.mdx`
18. `interval-training.mdx`
19. `squats.mdx`
20. `calf-raises.mdx`

### Step 4: After Each Batch

After creating 5-10 files, run:
```bash
npm run build:index
npm run validate
```

Check output - warnings are OK (missing related content), but NO critical errors.

### Step 5: Test

After all files created:
1. Run `npm run build:index`
2. Run `npm run validate`
3. Open browser: `http://localhost:5173/muscles/trapezius-upper`
4. Check graph: `http://localhost:5173/graph`

---

## Important Rules

1. **File naming:** Use exact `id` from JS data as filename
2. **Frontmatter:** YAML format, exact field names
3. **Related:** Leave empty arrays for now - we'll connect later
4. **Status:** Always "published"
5. **Tags:** Create relevant tags from data (region, group, type, difficulty)
6. **Images:** Use `{id}.jpg` format (images don't exist yet - that's OK)

## Example Conversion

**From JS:**
```javascript
"bench-press": {
  id: "bench-press",
  type: exerciseTypes.COMPOUND,
  title: "Жим штанги лёжа",
  titleEn: "Barbell Bench Press",
  primaryMuscles: ["pectoralis-major", "triceps-brachii"],
  equipment: ["barbell", "bench"],
  difficulty: "intermediate",
  description: "Базовое упражнение для развития грудных мышц"
}
```

**To MDX:**
```mdx
---
id: bench-press
type: exercise
title: Жим штанги лёжа
titleShort: Жим лёжа
tags: [базовое, грудь, трицепс, intermediate]
related:
  muscles: [pectoralis-major, triceps-brachii]
  exercises: []
  goals: []
  pain: []
equipment: [barbell, bench]
image: bench-press.jpg
status: published
---

## Описание

Базовое упражнение для развития грудных мышц, трицепсов и передних дельт.

## Целевые мышцы

**Основные:** Грудные (pectoralis-major), Трицепс (triceps-brachii)
```

---

## Validation

After migration, validation should show:
- ✅ No critical errors
- ⚠️ Warnings about non-existent related IDs (normal - content being added gradually)
- ✅ All frontmatter fields present
- ✅ No duplicate IDs

---

## Success Criteria

- [ ] All 8 muscles migrated
- [ ] All 5 goals migrated
- [ ] All 25+ exercises migrated
- [ ] `npm run build:index` succeeds
- [ ] `npm run validate` shows only warnings (no errors)
- [ ] At least 3 different articles open in browser
- [ ] Graph shows multiple nodes

---

## Start Command

Begin with: "I'll migrate the data from JS modules to MDX files following your structure. Starting with muscles..."

Then create files one by one, running validation after each batch of 5-10 files.
