import { types, SnapshotIn, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'
import moment from "moment"

const card_types = ['monthly', 'visits']

export const Cardy_Type = types.model({
    type : types.enumeration(card_types),
    visits_limit : types.maybeNull(types.number),
    monthly_limit: types.maybeNull(types.number),
    price : types.number,
    realPrice: types.number,
    rate : types.number,
    visits : types.optional(types.array(types.string), []),
})

export interface ICardy_Type extends SnapshotIn<typeof Cardy_Type> {}

export const CardTypesStoreModel2 = types.model('RootStore').props({
    cards: types.array(types.model({
        id: types.identifier,
        item: Cardy_Type
    })),
    collection: 'card-types'
})
.actions(self => firebaseFuncs<ICardy_Type>(self.cards, self.collection))
.actions(self => ({
    async addMonltyCard(_months: number, _price: number, _realPrice: number){
        self.addItem({
            type: card_types[0],
            monthly_limit: _months,
            price: _price,
            realPrice: _realPrice
        })
    },

    async addVisitsCard(_visits: number, _price: number, _realPrice: number){
        self.addItem({
            type: card_types[1],
            visits_limit: _visits,
            price: _price,
            realPrice: _realPrice,
            rate: _price /_visits,
            visits: []
        })
    }
}))