import { T_client_full, T_Program } from "../../.."
import { T_Global_State } from "../global-state3"
export type T_Global_Programs_Actions = {
  type: "update programs from firestore"
  value: T_Program[]
}

export const programsReducer = (state: T_Global_State, action: T_Global_Programs_Actions) => {
  switch (action.type) {
    case "update programs from firestore": {
      state.programs = action.value
      break
    }

    default: {
      return state
    }
  }
  return state
}
