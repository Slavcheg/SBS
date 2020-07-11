import { types } from "mobx-state-tree"
import { MCardy, Cardy } from "../cardy.model"
import { addItem, updateItem, deleteItem, firebaseSnapShot } from "../../services/firebase/firebase.service"
import moment from "moment"
import { values } from "mobx";
import { cast, getSnapshot } from "mobx-state-tree"

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

    async addTrainingYesterday(cardy){
        cardy.item.visits
            .push(moment().subtract(1, 'days').format('MMM DD[,] YY').toString())

        this.updateCard(cardy.id, getSnapshot(cardy.item))         
    },

    async removeTrainingYesterday(card){
        const pos = card.item.visits.indexOf(moment().subtract(1, 'days').format('MMM DD[,] YY').toString())
        pos > -1 ? card.item.visits.splice(pos, 1) : console.log('Client trained yesterday, but date is not in visits');
        await this.updateCard(card.id, getSnapshot(card.item))
    },

    async addTrainingToday(cardy){
        cardy.item.visits
            .push(moment().format('MMM DD[,] YY').toString())

        this.updateCard(cardy.id, getSnapshot(cardy.item))         
    },

    async removeTrainingToday(card){
        const pos = card.item.visits.indexOf(moment().format('MMM DD[,] YY').toString())
        pos > -1 ? card.item.visits.splice(pos, 1) : console.log('Client trained yesterday, but date is not in visits');
        await this.updateCard(card.id, getSnapshot(card.item))
    }
    
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