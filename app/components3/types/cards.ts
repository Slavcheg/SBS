import { T_client_short } from "./clients"
import firestore from "@react-native-firebase/firestore"
import _ from "lodash"

type timestamp = any

type T_cardVariants = "visits" | "monthly"

type T_transaction = {
  price: number
  transactionID: ""
}

export type T_session_types = "live at gym" | "live viber" | "alone with online coach"

export type T_session = {
  sessionID: string
  type: T_session_types
  isCompleted: boolean
  doneOn: number
  trainerID: string
  clientID: string
  gymID: string
  isPaid: boolean
  client: T_client_short
  trainer: T_client_short
}

export const DEFAULT_SESSION: T_session = {
  sessionID: "",
  type: "live at gym",
  clientID: null,
  trainerID: null,
  doneOn: null,
  isCompleted: false,
  gymID: null,
  isPaid: true,
  client: null,
  trainer: null,
}

type T_cardType = {
  sessions_limit: number
  monthly_limit: number
  price: number
  pricePerSession: number
  title: string
  variant: T_cardVariants
}

export type T_card = {
  cardType: T_cardType
  datestampPayment: timestamp
  datestampStart: timestamp
  datestampCreated: timestamp
  transaction: T_transaction
  brandID: string
  cardID: string
  clientIDs: string[]
  trainerIDs: string[]
  clients: T_client_short[]
  trainers: T_client_short[]
  comments: string
  sessions: T_session[]
  isActive: boolean
}

const DEFAULT_CARD_TYPE: T_cardType = {
  sessions_limit: null,
  monthly_limit: null,
  price: null,
  pricePerSession: null,
  title: null,
  variant: "visits",
}

const DEFAULT_TRANSACTION: T_transaction = {
  price: null,
  transactionID: null,
}

export const DEFAULT_CARD: T_card = {
  brandID: "Strong_By_Science_ID",
  cardID: "",
  clientIDs: [],
  trainerIDs: [],
  clients: [],
  trainers: [],
  sessions: [],
  datestampPayment: null,
  datestampStart: null,
  datestampCreated: null,
  cardType: _.cloneDeep(DEFAULT_CARD_TYPE),
  transaction: _.cloneDeep(DEFAULT_TRANSACTION),
  comments: "",
  isActive: true,
}

export type cardModel = T_card
export type cardType = T_cardType
export type cardVariants = T_cardVariants
