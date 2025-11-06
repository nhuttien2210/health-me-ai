export type HealthReport = {
  summary: Summary
  exerciseCalendar: ExerciseCalendar[]
  timeline: Timeline
  charts: Charts
}

export type Summary = {
  name: string
  age: number
  height: number
  currentWeight: number
  goalWeight: number
  bmi: number
  bmiCategory: string
  healthSummary: string
}

export type ExerciseCalendar = {
  day: string
  activity: string
  duration: string
  caloriesBurned: number
}

export type NutritionBreakdown = {
  dailyCalories: number
  macros: Macro[]
  recommendation: string
}

export type Macro = {
  type: string
  percentage: number
}

export type WeightProgress = {
  goalWeeks: number
  targetLoss: number
  progressData: ProgressDaum[]
}

export type ProgressDaum = {
  week: number
  weight: number
}

export type Timeline = {
  currentProgress: number
  weeksToGoal: number
  message: string
}

export type Charts = {
  nutritionBreakdown: NutritionBreakdown
  exerciseEffort: ExerciseEffort[]
  activityComposition: ActivityComposition[]
  bodyComposition: BodyComposition[]
  weightProgress: WeightProgress
}

export type NutritionPie = {
  type: string
  value: number
}

export type ExerciseEffort = {
  day: string
  caloriesBurned: number
  durationMin: number
}

export type ActivityComposition = {
  type: string
  value: number
}

export type BodyComposition = {
  type: string
  value: number
}
