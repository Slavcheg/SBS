import { types, SnapshotIn, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'
import moment from "moment"
import { return_todays_datestamp } from "../../global-helper"
import { Cardy_Type, card_types } from "./v2-cardy-types-store"

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
    visits : types.optional(types.array(types.string), []),
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
    isActiveCard(cardId: string): boolean{
        const today = return_todays_datestamp();
        const cardy = self.cards.find(card => card.id === cardId)

        if (cardy.item.card_type.type === card_types.monthly) {
            const cardyExpiryDate = +moment(cardy.item.datestampStart)
                                        .add(cardy.item.card_type.card_limit, 'M')
            return (cardyExpiryDate - today) <= 0 ? 
                // if result is negative so expiry date is in the past so card is expired
                false : true 
        } else {
            return cardy.item.card_type.card_limit - cardy.item.visits.length <= 0 ?
            // if result is 0 (or exidentally negative) limit is reached so card has expired
            false: true
        }
    },

    cardVisitsMonthsPassed(cardId){
        return 0
    }
}))