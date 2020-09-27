import {
  COLLECTION,
  DB_EXERCISE_COLLECTION,
  YOUTUBE_API_KEY,
  PROGRAMS_COLLECTION,
} from "../Constants/DatabaseConstants"

import {
  muscleGroups,
  MAX_SETS,
  MAX_REPS,
  DEFAULT_SET_DATA,
  DEFAULT_EXERCISE_DATA,
} from "../Constants/simpleConstants"

import _ from "lodash"

const updateFollowingWeeks = state => {
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
  console.log(
    "currentProgram.Weeks[currentWeekIndex].Days[1].Exercises",
    currentProgram.Weeks[currentWeekIndex].Days[1].Exercises,
  )
  console.log("currentProgram.Weeks.length", currentProgram.Weeks.length)

  // if week is not last - update all following weeks
  if (currentWeekIndex !== currentProgram.Weeks.length - 1) {
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
    //на магия се получи, дано не се налага да се пипа
    for (
      let i = currentWeekIndex + 1;
      i < currentProgram.Weeks.length;
      i++ // i = weekIndex
    ) {
      if (newProgram.Weeks[i].Days[currentDayIndex].Exercises.length > 0) {
        newProgram.Weeks[i].Days.forEach((day, dayIndex: number) => {
          newProgram.Weeks[i].Days[dayIndex].Exercises.forEach(
            (exercise, exerciseIndex: number) => {
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
                    ].Weight =
                      newProgram.Weeks[i - 1].Days[dayIndex].Exercises[exerciseIndex].Sets[setIndex]
                        .Weight + currentExercise.increaseWeight
                },
              )
            },
          )
        })
      }
    }
  }

  return { ...newProgram }
}

export const EditProgramReducer = (state, action) => {
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

  switch (action.type) {
    case "close program settings modal": {
      state.isProgramSettingsModalVisible = false
      // state.currentProgram = action.value;
      return { ...state }
    }

    case "toggle day completed": {
      state.currentProgram.Weeks[currentWeekIndex].Days[action.value].isCompleted = !state
        .currentProgram.Weeks[currentWeekIndex].Days[action.value].isCompleted

      return { ...state }
    }

    case "edit field": {
      switch (action.field) {
        case "program name": {
          state.currentProgram.Name = action.value
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

    case "open program settings modal": {
      state.isProgramSettingsModalVisible = true
      return { ...state }
    }

    case "flip keyboard mode": {
      return {
        ...state,
        isKeyboardActive: !isKeyboardActive,
        isButtonsRowShown: !isButtonsRowShown,
      }
    }

    case "openBigProgram": {
      return {
        ...state,
        isExercisePickerShown: !state.isExercisePickerShown,
        // isButtonsRowShown: !state.isButtonsRowShown,
        isProgramViewBig: !state.isProgramViewBig,
      }
    }
    case "changeShownExercises": {
      state.shownExercises = [...action.value]
      return { ...state }
    }

    case "add new day": {
      state.currentDayIndex = action.value
      state.shownProgramExercises = action.value2

      if (isProgramSaved) state.isProgramSaved = false
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }
    case "change day": {
      // zero out isExpanded values

      let newArray = state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises
      newArray.forEach((exercise, index) => (exercise.isExpanded = false))

      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises = newArray

      state.currentDayIndex = action.value
      state.currentExerciseIndex = 0
      // state.shownProgramExercises = action.value2;
      return { ...state }
    }
    case "remove day": {
      // console.log('currentProgram', state.currentProgram);
      // // state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex]
      let helperDays = state.currentProgram.Weeks[state.currentWeekIndex].Days
      helperDays.splice(currentDayIndex, 1)
      state.currentProgram.Weeks[state.currentWeekIndex].Days = helperDays
      state.currentDayIndex = 0
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "close exercise picker": {
      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      return { ...state }
    }

    case "update current program": {
      state.currentProgram = action.value
      state.shownProgramExercises = action.shownExercises
      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      if (isProgramSaved) state.isProgramSaved = false
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }
    case "reorder current program": {
      state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises =
        action.exercises
      state.shownProgramExercises = action.exercises
      if (isProgramSaved) state.isProgramSaved = false
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }
    case "start editing an exercise": {
      state.currentExerciseIndex = action.value
      state.isEditExerciseModalVisible = true
      return { ...state }
    }
    case "stop editing an exercise": {
      state.isEditExerciseModalVisible = false
      return { ...state }
    }
    case "change number of sets": {
      let newSets = []
      let oldSetsNumberForThisExercise =
        state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
          state.currentExerciseIndex
        ].Sets.length
      let newNumberofSets = action.value
      for (let i = 0; i < newNumberofSets; i++)
        newSets.push({
          ...DEFAULT_SET_DATA,
          Reps:
            currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
              currentExerciseIndex
            ].Sets[0].Reps,
        })
      state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
        state.currentExerciseIndex
      ].Sets = newSets

      if (isProgramSaved) state.isProgramSaved = false
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }
    case "change reps": {
      if (action.currentSetIndex === 0) {
        //if set is first > change value in all sets
        for (
          let i = 0;
          i <
          state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
            state.currentExerciseIndex
          ].Sets.length;
          i++
        ) {
          state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
            state.currentExerciseIndex
          ].Sets[i].Reps = action.value
        }
      } else
        state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
          state.currentExerciseIndex
        ].Sets[action.currentSetIndex].Reps = action.value
      if (isProgramSaved) state.isProgramSaved = false

      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "update reps progression": {
      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
        currentExerciseIndex
      ].increaseReps = action.value
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "update weight progression": {
      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
        currentExerciseIndex
      ].increaseWeight = action.value
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "change weight": {
      console.log(action.value)
      //if set is first > change value in all sets
      let currentExercise =
        state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
          state.currentExerciseIndex
        ]
      let newValue = action.value

      if (Number.isNaN(parseInt(newValue))) {
        for (let i = 0; i < currentExercise.Sets.length; i++)
          state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
            state.currentExerciseIndex
          ].Sets[i].WeightType = "other"
      }
      if (action.currentSetIndex === 0) {
        for (let i = 0; i < currentExercise.Sets.length; i++) {
          state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
            state.currentExerciseIndex
          ].Sets[i].Weight = newValue
        }
      } else
        state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises[
          state.currentExerciseIndex
        ].Sets[action.currentSetIndex].Weight = newValue
      if (isProgramSaved) state.isProgramSaved = false

      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "start manual search": {
      state.isManuallySearchingExercises = true
      return { ...state }
    }

    case "end manual search": {
      state.isManuallySearchingExercises = false
      return { ...state }
    }

    case "change position number": {
      currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
        action.itemIndex
      ].Position = action.value
      if (isProgramSaved) state.isProgramSaved = false
      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
    }

    case "toggle program saving": {
      state.isProgramSaving = !isProgramSaving
      return { ...state }
    }

    // case 'toggle two buttons modal': {
    //   state.isProgramSaving = !isProgramSaving;
    //   return {...state};
    // }

    case "program is saved": {
      state.isProgramSaved = true
      state.isProgramSaving = false
      return { ...state }
    }

    case "program is now not saved": {
      state.isProgramSaved = false
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
      let changeBy = action.value === "increase" ? 1 : -1
      //check whether week will be out of bounds and change by 0 if so
      if (currentWeekIndex === action.weekLength - 1 && changeBy === 1) changeBy = 0
      else if (currentWeekIndex === 0 && changeBy === -1) changeBy = 0

      //increse/decrease weekIndex
      state.currentWeekIndex += changeBy

      if (changeBy === 0) return state
      else return { ...state }
    }

    case "change client": {
      state.currentProgram.ClientID = action.value
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
    case "after adding exercise from picker": {
      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      return { ...state }
    }

    default:
      throw new Error("Unexpected action in ExerciseDBReducer")
  }
}
