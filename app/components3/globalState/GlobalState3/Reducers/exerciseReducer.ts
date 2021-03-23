import { T_Global_State } from "../global-state3"
import { T_Exercise_In_Database } from "../../../../components3"
import * as exerciseFuncs from "../functions/exercises"
import * as dateHelper from "../../../../global-helper/global-date-helper/global-date-helper"

export type T_Global_Exercise_Actions =
  | {
      type: "test"
    }
  | { type: "update global exercises from firestore"; value: T_Exercise_In_Database[] }
  | { type: "update personal exercises from firestore"; value: T_Exercise_In_Database[] }
  | {
      type: "remove one exercise from own collection" | "update custom exercise in own collection" | "add one personal exercise"
      exercise: T_Exercise_In_Database
    }

export const exerciseReducer = (state: T_Global_State, action: T_Global_Exercise_Actions) => {
  switch (action.type) {
    case "test": {
      state.test = `${Math.random()}`
      break
    }

    case "update global exercises from firestore": {
      if (!state.exercises)
        state.exercises = {
          allExercises: null,
          downloadedGlobal: null,
          downloadedPersonal: null,
          allExercisesFiltered: null,
        }

      state.exercises.downloadedGlobal = [...action.value]

      if (state.exercises.downloadedPersonal && state.exercises.downloadedPersonal.length > 0)
        state.exercises.allExercises = [...action.value, ...state.exercises.downloadedPersonal]
      else state.exercises.allExercises = [...action.value]

      state.exercises.allExercisesFiltered = {}
      state.exercises.allExercises.forEach(exercise => {
        if (!state.exercises.allExercisesFiltered[exercise.MainMuscleGroup])
          state.exercises.allExercisesFiltered = { ...state.exercises.allExercisesFiltered, [exercise.MainMuscleGroup]: [] }
        state.exercises.allExercisesFiltered[exercise.MainMuscleGroup].push(exercise)
      })
      break
    }

    case "update personal exercises from firestore": {
      if (!state.exercises)
        state.exercises = {
          allExercises: null,
          downloadedGlobal: null,
          downloadedPersonal: null,
          allExercisesFiltered: null,
        }
      state.exercises.downloadedPersonal = [...action.value]

      if (state.exercises.downloadedGlobal && state.exercises.downloadedGlobal.length > 0)
        state.exercises.allExercises = [...state.exercises.downloadedGlobal, ...action.value]
      else state.exercises.allExercises = [...action.value]

      state.exercises.allExercisesFiltered = {}
      state.exercises.allExercises.forEach(exercise => {
        if (!state.exercises.allExercisesFiltered[exercise.MainMuscleGroup])
          state.exercises.allExercisesFiltered = { ...state.exercises.allExercisesFiltered, [exercise.MainMuscleGroup]: [] }
        state.exercises.allExercisesFiltered[exercise.MainMuscleGroup].push(exercise)
      })

      break
    }

    case "add one personal exercise": {
      const newExID = exerciseFuncs.getNewExerciseID(state.exercises.allExercises)

      let newEx = { ...action.exercise, ID: newExID }
      if (!newEx.YouTubeLink) newEx.YouTubeLink = "No link"
      if (!newEx.MainMuscleGroup) newEx.MainMuscleGroup = "No group"
      newEx.AddedOn = dateHelper.return_todays_datestamp()

      exerciseFuncs.addOnePersonalExercise(state.loggedUser.ID, newEx)
      break
    }

    case "remove one exercise from own collection": {
      exerciseFuncs.deleteOnePersonalExercise(state.loggedUser.ID, action.exercise)
      break
    }

    case "update custom exercise in own collection": {
      exerciseFuncs.updateOnePersonalExercise(state.loggedUser.ID, action.exercise)
      break
    }

    default: {
      return state
    }
  }

  return state
}
