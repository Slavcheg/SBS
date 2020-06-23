import { Instance, SnapshotOut, types } from "mobx-state-tree"
import {MCardy, MCardItem} from "../cardy.model"
import {addItem, updateItem, getItems, deleteItem} from "../../services/firebase/firebase.service"
import firestore from '@react-native-firebase/firestore';
import { values } from "mobx";
import { ObservableArray } from "mobx/lib/internal";

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
        const ref = firestore().collection('cards');
        ref.onSnapshot((cards) => {
            let newCards = [];
            cards.forEach(card=>{
                newCards.push(MCardy.create({id:card.id,item: MCardItem.create(card.data()) }));
            })
            this.refreshCards(newCards); 
        })      
    },
    
}))

// .views(self => ({
//     get ccards() {
//         console.log('is inside ccards view')
        
//         const ref = firestore().collection('cards');
        
//         let newCards = [];
//           ref.onSnapshot((cards) => {
//                         console.log('is inside ccards view snap')
                        
//                         cards.forEach(card=>{
//                             // console.log(card)
//                             newCards.push(MCardy.create({id:card.id,item: MCardItem.create(card.data()) }));
//                         })
//                     })
//         return values(newCards)
//     }
// }))