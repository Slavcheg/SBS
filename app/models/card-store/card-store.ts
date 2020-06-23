import { Instance, SnapshotOut, types } from "mobx-state-tree"
import {MCardy, MItem} from "../cardy.model"
import {addItem, updateItem, getItems, deleteItem} from "../../services/firebase/firebase.service"


// prettier-ignore
export const CardStoreModel = types.model("RootStore").props({
    cards: types.array(MCardy)
})
.actions(self=>({
    async addCard(newCard){
        await addItem(newCard, 'cards');
    },
    async updateCard(id, newCard){
        await updateItem(id, newCard, 'cards');
    },
    refreshCards(cards){
        self.cards = cards
    },
    async deleteCard(id){
        await deleteItem(id, 'cards');
    },
    async getCards(){
        let cards = await getItems('cards');
        let newCards = [];
        cards.forEach(card=>{
            newCards.push(MCardy.create({id:card.id,item: MItem.create(card.data()) }));
        })
        this.refreshCards(newCards);        
    },
    
}))

