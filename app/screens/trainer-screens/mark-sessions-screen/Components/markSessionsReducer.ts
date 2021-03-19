import React from "react"
import { Dispatch, useReducer } from "react"
import { Alerts } from "./alerts"
import {
  T_card,
  T_client_short,
  DEFAULT_SESSION,
  T_session,
  CARDS_COLLECTION,
} from "../../../../components3"
import * as cardFuncs from "../../../admin-screens/ManageCardsScreen/Components/functions/functions"
import * as dateHelper from "../../../../global-helper/global-date-helper/global-date-helper"

import { randomString } from "../../../../components3"
import firestore from "@react-native-firebase/firestore"

export type T_cardClientPair = {
  currentCardID: string
  inactiveCardIDs: string[]
  activeCardIDs: string[]
  clientID: string
}

export type T_State_MarkSessions = {
  cards: T_card[]
  clients: T_client_short[]
  cardsToUpdate: string[]
  cardClientPairs: T_cardClientPair[]
  trainerID: string
  showMarkSessions: boolean
  showCards: boolean
  selectedClientID: string
  currentDate: number
}

export type T_Action_MarkSessions =
  | { type: "load cards"; value: T_card[]; trainerID: string }
  | {
      type: "mark sessions" | "unmark sessions"
      value: number
      pair: T_cardClientPair
      pairIndex: number
    }
  | { type: "save sessions" }
  | { type: "click client name"; value: string }
  | { type: "close card view" }
  | { type: "make card current"; cardID: string }
  | { type: "change date +1 day" | "change date -1 day" | "make date today" }
export type T_Reducer_MarkSessions = React.Reducer<T_State_MarkSessions, T_Action_MarkSessions>

export const useSessionsState = () => {
  const [state, dispatch] = useReducer<T_Reducer_MarkSessions>(markSessionsReducer, {
    cards: [],
    clients: [],
    cardsToUpdate: [],
    cardClientPairs: [],
    trainerID: "",
    showCards: false,
    showMarkSessions: true,
    selectedClientID: "",
    currentDate: dateHelper.return_todays_datestamp(),
  })

  return [state, dispatch] as const
}

export const markSessionsReducer: T_Reducer_MarkSessions = (
  state: T_State_MarkSessions,
  action: T_Action_MarkSessions,
) => {
  switch (action.type) {
    case "load cards": {
      state.cards = [...action.value]
      state.trainerID = action.trainerID
      state.clients = []
      state.cardsToUpdate = []

      action.value.forEach(card => {
        card.clients.forEach(client => {
          if (!state.clients.find(_client => _client.ID === client.ID)) {
            state.clients.push(client)
          }
        })
      })
      state.cardClientPairs = getCardClientPairs(state.cards, state.clients)
      break
    }

    case "mark sessions": {
      const { pair, pairIndex } = action
      let session: T_session = {
        ...DEFAULT_SESSION,
        sessionID: randomString(15),
        clientID: action.pair.clientID,
        doneOn: action.value,
        isCompleted: true,
        trainerID: state.trainerID,
        client: getClient(action.pair.clientID, state),
        trainer: getTrainer(state),
      }

      //try marking current card first
      let cardIDtoMark
      const currentCardSessions = cardSessionsLeft(pair.currentCardID, state)
      if (currentCardSessions > 0 || pair.activeCardIDs.length === 1) {
        cardIDtoMark = pair.currentCardID
        console.log("marked current")

        if (currentCardSessions <= 0) session.isPaid = false

        //delete this block if including green one at bottom
        const cardIndex = state.cards.findIndex(card => card.cardID === cardIDtoMark)
        state.cards[cardIndex].sessions.push({ ...session })

        //starting to save instantly
        // if (!state.cardsToUpdate.includes(cardIDtoMark)) state.cardsToUpdate.push(cardIDtoMark)
        saveCard(cardIDtoMark, state)

        //check if there are completed cards so we can make them incative
        pair.activeCardIDs.forEach(activeCardID => {
          if (activeCardID !== pair.currentCardID && !hasSessionsLeft(activeCardID, state)) {
            const makeInactivecardIndex = state.cards.findIndex(
              card => card.cardID === activeCardID,
            )
            state.cards[makeInactivecardIndex].isActive = false
            saveCard(state.cards[makeInactivecardIndex].cardID, state)
            state.cardClientPairs[pairIndex].activeCardIDs = state.cardClientPairs[
              pairIndex
            ].activeCardIDs.filter(cardID => cardID !== activeCardID)
            state.cardClientPairs[pairIndex].inactiveCardIDs.push(activeCardID)
            console.log("made card inactive")
          }
        })
      }
      //if current card doesn't have more sessions left and there are other active cards
      else {
        Alerts.ChangeCard()

        //засега го изключваме. ако го включим => горе да изтрием втората част и да добавим тази най-долу

        // let foundActiveCardID
        // pair.activeCardIDs.forEach(cardID => {
        //   if (!foundActiveCardID && cardID !== pair.currentCardID)
        //     if (hasSessionsLeft(cardID, state)) foundActiveCardID = cardID
        //   cardIDtoMark = foundActiveCardID
        // })
      }

      // const cardIndex = state.cards.findIndex(card => card.cardID === cardIDtoMark)
      // state.cards[cardIndex].sessions.push({ ...session })
      // if (!state.cardsToUpdate.includes(cardIDtoMark)) state.cardsToUpdate.push(cardIDtoMark)

      // state.cardClientPairs[pairIndex].currentCardID = cardIDtoMark

      break
    }
    case "unmark sessions": {
      const { pair } = action
      const cardIndex = state.cards.findIndex(card => card.cardID === pair.currentCardID)
      let sessionsLength = state.cards[cardIndex].sessions.length

      let isWrongTrainer: string = null //checking for if we are trying to unmark session by another trainer
      state.cards[cardIndex].sessions.forEach(session => {
        if (
          pair.clientID === session.clientID &&
          dateHelper.compareDates(session.doneOn, action.value)
        )
          if (session.trainerID !== state.trainerID) isWrongTrainer = session.trainer.Name
      })

      if (!isWrongTrainer) {
        state.cards[cardIndex].sessions = [
          ...state.cards[cardIndex].sessions.filter(
            _session =>
              !(
                dateHelper.compareDates(_session.doneOn, action.value) &&
                _session.clientID === pair.clientID
              ),
          ),
        ]
      } else Alerts.WrongTrainer(isWrongTrainer)

      // if (sessionsLength === state.cards[cardIndex].sessions.length) Alerts.ChangeCard()
      // else if (!state.cardsToUpdate.includes(pair.currentCardID))
      //   state.cardsToUpdate.push(pair.currentCardID)
      saveCard(pair.currentCardID, state)

      break
    }

    case "save sessions": {
      state.cardsToUpdate.forEach(cardID => {
        cardFuncs.updateCard(getCard(cardID, state))
      })
      break
    }

    case "click client name": {
      state.selectedClientID = action.value
      state.showCards = true
      state.showMarkSessions = false
      break
    }

    case "close card view": {
      state.showCards = false
      state.showMarkSessions = true
      break
    }

    case "make card current": {
      const pairIndex = state.cardClientPairs.findIndex(
        pair => pair.clientID === state.selectedClientID,
      )
      state.cardClientPairs[pairIndex].currentCardID = action.cardID
      //if we want to activate an 'inactive' card
      if (
        state.cardClientPairs[pairIndex].inactiveCardIDs.find(
          inactiveCardID => inactiveCardID === action.cardID,
        )
      ) {
        state.cardClientPairs[pairIndex].inactiveCardIDs = state.cardClientPairs[
          pairIndex
        ].inactiveCardIDs.filter(_cardID => _cardID !== action.cardID)
        state.cardClientPairs[pairIndex].activeCardIDs.push(action.cardID)
        const inactiveCardIndex = state.cards.findIndex(card => card.cardID === action.cardID)
        state.cards[inactiveCardIndex].isActive = true
        saveCard(action.cardID, state)
      }

      break
    }

    case "change date +1 day": {
      //for testing
      state.currentDate = dateHelper.addDaysFromDateStamp(state.currentDate, 1)
      break
    }
    case "change date -1 day": {
      //for testing
      state.currentDate = dateHelper.subtractDaysFromDateStamp(state.currentDate, 1)
      break
    }

    case "make date today": {
      state.currentDate = dateHelper.return_todays_datestamp()
      break
    }

    default: {
      console.error("invalid action in mark sessions reducer, ", action)
      break
    }
  }
  return afterBreak(state)
}
function afterBreak(state) {
  return { ...state }
}

export const ReducerLoadCards = (trainerID: string, dispatch: Dispatch<T_Action_MarkSessions>) => {
  const onDownload = (cards: T_card[]) => {
    dispatch({ type: "load cards", value: cards, trainerID: trainerID })
  }

  cardFuncs.getTrainerCards(trainerID, onDownload)
}

const getCardClientPairs = (cards: T_card[], clients: T_client_short[]) => {
  const pairs: T_cardClientPair[] = []
  clients.forEach((client, pairIndex) => {
    const cards_arrangement = getThisClientCards(cards, client.ID)

    const newPairItem: T_cardClientPair = {
      clientID: client.ID,
      activeCardIDs: cards_arrangement.activeCards,
      inactiveCardIDs: cards_arrangement.inactiveCards,
      currentCardID: cards_arrangement.currentCardID,
    }
    pairs.push(newPairItem)
  })
  return pairs
}

const getThisClientCards = (cards: T_card[], clientID: string) => {
  const this_client_active_cards: string[] = []
  const this_client_inactive_cards: string[] = []
  cards.forEach(card => {
    if (card.clientIDs.includes(clientID))
      if (card.isActive) this_client_active_cards.push(card.cardID)
      else this_client_inactive_cards.push(card.cardID)
  })

  //to fix
  return {
    activeCards: this_client_active_cards,
    inactiveCards: this_client_inactive_cards,
    currentCardID: this_client_active_cards[0] || null,
  }
}

export const getClient = (clientID: string, state: T_State_MarkSessions) => {
  return state.clients.find(client => client.ID === clientID)
}

export const getTrainer = (state: T_State_MarkSessions) => {
  const card = state.cards.find(card => card.trainerIDs.includes(state.trainerID))
  return card.trainers.find(trainer => trainer.ID === state.trainerID)
}

export const getCard = (cardID: string, state: T_State_MarkSessions) => {
  return state.cards.find(card => card.cardID === cardID)
}

const hasSessionsLeft = (cardID: string, state: T_State_MarkSessions) => {
  const card = getCard(cardID, state)
  if (card.cardType.sessions_limit - card.sessions.length > 0) return true
  else return false
}

const cardSessionsLeft = (cardID: string, state: T_State_MarkSessions) => {
  const card = getCard(cardID, state)
  return card.cardType.sessions_limit - card.sessions.length
}

const saveCard = (cardID: string, state: T_State_MarkSessions) => {
  const card = state.cards.find(_card => _card.cardID === cardID)
  if (card)
    firestore()
      .collection(CARDS_COLLECTION)
      .doc(card.cardID)
      .update(card)
}
