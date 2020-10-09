import { muscleGroups } from "../Constants/MuscleGroups"

// get all exercises, sort them into an object with key arrays for each muscle

export const getFilteredExercises = exerciseDB => {
  let filtered = {}
  console.log(muscleGroups.length)
  muscleGroups.forEach(muscleGroupName => {
    filtered[muscleGroupName] = []
  })

  exerciseDB.forEach(exercise => {
    if (!exercise.MainMuscleGroup) return
    if (!exercise.Name) return
    let newArray = filtered[exercise.MainMuscleGroup]
    if (!newArray) return

    newArray.push(exercise)
    filtered = {
      ...filtered,
      [exercise.MainMuscleGroup]: newArray,
    }
  })

  return filtered
}
