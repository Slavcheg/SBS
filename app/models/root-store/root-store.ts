import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { values } from "mobx"
import { CardStoreModel, UserStoreModel } from "../sub-stores"
import { SessionStoreModel } from "../sub-stores/session-store"
import moment from "moment"
import { GymHallStoreModel } from "../sub-stores/gymhall-store"
import { ReferralStoreModel } from "../sub-stores/referral-store"
import { MonthlyCardStoreModel } from "../sub-stores/monthly-card-store"
import { VisitsCardStoreModel } from "../sub-stores/visits-cards"
import { UserStoreModel2 } from "../sub-stores/v2-user-store"
import { CardTypesStoreModel2 } from "../sub-stores/v2-cardy-types-store"
import { CardStoreModel2 } from "../sub-stores/v2-cardy-store"

import { trainingProgramsStoreModel } from "../sub-stores/trainingPrograms-store"
import { exerciseDataStoreModel } from "../sub-stores/exerciseData-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
    cardStore: types.optional(CardStoreModel,{}),
    userStore: types.optional(UserStoreModel,{}),
    monthlyCardStore: types.optional(MonthlyCardStoreModel,{}),
    visitsCardStore: types.optional(VisitsCardStoreModel,{}),
    
    gymHallStore: types.optional(GymHallStoreModel,{}),
    referralStore: types.optional(ReferralStoreModel,{}),


    userStore2: types.optional(UserStoreModel2,{}),
    cardyTypesStore2: types.optional(CardTypesStoreModel2,{}),
    cardyStore2: types.optional(CardStoreModel2,{}),
    
    sessionStore: types.optional(SessionStoreModel,{}),
    progressLoader: types.optional(types.boolean, false),

    trainingProgramsStore: types.optional(trainingProgramsStoreModel, {}),
    exerciseDataStore: types.optional(exerciseDataStoreModel, {}),
    
})
.actions(self => ({
    showLoader(){
        console.log('show loader')
        self.progressLoader = true
    },
    hideLoader(){
        self.progressLoader = false
    },
}))
.views(self => ({
    get loggedUser(){
        return values(self.userStore2.users)
            .find(user => user.item.email == self.sessionStore.userEmail)
    },
    get getProfilePicture(){
        try{
            return values(self.userStore2.users)
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
    },

    get numberOfTrainingsForLoggedClientForActiveCards(){
        let counterDone = 0
        let counterTotal = 0

        self.cardStore.cards
            .filter(card => card.item.client === self.sessionStore.userEmail)
            // .filter(card => {card.item.active})
            .forEach(card => {
                counterDone += card.item.visits.length
                counterTotal += +card.item.card_limit
            })
        return {counterDone, counterTotal}
    },

    getUserPrograms (clientID: string) {
        const loggedUser = values(self.userStore2.users)
        .find(user => user.item.email == self.sessionStore.userEmail)
        
        const allTrainersPrograms = self.trainingProgramsStore.trainersPrograms(loggedUser.id);

        const oneTraineePrograms = allTrainersPrograms.filter(program => program.item.Client === clientID)

        const justProgramIDs = [];
        oneTraineePrograms.map((program => {
            justProgramIDs.push(program.id)
        }))

        return justProgramIDs
    },

}))

/**
 * The RootStore instance.()
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
