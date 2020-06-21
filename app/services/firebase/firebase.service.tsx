import { Api } from "../api"
import { ICardy, MCardy, IMCardy, IMItem } from "../../models"
import { types } from "mobx-state-tree"
import firestore from '@react-native-firebase/firestore';

export const fbAddCard = async (cardy: IMItem) => {
    // const API = new Api()
    // API.setup()
    // API.postAddItem('cards', JSON.stringify(cardy))
    //     .then((res: any) => {
    //     //    console.log(res.data)
    // })
    await firestore()
    .collection('cards')
    .add(cardy)
    .then((res) => {
      console.log(res);
    });
}
export const fbDeleteCard = async (id:string)=>{
    await firestore()
    .collection('cards')
    .doc(id)
    .delete()
    .then(() => {
      console.log('Card deleted!');
    });
}
export const fbUpdateCard = async (id: string, cardy: IMItem) => {
    // const API = new Api()
    // API.setup()
    // API.postUpdateItem('cards', id, JSON.stringify(cardy))
    //     .then((res: any) => {
    //     //    console.log(res)
    // })
    firestore()
    .collection('cards')
    .doc(id)
    .update (cardy)
    .then(() => {
        console.log('card updated!');
    });
}
export const fbGetAllCards = async ()=>{
    let cards = [];  
    console.log("getting data");
    await firestore()
    .collection('cards')
    .get()
    .then(querySnapshot => {
        console.log('Total todos: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
        console.log('todo ID: ', documentSnapshot.id, documentSnapshot.data());
        cards.push(documentSnapshot);
        });
    });
    return cards;
}