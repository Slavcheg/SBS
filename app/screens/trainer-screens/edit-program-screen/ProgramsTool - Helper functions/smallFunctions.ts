import iStyles from "../Constants/Styles"
import { useStores } from "../../../../models/root-store"

import _ from "lodash"

export const updateFollowingWeeks = state => {
  const {
    currentWeekIndex,
    currentDayIndex,
    currentProgram,
    currentExerciseIndex,
    isEditExerciseModalVisible,
    isKeyboardActive,
    isButtonsRowShown,
    isProgramSaving,
    isProgramSaved,
  } = state
  let newProgram = _.cloneDeep(currentProgram)

  console.log("currentWeekIndex", currentWeekIndex)
  console.log("currentDayIndex", currentDayIndex)
  console.log("currentProgram.Weeks.length", currentProgram.Weeks.length)

  if (
    //ако операцията е била добавяне на нов ден - само копираме дните. Ако нещо друго се е ъпдейтвало - упражнение по упражнение
    newProgram.Weeks[currentWeekIndex + 1].Days.length !==
    currentProgram.Weeks[currentWeekIndex].Days.length
  )
    for (
      let i = currentWeekIndex + 1;
      i < currentProgram.Weeks.length;
      i++ // i = weekIndex
    )
      newProgram.Weeks[i].Days = _.cloneDeep(currentProgram.Weeks[currentWeekIndex].Days)
  else
    for (
      let i = currentWeekIndex + 1;
      i < currentProgram.Weeks.length;
      i++ // i = weekIndex
    ) {
      // всяка седмица напред се копира да е същата, като настоящата, освен 'Days[x].isCompleted
      newProgram.Weeks[i].Days.forEach((day, dayIndex) => {
        newProgram.Weeks[i].Days[dayIndex].Exercises = _.cloneDeep(
          currentProgram.Weeks[currentWeekIndex].Days[dayIndex].Exercises,
        )
        newProgram.Weeks[i].Days[dayIndex].DayName =
          currentProgram.Weeks[currentWeekIndex].Days[dayIndex].DayName
      })
    }

  //block for updating exercises by their +reps +weight values

  for (
    let i = currentWeekIndex + 1;
    i < currentProgram.Weeks.length;
    i++ // i = weekIndex
  ) {
    if (newProgram.Weeks[i].Days[currentDayIndex].Exercises.length > 0) {
      newProgram.Weeks[i].Days.forEach((day, dayIndex: number) => {
        newProgram.Weeks[i].Days[dayIndex].Exercises.forEach((exercise, exerciseIndex: number) => {
          let currentExercise =
            currentProgram.Weeks[currentWeekIndex].Days[dayIndex].Exercises[exerciseIndex]
          newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets.forEach(
            (set, setIndex) => {
              newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex].Reps =
                newProgram.Weeks[i - 1].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex]
                  .Reps + currentExercise.increaseReps
              if (
                newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex]
                  .WeightType === "pureWeight"
              )
                newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets[
                  setIndex
                ].Weight = `${parseFloat(
                  newProgram.Weeks[i - 1].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex]
                    .Weight,
                ) + parseFloat(currentExercise.increaseWeight)}`
            },
          )
        })
      })
    }
  }

  return { ...newProgram }
}

type latestSet = {
  latestWeight: string
  latestWeightType: string
  latestWeightReps: number
  completedOn: string | Date | number
  wholeSetString: string
  Sets: any
}

type oldExerciseInfo = {
  Name: string
  doneBefore: number
  latestSet: latestSet
}

const getExerciseLatestSet = (exercise, day) => {
  let latestSet: latestSet

  let setIndex = exercise.Sets.length - 1
  let sets = exercise.Sets.length

  let weight = exercise.Sets[setIndex].Weight
  let weightType = exercise.Sets[setIndex].WeightType
  let reps = exercise.Sets[setIndex].Reps
  let showKg = weightType === "pureWeight" ? "kg" : ""

  latestSet = {
    latestWeight: weight,
    latestWeightType: weightType,
    latestWeightReps: reps,
    completedOn: day.completedOn,
    wholeSetString: `${sets}x${reps} @ ${weight}${showKg}`,
    Sets: exercise.Sets,
  }

  return latestSet
}

export const updateOldExercises = state => {
  let oldExercises: oldExerciseInfo[] = [] //all info about oldExercises will be in this array
  let oldExercisesNames = [] //names here for easy checking if we already did that exercise
  let markedThisProgram = [] //we put each exercise that we already did in the program here so we count each exercise as done once per program

  state.oldPrograms.forEach((program, index) => {
    markedThisProgram = []
    program.item.Weeks.forEach((week, weekIndex) => {
      program.item.Weeks[weekIndex].Days.forEach((day, dayIndex) => {
        if (program.item.Weeks[weekIndex].Days[dayIndex].isCompleted)
          //only count exercises on days we've completed
          program.item.Weeks[weekIndex].Days[dayIndex].Exercises.forEach(
            (exercise, exerciseIndex) => {
              let newLatestSet: latestSet = getExerciseLatestSet(exercise, day)
              if (!oldExercisesNames.includes(exercise.Name)) {
                //if we haven't done it already - we push a new exercise

                oldExercises.push({
                  ...exercise,
                  doneBefore: 1,

                  latestSet: newLatestSet,
                })
                oldExercisesNames.push(exercise.Name)
                markedThisProgram.push(exercise.Name)
              } else {
                //if we've pushed this exercise already - we increase the 'doneBefore' count per program, and get latestWeight/WeightType always

                let foundIndex = oldExercises.findIndex(ex => ex.Name === exercise.Name)

                oldExercises[foundIndex].latestSet = newLatestSet

                if (!markedThisProgram.includes(exercise.Name))
                  // if exercise exists in oldExercises but we haven't counted it for this program yet
                  oldExercises[foundIndex].doneBefore++
              }
            },
          )
      })
    })
  })

  return oldExercises
}

export const getVideoID = originalLink => {
  let newVideoID = originalLink
  let newVideo2 = originalLink

  newVideoID.includes("www.youtube.com")
    ? (newVideoID = newVideoID.substring(32, 43))
    : (newVideoID = newVideoID.substring(17, 28))
  console.log(originalLink)

  return newVideoID
}

export const getVideoTime = originalLink => {
  let newVideoID = originalLink
  let videoTime = 0

  newVideoID.includes("?t=") ? (newVideoID = newVideoID.substring(31, 35)) : (newVideoID = 0)

  videoTime = parseInt(newVideoID)

  console.log(videoTime)

  return videoTime
}

export function getColorByMuscleName(muscleName) {
  let color1 = iStyles.text1.color
  let color2 = iStyles.text2.color
  let color3 = iStyles.text3.color

  switch (muscleName) {
    case "chest":
    case "shoulders":
    case "back": {
      return color1
    }
    case "glutes":
    case "quads":
    case "hamstrings": {
      return color2
    }

    default: {
      return color3
    }
  }
}

export function getColorByExercisePosition(position) {
  let color1 = iStyles.text2.color
  let color2 = iStyles.text1.color
  let color3 = iStyles.text3.color

  switch (position) {
    case 1: {
      return color1
    }
    case 2: {
      return color2
    }
    case 3: {
      return color3
    }
    case 4: {
      return color1
    }
    case 5: {
      return color2
    }
    case 6: {
      return color3
    }
    case 7: {
      return color1
    }
    case 8: {
      return color2
    }
    case 9: {
      return color3
    }

    default: {
      return color1
    }
  }
}

export const getDoneBeforeColor = (doneBefore: number) => {
  let color1 = iStyles.text1.color
  let color2 = iStyles.text2.color
  let color3 = iStyles.text3.color

  switch (doneBefore) {
    case 0: {
      return color2
    }
    case 1:
    case 2:
    case 3: {
      return "orange"
    }

    default: {
      return "red"
    }
  }
}
