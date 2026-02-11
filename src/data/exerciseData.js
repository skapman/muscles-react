/**
 * Exercise Data Structure
 * Defines exercises with their target muscles and relationships
 */

export const exerciseTypes = {
  COMPOUND: 'compound',
  ISOLATION: 'isolation',
  CARDIO: 'cardio',
  MOBILITY: 'mobility',
  REHABILITATION: 'rehabilitation'
};

export const exerciseData = {
  // COMPOUND EXERCISES
  "bench-press": {
    id: "bench-press",
    type: exerciseTypes.COMPOUND,
    title: "Жим штанги лёжа",
    titleEn: "Barbell Bench Press",
    icon: "🏋️",

    primaryMuscles: ["pectoralis-major", "triceps-brachii", "deltoid-anterior"],
    secondaryMuscles: ["serratus-anterior", "coracobrachialis"],

    equipment: ["barbell", "bench"],
    difficulty: "intermediate",

    description: "Базовое упражнение для развития грудных мышц, трицепсов и передних дельт",

    technique: {
      setup: "Лягте на скамью, ноги на полу, лопатки сведены",
      execution: "Опустите штангу к груди, затем выжмите вверх",
      breathing: "Вдох при опускании, выдох при подъёме"
    },

    commonMistakes: [
      "Отрыв таза от скамьи",
      "Разведение локтей слишком широко",
      "Отбив штанги от груди"
    ],

    variations: ["incline-bench-press", "decline-bench-press", "close-grip-bench-press"]
  },

  "incline-bench-press": {
    id: "incline-bench-press",
    type: exerciseTypes.COMPOUND,
    title: "Жим штанги на наклонной скамье",
    titleEn: "Incline Barbell Bench Press",
    icon: "🏋️",

    primaryMuscles: ["pectoralis-major", "deltoid-anterior"],
    secondaryMuscles: ["triceps-brachii", "serratus-anterior"],

    equipment: ["barbell", "incline-bench"],
    difficulty: "intermediate",

    description: "Акцент на верхнюю часть грудных мышц",

    technique: {
      setup: "Наклон скамьи 30-45 градусов",
      execution: "Опустите штангу к верхней части груди, выжмите вверх",
      breathing: "Вдох при опускании, выдох при подъёме"
    },

    variations: ["dumbbell-incline-press"]
  },

  "close-grip-bench-press": {
    id: "close-grip-bench-press",
    type: exerciseTypes.COMPOUND,
    title: "Жим узким хватом",
    titleEn: "Close-Grip Bench Press",
    icon: "🏋️",

    primaryMuscles: ["triceps-brachii", "pectoralis-major"],
    secondaryMuscles: ["deltoid-anterior"],

    equipment: ["barbell", "bench"],
    difficulty: "intermediate",

    description: "Акцент на трицепсы с вовлечением грудных",

    technique: {
      setup: "Хват на ширине плеч или уже",
      execution: "Локти ближе к корпусу, опустите к нижней части груди",
      breathing: "Вдох при опускании, выдох при подъёме"
    }
  },

  "dumbbell-press": {
    id: "dumbbell-press",
    type: exerciseTypes.COMPOUND,
    title: "Жим гантелей лёжа",
    titleEn: "Dumbbell Bench Press",
    icon: "🏋️",

    primaryMuscles: ["pectoralis-major", "triceps-brachii", "deltoid-anterior"],
    secondaryMuscles: ["serratus-anterior"],

    equipment: ["dumbbells", "bench"],
    difficulty: "beginner",

    description: "Большая амплитуда движения и стабилизация",

    technique: {
      setup: "Гантели на уровне груди, локти под углом 45 градусов",
      execution: "Выжмите гантели вверх, сводя их в верхней точке",
      breathing: "Вдох при опускании, выдох при подъёме"
    }
  },

  "dumbbell-fly": {
    id: "dumbbell-fly",
    type: exerciseTypes.ISOLATION,
    title: "Разведение гантелей",
    titleEn: "Dumbbell Fly",
    icon: "💪",

    primaryMuscles: ["pectoralis-major"],
    secondaryMuscles: ["deltoid-anterior"],

    equipment: ["dumbbells", "bench"],
    difficulty: "beginner",

    description: "Изолированная работа грудных мышц",

    technique: {
      setup: "Лёгкий сгиб в локтях, гантели над грудью",
      execution: "Разведите руки в стороны, затем сведите",
      breathing: "Вдох при разведении, выдох при сведении"
    },

    commonMistakes: [
      "Слишком большой вес",
      "Полное выпрямление локтей",
      "Опускание гантелей слишком низко"
    ]
  },

  "cable-crossover": {
    id: "cable-crossover",
    type: exerciseTypes.ISOLATION,
    title: "Сведение рук в кроссовере",
    titleEn: "Cable Crossover",
    icon: "💪",

    primaryMuscles: ["pectoralis-major"],
    secondaryMuscles: ["deltoid-anterior"],

    equipment: ["cable-machine"],
    difficulty: "beginner",

    description: "Постоянное напряжение грудных мышц",

    technique: {
      setup: "Рукоятки на уровне плеч, шаг вперёд",
      execution: "Сведите руки перед собой, сжимая грудные",
      breathing: "Выдох при сведении, вдох при разведении"
    }
  },

  "push-ups": {
    id: "push-ups",
    type: exerciseTypes.COMPOUND,
    title: "Отжимания",
    titleEn: "Push-ups",
    icon: "💪",

    primaryMuscles: ["pectoralis-major", "triceps-brachii", "deltoid-anterior"],
    secondaryMuscles: ["rectus-abdominis", "serratus-anterior"],

    equipment: [],
    difficulty: "beginner",

    description: "Базовое упражнение с собственным весом",

    technique: {
      setup: "Планка, руки на ширине плеч",
      execution: "Опуститесь до касания грудью пола, вернитесь в исходное положение",
      breathing: "Вдох при опускании, выдох при подъёме"
    },

    variations: ["diamond-push-ups", "wide-push-ups", "decline-push-ups"]
  },

  "dips": {
    id: "dips",
    type: exerciseTypes.COMPOUND,
    title: "Отжимания на брусьях",
    titleEn: "Dips",
    icon: "💪",

    primaryMuscles: ["pectoralis-major", "triceps-brachii"],
    secondaryMuscles: ["deltoid-anterior"],

    equipment: ["parallel-bars"],
    difficulty: "intermediate",

    description: "Мощное упражнение для груди и трицепсов",

    technique: {
      setup: "Наклон корпуса вперёд для акцента на грудь",
      execution: "Опуститесь до угла 90 градусов в локтях, вернитесь вверх",
      breathing: "Вдох при опускании, выдох при подъёме"
    }
  },

  "pull-ups": {
    id: "pull-ups",
    type: exerciseTypes.COMPOUND,
    title: "Подтягивания",
    titleEn: "Pull-ups",
    icon: "💪",

    primaryMuscles: ["latissimus-dorsi", "biceps-brachii"],
    secondaryMuscles: ["rhomboid", "trapezius-middle", "brachialis"],

    equipment: ["pull-up-bar"],
    difficulty: "intermediate",

    description: "Базовое упражнение для спины и бицепсов",

    technique: {
      setup: "Хват чуть шире плеч, ладони от себя",
      execution: "Подтянитесь до подбородка выше перекладины",
      breathing: "Выдох при подъёме, вдох при опускании"
    },

    variations: ["chin-ups", "wide-grip-pull-ups", "neutral-grip-pull-ups"]
  },

  "assisted-pull-ups": {
    id: "assisted-pull-ups",
    type: exerciseTypes.COMPOUND,
    title: "Подтягивания с помощью",
    titleEn: "Assisted Pull-ups",
    icon: "💪",

    primaryMuscles: ["latissimus-dorsi", "biceps-brachii"],
    secondaryMuscles: ["rhomboid", "trapezius-middle"],

    equipment: ["pull-up-bar", "resistance-band"],
    difficulty: "beginner",

    description: "Подтягивания с резинкой или тренажёром для помощи"
  },

  "lat-pulldown": {
    id: "lat-pulldown",
    type: exerciseTypes.COMPOUND,
    title: "Тяга верхнего блока",
    titleEn: "Lat Pulldown",
    icon: "🏋️",

    primaryMuscles: ["latissimus-dorsi"],
    secondaryMuscles: ["biceps-brachii", "rhomboid", "trapezius-middle"],

    equipment: ["cable-machine"],
    difficulty: "beginner",

    description: "Альтернатива подтягиваниям на тренажёре"
  },

  "inverted-rows": {
    id: "inverted-rows",
    type: exerciseTypes.COMPOUND,
    title: "Горизонтальные подтягивания",
    titleEn: "Inverted Rows",
    icon: "💪",

    primaryMuscles: ["latissimus-dorsi", "rhomboid", "trapezius-middle"],
    secondaryMuscles: ["biceps-brachii"],

    equipment: ["bar"],
    difficulty: "beginner",

    description: "Горизонтальная тяга с собственным весом"
  },

  // CORE EXERCISES
  "hanging-leg-raises": {
    id: "hanging-leg-raises",
    type: exerciseTypes.ISOLATION,
    title: "Подъём ног в висе",
    titleEn: "Hanging Leg Raises",
    icon: "🎯",

    primaryMuscles: ["rectus-abdominis", "hip-flexors"],
    secondaryMuscles: ["external-oblique"],

    equipment: ["pull-up-bar"],
    difficulty: "advanced",

    description: "Мощное упражнение для нижнего пресса"
  },

  "cable-crunches": {
    id: "cable-crunches",
    type: exerciseTypes.ISOLATION,
    title: "Скручивания на блоке",
    titleEn: "Cable Crunches",
    icon: "🎯",

    primaryMuscles: ["rectus-abdominis"],
    secondaryMuscles: [],

    equipment: ["cable-machine"],
    difficulty: "beginner",

    description: "Изолированная работа пресса с возможностью прогрессии"
  },

  "plank": {
    id: "plank",
    type: exerciseTypes.ISOLATION,
    title: "Планка",
    titleEn: "Plank",
    icon: "🎯",

    primaryMuscles: ["rectus-abdominis", "transversus-abdominis"],
    secondaryMuscles: ["erector-spinae", "gluteus-maximus"],

    equipment: [],
    difficulty: "beginner",

    description: "Статическое упражнение для кора"
  },

  "russian-twists": {
    id: "russian-twists",
    type: exerciseTypes.ISOLATION,
    title: "Русские скручивания",
    titleEn: "Russian Twists",
    icon: "🎯",

    primaryMuscles: ["external-oblique", "internal-oblique"],
    secondaryMuscles: ["rectus-abdominis"],

    equipment: [],
    difficulty: "beginner",

    description: "Упражнение для косых мышц живота"
  },

  // CARDIO
  "running": {
    id: "running",
    type: exerciseTypes.CARDIO,
    title: "Бег",
    titleEn: "Running",
    icon: "🏃",

    primaryMuscles: ["quadriceps", "gastrocnemius", "soleus"],
    secondaryMuscles: ["gluteus-maximus", "hamstrings"],

    equipment: [],
    difficulty: "beginner",

    description: "Кардио упражнение для выносливости"
  },

  "interval-training": {
    id: "interval-training",
    type: exerciseTypes.CARDIO,
    title: "Интервальный бег",
    titleEn: "Interval Training",
    icon: "🏃",

    primaryMuscles: ["quadriceps", "gastrocnemius"],
    secondaryMuscles: ["gluteus-maximus", "hamstrings"],

    equipment: [],
    difficulty: "intermediate",

    description: "Чередование высокой и низкой интенсивности"
  },

  "squats": {
    id: "squats",
    type: exerciseTypes.COMPOUND,
    title: "Приседания",
    titleEn: "Squats",
    icon: "🏋️",

    primaryMuscles: ["quadriceps", "gluteus-maximus"],
    secondaryMuscles: ["hamstrings", "erector-spinae"],

    equipment: [],
    difficulty: "beginner",

    description: "Базовое упражнение для ног"
  },

  "calf-raises": {
    id: "calf-raises",
    type: exerciseTypes.ISOLATION,
    title: "Подъём на носки",
    titleEn: "Calf Raises",
    icon: "💪",

    primaryMuscles: ["gastrocnemius", "soleus"],
    secondaryMuscles: [],

    equipment: [],
    difficulty: "beginner",

    description: "Изолированная работа икроножных мышц"
  }
};

/**
 * Get exercise by ID
 */
export function getExercise(exerciseId) {
  return exerciseData[exerciseId] || null;
}

/**
 * Get exercises by type
 */
export function getExercisesByType(type) {
  return Object.values(exerciseData).filter(ex => ex.type === type);
}

/**
 * Get exercises that target a specific muscle
 */
export function getExercisesByMuscle(muscleId) {
  return Object.values(exerciseData).filter(ex =>
    ex.primaryMuscles?.includes(muscleId) ||
    ex.secondaryMuscles?.includes(muscleId)
  );
}

/**
 * Get exercises by difficulty
 */
export function getExercisesByDifficulty(difficulty) {
  return Object.values(exerciseData).filter(ex => ex.difficulty === difficulty);
}

/**
 * Get exercises by equipment
 */
export function getExercisesByEquipment(equipment) {
  return Object.values(exerciseData).filter(ex =>
    ex.equipment?.includes(equipment) || ex.equipment?.length === 0
  );
}
