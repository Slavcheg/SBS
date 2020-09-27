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
]

export const muscleGroupsObject = () => {
  let newObj = {}
  muscleGroups.forEach(muscle => {
    newObj = { ...newObj, [muscle]: "" }
  })
  return newObj
}
