import { T_client_full } from "../../.."
import { T_Global_State } from "../global-state3"
export type T_Global_User_Actions = {
  type: "login"
  user: T_client_full
  userDiary: any
}

export const userReducer = (state: T_Global_State, action: T_Global_User_Actions) => {
  switch (action.type) {
    case "login": {
      state.loggedUser = action.user
      state.loggedUser.userDiary = action.userDiary
      if (action.user.Clients) state.loggedUser.Clients = action.user.Clients

      console.log(`${action.user} logged in`)
      //   console.log(`Found ${action.user.Clients.length} clients`)
      break
    }

    default: {
      return state
    }
  }
  return state
}
