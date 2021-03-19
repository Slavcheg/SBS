type sex = "male" | "female"

export type T_fat_eval_result = {
  comparison: "lower" | "current" | "higher"
  personGroup: string
  bodyFatRanges: string
  score: "very low" | "low" | "average" | "high" | "very high"
}

export const getFatEval = (sex: sex, age: number, bodyFatPercent: number) => {
  const results: T_fat_eval_result[] = []
  const BFP = Math.round(bodyFatPercent)

  FAT_EVAL_TABLE.forEach(person => {
    if (sex === person.sex) {
      if (age >= person.minAge && age <= person.maxAge) {
        const personGroup = `${person.sex === "female" ? "жена" : "мъж"} ${person.minAge !== 0 ? person.minAge : ""}${
          person.maxAge < 80 ? `-${person.maxAge}` : "+"
        }`
        const bodyFatRanges = `${person.minBodyFatPerc !== 0 ? person.minBodyFatPerc : ""}${
          person.maxBodyFatPerc < 80 ? `-${person.maxBodyFatPerc}` : "+"
        }%`
        let comparison
        if (BFP >= person.minBodyFatPerc) {
          if (BFP <= person.maxBodyFatPerc) comparison = "current"
          else comparison = "lower"
        } else comparison = "higher"
        results.push({ comparison: comparison, personGroup: personGroup, bodyFatRanges: bodyFatRanges, score: person.grade })
      }
    }
  })
  return results
}

type fatEval = {
  minAge: number
  maxAge: number
  minBodyFatPerc: number
  maxBodyFatPerc: number
  sex: "male" | "female"
  grade: "very low" | "low" | "average" | "high" | "very high"
}
const FAT_EVAL_TABLE: fatEval[] = [
  { sex: "male", minAge: 20, maxAge: 29, minBodyFatPerc: 0, maxBodyFatPerc: 8, grade: "very low" },
  { sex: "male", minAge: 20, maxAge: 29, minBodyFatPerc: 9, maxBodyFatPerc: 12, grade: "low" },
  { sex: "male", minAge: 20, maxAge: 29, minBodyFatPerc: 13, maxBodyFatPerc: 16, grade: "average" },
  { sex: "male", minAge: 20, maxAge: 29, minBodyFatPerc: 17, maxBodyFatPerc: 19, grade: "high" },
  { sex: "male", minAge: 20, maxAge: 29, minBodyFatPerc: 20, maxBodyFatPerc: 100, grade: "very high" },
  { sex: "male", minAge: 30, maxAge: 39, minBodyFatPerc: 0, maxBodyFatPerc: 10, grade: "very low" },
  { sex: "male", minAge: 30, maxAge: 39, minBodyFatPerc: 11, maxBodyFatPerc: 13, grade: "low" },
  { sex: "male", minAge: 30, maxAge: 39, minBodyFatPerc: 14, maxBodyFatPerc: 17, grade: "average" },
  { sex: "male", minAge: 30, maxAge: 39, minBodyFatPerc: 18, maxBodyFatPerc: 22, grade: "high" },
  { sex: "male", minAge: 30, maxAge: 39, minBodyFatPerc: 23, maxBodyFatPerc: 100, grade: "very high" },
  { sex: "male", minAge: 40, maxAge: 49, minBodyFatPerc: 0, maxBodyFatPerc: 11, grade: "very low" },
  { sex: "male", minAge: 40, maxAge: 49, minBodyFatPerc: 12, maxBodyFatPerc: 15, grade: "low" },
  { sex: "male", minAge: 40, maxAge: 49, minBodyFatPerc: 16, maxBodyFatPerc: 20, grade: "average" },
  { sex: "male", minAge: 40, maxAge: 49, minBodyFatPerc: 21, maxBodyFatPerc: 25, grade: "high" },
  { sex: "male", minAge: 40, maxAge: 49, minBodyFatPerc: 26, maxBodyFatPerc: 100, grade: "very high" },
  { sex: "male", minAge: 50, maxAge: 999, minBodyFatPerc: 0, maxBodyFatPerc: 12, grade: "very low" },
  { sex: "male", minAge: 50, maxAge: 999, minBodyFatPerc: 13, maxBodyFatPerc: 16, grade: "low" },
  { sex: "male", minAge: 50, maxAge: 999, minBodyFatPerc: 17, maxBodyFatPerc: 21, grade: "average" },
  { sex: "male", minAge: 50, maxAge: 999, minBodyFatPerc: 22, maxBodyFatPerc: 27, grade: "high" },
  { sex: "male", minAge: 50, maxAge: 999, minBodyFatPerc: 28, maxBodyFatPerc: 100, grade: "very high" },
  { sex: "female", minAge: 20, maxAge: 29, minBodyFatPerc: 0, maxBodyFatPerc: 16, grade: "very low" },
  { sex: "female", minAge: 20, maxAge: 29, minBodyFatPerc: 17, maxBodyFatPerc: 20, grade: "low" },
  { sex: "female", minAge: 20, maxAge: 29, minBodyFatPerc: 21, maxBodyFatPerc: 23, grade: "average" },
  { sex: "female", minAge: 20, maxAge: 29, minBodyFatPerc: 24, maxBodyFatPerc: 27, grade: "high" },
  { sex: "female", minAge: 20, maxAge: 29, minBodyFatPerc: 28, maxBodyFatPerc: 100, grade: "very high" },
  { sex: "female", minAge: 30, maxAge: 39, minBodyFatPerc: 0, maxBodyFatPerc: 17, grade: "very low" },
  { sex: "female", minAge: 30, maxAge: 39, minBodyFatPerc: 18, maxBodyFatPerc: 21, grade: "low" },
  { sex: "female", minAge: 30, maxAge: 39, minBodyFatPerc: 22, maxBodyFatPerc: 24, grade: "average" },
  { sex: "female", minAge: 30, maxAge: 39, minBodyFatPerc: 25, maxBodyFatPerc: 29, grade: "high" },
  { sex: "female", minAge: 30, maxAge: 39, minBodyFatPerc: 30, maxBodyFatPerc: 100, grade: "very high" },
  { sex: "female", minAge: 40, maxAge: 49, minBodyFatPerc: 0, maxBodyFatPerc: 19, grade: "very low" },
  { sex: "female", minAge: 40, maxAge: 49, minBodyFatPerc: 20, maxBodyFatPerc: 23, grade: "low" },
  { sex: "female", minAge: 40, maxAge: 49, minBodyFatPerc: 24, maxBodyFatPerc: 27, grade: "average" },
  { sex: "female", minAge: 40, maxAge: 49, minBodyFatPerc: 28, maxBodyFatPerc: 30, grade: "high" },
  { sex: "female", minAge: 40, maxAge: 49, minBodyFatPerc: 31, maxBodyFatPerc: 100, grade: "very high" },
  { sex: "female", minAge: 50, maxAge: 999, minBodyFatPerc: 0, maxBodyFatPerc: 20, grade: "very low" },
  { sex: "female", minAge: 50, maxAge: 999, minBodyFatPerc: 21, maxBodyFatPerc: 24, grade: "low" },
  { sex: "female", minAge: 50, maxAge: 999, minBodyFatPerc: 25, maxBodyFatPerc: 31, grade: "average" },
  { sex: "female", minAge: 50, maxAge: 999, minBodyFatPerc: 32, maxBodyFatPerc: 35, grade: "high" },
  { sex: "female", minAge: 50, maxAge: 999, minBodyFatPerc: 36, maxBodyFatPerc: 100, grade: "very high" },
]
