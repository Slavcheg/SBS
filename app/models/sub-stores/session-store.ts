import { types } from "mobx-state-tree"
import { MUserItem, MUSer } from "../user.model"
import { values } from "mobx"

export const SessionStoreModel = types
  .model("RootStore")
  .props({
    userEmail: types.optional(types.string, ""),
  })
  .actions(self => ({
    // make u strongly typed
    logIn(ue: string) {
      self.userEmail = ue
    },
    logOut() {
      self.userEmail = ""
    },
  }))
  .views(self => ({
    get isLogged() {
      if (self.userEmail) {
        return true
      }
      return false
    },
  }))
