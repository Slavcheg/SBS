import firestore from "@react-native-firebase/firestore"
import * as dateHelper from "../../../../../global-helper/global-date-helper/global-date-helper"

import {
  CARDS_COLLECTION,
  cardModel,
  T_client_full,
  T_client_short,
  CLIENTS_COLLECTION,
} from "../../../../../components3"

export const getTrainerCards = async (trainerID, onDownloadCards) => {
  firestore()
    .collection(CARDS_COLLECTION)
    .where("trainerIDs", "array-contains", trainerID)
    .get()
    .then(query => {
      const downloadedCards = []
      query.forEach(doc => {
        downloadedCards.push(doc.data())
      })
      onDownloadCards(downloadedCards)
    })
}

export const getCards = async onDownloadCards => {
  const subscriber = await firestore()
    .collection(CARDS_COLLECTION)
    .get()
    .then(query => {
      const downloadedCards = []
      query.forEach(doc => {
        downloadedCards.push(doc.data())
      })
      onDownloadCards(downloadedCards)
    })
}

const getShortClient = (fullClient: T_client_full) => {
  const shortClient: T_client_short = {
    ClientNumber: fullClient.ClientNumber,
    FamilyName: fullClient.FamilyName,
    ID: fullClient.ID,
    Name: fullClient.Name,
  }
  return shortClient
}

const getClients = async onDownloadClients => {
  await firestore()
    .collection(CLIENTS_COLLECTION)
    .get()
    .then(query => {
      const downloadedClients = []
      query.forEach(clientDoc => {
        downloadedClients.push(getShortClient(clientDoc.data()))
      })
      onDownloadClients(downloadedClients)
    })
}

export const addNewCard = async (card: cardModel, onAdd: any) => {
  const newCardRef = await firestore()
    .collection(CARDS_COLLECTION)
    .add(card)
  const timeStamp = dateHelper.return_todays_datestamp()
  const updatedCard: cardModel = { ...card, cardID: newCardRef.id, datestampCreated: timeStamp }
  onAdd(updatedCard)
  firestore()
    .collection(CARDS_COLLECTION)
    .doc(updatedCard.cardID)
    .update(updatedCard)
    .then(cardRef2 => console.log("update successful"))
    .catch(err => console.error(err))
}

export const deleteCard = async (card: cardModel, onDelete?: any) => {
  await firestore()
    .collection(CARDS_COLLECTION)
    .doc(card.cardID)
    .delete()
    .catch(err => console.error(err))
    .then(() => {
      console.log("delete successful")
      if (onDelete) onDelete(card)
    })
}

export const updateCard = async (card: cardModel, onUpdate?: any) => {
  await firestore()
    .collection(CARDS_COLLECTION)
    .doc(card.cardID)
    .update(card)
    .catch(err => console.error(err))
    .then(() => {
      console.log("update successful")
      if (onUpdate) onUpdate()
    })
}

export const functions = {
  deleteCard: deleteCard,
  addNewCard: addNewCard,
  getCards: getCards,
  updateCard: updateCard,
  getClients: getClients,
}
