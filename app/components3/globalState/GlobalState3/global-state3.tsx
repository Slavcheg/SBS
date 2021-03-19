import AsyncStorage from "@react-native-community/async-storage"
import React, { Context, createContext, useContext, useReducer, useMemo, useEffect } from "react"
import {
  userReducer,
  exerciseReducer,
  T_Global_Exercise_Actions,
  T_Global_User_Actions,
  lastReducer,
  T_Global_Last,
  programsReducer,
  T_Global_Programs_Actions,
} from "./Reducers"
import firestore from "@react-native-firebase/firestore"
import * as exerciseFuncs from "./functions/exercises"

import { T_Exercise_In_Database } from "../../../components3"
import { TRAINING_PROGRAMS_COLLECTION } from "../../Constants"
import { T_Program } from "../../types"

export type exercisesStore = {
  allExercises: T_Exercise_In_Database[]
  downloadedGlobal: T_Exercise_In_Database[]
  downloadedPersonal: T_Exercise_In_Database[]
}

export type T_Global_State = {
  loggedUser: any
  test: string
  test2: boolean
  exercises: exercisesStore
  programs: T_Program[]
}

type T_Global_Action = T_Global_Last | T_Global_Exercise_Actions | T_Global_User_Actions | T_Global_Programs_Actions

export type T_Global_Dispatch = React.Dispatch<T_Global_Action>

const initialExercises: exercisesStore = {
  allExercises: null,
  downloadedGlobal: null,
  downloadedPersonal: null,
}

const initialState: T_Global_State = {
  loggedUser: null,
  test: "initial",
  test2: true,
  exercises: initialExercises,
  programs: null,
}

const reduceReducers = (...reducers) => (state, action) => reducers.reduce((acc, nextReducer) => nextReducer(acc, action), state)

export type T_Global_Reducer = React.Reducer<T_Global_State, T_Global_Action>

const globalReducer: T_Global_Reducer = reduceReducers(userReducer, exerciseReducer, programsReducer, lastReducer)

// const globalReducer: T_Global_Reducer = (state: T_Global_State, action: T_Global_Exercise_Actions | T_Global_User_Actions) => {
//   // state = userReducer(state, action)

//   switch (action.type) {
//     case "login": {
//       break
//     }

//     default: {
//       console.error("invalid action in Global User Reducer, ", action)
//       break
//     }
//   }

//   return { ...state }
// }

const GlobalContext3 = createContext<{ state: T_Global_State; dispatch: T_Global_Dispatch }>({
  state: initialState,
  dispatch: () => null,
})
export const useGlobalState3 = () => useContext(GlobalContext3)

const memoStore = () => {
  const [state, dispatch] = useReducer<T_Global_Reducer>(globalReducer, initialState)
  const store = { state, dispatch }
  return useMemo(() => store, [store.state])
}

export const GlobalStateProvider3 = ({ children }) => {
  // const [state, dispatch] = useReducer<T_Global_Reducer>(globalReducer, initialState)
  // const store = useMemo(() => {state: state, dispatch: dispatch}, [state]);
  return <GlobalContext3.Provider value={memoStore()}>{children}</GlobalContext3.Provider>
}

export const storeAsyncState = async (state, stateName: string) => {
  try {
    await AsyncStorage.setItem(stateName, JSON.stringify(state))
    console.log("tried saving storage")
  } catch (err) {
    console.error(err)
  }
}
const getAsyncState = async (reducer: T_Global_Dispatch, stateName, onUpdate: (state: T_Global_State) => any) => {
  console.log("went to getAsyncState")
  const stateString = await AsyncStorage.getItem(stateName)
  const state = JSON.parse(stateString)
  onUpdate(state)
  if (state)
    reducer({
      type: "update from storage",
      value: state,
    })
}

export const useAsyncState3 = () => {
  const { state, dispatch } = useGlobalState3()

  useEffect(() => {
    getAsyncState(dispatch, "globalState3", onUpdateFromStorage)
  }, [])

  const onUpdatePrograms = (programs: T_Program[]) => {
    dispatch({ type: "update programs from firestore", value: programs })
  }
  const onUpdateFromStorage = (state: T_Global_State) => {
    if (state && state.loggedUser) {
      // if (state && !state.exercises) exerciseFuncs.getExercises(state.loggedUser.ID, onDownloadMainExercises)
      exerciseFuncs.getGlobalExercises(state.loggedUser.ID, onDownloadMainExercises)
      exerciseFuncs.getPersonalExercises(state.loggedUser.ID, onDownloadPersonalExercises)
    }
  }

  const onDownloadMainExercises = exercises => {
    dispatch({ type: "update global exercises from firestore", value: exercises })
  }
  const onDownloadPersonalExercises = exercises => {
    dispatch({ type: "update personal exercises from firestore", value: exercises })
  }

  useTrainerPrograms(onUpdatePrograms)
}

export const refreshExercises = () => {
  const { state, dispatch } = useGlobalState3()

  const onDownloadMainExercises = exercises => {
    dispatch({ type: "update global exercises from firestore", value: exercises })
  }
  const onDownloadPersonalExercises = exercises => {
    dispatch({ type: "update personal exercises from firestore", value: exercises })
  }

  exerciseFuncs.getGlobalExercises(state.loggedUser.ID, onDownloadMainExercises)
  exerciseFuncs.getPersonalExercises(state.loggedUser.ID, onDownloadPersonalExercises)
}

export const useTrainerPrograms = onRefresh => {
  const { state } = useGlobalState3()

  useEffect(() => {
    console.log("useTrainerProgramsEffect", state.loggedUser)
    let subscriber
    if (state.loggedUser && state.loggedUser.ID)
      subscriber = firestore()
        .collection(TRAINING_PROGRAMS_COLLECTION)
        .where("Trainers", "array-contains", state.loggedUser.ID)
        .onSnapshot(colRef => {
          const programs: T_Program[] = []
          colRef.forEach((doc: any) => {
            programs.push({ ...doc.data(), ID: doc.id })
          })
          onRefresh(programs)
        })
    return () => {
      if (subscriber) subscriber()
    }
  }, [state.loggedUser])
}
