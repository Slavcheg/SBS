import { T_measurement, T_measurement_Document } from "../../../../../components3"

export const getFatPercent_Skinfold = (measurement: T_measurement, measurementDoc: T_measurement_Document) => {
  const { age } = measurement

  let returnNull = false
  let CaliperSum = 0
  measurement.folds.forEach(fold => {
    if (!fold.Value) returnNull = true
    CaliperSum += parseFloat(fold.Value)
  })
  if (returnNull) return null

  let womanPercent = 495 / (1.097 - 0.00046971 * CaliperSum + 0.00000056 * CaliperSum * CaliperSum - 0.00012828 * age) - 450
  let manPercent = 495 / (1.112 - 0.00043499 * CaliperSum + 0.00000055 * CaliperSum * CaliperSum - 0.00028826 * age) - 450
  womanPercent = Math.round(womanPercent * 10) / 10
  manPercent = Math.round(manPercent * 10) / 10

  let other = (manPercent + womanPercent) / 2
  if (measurementDoc.sex === "male") return manPercent
  else if (measurementDoc.sex === "female") return womanPercent
  else return other
}

export const getFatPercent_TapeMeasure = (measurement: T_measurement, measurementDoc: T_measurement_Document) => {
  const { height } = measurement

  const waist = parseFloat(measurement.tapeMeasures.find(measure => measure.Name === "waist").Value)
  const hips = parseFloat(measurement.tapeMeasures.find(measure => measure.Name === "hips").Value)
  const neck = parseFloat(measurement.tapeMeasures.find(measure => measure.Name === "neck").Value)

  if (!waist || !hips) return null
  if (!neck && measurementDoc.sex === "male") return null

  let womanPercent = (hips * 0.55 - 1 + (waist * 0.29 - 2) - measurement.height * 0.24 - 10) / 100
  let manPercent = (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450) / 100
  womanPercent = Math.round(womanPercent * 1000) / 10
  manPercent = Math.round(manPercent * 1000) / 10

  let other = Math.round(((manPercent + womanPercent) / 2) * 10) / 10
  if (measurementDoc.sex === "male") return manPercent
  else if (measurementDoc.sex === "female") return womanPercent
  else return other
}

export const getSkinfoldResults = (measurement: T_measurement, measurementDoc: T_measurement_Document) => {
  type Tresult = { fatPercent: number; fatWeight: number; leanWeight: number }
  let result: Tresult = { fatPercent: null, fatWeight: null, leanWeight: null }
  const weight = parseFloat(measurement.weight)

  if (measurement.folds) result.fatPercent = getFatPercent_Skinfold(measurement, measurementDoc)
  result.fatWeight = Math.round(weight * (result.fatPercent / 100) * 10) / 10
  result.leanWeight = Math.round((weight - result.fatWeight) * 10) / 10
  return result
}

export const getTapeMeasureResults = (measurement: T_measurement, measurementDoc: T_measurement_Document) => {
  type Tresult = { fatPercent: number; fatWeight: number; leanWeight: number }
  let result: Tresult = { fatPercent: null, fatWeight: null, leanWeight: null }
  const weight = parseFloat(measurement.weight)

  if (measurement.tapeMeasures) result.fatPercent = getFatPercent_TapeMeasure(measurement, measurementDoc)
  result.fatWeight = Math.round(weight * (result.fatPercent / 100) * 10) / 10
  result.leanWeight = Math.round((weight - result.fatWeight) * 10) / 10
  return result
}
