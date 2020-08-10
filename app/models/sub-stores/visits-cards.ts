import { types, getSnapshot } from "mobx-state-tree"
import { addItem, updateItem, deleteItem, firebaseSnapShot } from "../../services/firebase/firebase.service"
import { values } from "mobx";


export class VisitsCardItem {
    name = '';
    visits= 1;
    monthsValid= 1;
    price= 1;

}

export const VisitsCardItemModel = types.model({
    name: '',
    visits: 1,
    monthsValid: 1,
    price: 1
})

export const VisitsCardModel = types.model({
    id: "",
    item: VisitsCardItemModel
})

export const VisitsCardStoreModel = types.model("RootStore").props({
    visitsCards: types.array(VisitsCardModel),
    collection: 'visits-cards'
})
.actions(self => ({

    async addMItem(newItem){
        await addItem(newItem, self.collection);
    },

    async updateMItem(id, newItem){
        await updateItem(id, newItem, self.collection);
    },
    refreshItems(items){
        self.visitsCards = items
    },

    async deleteMItem(id){
        await deleteItem(id, self.collection);
    },

    async getMItem(){
        firebaseSnapShot({Type: self.collection, RefreshHandler: this.refreshItems});  
    },
}))