import { types } from "mobx-state-tree"
import {MUSer, MUserItem} from "../user.model"
import {addItem, updateItem, getItems, deleteItem} from "../../services/firebase/firebase.service"


// prettier-ignore
export const UserStoreModel = types.model("RootStore").props({
    users: types.array(MUSer)
})
.actions(self=>({
    async addItem(newItem){
        await addItem(newItem, 'users');
    },
    async updateItem(id, newItem){
        await updateItem(id, newItem, 'users');
    },
    refreshItems(items){
        self.users = items
    },
    async deleteItem(id){
        await deleteItem(id, 'users');
    },
    async getItems(){
        let items = await getItems('users');
        let newItems = [];
        items.forEach(item=>{
            newItems.push(MUSer.create({id:item.id,item: MUserItem.create(item.data()) }));
        })
        this.refreshItems(newItems);        
    }
    
}))

