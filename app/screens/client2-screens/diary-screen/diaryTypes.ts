import { return_todays_datestamp } from "../../../global-helper"

export type diaryDay = {
  date: number | null
  weight: number | null
  kcal: number | null
  protein: number | null
}

export const defaultDiaryDay: diaryDay = {
  date: return_todays_datestamp(),
  weight: null,
  kcal: null,
  protein: null,
}

export type diarySettings = {
  showWeight: boolean
  showCalories: boolean
  showProtein: boolean
}

export const defaultSettings: diarySettings = {
  showWeight: true,
  showCalories: true,
  showProtein: true,
}

export type DiaryType = {
  clientID: string
  weightTarget?: number
  kcalTarget?: number
  proteinTarget?: number
  Days: diaryDay[]
  Name: string
  FamilyName: string
  ClientNumber: number
  settings?: diarySettings
}
