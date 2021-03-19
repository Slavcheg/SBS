import { T_Global_State } from "../global-state3"
import { T_Exercise_In_Database } from "../../../../components3"

export type T_Global_Exercise_Actions =
  | {
      type: "test"
    }
  | { type: "update global exercises from firestore"; value: T_Exercise_In_Database[] }
  | { type: "update personal exercises from firestore"; value: T_Exercise_In_Database[] }

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
        }

      if (!state.exercises.downloadedGlobal || state.exercises.downloadedGlobal.length === 0) {
        state.exercises.downloadedGlobal = [...action.value]
      }
      if (state.exercises.downloadedPersonal && state.exercises.downloadedPersonal.length > 0)
        state.exercises.allExercises = [...action.value, ...state.exercises.downloadedPersonal]
      else state.exercises.allExercises = [...action.value]
      break
    }

    case "update personal exercises from firestore": {
      if (!state.exercises)
        state.exercises = {
          allExercises: null,
          downloadedGlobal: null,
          downloadedPersonal: null,
        }

      if (!state.exercises.downloadedPersonal || state.exercises.downloadedPersonal.length === 0) {
        state.exercises.downloadedPersonal = [...action.value]
      }
      if (state.exercises.downloadedGlobal && state.exercises.downloadedGlobal.length > 0)
        state.exercises.allExercises = [...state.exercises.downloadedGlobal, ...action.value]
      else state.exercises.allExercises = [...action.value]
      break
    }

    default: {
      return state
    }
  }

  return state
}
