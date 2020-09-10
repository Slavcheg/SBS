import { types, SnapshotIn, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'
import moment from "moment"
import { return_todays_datestamp } from "../../global-helper"
import { Cardy_Type } from "./v2-cardy-types-store"

const card_types = ['monthly', 'visits']

export const Cardy2 = types.model({
    trainers: types.optional(types.array(types.string), []),
    trainersPics: types.optional(types.array(types.string), []),
    clients: types.optional(types.array(types.string), []),
    clientsPics: types.optional(types.array(types.string), []),
    datestampPayment : return_todays_datestamp(),
    datestampStart : return_todays_datestamp(),
    whoPays : '',
    comment : '',

    card_type: Cardy_Type,
    realPrice: types.number,
    // type : types.enumeration(card_types),
    // visits_limit : types.maybeNull(types.number),
    // monthly_limit: types.maybeNull(types.number),
    // price : types.number,
    // realPrice: types.number,
    // rate : types.number,
    // visits : types.optional(types.array(types.string), []),
})

const Cardy_Model = types.model({
    id: types.identifier,
    item: Cardy2
})

export interface ICardy2 extends SnapshotIn<typeof Cardy2> {}
export interface ICardy2_Model extends SnapshotIn<typeof Cardy_Model> {}

export const CardStoreModel2 = types.model('RootStore').props({
    cards: types.array(Cardy_Model),
    collection: 'cards2'
})
.actions(self => ({
    refreshItems(items){
        self.cards = items
    },
}))
.actions(self => firebaseFuncs<ICardy2>(self.refreshItems, self.collection))
.actions(self => ({

    async addTrainingYesterday(cardy){
        cardy.item.visits
            .push(moment().subtract(1, 'days').format('MMM DD[,] YY').toString())

        self.updateItem(cardy.id, getSnapshot(cardy.item))         
    },

    async removeTrainingYesterday(card){
        const pos = card.item.visits.indexOf(moment().subtract(1, 'days').format('MMM DD[,] YY').toString())
        pos > -1 ? card.item.visits.splice(pos, 1) : console.log('Client trained yesterday, but date is not in visits');
        await self.updateItem(card.id, getSnapshot(card.item))
    },

    async addTrainingToday(cardy){
        cardy.item.visits
            .push(moment().format('MMM DD[,] YY').toString())

        self.updateItem(cardy.id, getSnapshot(cardy.item))         
    },

    async removeTrainingToday(card){
        const pos = card.item.visits.indexOf(moment().format('MMM DD[,] YY').toString())
        pos > -1 ? card.item.visits.splice(pos, 1) : console.log('Client trained yesterday, but date is not in visits');
        await self.updateItem(card.id, getSnapshot(card.item))
    }
}))
.views(self => ({
    isActiveCard(cardId=''){
        return true;
    }
}))