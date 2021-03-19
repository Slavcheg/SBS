import _ from "lodash"
import { T_client_short } from "./clients"

import { T_Activity_calculator, DEFAULT_ACTIVITY_ElEMENTS } from "./activityMeasurementQuestions"

export type T_measurement = {
  trainer: T_client_short
  dateStamp: number
  weight: string
  age: number
  height: number
  measurementID: string
  caliperID: string
  folds: T_fold[]
  tapeMeasures: T_TapeMeasure[]
  activity: T_Activity_calculator
  goals: T_goals
}

export type T_goals = {
  transformationGoal: "cut" | "bulk" | "maintenance"
  targetPercent?: string
  goalCalories?: number
  goalProteinCoef?: string
  goalProtein?: number
  goalCarbs?: number
  goalFat?: number
}

export type T_fold = {
  Name: "TRI" | "PEC" | "MID" | "SUB" | "ABD" | "SUP" | "QUAD"
  Value: string
}

export type T_TapeMeasure = {
  Name: "neck" | "waist" | "hips" | "chest" | "biceps" | "abdominal" | "quads"
  Value: string
}

// export type T_Client_Sex = YES
export type T_Client_Sex = "male" | "female" | "other"

export type T_measurement_Document = {
  client: T_client_short
  clientID: string
  trainerIDs: string[]
  docID: string
  sex: T_Client_Sex
  measurements: T_measurement[]
}

export const DEFAULT_MEASUREMENT_DOC: T_measurement_Document = {
  client: null,
  clientID: "",
  trainerIDs: [],
  docID: "",
  sex: "male",
  measurements: [],
}

export const DEFAULT_ANY_MEASUREMENT: T_measurement = {
  trainer: null,
  dateStamp: null,
  weight: null,
  age: null,
  height: null,
  measurementID: null,
  caliperID: "",
  folds: null,
  tapeMeasures: null,
  activity: null,
  goals: null,
}

const DEFAULT_FOLDS: T_fold[] = [
  { Name: "TRI", Value: null },
  { Name: "PEC", Value: null },
  { Name: "MID", Value: null },
  { Name: "SUB", Value: null },
  { Name: "ABD", Value: null },
  { Name: "SUP", Value: null },
  { Name: "QUAD", Value: null },
]

const DEFAULT_TAPE_MEASURES: T_TapeMeasure[] = [
  { Name: "neck", Value: null },
  { Name: "waist", Value: null },
  { Name: "hips", Value: null },
  { Name: "chest", Value: null },
  { Name: "biceps", Value: null },
  { Name: "abdominal", Value: null },
  { Name: "quads", Value: null },
]

const DEFAULT_GOALS: T_goals = {
  transformationGoal: "cut",
  targetPercent: "25",
  goalCalories: 1500,
  goalProtein: 120,
  goalProteinCoef: "1.6",
  goalCarbs: null,
  goalFat: null,
}

export const DEFAULT_MEASUREMENT_ELEMENTS = {
  DEFAULT_FOLDS: DEFAULT_FOLDS,
  DEFAULT_TAPE_MEASURES: DEFAULT_TAPE_MEASURES,
  DEFAULT_ACTIVITY_ElEMENTS: DEFAULT_ACTIVITY_ElEMENTS,
  DEFAULT_GOALS: DEFAULT_GOALS,
}
