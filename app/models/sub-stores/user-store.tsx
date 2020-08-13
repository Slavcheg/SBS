import React, { useState } from 'react'
import { types, getSnapshot } from 'mobx-state-tree'
import { MUSer } from '../user.model'
import { addItem, updateItem, deleteItem, firebaseSnapShot } from '../../services/firebase/firebase.service'
import { values } from 'mobx';

export const UserStoreModel = types.model('RootStore').props({
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

    async updateDiary(email, date, weight, calories, protein){
        let user = self.users
            .find(user => user.item.email === email)
        // !Array.isArray(user.item.diary)? user.item.diary = [] null
        user.item.diary.push(
            date + '||' +
            +weight + '||' +
            +calories + '||' +
            +protein
        )
        this.uupdateItem(user.id, getSnapshot(user.item))
    },

    decodeDiaryItem(item: string){
        let obj = item.split('||')

        return {
            date: obj[0],
            weight: obj[1],
            calories: obj[2],
            protein: obj[3],
        }
    },
    encodeDiaryItem(item): string {
        return item.date + '||' + item.weight + '||' + item.calories + '||' + item.protein
    },

    deleteDiaryItem(userMail, diaryItem: string){
        let user = self.users.find(user => user.item.email === userMail)
        user.item.diary.splice(user.item.diary.indexOf(diaryItem))
        console.log(user.item.diary)
        this.uupdateItem(user.id, getSnapshot(user.item))
    },

    clientLogIn(gen_num, password) {   
        try {
            return self.users
            .filter(x => x.item.isClient == true)
            .find(user => 
                user.item.generic_number == gen_num &&
                user.item.password == password
            ).item.email || null
        }   catch {
            return null
        }  
        
    },

    async updatePic(user, newPic){        
        user.item.picture = newPic
        this.uupdateItem(user.id, getSnapshot(user.item))
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

