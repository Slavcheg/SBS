import React, { Dispatch, useReducer } from "react"

import { T_card, T_client_short, T_session } from "../../../components3"
import * as dateHelper from "../../../global-helper/global-date-helper/global-date-helper"

export type T_State_Client_HomeScreen = {
  clientID: string
  cards: T_card[]
  trainingsMoreInfo: boolean
}

export type T_Action_Client_HomeScreen =
  | {
      type: "load cards"
      value: T_card[]
      clientID: string
    }
  | { type: "toggle trainings more info" }

export type T_Reducer_Client_HomeScreen = React.Reducer<
  T_State_Client_HomeScreen,
  T_Action_Client_HomeScreen
>

export const useHomeScreenState = () => {
  const [state, dispatch] = useReducer<T_Reducer_Client_HomeScreen>(clientHomeScreen_Reducer, {
    clientID: "",
    cards: [],
    trainingsMoreInfo: false,
  })

  return [state, dispatch] as const
}

export const clientHomeScreen_Reducer: T_Reducer_Client_HomeScreen = (
  state: T_State_Client_HomeScreen,
  action: T_Action_Client_HomeScreen,
) => {
  switch (action.type) {
    case "load cards": {
      state.cards = action.value
      state.clientID = action.clientID
      break
    }
    case "toggle trainings more info": {
      state.trainingsMoreInfo = !state.trainingsMoreInfo
      break
    }
    default: {
      console.error("invalid action in home screen reducer, ", action)
      break
    }
  }
  return afterBreak(state)
}

function afterBreak(state) {
  return { ...state }
}
