import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { values } from "mobx";
import {CardStoreModel, UserStoreModel} from "../sub-stores"
import { SessionStoreModel } from "../sub-stores/session-store"
import { forEach, filter } from "ramda";
import moment from 'moment'

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
    cardStore: types.optional(CardStoreModel,{}),
    userStore: types.optional(UserStoreModel,{}),
    sessionStore: types.optional(SessionStoreModel,{})
})
.views(self => ({
    get loggedUser(){
        return values(self.userStore.users)
            .find(user => user.item.email == self.sessionStore.userEmail)
    },
    get getProfilePicture(){
        try{
            return values(self.userStore.users)
            .find(user => user?.item?.email == self.sessionStore.userEmail)
            .item
            .picture
        } catch {
            return 'https://images.assetsdelivery.com/compings_v2/4zevar/4zevar1604/4zevar160400009.jpg'
        }
    },

    get numberOfTrainingsForLoggedTrainerThisMonth() {
       let counter = 0
        self.cardStore.cards
            .filter(card => card.item.trainer === self.sessionStore.userEmail)
            .forEach(card => {
                counter += card.item.visits.filter(visit => visit.indexOf(moment().format('MMM').toString()) > -1).length
            })
        return counter
    }
}))

/**
 * The RootStore instance.()
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
