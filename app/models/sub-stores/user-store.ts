import { types } from "mobx-state-tree"
import { MUSer } from "../user.model"
import { addItem, updateItem, deleteItem, firebaseSnapShot } from "../../services/firebase/firebase.service"
import { values } from "mobx";

export const UserStoreModel = types.model("RootStore").props({
    users: types.array(MUSer),
    collection: 'users'
})

.actions(self => ({

    async aaddItem(newItem){
        await addItem(newItem, self.collection);
    },

    async uupdateItem(id, newItem){
        await updateItem(id, newItem, self.collection);
    },

    refreshItems(items){
        self.users = items
    },

    async ddeleteItem(id){
        await deleteItem(id, self.collection);
    },

    async ggetItems(){
        firebaseSnapShot({Type: 'users', RefreshHandler: this.refreshItems});  
    },

    clientLogIn(gen_num, password) {        
        return self.users
                .filter(x => x.item.isClient == true)
                .find(user => {
                    user.item.generic_number == gen_num &&
                    user.item.password == password
                })
}
}))
.views(self => ({
    get trainers() {
        return values(self.users).filter(x => x.item.isTrainer == true)
    },

    get clients() {
        return values(self.users).filter(x => x.item.isClient == true)
    },

    get clientsCount() {
        return values(self.users).filter(x => x.item.isClient == true).length
    }
}))

