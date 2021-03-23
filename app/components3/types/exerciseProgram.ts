export type T_WeightType = "pureWeight" | "other"

export type T_Set = {
  Reps: number
  Weight: string
  WeightType: T_WeightType
  Rest: string
}

export type T_Exercise = {
  Name: string
  ID: string
  Position: number
  isExpanded: boolean
  increaseReps: number
  increaseWeight: number
  Sets: T_Set[]
}

export type T_Day = {
  DayName: string
  isCompleted: boolean
  completedOn: number
  Exercises: T_Exercise[]
}

export type T_Week = {
  Days: T_Day[]
}

export type T_Program = {
  Name: string
  ID: string
  Tags: string[]
  Client: string
  Trainers: string[]
  isCompleted: boolean
  Weeks: T_Week[]
}

type ExerciseCoefs = {}

export type T_Exercise_In_Database = {
  Name: string
  YouTubeLink: string
  ID: string
  MainMuscleGroup: string
  Coefs: ExerciseCoefs
  AddedOn?: number
}
