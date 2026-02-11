/**
 * Goal Data Structure
 * Defines different types of fitness goals with their relationships
 * Priority: Athletic goals (strength, hypertrophy, aesthetics, endurance)
 */

export const goalTypes = {
  ATHLETIC: 'athletic',
  THERAPEUTIC: 'therapeutic',
  FUNCTIONAL: 'functional',
  RESEARCH: 'research'
};

export const athleticSubtypes = {
  STRENGTH: 'strength',
  HYPERTROPHY: 'hypertrophy',
  AESTHETICS: 'aesthetics',
  ENDURANCE: 'endurance'
};

export const goalData = {
  // ATHLETIC: Strength - Bench Press 100kg
  "bench-100kg": {
    id: "bench-100kg",
    type: goalTypes.ATHLETIC,
    subtype: athleticSubtypes.STRENGTH,
    title: "Жать 100кг лёжа",
    titleEn: "Bench Press 100kg",
    icon: "🏋️",

    metrics: {
      current: { value: 70, unit: "kg" },
      target: { value: 100, unit: "kg" },
      timeline: "6 months"
    },

    primaryMuscles: ["pectoralis-major", "triceps-brachii", "deltoid-anterior"],
    secondaryMuscles: ["serratus-anterior", "coracobrachialis"],

    primaryExercises: ["bench-press", "incline-bench-press", "close-grip-bench-press"],
    supportiveExercises: ["dumbbell-press", "push-ups", "dips"],

    program: {
      frequency: "2-3x per week",
      sets: "4-5 sets",
      reps: "3-6 reps",
      progression: "Linear progression: +2.5kg per week"
    },

    tips: [
      "Фокус на технике при малых весах",
      "Прогрессивная перегрузка каждую неделю",
      "Достаточный отдых между подходами (3-5 мин)"
    ]
  },

  // ATHLETIC: Hypertrophy - Build Chest Mass
  "build-chest": {
    id: "build-chest",
    type: goalTypes.ATHLETIC,
    subtype: athleticSubtypes.HYPERTROPHY,
    title: "Набрать массу груди",
    titleEn: "Build Chest Mass",
    icon: "💪",

    metrics: {
      current: { value: 95, unit: "cm" },
      target: { value: 102, unit: "cm" },
      timeline: "4 months"
    },

    primaryMuscles: ["pectoralis-major"],
    secondaryMuscles: ["deltoid-anterior", "triceps-brachii"],

    primaryExercises: [
      { id: "bench-press", sets: "4x8-12", priority: "primary" },
      { id: "incline-bench-press", sets: "3x10-12", priority: "primary" },
      { id: "dumbbell-fly", sets: "3x12-15", priority: "accessory" },
      { id: "cable-crossover", sets: "3x15-20", priority: "accessory" }
    ],

    program: {
      frequency: "2x per week",
      volume: "12-16 sets per week",
      progression: "Add weight when hitting top of rep range"
    },

    nutrition: {
      surplus: "+300-500 kcal",
      protein: "1.6-2.2g per kg bodyweight"
    },

    tips: [
      "Фокус на связи мозг-мышца",
      "Полная амплитуда движения",
      "Контролируемая негативная фаза"
    ]
  },

  // ATHLETIC: Aesthetics - Six Pack Abs
  "six-pack-abs": {
    id: "six-pack-abs",
    type: goalTypes.ATHLETIC,
    subtype: athleticSubtypes.AESTHETICS,
    title: "Кубики пресса",
    titleEn: "Six Pack Abs",
    icon: "🎯",

    metrics: {
      current: { value: 18, unit: "% body fat" },
      target: { value: 12, unit: "% body fat + visible abs" },
      timeline: "3 months"
    },

    primaryMuscles: ["rectus-abdominis", "external-oblique", "internal-oblique"],
    secondaryMuscles: ["transversus-abdominis", "serratus-anterior"],

    primaryExercises: [
      { id: "hanging-leg-raises", sets: "3x12-15", priority: "primary" },
      { id: "cable-crunches", sets: "3x15-20", priority: "primary" },
      { id: "plank", sets: "3x60s", priority: "primary" },
      { id: "russian-twists", sets: "3x20", priority: "accessory" }
    ],

    program: {
      frequency: "3-4x per week",
      volume: "12-15 sets per week",
      progression: "Add weight or increase time under tension"
    },

    nutrition: {
      deficit: "-300-500 kcal",
      protein: "2.0-2.4g per kg bodyweight",
      note: "Abs are made in the kitchen - diet is 80% of success"
    },

    tips: [
      "Дефицит калорий обязателен",
      "Кардио 3-4 раза в неделю",
      "Тренировка пресса - дополнение к диете"
    ]
  },

  // ATHLETIC: Strength - Pull-ups
  "pullups-10-reps": {
    id: "pullups-10-reps",
    type: goalTypes.ATHLETIC,
    subtype: athleticSubtypes.STRENGTH,
    title: "Подтянуться 10 раз",
    titleEn: "10 Pull-ups",
    icon: "💪",

    metrics: {
      current: { value: 3, unit: "reps" },
      target: { value: 10, unit: "reps" },
      timeline: "8 weeks"
    },

    primaryMuscles: ["latissimus-dorsi", "biceps-brachii", "brachialis"],
    secondaryMuscles: ["rhomboid", "trapezius-middle", "teres-major"],

    primaryExercises: [
      { id: "pull-ups", sets: "5xMax", priority: "primary" },
      { id: "assisted-pull-ups", sets: "3x8-10", priority: "primary" },
      { id: "lat-pulldown", sets: "3x10-12", priority: "accessory" },
      { id: "inverted-rows", sets: "3x12-15", priority: "accessory" }
    ],

    program: {
      frequency: "3x per week",
      progression: "Grease the groove method - multiple sets throughout day"
    },

    tips: [
      "Начните с негативных подтягиваний",
      "Используйте резинки для помощи",
      "Тренируйте хват отдельно"
    ]
  },

  // ATHLETIC: Endurance - Run 5km
  "run-5km": {
    id: "run-5km",
    type: goalTypes.ATHLETIC,
    subtype: athleticSubtypes.ENDURANCE,
    title: "Пробежать 5км",
    titleEn: "Run 5km",
    icon: "🏃",

    metrics: {
      current: { value: 2, unit: "km" },
      target: { value: 5, unit: "km non-stop" },
      timeline: "8 weeks"
    },

    primaryMuscles: ["quadriceps", "gastrocnemius", "soleus"],
    secondaryMuscles: ["gluteus-maximus", "hamstrings", "tibialis-anterior"],

    primaryExercises: [
      { id: "running", duration: "30-45 min", priority: "primary" },
      { id: "interval-training", duration: "20 min", priority: "primary" },
      { id: "squats", sets: "3x12-15", priority: "accessory" },
      { id: "calf-raises", sets: "3x20", priority: "accessory" }
    ],

    program: {
      frequency: "3-4x per week",
      progression: "Couch to 5K program"
    },

    tips: [
      "Начните с ходьбы и бега интервалами",
      "Увеличивайте дистанцию постепенно (10% в неделю)",
      "Правильная обувь критична"
    ]
  }
};

/**
 * Get goal by ID
 */
export function getGoal(goalId) {
  return goalData[goalId] || null;
}

/**
 * Get all goals of a specific type
 */
export function getGoalsByType(type) {
  return Object.values(goalData).filter(goal => goal.type === type);
}

/**
 * Get all athletic goals by subtype
 */
export function getAthleticGoalsBySubtype(subtype) {
  return Object.values(goalData).filter(
    goal => goal.type === goalTypes.ATHLETIC && goal.subtype === subtype
  );
}

/**
 * Get goals that target a specific muscle
 */
export function getGoalsByMuscle(muscleId) {
  return Object.values(goalData).filter(goal =>
    goal.primaryMuscles?.includes(muscleId) ||
    goal.secondaryMuscles?.includes(muscleId)
  );
}

/**
 * Get goals that include a specific exercise
 */
export function getGoalsByExercise(exerciseId) {
  return Object.values(goalData).filter(goal => {
    const primaryExercises = Array.isArray(goal.primaryExercises)
      ? goal.primaryExercises
      : goal.primaryExercises?.map(e => e.id) || [];
    const supportiveExercises = goal.supportiveExercises || [];

    return primaryExercises.includes(exerciseId) ||
           supportiveExercises.includes(exerciseId);
  });
}
