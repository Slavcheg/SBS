import { types } from "mobx-state-tree"
import {MUSer, MUserItem} from "../user.model"
import {addItem, updateItem, getItems, deleteItem, firebaseSnapShot} from "../../services/firebase/firebase.service"
import firestore from '@react-native-firebase/firestore';
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
        firebaseSnapShot({Type: 'users', RefreshHandler: refreshItems});  
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
