import { types, SnapshotIn, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'
import moment from "moment"

const card_types = ['monthly', 'visits']

export const Card2 = types.model({
    trainers: types.optional(types.array(types.string), []),
    clients: types.optional(types.array(types.string), []),
    datePayment : Date.now(),
    dateStart : Date.now(),
    whoPays : '',
    comment : '',
    
    type : types.enumeration(card_types),
    visits_limit : types.maybeNull(types.number),
    monthly_limit: types.maybeNull(types.number),
    price : types.number,
    realPrice: types.number,
    rate : types.number,
    visits : types.optional(types.array(types.string), []),
})

export interface ICard2 extends SnapshotIn<typeof Card2> {}

export const CardStoreModel2 = types.model('RootStore').props({
    cards: types.array(types.model({
        id: types.identifier,
        item: Card2
    })),
    collection: 'cards2'
})
.actions(self => firebaseFuncs<ICard2>(self.cards, self.collection))
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