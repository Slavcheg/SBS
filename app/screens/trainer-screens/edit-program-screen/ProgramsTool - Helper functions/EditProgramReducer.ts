import { YOUTUBE_API_KEY, NO_CLIENT_YET } from "../../../../components3/Constants/DatabaseConstants"

import { DEFAULT_SET_DATA2, DEFAULT_EXERCISE_DATA2, DEFAULT_ONE_DAY_DATA2 } from "../../../../components3/Constants"

import { updateFollowingWeeks, updateOldExercises, getProgressions } from "./index"

import _ from "lodash"
import { T_Program } from "../../../../components3"

export type T_Dispatch_EditProgram = React.Dispatch<T_Action_EditProgram>
type T_Action_EditProgram = {
  type:
    | "close program settings modal"
    | "toggle day completed"
    | "edit field"
    | "toggle program completed status"
    | "open program settings modal"
    | "add new day"
    | "change day"
    | "remove day"
    | "close exercise picker"
    | "close EditExerciseModal"
    | "delete exercise"
    | "start to copy from another program"
    | "close program picker without choosing a program"
    | "copy program and close ProgramPicker"
    | "expand buttons row"
    | "collapse buttons row"
    | "update current program2"
    | "update current program"
    | "reorder current program"
    | "change position number"
    | "add exercise from end of day button"
    | "choose another muscle group"
    | "search exercies directly"
    | "toggle reorder"
    | "expand exercise info"
    | "change current week by one"
    | "add week"
    | "remove week"
    | "change client"
    | "expand more info all exercises"
    | "replace exercise with another from picker"
    | "add exercise from picker"
    | "close modal and update exercise"
    | "open modal and start editing exercise"
  value?: any
  dayIndex?: number
  weekIndex?: number
}

type state = {
  currentProgram: T_Program
  currentDayIndex: number
  currentWeekIndex: number
  currentProgramID: string
  currentExerciseIndex: number
  isEditExerciseModalVisible: boolean
  isKeyboardActive: boolean
  isButtonsRowShown: boolean
  isProgramSaving: boolean
  isProgramSaved: boolean
}

export const EditProgramReducer = (state, action: T_Action_EditProgram) => {
  const {
    currentWeekIndex,
    currentDayIndex,
    currentProgram,
    currentProgramID,
    currentExerciseIndex,
    isEditExerciseModalVisible,
    isKeyboardActive,
    isButtonsRowShown,
    isProgramSaving,
    isProgramSaved,
  } = state

  let isLastWeek
  if (currentProgram) isLastWeek = currentWeekIndex >= currentProgram.Weeks.length - 1 ? true : false

  switch (action.type) {
    case "close program settings modal": {
      state.isProgramSettingsModalVisible = false
      // state.currentProgram = action.value;
      break
    }

    case "toggle day completed": {
      state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].isCompleted = !state.currentProgram.Weeks[
        currentWeekIndex
      ].Days[action.dayIndex].isCompleted

      if (action.newDate) state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].completedOn = action.newDate

      // if all days are completed - toggle program completed
      let allDaysNumber = 0
      let completedDaysNumber = 0
      for (let i = 0; i < currentProgram.Weeks.length; i++)
        for (let k = 0; k < currentProgram.Weeks[i].Days.length; k++) {
          if (currentProgram.Weeks[i].Days[k]) {
            allDaysNumber++
            if (currentProgram.Weeks[i].Days[k].isCompleted) completedDaysNumber++
          }
        }
      if (allDaysNumber === completedDaysNumber) state.currentProgram.isCompleted = true

      break
    }

    case "edit field": {
      switch (action.field) {
        case "program name": {
          state.currentProgram.Name = `${action.value}`
          break
        }

        case "day name": {
          state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].DayName = action.value
          break
        }

        default:
          throw new Error("Unexpected action in ExerciseDBReducer - Edit Field")
      }
    }

    case "toggle program completed status": {
      state.currentProgram = { ...currentProgram, isCompleted: !state.currentProgram.isCompleted }
      break
    }

    case "open program settings modal": {
      state.isProgramSettingsModalVisible = true
      break
    }

    case "add new day": {
      // const newWeekData = { ...currentProgram.Weeks[currentWeekIndex] }

      const newDayName = `Day ${currentProgram.Weeks[currentWeekIndex].Days.length + 1}`
      // newWeekData.Days.push({ ...DEFAULT_ONE_DAY_DATA2, DayName: newDayName })
      // state.currentProgram.Weeks[currentWeekIndex] = {
      //   ...newWeekData,
      // }

      // state.currentDayIndex = newWeekData.Days.length - 1

      // if (currentWeekIndex !== currentProgram.Weeks.length - 1) { //if week is not last
      // state.currentProgram = updateFollowingWeeks(state)
      //ще пробваме ръчно да ги ъпдейтнем, вместо горните зелени редове

      for (let i = currentWeekIndex; i < currentProgram.Weeks.length; i++)
        state.currentProgram.Weeks[i].Days.push({
          ..._.cloneDeep(DEFAULT_ONE_DAY_DATA2),
          DayName: newDayName,
        })

      // }

      break
    }
    case "change day": {
      // zero out isExpanded values

      let newArray = [...state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises]
      newArray.forEach((exercise, index) => (exercise.isExpanded = false))

      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises = newArray

      //turning off deselectAllDays option for now

      // if (state.currentDayIndex === action.value) {
      //   state.deselectAllDays = !state.deselectAllDays
      // } else {
      //   state.deselectAllDays = false
      //   state.currentDayIndex = action.value
      // }

      // dummy so it's always false. Use top one and delete these 2 lines in case you need it again
      state.deselectAllDays = false
      state.currentDayIndex = action.value

      state.currentExerciseIndex = 0

      state.isReordering = false

      break
    }
    case "remove day": {
      const dayIndexToDelete = action.value

      for (let i = currentWeekIndex; i < currentProgram.Weeks.length; i++) {
        const helperDays = _.cloneDeep(state.currentProgram.Weeks[i].Days)
        helperDays.splice(dayIndexToDelete, 1)
        state.currentProgram.Weeks[i].Days = helperDays
      }
      state.currentDayIndex = 0
      break
    }

    case "close exercise picker": {
      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      state.isButtonsRowShown = false
      break
    }

    case "close EditExerciseModal": {
      //closing with 'onRequestClose' on <Modal> component
      state.isEditExerciseModalVisible = false
      state.isProgramViewShown = true

      break
    }

    case "delete exercise": {
      const exID = state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises[action.value].ID

      for (let i = currentWeekIndex; i < currentProgram.Weeks.length; i++) {
        const thisWeekExerciseIndex = state.currentProgram.Weeks[i].Days[action.dayIndex].Exercises.findIndex(
          exercise => exercise.ID === exID,
        )
        if (thisWeekExerciseIndex === undefined || null) continue
        state.currentProgram.Weeks[i].Days[action.dayIndex].Exercises = state.currentProgram.Weeks[i].Days[
          action.dayIndex
        ].Exercises.filter((ex, exIndex) => exIndex !== thisWeekExerciseIndex)
      }

      //hoping to remove bottom one as not needed
      // const newExercises = state.currentProgram.Weeks[currentWeekIndex].Days[
      //   action.dayIndex
      // ].Exercises.filter((exercise, exIndex) => exIndex != action.value)
      // state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises = [
      //   ...newExercises,
      // ]
      break
    }

    case "start to copy from another program": {
      state.isProgramViewShown = false
      state.isCopyProgramViewShown = true
      break
    }

    case "close program picker without choosing a program": {
      state.isProgramViewShown = true
      state.isCopyProgramViewShown = false
      break
    }

    case "copy program and close ProgramPicker": {
      const copiedWeek = action.value.Weeks[0]

      state.currentProgram.Weeks[currentWeekIndex].Days = _.cloneDeep(copiedWeek.Days)
      state.currentProgram.Weeks[currentWeekIndex].Days.forEach((day, dayIndex) => {
        state.currentProgram.Weeks[currentWeekIndex].Days[dayIndex].isCompleted = false
        state.currentProgram.Weeks[currentWeekIndex].Days[dayIndex].Exercises.forEach((ex, exIndex) => {
          //ако сме го правили - слагаме сериите от последния път както сме го правили. Ако не сме - оставяме тези на копираната програма
          let addLastSets = false
          let Sets = []

          state.oldExercises.forEach(oldEx => {
            if (oldEx.Name === ex.Name) {
              addLastSets = true
              Sets = oldEx.latestSet.Sets
            }
          })

          if (addLastSets) state.currentProgram.Weeks[currentWeekIndex].Days[dayIndex].Exercises[exIndex].Sets = Sets
        })
      })
      if (currentWeekIndex < currentProgram.Weeks.length - 1) {
        //старото, опитваме се да го избегнем
        // state.currentProgram = updateFollowingWeeks(state)

        //copy over whole days structure, apply progressions after
        for (let i = currentWeekIndex + 1; i < currentProgram.Weeks.length; i++) {
          state.currentProgram.Weeks[i].Days = _.cloneDeep(copiedWeek.Days)
          state.currentProgram.Weeks[i].Days.forEach((day, dayIndex) => {
            state.currentProgram.Weeks[i].Days[dayIndex].isCompleted = false
            state.currentProgram.Weeks[i].Days[dayIndex].Exercises.forEach((ex, exIndex) => {
              const lastWeekExercise = currentProgram.Weeks[i - 1].Days[dayIndex].Exercises[exIndex]

              const progressions = getProgressions(lastWeekExercise)
              const { Sets } = currentProgram.Weeks[i].Days[dayIndex].Exercises[exIndex]
              Sets.forEach((set, setIndex) => {
                Sets[setIndex].Reps = progressions.newReps
                Sets[setIndex].Weight = progressions.newWeight
              })

              // const isPure = isPureWeight(lastWeekExercise)
              // const averageReps = getAverageReps(lastWeekExercise)
              // currentProgram.Weeks[i].Days[dayIndex].Exercises[exIndex].Sets.forEach(
              //   (set, setIndex) => {
              //     state.currentProgram.Weeks[i].Days[dayIndex].Exercises[exIndex].Sets[
              //       setIndex
              //     ].Reps = averageReps + lastWeekExercise.increaseReps
              //     if (isPure) {
              //       const averageWeight = getAverageWeightFromExercise(lastWeekExercise)
              //       state.currentProgram.Weeks[i].Days[dayIndex].Exercises[exIndex].Sets[
              //         setIndex
              //       ].Weight = `${(
              //         averageWeight + parseFloat(lastWeekExercise.increaseWeight)
              //       ).toPrecision(3)}`
              //     }
              //   },
              // )
            })
          })
        }
      }

      state.isProgramViewShown = true
      state.isCopyProgramViewShown = false
      break
    }

    case "expand buttons row": {
      state.isButtonsRowExpanded = true
      break
    }
    case "collapse buttons row": {
      state.isButtonsRowExpanded = false
      break
    }

    case "update current program2": {
      state.currentProgram = action.value
      break
    }

    case "update current program": {
      state.currentProgram = action.value

      state.oldPrograms = action.oldPrograms
      state.allPrograms = action.allPrograms
      state.allUsers = action.allUsers

      // state.oldExercises = []
      // let oldExercisesNames = []
      // let markedThisProgram = []
      // state.oldPrograms.forEach((program, index) => {
      //   markedThisProgram = []
      //   program.item.Weeks.forEach((week, weekIndex) => {
      //     program.item.Weeks[weekIndex].Days.forEach((day, dayIndex) => {
      //       program.item.Weeks[weekIndex].Days[dayIndex].Exercises.forEach(
      //         (exercise, exerciseIndex) => {
      //           if (!oldExercisesNames.includes(exercise.Name)) {
      //             state.oldExercises.push({ ...exercise, doneBefore: 1 })
      //             oldExercisesNames.push(exercise.Name)
      //             markedThisProgram.push(exercise.Name)
      //           } else {
      //             let foundIndex
      //             if (!markedThisProgram.includes(exercise.Name)) {
      //               foundIndex = state.oldExercises.findIndex(ex => ex.Name === exercise.Name)
      //               state.oldExercises[foundIndex].doneBefore++
      //             }
      //           }
      //         },
      //       )
      //     })
      //   })
      // })

      state.oldExercises = updateOldExercises(state)

      state.isExercisePickerShown = false
      state.isProgramViewShown = true

      // state.currentProgram = updateFollowingWeeks(state)

      // get latest uncompleted day
      // const last = getLastCompletedDay(currentProgram)
      // state.currentWeekIndex = last.WeekIndex
      // state.currentDayIndex = last.DayIndex

      // // update exercise ID to match one in DB (temporarily, to not lose data)
      // currentProgram.Weeks.forEach((week, weekIndex) => {
      //   week.Days.forEach((day, dayIndex) => {
      //     day.Exercises.forEach((exercise, exerciseIndex) => {
      //       action.exercises.forEach((dbEx, dbExIndex) => {
      //         if (dbEx.Name === exercise.Name)
      //           state.currentProgram.Weeks[weekIndex].Days[dayIndex].Exercises[exerciseIndex].ID =
      //             dbEx.ID
      //       })
      //     })
      //   })
      // })

      break
    }
    case "reorder current program": {
      state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises = [...action.exercises]

      state.currentProgram = updateFollowingWeeks(state)
      break
    }

    case "change position number": {
      state.currentDayIndex = action.dayIndex
      const exIndex = action.value

      const exercises = [...currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises]
      let newPosition = exercises[exIndex].Position
      // get position of last exercise and set as max for now
      let maxPosition = exercises[exercises.length - 1].Position

      // get highest position compared to others
      exercises.forEach(exercise => {
        if (exercise.Position > maxPosition) maxPosition = exercise.Position
      })

      exercises[exIndex].Position < 2 ? (newPosition = maxPosition + 1) : newPosition--

      for (let i = currentWeekIndex; i < currentProgram.Weeks.length; i++)
        state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[exIndex].Position = newPosition

      break
    }

    case "add exercise from end of day button": {
      state.currentDayIndex = action.dayIndex
      state.currentWeekIndex = action.weekIndex
      state.isButtonsRowShown = true
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.isManuallySearchingExercises = true
      break
    }

    case "choose another muscle group": {
      state.selectedMuscleGroup = action.value
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.isManuallySearchingExercises = true
      break
    }

    case "search exercies directly": {
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.autoFocusSearch = true
      break
    }

    case "toggle reorder": {
      state.currentDayIndex = action.dayIndex
      state.isReordering = !state.isReordering
      break
    }

    case "expand exercise info": {
      state.currentDayIndex = action.dayIndex
      // let newArray = state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises
      // newArray.forEach((exercise, index) => {
      //   if (index !== action.value) exercise.isExpanded = false
      // })

      // newArray[action.value].isExpanded = !newArray[action.value].isExpanded

      // state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises = newArray
      const isExpanded = state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises[action.value].isExpanded
        ? true
        : false
      state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises[action.value].isExpanded = !isExpanded
      break
    }

    case "change current week by one": {
      if (action.value === "increase" || action.value === "decrease") {
        let changeBy = action.value === "increase" ? 1 : -1
        //check whether week will be out of bounds and change by 0 if so
        if (currentWeekIndex === action.weekLength - 1 && changeBy === 1) changeBy = 0
        else if (currentWeekIndex === 0 && changeBy === -1) changeBy = 0

        //increse/decrease weekIndex
        state.currentWeekIndex += changeBy
        state.currentDayIndex = 0

        if (changeBy === 0) break
        else break
      } else if (action.value === "custom") {
        state.currentWeekIndex = action.newWeekValue
        state.currentDayIndex = action.newDayValue
        break
      } else break
    }

    case "add week": {
      state.currentProgram.Weeks.push({
        ..._.cloneDeep(currentProgram.Weeks[currentProgram.Weeks.length - 1]),
      })

      //долният ред ще се опитаме да го избегнем с custom решение
      // state.currentProgram = updateFollowingWeeks(state)

      const weekIndex = currentProgram.Weeks.length - 1
      currentProgram.Weeks[weekIndex].Days.forEach((day, dayIndex) => {
        state.currentProgram.Weeks[weekIndex].Days[dayIndex].isCompleted = false
        state.currentProgram.Weeks[weekIndex].Days[dayIndex].Exercises.forEach((ex, exIndex) => {
          const lastWeekExercise = currentProgram.Weeks[weekIndex - 1].Days[dayIndex].Exercises[exIndex]

          const progressions = getProgressions(lastWeekExercise)

          const { Sets } = currentProgram.Weeks[weekIndex].Days[dayIndex].Exercises[exIndex]
          Sets.forEach((set, setIndex) => {
            Sets[setIndex].Reps = progressions.newReps
            Sets[setIndex].Weight = progressions.newWeight
          })

          // const isPure = isPureWeight(lastWeekExercise)
          // const averageReps = getAverageReps(lastWeekExercise)

          // currentProgram.Weeks[weekIndex].Days[currentDayIndex].Exercises[exIndex].Sets.forEach(
          //   (set, setIndex) => {
          //     state.currentProgram.Weeks[weekIndex].Days[currentDayIndex].Exercises[exIndex].Sets[
          //       setIndex
          //     ].Reps = averageReps + lastWeekExercise.increaseReps
          //     if (isPure) {
          //       const averageWeight = getAverageWeightFromExercise(lastWeekExercise)
          //       state.currentProgram.Weeks[weekIndex].Days[currentDayIndex].Exercises[exIndex].Sets[
          //         setIndex
          //       ].Weight = `${(
          //         averageWeight + parseFloat(lastWeekExercise.increaseWeight)
          //       ).toPrecision(3)}`
          //     }
          //   },
          // )
        })
      })

      break
    }

    case "remove week": {
      if (currentProgram.Weeks.length === 1) break

      if (currentWeekIndex === currentProgram.Weeks.length - 1) state.currentWeekIndex--
      state.currentProgram.Weeks.pop()
      break
    }

    case "change client": {
      let newUser = {
        Name: NO_CLIENT_YET,
        ID: NO_CLIENT_YET,
      }

      state.allUsers.forEach(user => {
        if (user) if (user.ID === action.value) newUser = user
      })

      state.currentProgram.Client = newUser.ID

      if (newUser.Name !== NO_CLIENT_YET) {
        state.oldPrograms = state.allPrograms.filter(program => program.Client === newUser.ID)
        state.oldPrograms = state.oldPrograms.filter(program => program.ID != state.programID)
        state.currentProgram.Name = `${newUser.Name} ${state.oldPrograms.length + 1}`
        state.oldExercises = updateOldExercises(state)
      } else {
        state.oldPrograms = []
        state.currentProgram.Name = `New program`
        state.oldExercises = []
      }

      break
    }

    case "expand more info all exercises": {
      currentProgram.Weeks.forEach((week, weekIndex) => {
        let days = state.currentProgram.Weeks[weekIndex].Days
        days.forEach((day, dayIndex) => {
          day.Exercises.forEach((exercise, exerciseIndex) => {
            days[dayIndex].Exercises[exerciseIndex].isExpanded = action.expand
          })
        })
        state.currentProgram.Weeks[weekIndex].Days = days
      })

      break
    }

    case "replace exercise with another from picker": {
      state.currentDayIndex = action.dayIndex
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.isManuallySearchingExercises = true
      state.currentExerciseIndex = action.value
      state.isReplacingExercise = true
      break
    }

    case "add exercise from picker": {
      const exercise = _.cloneDeep(action.value)
      console.log(exercise)
      // ако заменяме настоящо упражнение
      const exID = exercise.ID

      const defaultExData = {
        ..._.cloneDeep(DEFAULT_EXERCISE_DATA2),
        Name: exercise.Name,
        ID: exercise.ID,
        Position: Math.floor(currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length / 2 + 1),
      }

      //ако сме го правили - слагаме сериите от последния път както сме го правили. Ако не сме - слагаме default само
      let addLastSets = false
      let Sets = []

      ///trying to find from current program first (other days) and then from old programs
      currentProgram.Weeks.forEach((week, weekIndex) => {
        week.Days.forEach((day, dayIndex) => {
          if (dayIndex !== currentDayIndex && day.isCompleted)
            day.Exercises.forEach(currProgramExercise => {
              if (currProgramExercise.ID === exercise.ID) {
                Sets = _.cloneDeep(currProgramExercise.Sets)
                addLastSets = true
              }
            })
        })
      })

      if (!addLastSets)
        state.oldExercises.forEach(oldEx => {
          if (oldEx.ID === exercise.ID) {
            addLastSets = true
            Sets = _.cloneDeep(oldEx.latestSet.Sets)
          }
        })

      if (state.isReplacingExercise) {
        const oldExID = currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[currentExerciseIndex].ID
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[currentExerciseIndex].Name = exercise.Name
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[currentExerciseIndex].ID = exercise.ID

        if (addLastSets) currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[currentExerciseIndex].Sets = Sets

        const newExercise = currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[currentExerciseIndex]

        if (currentWeekIndex !== currentProgram.Weeks.length - 1) {
          // if week is not last => update following weeks
          for (let i = currentWeekIndex + 1; i < currentProgram.Weeks.length; i++) {
            const lastWeekExerciseIndex = currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises.findIndex(
              exercise => exercise.ID === exID,
            )
            const thisWeekExerciseIndex = currentProgram.Weeks[i].Days[currentDayIndex].Exercises.findIndex(
              exercise => exercise.ID === oldExID,
            )

            if (lastWeekExerciseIndex === undefined || thisWeekExerciseIndex === undefined) continue
            state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[thisWeekExerciseIndex] = _.cloneDeep(newExercise)

            const lastWeekExercise = currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises[lastWeekExerciseIndex]

            const progressions = getProgressions(lastWeekExercise)

            const { Sets } = currentProgram.Weeks[i].Days[currentDayIndex].Exercises[thisWeekExerciseIndex]
            Sets.forEach((set, setIndex) => {
              Sets[setIndex].Reps = progressions.newReps
              Sets[setIndex].Weight = progressions.newWeight
            })

            // const isPure = isPureWeight(lastWeekExercise)
            // const averageReps = getAverageReps(lastWeekExercise)
            // currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
            //   thisWeekExerciseIndex
            // ].Sets.forEach((set, setIndex) => {
            //   state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
            //     thisWeekExerciseIndex
            //   ].Sets[setIndex].Reps = averageReps + lastWeekExercise.increaseReps
            //   if (isPure) {
            //     const averageWeight = getAverageWeightFromExercise(lastWeekExercise)
            //     state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
            //       thisWeekExerciseIndex
            //     ].Sets[setIndex].Weight = `${(
            //       averageWeight + parseFloat(lastWeekExercise.increaseWeight)
            //     ).toPrecision(3)}`
            //   }
            // })
          }
        }
      }
      // ако добавяме ново накрая
      else {
        for (let i = currentWeekIndex; i < currentProgram.Weeks.length; i++) {
          if (i === currentWeekIndex) {
            if (addLastSets) {
              state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.push({
                ..._.cloneDeep(defaultExData),
                Sets: Sets,
              })
            } else {
              state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises.push(_.cloneDeep(defaultExData))
            }
          } else {
            const lastWeekExerciseIndex = currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises.findIndex(
              exercise => exercise.ID === exID,
            )
            const lastWeekExercise = currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises[lastWeekExerciseIndex]
            const progressions = getProgressions(lastWeekExercise)

            if (addLastSets) {
              Sets.forEach((set, setIndex) => {
                Sets[setIndex].Reps = progressions.newReps
                Sets[setIndex].Weight = progressions.newWeight
              })
              state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises.push({
                ..._.cloneDeep(defaultExData),
                Sets: Sets,
              })
            } else {
              let newExerciseData = _.cloneDeep(defaultExData)
              const { Sets } = newExerciseData
              Sets.forEach((set, setIndex) => {
                Sets[setIndex].Reps = progressions.newReps
                Sets[setIndex].Weight = progressions.newWeight
              })

              state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises.push(_.cloneDeep(newExerciseData))
            }
          }
        }
      }

      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      state.isReplacingExercise = false
      state.isButtonsRowShown = false

      state.currentExerciseIndex = 0

      break
    }

    case "close modal and update exercise": {
      state.isEditExerciseModalVisible = false
      const newExercise = action.value
      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[currentExerciseIndex] = _.cloneDeep(
        newExercise,
      )

      const exID = newExercise.ID

      if (currentWeekIndex >= currentProgram.Weeks.length - 1) break

      //if week is not last - update exercise in following weeks

      for (let i = currentWeekIndex + 1; i < currentProgram.Weeks.length; i++) {
        const lastWeekExerciseIndex = currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises.findIndex(
          exercise => exercise.ID === exID,
        )
        const thisWeekExerciseIndex = currentProgram.Weeks[i].Days[currentDayIndex].Exercises.findIndex(
          exercise => exercise.ID === exID,
        )

        if (lastWeekExerciseIndex === undefined || thisWeekExerciseIndex === undefined) continue

        state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[thisWeekExerciseIndex] = _.cloneDeep(newExercise)

        const lastWeekExercise = currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises[lastWeekExerciseIndex]

        const progressions = getProgressions(lastWeekExercise)

        const { Sets } = state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[thisWeekExerciseIndex]

        Sets.forEach((set, setIndex) => {
          Sets[setIndex].Reps = progressions.newReps
          Sets[setIndex].Weight = progressions.newWeight
        })
      }

      //това е старият механизъм, опитваме се да го избегнем
      // state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
      //   currentExerciseIndex
      // ] = action.value

      // if (currentWeekIndex !== currentProgram.Weeks.length - 1) {
      //   state.currentProgram = updateFollowingWeeks(state)
      // }

      break
    }

    case "open modal and start editing exercise": {
      state.currentDayIndex = action.dayIndex
      state.isEditExerciseModalVisible = true
      state.currentExerciseIndex = action.value
      // break
      break
    }

    default:
      throw new Error("Unexpected action in ExerciseDBReducer")
  }
  switch (action.type) {
    case "add exercise from end of day button":
    case "add exercise from picker":
    case "add new day":
    case "add week":
    case "change client":
    case "change position number":
    case "close EditExerciseModal":
    case "close exercise picker":
    case "close modal and update exercise":
    case "close program settings modal":
    case "delete exercise":
    case "edit field":
    case "expand exercise info":
    case "expand more info all exercises":
    case "remove day":
    case "remove week":
    case "reorder current program":
    case "replace exercise with another from picker":
    case "toggle day completed":
    case "toggle program completed status":
    case "toggle reorder":
    case "update current program":
    case "update current program2": {
      state.renders.programChangeID = Math.random()
      console.log("newRenderID")
      break
    }
  }
  return { ...state }
}

const getLastCompletedDay = (currentProgram: T_Program) => {
  let returnDayWeekIndex = { DayIndex: 0, WeekIndex: 0 }
  let breakFlag = false
  for (let weekIndex = 0; weekIndex < currentProgram.Weeks.length; weekIndex++) {
    if (breakFlag === true) break
    for (let dayIndex = 0; dayIndex < currentProgram.Weeks[weekIndex].Days.length; dayIndex++) {
      if (breakFlag) break
      if (currentProgram.Weeks[weekIndex].Days[dayIndex].isCompleted !== true) {
        breakFlag = true
        returnDayWeekIndex.WeekIndex = weekIndex
        returnDayWeekIndex.DayIndex = dayIndex
      }
    }
  }
  return returnDayWeekIndex
}
