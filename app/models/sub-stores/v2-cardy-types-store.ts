import { types, SnapshotIn } from "mobx-state-tree"
import { firebaseFuncs } from "../../services/firebase/firebase.service"

export enum card_types {
  monthly = "monthly",
  per_visits = "visits",
}

const card_types_list: string[] = [card_types.monthly, card_types.per_visits]

export const Cardy_Type = types.model({
  type: types.enumeration(card_types_list),
  title: types.string,
  card_limit: types.maybeNull(types.number),
  monthly_limit: types.maybeNull(types.number),
  price: types.number,
  rate: types.number,
})

const Card_Type_Model = types.model({
  id: types.identifier,
  item: Cardy_Type,
})
export interface ICardy_Type extends SnapshotIn<typeof Cardy_Type> {}
export interface ICardy_Type_Model extends SnapshotIn<typeof Card_Type_Model> {}

export const CardTypesStoreModel2 = types
  .model("RootStore")
  .props({
    cards: types.array(Card_Type_Model),
    collection: "card-types",
  })
  .actions(self => ({
    refreshItems(items) {
      self.cards = items
    },
  }))
  .actions(self => firebaseFuncs<ICardy_Type>(self.refreshItems, self.collection))
  .actions(self => ({
    async addMonltyCard(_title: string, _card_limit: number, _price: number) {
      self.addItem({
        type: card_types.monthly,
        title: _title,
        card_limit: _card_limit,
        monthly_limit: _card_limit,
        price: _price,
        rate: +(_price / _card_limit).toPrecision(3),
      })
    },

    async addVisitsCard(_title: string, _card_limit: number, _price: number) {
      self.addItem({
        type: card_types.per_visits,
        title: _title,
        card_limit: _card_limit,
        monthly_limit: -1,
        price: _price,
        rate: +(_price / _card_limit).toPrecision(3),
      })
    },

    async addCardType(obj: ICardy_Type) {
      obj.type === card_types.monthly
        ? this.addMonltyCard(obj.title, obj.card_limit, obj.price)
        : this.addVisitsCard(obj.title, obj.card_limit, obj.price)
    },
  }))
