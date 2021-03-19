import {
  DEFAULT_CARD,
  cardModel,
  T_client_short,
  T_card,
  randomString,
} from "../../../../components3"

import { Dispatch, useReducer } from "react"
import { functions } from "./functions/functions"
import { Alerts } from "./alerts"
import _ from "lodash"

export type useCardStateType = typeof useCardState
export type cardManagementStateType = {
  card: cardModel
  isEditingCard: boolean
  downloadedCards: cardModel[]
  downloadedClients: T_client_short[]
  filteredCards: cardModel[]
  otherCardsToUpdate: string[]
  refreshString: string
}

export const useCardState = () => {
  const [editableCard, setEditableCard] = useReducer<cardStateUseReducer>(EditCardsReducer, {
    card: _.cloneDeep(DEFAULT_CARD),
    isEditingCard: false,
    downloadedCards: [],
    downloadedClients: [],
    filteredCards: [],
    otherCardsToUpdate: [],
    refreshString: "",
  })
  return [editableCard, setEditableCard] as const
}

export type cardStateUseReducer = React.Reducer<cardManagementStateType, Action>

export type Action =
  | { type: "change card variant"; value: typeof DEFAULT_CARD.cardType.variant }
  | { type: "make card null" | "isEditingCardValue" }
  | { type: "load cards"; value: cardModel[] }
  | { type: "load clients"; value: T_client_short[] }
  | {
      type:
        | "change card price"
        | "change card price per session"
        | "change card title"
        | "change card sessions limit"
        | "change card monthly limit"
      value: number | string
    }
  | { type: "choose a different card"; value: cardModel }
  | { type: "change comments"; value: string }
  | { type: "save card"; value: cardModel }
  | { type: "add client" | "add trainer"; value: T_client_short }
  | { type: "remove client" | "remove trainer"; value: string }
  | { type: "add new card"; value: cardModel }
  | { type: "remove card"; value: cardModel }
  | { type: "filter cards"; value: cardModel[] }
export const EditCardsReducer: cardStateUseReducer = (
  state: cardManagementStateType,
  action: Action,
) => {
  const { card } = state

  switch (action.type) {
    case "add new card": {
      state.downloadedCards.push(action.value)
      state.filteredCards = [...state.downloadedCards]
      break
    }
    case "remove card": {
      state.downloadedCards = state.downloadedCards.filter(
        card => card.cardID !== action.value.cardID,
      )
      state.filteredCards = [...state.downloadedCards]
      break
    }

    case "change card price": {
      card.cardType.price = parseFloat(`${action.value}`)
      if (card.cardType.sessions_limit)
        card.cardType.pricePerSession = parseFloat(
          (card.cardType.price / card.cardType.sessions_limit).toFixed(2),
        )
      break
    }
    case "change card price per session": {
      card.cardType.pricePerSession = parseFloat(`${action.value}`)
      break
    }
    case "change card sessions limit": {
      card.cardType.sessions_limit = parseInt(`${action.value}`)
      if (card.cardType.price)
        card.cardType.pricePerSession = parseFloat(
          (card.cardType.price / card.cardType.sessions_limit).toFixed(2),
        )
      break
    }
    case "change card monthly limit": {
      card.cardType.pricePerSession = parseInt(`${action.value}`)
      break
    }

    case "change card title": {
      card.cardType.title = `${action.value}`
      break
    }

    case "change card variant": {
      const newValue = action.value
      card.cardType.variant = newValue
      if (newValue === "monthly") {
        card.cardType.sessions_limit = null
        card.cardType.pricePerSession = null
      }
      break
    }

    case "change comments": {
      state.card.comments = action.value
      break
    }

    case "make card null": {
      state.card = null
      state.isEditingCard = false
      if (state.otherCardsToUpdate.length > 0) {
        state.otherCardsToUpdate = []
        state.refreshString = randomString(5)
      }

      break
    }

    case "choose a different card": {
      state.card = _.cloneDeep(action.value)
      state.isEditingCard = true
      break
    }

    case "save card": {
      functions.updateCard(action.value)
      const cardIndex = state.downloadedCards.findIndex(card => card.cardID === action.value.cardID)
      state.downloadedCards[cardIndex] = { ...action.value }
      state.isEditingCard = false
      state.card = null

      //update other cards as well, if moving sessions from one to another
      state.otherCardsToUpdate.forEach(cardID => {
        const updatedCard = state.downloadedCards.find(card => card.cardID === cardID)
        functions.updateCard(
          //remove cards from 'to update' after updating
          updatedCard,
          () =>
            (state.otherCardsToUpdate = state.otherCardsToUpdate.filter(
              _cardID => _cardID !== updatedCard.cardID,
            )),
        )
      })

      break
    }

    case "isEditingCardValue": {
      state.isEditingCard = !state.isEditingCard
      break
    }

    case "load cards": {
      console.log("loaded ", action.value.length, " cards")

      state.downloadedCards = [...action.value]
      state.filteredCards = [...action.value]
      break
    }

    case "load clients": {
      console.log("loaded ", action.value.length, "  clients")
      state.downloadedClients = action.value
      break
    }

    case "add client": {
      const clientID = action.value.ID
      //add client if he isn't already added
      if (!state.card.clientIDs.find(clientID => clientID === action.value.ID)) {
        let unpaidSessions = 0 //check for unpaid sessions first

        state.downloadedCards.forEach((card, cardIndex) => {
          console.log("card", card.clientIDs)
          console.log(clientID)
          if (card.clientIDs.includes(clientID)) {
            const sessionsLimit = card.cardType.sessions_limit
            let sessionsLeft = sessionsLimit - card.sessions.length
            console.log(sessionsLeft)
            if (sessionsLeft < 0) {
              unpaidSessions += sessionsLeft * -1
              const movedSessions = state.downloadedCards[cardIndex].sessions.splice(
                sessionsLimit - 1,
                sessionsLeft * -1,
              )
              console.log(movedSessions)
              state.otherCardsToUpdate.push(card.cardID)
              state.card.sessions = [...state.card.sessions, ...movedSessions]
            }
          }
        })

        const person = state.downloadedClients.find(client => client.ID === action.value.ID)
        state.card.clientIDs.push(person.ID)
        state.card.clients.push(person)
        console.log("added client: ", action.value.Name, action.value.ClientNumber)
        if (unpaidSessions > 0) Alerts.Has_Unpaid_Sessions(unpaidSessions)
      }
      break
    }
    case "add trainer": {
      if (!state.card.trainerIDs.find(trainerID => trainerID === action.value.ID)) {
        const person = state.downloadedClients.find(client => client.ID === action.value.ID)
        state.card.trainerIDs.push(person.ID)
        state.card.trainers.push(person)
        console.log("added trainer: ", action.value.Name, action.value.ClientNumber)
      }
      break
    }

    case "remove client": {
      state.card.clientIDs = state.card.clientIDs.filter(ID => ID !== action.value)
      state.card.clients = state.card.clients.filter(client => client.ID !== action.value)
      break
    }
    case "remove trainer": {
      state.card.trainerIDs = state.card.trainerIDs.filter(ID => ID !== action.value)
      state.card.trainers = state.card.trainers.filter(client => client.ID !== action.value)
      break
    }

    case "filter cards": {
      state.filteredCards = action.value
      break
    }

    default: {
      console.error("invalid action in card reducer, ", action)
      break
    }
  }

  return afterBreak(state)
}

function afterBreak(state) {
  return { ...state }
}

export const loadCards = (dispatch: Dispatch<Action>, mounted: boolean) => {
  const onDownloadCards = (cards: cardModel[]) => {
    console.log("mounted (cards): ", mounted)
    if (mounted) {
      //if component is not mounted => do not try to update state
      dispatch({ type: "load cards", value: cards })
    }
  }
  functions.getCards(onDownloadCards)
}

export const loadClients = (dispatch: Dispatch<Action>, mounted: boolean) => {
  const onDownloadClients = (clients: T_client_short[]) => {
    console.log("mounted (load clients): ", mounted)
    if (mounted) dispatch({ type: "load clients", value: clients })
  }
  functions.getClients(onDownloadClients)
}

export const ReducerAddNewCard = (dispatch: Dispatch<Action>, mounted: boolean) => {
  const onAddNewCardInside = (newCard: cardModel) => {
    console.log("mounted (add card): ", mounted)
    if (mounted) dispatch({ type: "add new card", value: newCard })
  }
  functions.addNewCard(_.cloneDeep(DEFAULT_CARD), onAddNewCardInside)
}

export const ReducerRemoveCard = (
  card: cardModel,
  dispatch: Dispatch<Action>,
  mounted: boolean,
) => {
  const onRemoveCardInside = (removedCard: cardModel) => {
    console.log("mounted (remove card): ", mounted)
    if (mounted) dispatch({ type: "remove card", value: removedCard })
  }
  functions.deleteCard(card, onRemoveCardInside)
}
