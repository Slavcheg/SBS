import { types, getSnapshot } from "mobx-state-tree"
import { addItem, updateItem, deleteItem, firebaseSnapShot } from "../../services/firebase/firebase.service"
import { values } from "mobx";


export class MonthlyCardItem {
    name = '';
    monthsValid= 1;
    price= 1;

}

export const MonthlyCardItemModel = types.model({
    name: '',
    monthsValid: 1,
    price: 1
})

export const MonthlyCardModel = types.model({
    id: "",
    item: MonthlyCardItemModel
})

export const MonthlyCardStoreModel = types.model("RootStore").props({
    monthlyCards: types.array(MonthlyCardModel),
    collection: 'monthly-cards'
})
.actions(self => ({

    async addMItem(newItem){
        await addItem(newItem, self.collection);
    },

    async updateMItem(id, newItem){
        await updateItem(id, newItem, self.collection);
    },
    refreshItems(items){
        self.monthlyCards = items
    },

    async deleteMItem(id){
        await deleteItem(id, self.collection);
    },

    async getMItem(){
        firebaseSnapShot({Type: self.collection, RefreshHandler: this.refreshItems});  
    },
}))