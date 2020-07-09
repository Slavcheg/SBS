import { Instance, SnapshotOut, types } from "mobx-state-tree"

import {CardStoreModel, UserStoreModel} from "../sub-stores"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
    cardStore: types.optional(CardStoreModel,{}),
    userStore: types.optional(UserStoreModel,{})
})
// .actions(self=>({
//     async addCard(newCard){
//         await addItem(newCard, 'cards');
//     },
//     async updateCard(id, newCard){
//         await updateItem(id, newCard, 'cards');
//     },
//     refreshCards(cards){
//         self.cards = cards
//     },
//     async deleteCard(id){
//         await deleteItem(id, 'cards');
//     },
//     async getCards(){
//         let cards = await getItems('cards');
//         let newCards = [];
//         cards.forEach(card=>{
//             newCards.push(MCardy.create({id:card.id,item: MItem.create(card.data()) }));
//         })
//         this.refreshCards(newCards);        
//     },
    
// }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
