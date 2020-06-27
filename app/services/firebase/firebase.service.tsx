import firestore from '@react-native-firebase/firestore';

export interface SnapShotProps{
    Type: string,
    RefreshHandler: (items: any)=>void
}

export const addItem = async (item: any, collection: string) => {   
    await firestore()
    .collection(collection)
    .add(item)
    .then((res) => {
      console.log(res);
    });
}
export const deleteItem = async (id:string, collection: string)=>{
    await firestore()
    .collection(collection)
    .doc(id)
    .delete()
    .then(() => {
      console.log('deleted!');
    });
}
export const updateItem = async (id: string, item: any, collection: string) => {   
    firestore()
    .collection(collection)
    .doc(id)
    .update (item)
    .then(() => {
        console.log('updated!');
    });
}
export const getItems = async (collection :string)=>{
    let items = [];  
    await firestore()
    .collection(collection)
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
        items.push(documentSnapshot);
        });
    });
    return items;
}
export const firebaseSnapShot = async (props: SnapShotProps)=>{
    const ref = firestore().collection(props.Type);
        ref.onSnapshot((items) => {
            let newItems = [];
            items.forEach(item=>{
                newItems.push({id:item.id,item: item.data() });
            })
            props.RefreshHandler(newItems); 
        })      
}