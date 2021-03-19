import iStyles from "../../../../components3/Constants/Styles"

import firestore from "@react-native-firebase/firestore"

import _ from "lodash"

import { repComparisonCoefs as repComp, colors, state } from "../../../../components3/Constants"

import { muscleGroups2, muscleGroupsObject } from "../../../../components3/Constants/MuscleGroups"

export function omit(obj, props) {
  props = props instanceof Array ? props : [props]
  return eval(`(({${props.join(",")}, ...o}) => o)(obj)`)
}

// usage
// const obj = { a: 1, b: 2, c: 3, d: 4 }
// const clone = omit(obj, ['b', 'c'])
// console.log(clone)

export const getInitialState = program => {
  let state = {
    locked: true,
    currentWeekIndex: 0,
    currentDayIndex: 0,
    currentExerciseIndex: 0,
    currentProgram: program,
    isExerciseModalVisible: false,
  }

  let breakFlag = false
  for (let weekIndex = 0; weekIndex < program.Weeks.length; weekIndex++) {
    if (breakFlag === true) break
    for (let dayIndex = 0; dayIndex < program.Weeks[weekIndex].Days.length; dayIndex++) {
      if (breakFlag) break
      if (program.Weeks[weekIndex].Days[dayIndex].isCompleted !== true) {
        breakFlag = true
        state = { ...state, locked: true, currentWeekIndex: weekIndex, currentDayIndex: dayIndex }
      }
    }
  }
  return state
}

export const getProgressions = (lastWeekExercise: any) => {
  let progressions = { newReps: 1, newWeight: "errorWeight" }
  const RELATIVE_CALCULATION = false

  const isPure = isPureWeight(lastWeekExercise)
  const averageReps = getAverageReps(lastWeekExercise)

  progressions.newReps = averageReps + lastWeekExercise.increaseReps
  if (isPure) {
    const averageWeight = getAverageWeightFromExercise(
      lastWeekExercise,
      RELATIVE_CALCULATION,
      averageReps,
    )
    progressions.newWeight = `${(
      averageWeight + parseFloat(lastWeekExercise.increaseWeight)
    ).toPrecision(5)}`
  } else progressions.newWeight = lastWeekExercise.Sets[0].Weight

  return progressions
}

export const fixTrainees = (onFix: Function) => {
  //updating clients values if something breaks
  // console.log(allClients.find(client => client.ID === "JMxV035wcHXjmYjYyHGR"))
  firestore()
    .collection("trainingPrograms")
    .get()
    .then(docs => {
      let programs = []
      docs.forEach(doc => {
        programs.push(doc.data())
      })
      console.log("got all programs ", programs.length)

      firestore()
        .collection("users2")
        .get()
        .then(users => {
          let newUsers = []
          users.forEach(user => {
            if (user.data().first)
              newUsers.push({
                Name: user.data().first,
                ID: user.id,
                FamilyName: user.data().last,
                ClientNumber: 0,
                email: user.data().email,
                Trainers: [{ Name: user.data().first, ID: user.id }],
                Clients: [
                  {
                    ClientNumber: 0,
                    FamilyName: user.data().last || "",
                    Name: user.data().first,
                    ID: user.id,
                  },
                ],
                isTrainer: user.data().isTrainer,
              })
          })

          console.log("got all users ", newUsers.length)

          newUsers.forEach((user, index) => {
            let thisTrainerclientsList = [user.ID]
            programs.forEach(program => {
              if (program.Client === user.ID)
                program.Trainers.forEach(trainerID => {
                  let addnewTrainer = true
                  newUsers[index].Trainers.forEach(trainer => {
                    if (trainer.ID === trainerID) addnewTrainer = false
                  })
                  if (addnewTrainer)
                    newUsers[index].Trainers.push({
                      ID: trainerID,
                      Name: newUsers.find(user => user.ID === trainerID).Name,
                    })
                })
              if (user.isTrainer) {
                if (program.Trainers.includes(user.ID)) {
                  if (!thisTrainerclientsList.includes(program.Client)) {
                    thisTrainerclientsList.push(program.Client)
                    const newClient = newUsers.find(user => user.ID === program.Client)
                    if (newClient) {
                      const newClientInfo = {
                        Name: newClient.Name,
                        FamilyName: newClient.FamilyName,
                        ClientNumber: newClient.ClientNumber,
                        ID: newClient.ID,
                      }
                      newUsers[index].Clients.push(newClientInfo)
                    }
                  }
                }
              }
            })
          })
          newUsers.forEach(user => {
            firestore()
              .collection("trainees")
              .doc(user.ID)
              .set(user)
          })
          onFix()
        })
    })
}

export const getExerciseVolume = (exerciseWithSets, allExercises) => {
  // exerciseWithSets is what the program contains. simply 'exercise' refers to exercise in database
  let exercise = allExercises.find(element => element.ID === exerciseWithSets.ID)
  let volumes = {}
  if (!exercise) {
    console.error("Exercise not found in DB")
    return null
  }

  for (const property in exercise.Coefs) {
    volumes[property] = exercise.Coefs[property] * exerciseWithSets.Sets.length
  }
  return volumes
}

export const getVolumeStrings = (exerciseWithSets, allExercises) => {
  let volumes = getExerciseVolume(exerciseWithSets, allExercises)
  if (volumes === null) return "exercise not found"
  let volumesArray = []

  let volumesString = ""

  for (const property in volumes) {
    volumesArray.push({ muscleName: property, value: volumes[property] })
  }

  const sortFunction = (a, b) => {
    return b.value - a.value
  }

  volumesArray.sort(sortFunction)

  for (let i = 0; i <= volumesArray.length; i++) {
    if (volumesArray[i].value === 0 || i >= 4) break //максимална бройка на мускулните групи, които да показва
    let oneVolumeString = volumesArray[i].value
    if (!Number.isInteger(volumesArray[i].value)) oneVolumeString = volumesArray[i].value.toFixed(1)
    volumesString += `${volumesArray[i].muscleName} ${oneVolumeString} `
  }

  return volumesString
}

export const getProgramVolume = (state, allExercises) => {
  const { currentProgram, currentWeekIndex, currentDayIndex, currentExerciseIndex } = state

  //get muscle groups and set volume to zero

  let exercise = allExercises.find(element => element.Name === "Bench Press")

  const allVolumesZero = () => {
    let emptyObj = {}
    for (const property in exercise.Coefs) {
      emptyObj[property] = 0
    }
    return emptyObj
  }

  let programCoefs = {}
  let weeklyCoefs = []

  programCoefs = allVolumesZero()

  currentProgram.Weeks[currentWeekIndex].Days.forEach(day => {
    weeklyCoefs.push({ coefs: {} })
  })

  //calculate all coefs
  currentProgram.Weeks[currentWeekIndex].Days.map((day, dayIndex) => {
    day.Exercises.forEach((exercise, exerciseIndex) => {
      let execiseVolumes = getExerciseVolume(exercise, allExercises)
      for (const property in programCoefs) {
        if (!execiseVolumes) continue
        programCoefs[property] += execiseVolumes[property]
        if (!weeklyCoefs[dayIndex]) weeklyCoefs.push({ coefs: {} })
        if (!weeklyCoefs[dayIndex].coefs[property]) weeklyCoefs[dayIndex].coefs[property] = 0 //zero out value if undefined
        weeklyCoefs[dayIndex].coefs[property] += execiseVolumes[property]
      }
    })
  })

  //reduce float numbers to 1 digit
  for (const property in programCoefs) {
    if (!Number.isInteger(programCoefs[property]))
      programCoefs[property] = parseFloat(programCoefs[property].toFixed(1))
    weeklyCoefs.forEach((coef, index) => {
      if (weeklyCoefs[index].coefs[property])
        if (!Number.isInteger(weeklyCoefs[index].coefs[property]))
          weeklyCoefs[index].coefs[property] = parseFloat(
            weeklyCoefs[index].coefs[property].toFixed(1),
          )
    })
  }

  let volumeArray = []
  let i = 0
  for (const muscleName in programCoefs) {
    volumeArray.push({
      muscleName: muscleName,
      programVolume: programCoefs[muscleName],
      weeklyVolume: [],
    })
    weeklyCoefs.forEach((week, index) => {
      volumeArray[i].weeklyVolume.push(weeklyCoefs[index].coefs[muscleName])
    })
    i++
  }

  const sortFunction = (a, b) => {
    return b.programVolume - a.programVolume
  }

  volumeArray.sort(sortFunction)

  return volumeArray
}

export const filteredByMuscleGroup = allExercises => {
  let type = muscleGroupsObject()
  let filtered = type
  allExercises.forEach(exercise => {
    if (!exercise.MainMuscleGroup) return
    if (!exercise.Name) return
    let newArray = filtered[exercise.MainMuscleGroup] ? filtered[exercise.MainMuscleGroup] : []

    newArray.push(exercise)
    filtered = {
      ...filtered,
      [exercise.MainMuscleGroup]: newArray,
    }
  })

  return filtered
}

export const getWeightEquivalent = (
  originalWeight: number,
  originalReps: number,
  toNumberOfReps: number,
) => {
  if (originalReps > 30) return 0

  const weightRepCoef = repComp.find(el => el.Reps === Math.round(originalReps))
  const toNumberOfRepsCoef = repComp.find(el => el.Reps === Math.round(toNumberOfReps))
  const newWeight = (originalWeight / weightRepCoef.Weight) * toNumberOfRepsCoef.Weight
  return newWeight
}

export const getAverageReps = exercise => {
  let average = 0
  exercise.Sets.forEach(set => {
    average += parseFloat(set.Reps)
  })
  return parseFloat((average / exercise.Sets.length).toPrecision(5))
}

export const getAverageWeightFromExercise = (
  exercise,
  calculateRelative = false,
  repEqualizer: number = 8,
) => {
  let weightSum = 0
  exercise.Sets.forEach(set => {
    const absoluteWeight = parseFloat(set.Weight)
    const realWeight = getWeightEquivalent(absoluteWeight, set.Reps, repEqualizer)
    if (calculateRelative) weightSum += realWeight
    else weightSum += absoluteWeight
  })
  return weightSum / exercise.Sets.length
}

export const isPureWeight = exercise => {
  let pureWeight = true
  exercise.Sets.forEach(set => {
    if (set.WeightType !== "pureWeight") pureWeight = false
  })
  return pureWeight
}

export const updateFollowingWeeks = state => {
  //copy next weeks to be exactly the same as previous (with applied progressions)
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

  if (currentWeekIndex >= currentProgram.Weeks.length - 1) return currentProgram

  let newProgram = _.cloneDeep(currentProgram)
  // return _.cloneDeep(newProgram)
  console.log("currentWeekIndex", currentWeekIndex)
  console.log("currentDayIndex", currentDayIndex)
  console.log("currentProgram.Weeks.length", currentProgram.Weeks.length)

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
          const lastWeekExercise = newProgram.Weeks[i - 1].Days[dayIndex].Exercises[exerciseIndex]

          const progressions = getProgressions(lastWeekExercise)

          const { Sets } = newProgram.Weeks[i].Days[currentDayIndex].Exercises[exerciseIndex]
          Sets.forEach((set, setIndex) => {
            Sets[setIndex].Reps = progressions.newReps
            Sets[setIndex].Weight = progressions.newWeight
          })
          console.log("reordered exercises hehe")
          // newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets.forEach(
          //   (set, setIndex) => {

          //     newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex].Reps =
          //       newProgram.Weeks[i - 1].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex]
          //         .Reps + currentExercise.increaseReps
          //     if (
          //       newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex]
          //         .WeightType === "pureWeight"
          //     )
          //       newProgram.Weeks[i].Days[dayIndex].Exercises[exerciseIndex].Sets[
          //         setIndex
          //       ].Weight = `${parseFloat(
          //         newProgram.Weeks[i - 1].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex]
          //           .Weight,
          //       ) + parseFloat(currentExercise.increaseWeight)}`
          //   },
          // )
        })
      })
    }
  }

  return _.cloneDeep(newProgram)
}

export const getLatestCompletedWeekIndexForOneDay = (program: any, dayIndex: number) => {
  let weekIndex = -1 //stays -1 if no weeks found
  program.Weeks.forEach((week, wIndex) => {
    if (program.Weeks[wIndex].Days[dayIndex])
      if (program.Weeks[wIndex].Days[dayIndex].isCompleted) weekIndex = wIndex
  })
  return weekIndex
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

export const getExerciseLatestSet = (exercise, day) => {
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
    case "hams":
    case "hamstrings": {
      return color2
    }

    default: {
      return color3
    }
  }
}

export function getColorByExercisePosition(position) {
  let color1 = colors.blue3
  let color2 = colors.green3
  let color3 = colors.purple1

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
  let colorYellow = iStyles.textYellow.color

  // switch (doneBefore) {
  //   case 0: {
  //     return color2
  //   }
  //   case 1:
  //   case 2:
  //   case 3: {
  //     return colorYellow
  //   }

  //   default: {
  //     return "red"
  //   }
  // }

  return "grey"
}
