import { types } from "mobx-state-tree"
import { MCardy } from "../cardy.model"
import { addItem, updateItem, deleteItem, firebaseSnapShot } from "../../services/firebase/firebase.service"

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
        firebaseSnapShot({Type: 'cards', RefreshHandler: this.refreshCards});
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