import { types, getSnapshot, ModelPropertiesDeclaration } from "mobx-state-tree"
import { addItem, updateItem, deleteItem, firebaseSnapShot } from "../../services/firebase/firebase.service"
import { values } from "mobx";


export class GymHallItem {
    name = ''
}

export const GymHallItemModel = types.model({name: ''})

export const GymHallModel = types.model({
    id: "",
    item: GymHallItemModel
})

export const GymHallStoreModel = types.model("RootStore").props({
    gymhalls: types.array(GymHallModel),
    collection: 'gymhalls'
})
.actions(self => ({

    async addGymHall(newItem){
        await addItem(newItem, self.collection);
    },

    async updateGymHall(id, newItem){
        await updateItem(id, newItem, self.collection);
    },
    refreshItems(items){
        self.gymhalls = items
    },

    async deleteGymHall(id){
        await deleteItem(id, self.collection);
    },

    async getGymHalls(){
        firebaseSnapShot({Type: self.collection, RefreshHandler: this.refreshItems});  
    },
}))