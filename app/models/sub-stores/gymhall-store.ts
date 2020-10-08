import { types, SnapshotIn } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'

export class GymHallItem {
    name = ''
}

export const GymHall = types.model({
    name: ''
})

export const GymHallModel = types.model({
    id: "",
    item: GymHall
})

export interface IGymhall2 extends SnapshotIn<typeof GymHall> {}

export const GymHallStoreModel = types.model("RootStore").props({
    gymhalls: types.array(GymHallModel),
    collection: 'gymhalls'
})
.actions(self => ({
    refreshItems(items){
        self.gymhalls = items
    },
}))
.actions(self => firebaseFuncs<IGymhall2>(self.refreshItems, self.collection))