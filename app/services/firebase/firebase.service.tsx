import firestore from "@react-native-firebase/firestore"

export interface SnapShotProps {
  Type: string
  RefreshHandler: (items: any) => void
}

export const addItem = async (item: any, collection: string) => {
  await firestore()
    .collection(collection)
    .add(item)
    .then(res => {
      console.log(res)
    })
}
export const deleteItem = async (id: string, collection: string) => {
  await firestore()
    .collection(collection)
    .doc(id)
    .delete()
    .then(() => {
      console.log("deleted!")
    })
}
export const updateItem = async (id: string, item: any, collection: string) => {
  firestore()
    .collection(collection)
    .doc(id)
    .update(item)
    .catch(error => console.error(error))
    .then(() => {
      console.log("updated!")
    })
}
export const getItems = async (collection: string) => {
  let newItems = []
  await firestore()
    .collection(collection)
    .get()
    .then(items => {
      items.forEach(item => {
        newItems.push({ id: item.id, item: item.data() })
      })
    })
  return newItems
}
export const firebaseSnapShot = async (props: SnapShotProps) => {
  const ref = firestore().collection(props.Type)
  ref.onSnapshot(items => {
    let newItems = []
    items.forEach(item => {
      newItems.push({ id: item.id, item: item.data() })
    })
    props.RefreshHandler(newItems)
  })
}

const fb_addItem = addItem
const fb_updateItem = updateItem
const fb_deleteItem = deleteItem

export const firebaseFuncs = <T extends {}>(refreshItems, collection) => ({
  async addItem(newItem: T) {
    await fb_addItem(newItem, collection)
  },

  async updateItem(id, newItem) {
    await fb_updateItem(id, newItem, collection)
  },

  async deleteItem(id) {
    await fb_deleteItem(id, collection)
  },

  async getItems() {
    firebaseSnapShot({ Type: collection, RefreshHandler: refreshItems })
  },
})
