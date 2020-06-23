import { types } from "mobx-state-tree"
import {MUSer, MUserItem} from "../user.model"
import {addItem, updateItem, getItems, deleteItem} from "../../services/firebase/firebase.service"

const UserStoreModel = {
    users: types.array(MUSer),
    collection: 'users'
}

export const FirebaseActions = self => {

    async function aaddItem(newItem){
        await addItem(newItem, self.collection);
    }
    async function uupdateItem(id, newItem){
        await updateItem(id, newItem, self.collection);
    }

    function refreshItems(items){
        self.users = items
    }

    async function ddeleteItem(id){
        await deleteItem(id, self.collection);
    }

    async function ggetItems(){
        let items = await getItems(self.collection);
        let newItems = [];
        items.forEach(item=>{
            newItems.push(MUSer.create({id:item.id,item: MUserItem.create(item.data()) }));
        })
        refreshItems(newItems);        
    }

    return {
        aaddItem, uupdateItem, refreshItems, ddeleteItem, ggetItems
    }
}

export const UserStore = types
    .model(
        'UserStore',
        UserStoreModel
    )
    .actions(FirebaseActions)
