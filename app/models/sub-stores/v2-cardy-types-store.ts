import { types, SnapshotIn, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'
import moment from "moment"

const card_types = ['monthly', 'visits']

export const Cardy_Type = types.model({
    type : types.enumeration(card_types),
    title: types.string,
    visits_limit : types.maybeNull(types.number),
    monthly_limit: types.maybeNull(types.number),
    price : types.number,
    rate : types.number,
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
    async addMonltyCard(_title: string, _months: number, _price: number){
        self.addItem({
            type: card_types[0],
            title: _title,
            visits_limit: -1,
            monthly_limit: _months,
            price: _price,
            rate: _price / _months
        })
    },

    async addVisitsCard(_title: string, _visits: number, _price: number){
        self.addItem({
            type: card_types[1],
            title: _title,
            visits_limit: _visits,
            monthly_limit: -1,
            price: _price,
            rate: _price /_visits,
        })
    }
}))