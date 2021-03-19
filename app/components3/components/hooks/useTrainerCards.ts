import React, { useEffect, useState } from "react"
import { useGlobalState, CARDS_COLLECTION, T_session } from "../../../components3"
import firestore from "@react-native-firebase/firestore"
import { T_card } from "../../types"

export const useTrainerSessions = onUpdate => {
  const [globalState, setGlobalState] = useGlobalState()
  useLoggedTrainerCards((cards: T_card[]) => {
    const newSessions = []
    cards.forEach(card => {
      card.sessions.forEach(session => {
        if (session.trainerID === globalState.loggedUser.ID) newSessions.push(session)
      })
    })
    onUpdate(newSessions)
  })
}

export const useLoggedTrainerCards = onUpdate => {
  let mounted
  const [globalState, setGlobalState] = useGlobalState()

  useEffect(() => {
    let subscriber
    mounted = true
    const handleChange = newCards => {
      if (mounted) {
        console.log("refreshed cards")
        onUpdate(newCards)
      }
    }
    if (globalState.loggedUser.ID) {
      subscriber = firestore()
        .collection(CARDS_COLLECTION)
        .where("trainerIDs", "array-contains", globalState.loggedUser.ID)
        .onSnapshot(query => {
          const downloadedCards = []
          query.forEach(doc => {
            downloadedCards.push(doc.data())
          })
          handleChange(downloadedCards)
        })
    }
    return () => {
      mounted = false
      if (subscriber) {
        subscriber()
        console.log("unsubscriber")
      }
    }
  }, [globalState.loggedUser.ID])
}
