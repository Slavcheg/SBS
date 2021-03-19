import { TextStyle } from "react-native"

import { T_measurement, T_measurement_Document, Questionaires, colors } from "../../../../../components3"
import { T_person } from "./FatEvalRow"

const errorStyle: TextStyle = {
  color: colors.red,
  fontSize: 14,
}

const ERROR_STRINGS = {
  no_weight: "въведи тегло",
  no_age: "въведи възраст",
  wrong_age: "сигурен ли си, че годините са правилни?",
  age_too_low: "нямаме данни за тази възраст, минимално 20",
  no_height: "въведи височина",
  no_folds: "въведи всички гънки",
  no_waist: "въведи талия",
  no_hips: "въведи ханш",
  no_neck: "въведи врат",
  no_answers: "отговори на всички въпроси",
  no_sex: "въведи пол",
  wrong_fat: "този процент мазнини е много странен",
  no_activity: "попълни дневника за активност",
}
const getError_basic = (measurement: T_measurement, mesDoc: T_measurement_Document) => {
  let errorMsg = null
  if (!measurement.weight) errorMsg = ERROR_STRINGS.no_weight
  else if (!measurement.height) errorMsg = ERROR_STRINGS.no_height
  else if (!measurement.age) errorMsg = ERROR_STRINGS.no_age
  return errorMsg
}

const getError_folds = (measurement: T_measurement, mesDoc: T_measurement_Document) => {
  let errorMsg = null
  if (measurement.folds) {
    measurement.folds.forEach(fold => {
      if (!fold.Value) errorMsg = ERROR_STRINGS.no_folds
    })
  }
  return errorMsg
}

const getError_tapeMeasures = (measurement: T_measurement, mesDoc: T_measurement_Document) => {
  let errorMsg = null
  if (measurement.tapeMeasures) {
    const waist = measurement.tapeMeasures.find(measure => measure.Name === "waist").Value
    const hips = measurement.tapeMeasures.find(measure => measure.Name === "hips").Value
    const neck = measurement.tapeMeasures.find(measure => measure.Name === "neck").Value
    const height = measurement.height
    if (!waist) errorMsg = ERROR_STRINGS.no_waist
    else if (!height) errorMsg = ERROR_STRINGS.no_height
    else if (!hips) errorMsg = ERROR_STRINGS.no_hips
    else if (!neck && mesDoc.sex === "male") errorMsg = ERROR_STRINGS.no_neck
  }
  return errorMsg
}

const getError_activityMeasures = (measurement: T_measurement, mesDoc: T_measurement_Document) => {
  const queIndex = Questionaires.findIndex(que => que.questionaireID === measurement.activity.questionsID)
  const QueAnswersCount = Questionaires[queIndex].QuestionsAndAnswers.length

  let mesAnswerCount = 0
  measurement.activity.answers.forEach(answer => {
    if (Number.isInteger(answer)) mesAnswerCount++
  })

  if (mesAnswerCount < QueAnswersCount) return ERROR_STRINGS.no_answers
  else return null
}

const getError_goals = (measurement: T_measurement, mesDoc: T_measurement_Document) => {
  let err = null
  if (!measurement.activity) err = ERROR_STRINGS.no_activity
  else err = getError_basic(measurement, mesDoc)

  return err
}

const getFatEval_errors = (person: T_person) => {
  let err = null
  const { age, sex, fatPercent } = person
  if (!age) err = ERROR_STRINGS.no_age
  else if (age < 20) err = ERROR_STRINGS.age_too_low
  else if (age < 6 || age > 150) err = ERROR_STRINGS.wrong_age
  else if (!sex) ERROR_STRINGS.no_sex
  else if (fatPercent < 1 || fatPercent > 100) ERROR_STRINGS.wrong_fat
  return err
}

export const errors = {
  basic: getError_basic,
  folds: getError_folds,
  tapeMeasures: getError_tapeMeasures,
  activity: getError_activityMeasures,
  fatEval: getFatEval_errors,
  errorStyle: errorStyle,
  getError_goals: getError_goals,
}
