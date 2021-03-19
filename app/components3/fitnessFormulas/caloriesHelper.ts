export const CALORIES_IN_1_KG_FAT = 7716.17
export const CALORIES_IN_1_KG_MUSCLE = 1500
export const DAYS_IN_1_MONTH = 30.42

export type experience = "novice" | "advanced" | "elite"
export type sex = "male" | "female" | "other"
export type T_formula = "cut" | "bulk"

const getMaintenance = (sex: sex, weight: number, age: number, height: number, formula: T_formula, activityCoef: number) => {
  const femaleCut = (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) * activityCoef
  const femaleBulk = (655.1 + 9.563 * weight + 1.85 * height - 4.676 * age) * activityCoef
  const maleCut = (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * activityCoef
  const maleBulk = 66.5 + (13.75 * weight + 5.003 * height - 6.755 * age) * activityCoef
  if (sex === "male") {
    if (formula === "bulk") return maleBulk
    else return maleCut
  } else if (sex === "female") {
    if (formula === "bulk") return femaleBulk
    else return femaleCut
  } else {
    if (formula === "bulk") return (maleBulk + femaleBulk) / 2
    else return (maleCut + femaleCut) / 2
  }
}

const getMaximumDeficitRecommendation = (sex: sex, bodyFatPercent: number) => {
  let maxDeficitFemale = 0
  let maxDeficitMale = 0

  if (bodyFatPercent < 18) maxDeficitFemale = 20
  else if (bodyFatPercent < 25) maxDeficitFemale = 25
  else if (bodyFatPercent < 30) maxDeficitFemale = 35
  else if (bodyFatPercent < 40) maxDeficitFemale = 45
  else if (bodyFatPercent >= 40) maxDeficitFemale = 50

  if (bodyFatPercent < 10) maxDeficitMale = 20
  else if (bodyFatPercent < 15) maxDeficitMale = 25
  else if (bodyFatPercent < 20) maxDeficitMale = 35
  else if (bodyFatPercent < 30) maxDeficitMale = 45
  else if (bodyFatPercent >= 30) maxDeficitMale = 50
  if (sex === "male") return maxDeficitMale
  else if (sex === "female") return maxDeficitFemale
  else return (maxDeficitMale + maxDeficitFemale) / 2
}

const getBulkRecommendation = (experience: experience): string => {
  if (experience === "novice") return `10`
  else if (experience === "advanced") return "8"
  else return "5"
}

export type deficit_surplus = "deficit" | "surplus"
const getCalories = (deficit_surplus: deficit_surplus, maintenanceCals: number, percent: number) => {
  if (deficit_surplus === "deficit") return maintenanceCals * (1 - percent / 100)
  else return maintenanceCals * (1 + percent / 100)
}

const getMonthsExpectedRateOfFatloss = (numberOfMonths = 1, caloriesDeficitPerDay: number): number => {
  let weightlossPerDay = caloriesDeficitPerDay / CALORIES_IN_1_KG_FAT
  let weightLoss = numberOfMonths * DAYS_IN_1_MONTH * weightlossPerDay

  return weightLoss
}

// const getMonthsExpectedRateOfMuscleGain = (numberOfMonths = 1, caloriesDeficitPerDay: number): number => {
//   let muscleGainPerDay = caloriesDeficitPerDay / CALORIES_IN_1_KG_FAT
//   let totalMuscleGain = numberOfMonths * DAYS_IN_1_MONTH * muscleGainPerDay

//   return totalMuscleGain
// }

export const calFormulas = {
  getMaintenance: getMaintenance,
  getMaxDeficit: getMaximumDeficitRecommendation,
  getMaxBulk: getBulkRecommendation,
  getCalories: getCalories,
  getMonthsExpectedRateOfFatloss: getMonthsExpectedRateOfFatloss,
}
