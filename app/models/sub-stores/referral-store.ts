import { types, SnapshotIn } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'

export const Referral = types.model({
    name : ''
})

export const ReferralModel = types.model({
    id: "",
    item: Referral
})

export interface IReferral2 extends SnapshotIn<typeof Referral> {}

export const ReferralStoreModel = types.model("RootStore").props({
    referrals: types.array(ReferralModel),
    collection: 'referrals'
})
.actions(self => ({
    refreshItems(items){
        self.referrals = items
    },
}))
.actions(self => firebaseFuncs<IReferral2>(self.refreshItems, self.collection))