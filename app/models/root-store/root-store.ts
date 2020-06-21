import { Instance, SnapshotOut, types, getRoot } from "mobx-state-tree"
import {MCardy, MItem} from "../cardy.model"
import {fbAddCard, fbUpdateCard, fbGetAllCards, fbDeleteCard} from "../../services/firebase/firebase.service"
import { type } from "ramda";

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
    cards: types.array(MCardy)
})
.actions(self=>({
    async addCard(newCard){
        await fbAddCard(newCard);
        //self.cards.push(MCardy.create(newCard));
        //self.cards.push(MCardy.create({id:newCard.id,item: MItem.create(newCard.data()) }));
    },
    async updateCard(id, newCard){
        await fbUpdateCard(id, newCard);
    },
    refreshCards(cards){
        self.cards = cards
    },
    async deleteCard(id){
        await fbDeleteCard(id);
    },
    async getCards(){
        let cards = await fbGetAllCards();
        let newCards = [];
        cards.forEach(card=>{
            newCards.push(MCardy.create({id:card.id,item: MItem.create(card.data()) }));
        })
        this.refreshCards(newCards);        
    },
    
}))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
