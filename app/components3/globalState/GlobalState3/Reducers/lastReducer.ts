import { storeAsyncState, T_Global_State } from "../global-state3"
export type T_Global_Last = {
  type: "update from storage"
  value: T_Global_State
}

export const lastReducer = (state: T_Global_State, action: T_Global_Last) => {
  switch (action.type) {
    case "update from storage": {
      state = { ...state, ...action.value }
      break
    }
    default: {
      break
    }
  }
  storeAsyncState(state, "globalState3")
  return { ...state }
}
