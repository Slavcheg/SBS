import { types, SnapshotIn } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'

export enum card_types {
    monthly = 'monthly', 
    per_visits = 'visits'
}

const card_types_list: string[] = [card_types.monthly, card_types.per_visits]

export const Cardy_Type = types.model({
    type : types.enumeration(card_types_list),
    title: types.string,
    card_limit : types.maybeNull(types.number),
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

    async addMonltyCard(_title: string, _card_limit: number, _price: number){
        self.addItem({
            type: card_types[0],
            title: _title,
            card_limit: _card_limit,
            monthly_limit: _card_limit,
            price: _price,
            rate: _price / _card_limit
        })
    },

    async addVisitsCard(_title: string, _card_limit: number, _price: number){
        self.addItem({
            type: card_types[1],
            title: _title,
            card_limit: _card_limit,
            monthly_limit: -1,
            price: _price,
            rate: _price /_card_limit,
        })
    },

    async addCardType(obj: {type: card_types, title: string, card_limit: number, price: number}){
        obj.type === card_types.monthly ?
            this.addMonltyCard(obj.title, obj.card_limit, obj.price)
        : this.addVisitsCard(obj.title, obj.card_limit, obj.price)
    },
}))