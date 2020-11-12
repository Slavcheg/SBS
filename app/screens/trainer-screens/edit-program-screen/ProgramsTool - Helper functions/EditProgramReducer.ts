import {
  COLLECTION,
  DB_EXERCISE_COLLECTION,
  YOUTUBE_API_KEY,
  PROGRAMS_COLLECTION,
} from "../Constants/DatabaseConstants"

import {
  DEFAULT_SET_DATA2,
  DEFAULT_EXERCISE_DATA2,
  DEFAULT_ONE_DAY_DATA2,
} from "../../../../models/sub-stores"

import { updateFollowingWeeks, updateOldExercises } from "./index"

import _ from "lodash"

export const EditProgramReducer = (state, action) => {
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

  switch (action.type) {
    case "close program settings modal": {
      state.isProgramSettingsModalVisible = false
      // state.currentProgram = action.value;
      return { ...state }
    }

    case "toggle day completed": {
      state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].isCompleted = !state
        .currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].isCompleted

      if (action.newDate)
        state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].completedOn =
          action.newDate

      // if all days are completed - toggle program completed
      let allDaysNumber = 0
      let completedDaysNumber = 0
      for (let i = 0; i < currentProgram.Weeks.length; i++)
        for (let k = 0; k < currentProgram.Weeks[k].Days.length; k++) {
          allDaysNumber++
          if (currentProgram.Weeks[i].Days[k].isCompleted) completedDaysNumber++
        }
      if (allDaysNumber === completedDaysNumber) state.currentProgram.isCompleted = true

      return { ...state }
    }

    case "edit field": {
      switch (action.field) {
        case "program name": {
          state.currentProgram.Name = `${action.value}`
          return { ...state }
        }

        case "day name": {
          state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].DayName = action.value
          return { ...state }
        }

        default:
          throw new Error("Unexpected action in ExerciseDBReducer - Edit Field")
      }
    }

    case "toggle program completed status": {
      state.currentProgram.isCompleted = !state.currentProgram.isCompleted
      return { ...state }
    }

    case "open program settings modal": {
      state.isProgramSettingsModalVisible = true
      return { ...state }
    }

    case "add new day": {
      const newWeekData = { ...currentProgram.Weeks[currentWeekIndex] }

      console.log(newWeekData)
      const newDayName = `Day ${newWeekData.Days.length + 1}`
      newWeekData.Days.push({ ...DEFAULT_ONE_DAY_DATA2, DayName: newDayName })
      state.currentProgram.Weeks[currentWeekIndex] = {
        ...newWeekData,
      }

      state.currentDayIndex = newWeekData.Days.length - 1

      if (currentWeekIndex !== currentProgram.Weeks.length - 1) {
        state.currentProgram = updateFollowingWeeks(state)
      }

      return { ...state }
    }
    case "change day": {
      // zero out isExpanded values

      let newArray = [
        ...state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises,
      ]
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

      return { ...state }
    }
    case "remove day": {
      const helperDays = _.cloneDeep(state.currentProgram.Weeks[state.currentWeekIndex].Days)
      helperDays.splice(currentDayIndex, 1)
      state.currentProgram.Weeks[state.currentWeekIndex].Days = helperDays
      state.currentDayIndex = 0

      return { ...state }
    }

    case "close exercise picker": {
      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      return { ...state }
    }

    case "delete exercise": {
      const newExercises = state.currentProgram.Weeks[currentWeekIndex].Days[
        currentDayIndex
      ].Exercises.filter((exercise, index) => index != action.value)
      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises = [
        ...newExercises,
      ]
      return { ...state }
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
      let breakFlag = false
      for (let weekIndex = 0; weekIndex < currentProgram.Weeks.length; weekIndex++) {
        if (breakFlag === true) break
        for (let dayIndex = 0; dayIndex < currentProgram.Weeks[weekIndex].Days.length; dayIndex++) {
          if (breakFlag) break
          if (currentProgram.Weeks[weekIndex].Days[dayIndex].isCompleted !== true) {
            breakFlag = true
            state.currentWeekIndex = weekIndex
            state.currentDayIndex = dayIndex
          }
        }
      }

      return { ...state }
    }
    case "reorder current program": {
      state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises = [
        ...action.exercises,
      ]

      // state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "change position number": {
      const exercises = [...currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises]
      let newPosition = exercises[action.value].Position
      // get position of last exercise and set as max for now
      let maxPosition = exercises[exercises.length - 1].Position

      // get highest position compared to others
      exercises.forEach(exercise => {
        if (exercise.Position > maxPosition) maxPosition = exercise.Position
      })

      exercises[action.value].Position < 2 ? (newPosition = maxPosition + 1) : newPosition--

      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
        action.value
      ].Position = newPosition

      // state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "choose another muscle group": {
      state.selectedMuscleGroup = action.value
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.isManuallySearchingExercises = true
      return { ...state }
    }

    case "search exercies directly": {
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.autoFocusSearch = true
      return { ...state }
    }

    case "toggle reorder": {
      state.isReordering = !state.isReordering
      return { ...state }
    }

    case "expand exercise info": {
      let newArray = state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises
      newArray.forEach((exercise, index) => {
        if (index !== action.value) exercise.isExpanded = false
      })

      newArray[action.value].isExpanded = !newArray[action.value].isExpanded

      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises = newArray
      return { ...state }
    }

    case "change current week by one": {
      if (action.value === "increase" || action.value === "decrease") {
        let changeBy = action.value === "increase" ? 1 : -1
        //check whether week will be out of bounds and change by 0 if so
        if (currentWeekIndex === action.weekLength - 1 && changeBy === 1) changeBy = 0
        else if (currentWeekIndex === 0 && changeBy === -1) changeBy = 0

        //increse/decrease weekIndex
        state.currentWeekIndex += changeBy

        if (changeBy === 0) return state
        else return { ...state }
      } else if (action.value === "custom") {
        state.currentWeekIndex = action.newWeekValue
        state.currentDayIndex = action.newDayValue
        return { ...state }
      } else return state
    }

    case "add week": {
      const newWeek = { Days: [] }
      currentProgram.Weeks[currentWeekIndex].Days.forEach((day, dayIndex) => {
        newWeek.Days.push({ ...DEFAULT_ONE_DAY_DATA2, DayName: day.DayName })
      })
      state.currentProgram.Weeks.push(newWeek)
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "remove week": {
      if (currentProgram.Weeks.length === 1) return state

      if (currentWeekIndex === currentProgram.Weeks.length - 1) state.currentWeekIndex--
      state.currentProgram.Weeks.pop()
      return { ...state }
    }

    case "change client": {
      state.currentProgram.Client = action.value

      let newUser = state.allUsers.find(user => user.id === action.value)

      state.oldPrograms = state.allPrograms.filter(program => program.item.Client === newUser.id)
      state.oldPrograms = state.oldPrograms.filter(program => program.id != state.programID)
      state.currentProgram.Name = `${newUser.item.first} ${state.oldPrograms.length + 1}`
      state.oldExercises = updateOldExercises(state)
      return { ...state }
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

      return { ...state }
    }

    case "replace exercise with another from picker": {
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.isManuallySearchingExercises = true
      state.currentExerciseIndex = action.value
      state.isReplacingExercise = true
      return { ...state }
    }

    case "add exercise from picker": {
      const exercise = action.value

      // ако заменяме настоящо упражнение

      if (state.isReplacingExercise) {
        console.log(exercise)
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
          currentExerciseIndex
        ].Name = exercise.Name
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
          currentExerciseIndex
        ].ID = exercise.ID
      }
      // ако добавяме ново накрая
      else {
        const defaultExData = {
          ...DEFAULT_EXERCISE_DATA2,
          Name: exercise.Name,
          ID: exercise.ID,
          Position: Math.floor(
            currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length / 2 + 1,
          ),
        }

        //ако сме го правили - слагаме сериите от последния път както сме го правили. Ако не сме - слагаме default само
        let addLastSets = false
        let Sets = []

        state.oldExercises.forEach(oldEx => {
          if (oldEx.Name === exercise.Name) {
            addLastSets = true
            Sets = oldEx.latestSet.Sets
            console.log(Sets)
          }
        })

        if (addLastSets)
          state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.push({
            ...defaultExData,
            Sets: Sets,
          })
        else
          state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.push(
            defaultExData,
          )
      }

      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      state.isReplacingExercise = false

      console.log(
        "currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length",
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length,
      )

      state.currentExerciseIndex =
        state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length - 1

      // if week is not last - updating values for next week

      if (currentWeekIndex !== currentProgram.Weeks.length - 1) {
        state.currentProgram = updateFollowingWeeks(state)
      }

      return { ...state }
    }

    case "close modal and update exercise": {
      state.isEditExerciseModalVisible = false
      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
        currentExerciseIndex
      ] = action.value

      if (currentWeekIndex !== currentProgram.Weeks.length - 1) {
        state.currentProgram = updateFollowingWeeks(state)
      }

      return { ...state }
    }

    case "open modal and start editing exercise": {
      state.isEditExerciseModalVisible = true
      state.currentExerciseIndex = action.value
      return { ...state }
    }

    default:
      throw new Error("Unexpected action in ExerciseDBReducer")
  }
}
