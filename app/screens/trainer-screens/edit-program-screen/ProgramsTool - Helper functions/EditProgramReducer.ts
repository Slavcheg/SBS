import { YOUTUBE_API_KEY, NO_CLIENT_YET } from "../Constants/DatabaseConstants"

import { DEFAULT_SET_DATA2, DEFAULT_EXERCISE_DATA2, DEFAULT_ONE_DAY_DATA2 } from "../Constants"

import { updateFollowingWeeks, updateOldExercises, getProgressions } from "./index"

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

  let isLastWeek
  if (currentProgram)
    isLastWeek = currentWeekIndex >= currentProgram.Weeks.length - 1 ? true : false

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
        for (let k = 0; k < currentProgram.Weeks[i].Days.length; k++) {
          if (currentProgram.Weeks[i].Days[k]) {
            allDaysNumber++
            if (currentProgram.Weeks[i].Days[k].isCompleted) completedDaysNumber++
          }
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
      const dayIndexToDelete = action.value

      for (let i = currentWeekIndex; i < currentProgram.Weeks.length; i++) {
        const helperDays = _.cloneDeep(state.currentProgram.Weeks[i].Days)
        helperDays.splice(dayIndexToDelete, 1)
        state.currentProgram.Weeks[i].Days = helperDays
      }
      state.currentDayIndex = 0

      return { ...state }
    }

    case "close exercise picker": {
      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      state.isButtonsRowShown = false
      return { ...state }
    }

    case "close EditExerciseModal": {
      //closing with 'onRequestClose' on <Modal> component
      state.isEditExerciseModalVisible = false
      state.isProgramViewShown = true

      return { ...state }
    }

    case "delete exercise": {
      const exID =
        state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises[action.value]
          .ID

      for (let i = currentWeekIndex; i < currentProgram.Weeks.length; i++) {
        const thisWeekExerciseIndex = state.currentProgram.Weeks[i].Days[
          action.dayIndex
        ].Exercises.findIndex(exercise => exercise.ID === exID)
        if (thisWeekExerciseIndex === undefined || null) continue
        state.currentProgram.Weeks[i].Days[action.dayIndex].Exercises = state.currentProgram.Weeks[
          i
        ].Days[action.dayIndex].Exercises.filter((ex, exIndex) => exIndex !== thisWeekExerciseIndex)
      }

      //hoping to remove bottom one as not needed
      // const newExercises = state.currentProgram.Weeks[currentWeekIndex].Days[
      //   action.dayIndex
      // ].Exercises.filter((exercise, exIndex) => exIndex != action.value)
      // state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises = [
      //   ...newExercises,
      // ]
      return { ...state }
    }

    case "start to copy from another program": {
      state.isProgramViewShown = false
      state.isCopyProgramViewShown = true
      return { ...state }
    }

    case "close program picker without choosing a program": {
      state.isProgramViewShown = true
      state.isCopyProgramViewShown = false
      return { ...state }
    }

    case "copy program and close ProgramPicker": {
      const copiedWeek = action.value.item.Weeks[0]

      state.currentProgram.Weeks[currentWeekIndex].Days = _.cloneDeep(copiedWeek.Days)
      state.currentProgram.Weeks[currentWeekIndex].Days.forEach((day, dayIndex) => {
        state.currentProgram.Weeks[currentWeekIndex].Days[dayIndex].isCompleted = false
        state.currentProgram.Weeks[currentWeekIndex].Days[dayIndex].Exercises.forEach(
          (ex, exIndex) => {
            //ако сме го правили - слагаме сериите от последния път както сме го правили. Ако не сме - оставяме тези на копираната програма
            let addLastSets = false
            let Sets = []

            state.oldExercises.forEach(oldEx => {
              if (oldEx.Name === ex.Name) {
                addLastSets = true
                Sets = oldEx.latestSet.Sets
              }
            })

            if (addLastSets)
              state.currentProgram.Weeks[currentWeekIndex].Days[dayIndex].Exercises[
                exIndex
              ].Sets = Sets
          },
        )
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
      return { ...state }
    }

    case "expand buttons row": {
      return { ...state, isButtonsRowExpanded: true }
    }
    case "collapse buttons row": {
      return { ...state, isButtonsRowExpanded: false }
    }

    case "update current program2": {
      state.currentProgram = action.value
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

      return { ...state }
    }
    case "reorder current program": {
      state.currentProgram.Weeks[currentWeekIndex].Days[state.currentDayIndex].Exercises = [
        ...action.exercises,
      ]

      state.currentProgram = updateFollowingWeeks(state)
      return { ...state }
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
        state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
          exIndex
        ].Position = newPosition

      return { ...state }
    }

    case "add exercise from end of day button": {
      state.currentDayIndex = action.dayIndex
      state.currentWeekIndex = action.weekIndex
      state.isButtonsRowShown = true
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.isManuallySearchingExercises = true
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
      state.currentDayIndex = action.dayIndex
      state.isReordering = !state.isReordering
      return { ...state }
    }

    case "expand exercise info": {
      state.currentDayIndex = action.dayIndex
      // let newArray = state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises
      // newArray.forEach((exercise, index) => {
      //   if (index !== action.value) exercise.isExpanded = false
      // })

      // newArray[action.value].isExpanded = !newArray[action.value].isExpanded

      // state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises = newArray

      state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises[
        action.value
      ].isExpanded = !state.currentProgram.Weeks[currentWeekIndex].Days[action.dayIndex].Exercises[
        action.value
      ].isExpanded

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
        state.currentDayIndex = 0

        if (changeBy === 0) return state
        else return { ...state }
      } else if (action.value === "custom") {
        state.currentWeekIndex = action.newWeekValue
        state.currentDayIndex = action.newDayValue
        return { ...state }
      } else return state
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
          const lastWeekExercise =
            currentProgram.Weeks[weekIndex - 1].Days[dayIndex].Exercises[exIndex]

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

      return { ...state }
    }

    case "remove week": {
      if (currentProgram.Weeks.length === 1) return state

      if (currentWeekIndex === currentProgram.Weeks.length - 1) state.currentWeekIndex--
      state.currentProgram.Weeks.pop()
      return { ...state }
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
        state.oldPrograms = state.allPrograms.filter(program => program.item.Client === newUser.ID)
        state.oldPrograms = state.oldPrograms.filter(program => program.id != state.programID)
        state.currentProgram.Name = `${newUser.Name} ${state.oldPrograms.length + 1}`
        state.oldExercises = updateOldExercises(state)
      } else {
        state.oldPrograms = []
        state.currentProgram.Name = `New program`
        state.oldExercises = []
      }

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
      state.currentDayIndex = action.dayIndex
      state.isExercisePickerShown = true
      state.isProgramViewShown = false
      state.isManuallySearchingExercises = true
      state.currentExerciseIndex = action.value
      state.isReplacingExercise = true
      return { ...state }
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
        Position: Math.floor(
          currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length / 2 + 1,
        ),
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
        const oldExID =
          currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
            currentExerciseIndex
          ].ID
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
          currentExerciseIndex
        ].Name = exercise.Name
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
          currentExerciseIndex
        ].ID = exercise.ID

        if (addLastSets)
          currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
            currentExerciseIndex
          ].Sets = Sets

        const newExercise =
          currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
            currentExerciseIndex
          ]

        if (currentWeekIndex !== currentProgram.Weeks.length - 1) {
          // if week is not last => update following weeks
          for (let i = currentWeekIndex + 1; i < currentProgram.Weeks.length; i++) {
            const lastWeekExerciseIndex = currentProgram.Weeks[i - 1].Days[
              currentDayIndex
            ].Exercises.findIndex(exercise => exercise.ID === exID)
            const thisWeekExerciseIndex = currentProgram.Weeks[i].Days[
              currentDayIndex
            ].Exercises.findIndex(exercise => exercise.ID === oldExID)

            if (lastWeekExerciseIndex === undefined || thisWeekExerciseIndex === undefined) continue
            state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
              thisWeekExerciseIndex
            ] = _.cloneDeep(newExercise)

            const lastWeekExercise =
              currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises[lastWeekExerciseIndex]

            const progressions = getProgressions(lastWeekExercise)

            const { Sets } = currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
              thisWeekExerciseIndex
            ]
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
              state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises.push(
                _.cloneDeep(defaultExData),
              )
            }
          } else {
            const lastWeekExerciseIndex = currentProgram.Weeks[i - 1].Days[
              currentDayIndex
            ].Exercises.findIndex(exercise => exercise.ID === exID)
            const lastWeekExercise =
              currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises[lastWeekExerciseIndex]
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

              state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises.push(
                _.cloneDeep(newExerciseData),
              )
            }
          }
        }
      }

      state.isExercisePickerShown = false
      state.isProgramViewShown = true
      state.isReplacingExercise = false
      state.isButtonsRowShown = false

      state.currentExerciseIndex = 0

      return { ...state }
    }

    case "close modal and update exercise": {
      state.isEditExerciseModalVisible = false
      const newExercise = action.value
      state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
        currentExerciseIndex
      ] = _.cloneDeep(newExercise)

      const exID = newExercise.ID

      if (currentWeekIndex >= currentProgram.Weeks.length - 1) return { ...state }

      //if week is not last - update exercise in following weeks

      for (let i = currentWeekIndex + 1; i < currentProgram.Weeks.length; i++) {
        const lastWeekExerciseIndex = currentProgram.Weeks[i - 1].Days[
          currentDayIndex
        ].Exercises.findIndex(exercise => exercise.ID === exID)
        const thisWeekExerciseIndex = currentProgram.Weeks[i].Days[
          currentDayIndex
        ].Exercises.findIndex(exercise => exercise.ID === exID)

        if (lastWeekExerciseIndex === undefined || thisWeekExerciseIndex === undefined) continue

        state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
          thisWeekExerciseIndex
        ] = _.cloneDeep(newExercise)

        const lastWeekExercise =
          currentProgram.Weeks[i - 1].Days[currentDayIndex].Exercises[lastWeekExerciseIndex]

        const progressions = getProgressions(lastWeekExercise)

        const { Sets } = state.currentProgram.Weeks[i].Days[currentDayIndex].Exercises[
          thisWeekExerciseIndex
        ]

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

      return { ...state }
    }

    case "open modal and start editing exercise": {
      state.currentDayIndex = action.dayIndex
      state.isEditExerciseModalVisible = true
      state.currentExerciseIndex = action.value
      return { ...state }
    }

    default:
      throw new Error("Unexpected action in ExerciseDBReducer")
  }
}
