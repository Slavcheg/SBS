import { types, SnapshotIn, SnapshotOut, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from '../../services/firebase/firebase.service'
import { values } from "mobx"

const Client = types.model({
    generic_number : 0,
    password : '',
    referral : '',
})

const Trainer = types.model({
    clients: types.optional(types.array(types.string), []),
 })

const diaryItem = types.model({
    id: types.identifierNumber,
    date: Date.now(),
    weight: 0,
    calories: 0,
    protein: 0
})

const User2 = types.model('User2',{
    email : types.string,
    picture: types.optional(types.string, ''),
    first : types.optional(types.string, ''),
    last : types.optional(types.string, ''),

    referral : types.optional(types.string, ''),

    isClient: types.optional(types.boolean, false),
    isTrainer: types.optional(types.boolean, false),
    isAdmin: types.optional(types.boolean, false),

    client: types.optional(Client, {}),
    trainer: types.optional(Trainer, {}),
    diary : types.optional(types.array(diaryItem), [])
})

const User2_Model = types.model({
    id: types.identifier,
    item: User2
})

export interface IDiaryItem extends SnapshotOut<typeof diaryItem> {}
export interface IUser2 extends SnapshotIn<typeof User2> {}
export interface IUser2_Model extends SnapshotIn<typeof User2_Model> {}



export const UserStoreModel2 = types.model('RootStore').props({
    users: types.array(User2_Model),
    collection: 'users2'
})

.actions(self => ({
    refreshItems(items){
        self.users = items
    },
}))
.actions(self => 
    firebaseFuncs<IUser2>(
        self.refreshItems,
        self.collection
    )
)
.actions(self => ({

    async addToDiary(userEmail: string, newDiaryEntry: IDiaryItem){
        let user = self.users
            .find(user => user.item.email === userEmail)
        user.item.diary.push(newDiaryEntry)
        self.updateItem(user.id, getSnapshot(user.item))
            .then(res => {
                console.log(res)
            })
    },

    async deleteFromDiary(userEmail: string, diaryEntry: IDiaryItem){        
        let user = self.users
            .find(user => user.item.email === userEmail)
        let index = user.item.diary.indexOf(diaryEntry, 0)
        user.item.diary.splice(index, 1)
        self.updateItem(user.id, getSnapshot(user.item))
    },

    clientLogIn(gen_num, password) {  
        console.log(gen_num, password) 
        try {
            return self.users
            .filter(x => x.item.isClient == true)
            .find(user => 
                user.item.client.generic_number == gen_num &&
                user.item.client.password == password
            ).item.email || null
        }   catch {
            return null
        }  
        
    },

    async updatePic(user, newPic){        
        user.item.picture = newPic
        self.updateItem(user.id, getSnapshot(user.item))
    },

    isUserExistend(googleProfile: any): boolean {
        let u = self.users
                .find(user => user.item.email == googleProfile.email)
        if(u){
            this.updatePic(u, googleProfile.picture)
            return true
        }
        return false
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