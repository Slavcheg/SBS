import { types, getSnapshot } from "mobx-state-tree"
import { addItem, updateItem, deleteItem, firebaseSnapShot } from "../../services/firebase/firebase.service"
import { values } from "mobx";

export const ReferralItem = types.model({
    name : ''
})

export const Referral = types.model({
    id: "",
    item: ReferralItem
})

export const ReferralStoreModel = types.model("RootStore").props({
    referrals: types.array(Referral),
    collection: 'referrals'
})
.actions(self => ({

    async addReferral(newItem){
        await addItem(newItem, self.collection);
    },

    async updateReferral(id, newItem){
        await updateItem(id, newItem, self.collection);
    },
    refreshItems(items){
        self.referrals = items
    },

    async deleteReferral(id){
        await deleteItem(id, self.collection);
    },

    async getReferrals(){
        firebaseSnapShot({Type: self.collection, RefreshHandler: this.refreshItems});  
    },
}))