//for arranging by MainMuscleGroup
export const muscleGroups = [
  "chest",
  "shoulders",
  "back",
  "biceps",
  "triceps",
  "glutes",
  "quads",
  "hams",
  "core",
  "traps",
  "calves",
  "climbing",
  "low back",
  "cardio",
  "circuits",
  "neck",
]

//for Coefs
export const muscleGroups2 = [
  "glutes",
  "chest",
  "shoulders",
  "triceps",
  "back",
  "rShoulders",
  "quads",
  "hamstrings",
  "biceps",
  "lats",
  "abs",
  "calves",
  "cardio",
  "forearms",
  "lowBack",
  "traps",
  "lowTraps",
  "neck",
  "adductors",
  "abductors",
]

//for arranging by MainMuscleGroup
export const muscleGroupsObject = () => {
  let newObj = {}
  muscleGroups.forEach(muscle => {
    newObj = { ...newObj, [muscle]: "" }
  })
  return newObj
}
