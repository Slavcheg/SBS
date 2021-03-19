import React, { useReducer } from "react"
import {
  T_measurement,
  T_measurement_Document,
  MEASUREMENTS_COLLECTION,
  randomString,
  DEFAULT_MEASUREMENT_DOC,
  T_client_short,
  DEFAULT_MEASUREMENT_ELEMENTS,
  T_Client_Sex,
  DEFAULT_ANY_MEASUREMENT,
  T_goals,
  DEFAULT_ACTIVITY_ElEMENTS,
} from "../../../components3"

import * as dateHelper from "../../../global-helper/global-date-helper/global-date-helper"

import firestore from "@react-native-firebase/firestore"

import _ from "lodash"
import { errors } from "./Components/EditMeasurementComponents/errors"

export type T_State_Measurements = {
  measurementDocs: T_measurement_Document[]
  isEditing: boolean
  loggedTrainer: T_client_short
  editedDoc: T_measurement_Document
  editedMeasurementIndex: number
  saved: boolean
}
export type T_Dispatch_Measurements = React.Dispatch<T_Action_Measurements>
type T_Action_Measurements =
  | {
      type: "load measurements"
      value: T_measurement_Document[]
      loggedTrainer: T_client_short
    }
  | { type: "start editing client measurements"; value: string }
  | { type: "cancel editing client measurements" }
  | { type: "change client"; value: T_client_short }
  | { type: "change client sex"; value: T_Client_Sex }
  | { type: "add another measurement" }
  | { type: "delete measurement"; value: number }
  | { type: "save measurements" }
  | { type: "update measurement"; value: T_measurement }
  | { type: "choose measurement to edit"; value: number }
  | { type: "add folds" | "add tape measures" | "add activity calculation" | "stop editing specific measurement" | "add goals" }
  | {
      type: "delete some measures from one mesurement"
      value: "folds" | "tape measures" | "activity QnA" | "goals"
    }
  | { type: "change goals"; value: T_goals }
  | { type: "change activity questions answer"; questionIndex: number; newAnswerIndex: number }
export type T_Reducer_Measurements = React.Reducer<T_State_Measurements, T_Action_Measurements>

export const useMeasurementsState = () => {
  const [state, dispatch] = useReducer<T_Reducer_Measurements>(measurementsReducer, {
    measurementDocs: [],
    isEditing: false,
    loggedTrainer: null,
    editedDoc: null,
    editedMeasurementIndex: null,
    saved: true,
  })
  return [state, dispatch] as const
}

export const measurementsReducer: T_Reducer_Measurements = (state, action) => {
  const mesIndex = state.editedMeasurementIndex

  switch (action.type) {
    case "load measurements": {
      state.measurementDocs = [...action.value]
      state.loggedTrainer = action.loggedTrainer
      break
    }

    case "start editing client measurements": {
      state.editedDoc = _.cloneDeep(state.measurementDocs.find(doc => doc.docID === action.value))
      state.isEditing = true
      break
    }

    case "cancel editing client measurements": {
      state = getExitLocation(state)
      break
    }

    case "change client": {
      const newClient: T_client_short = { ...action.value }
      state.editedDoc.client = newClient
      state.editedDoc.clientID = newClient.ID
      break
    }

    case "change client sex": {
      state.editedDoc.sex = action.value
      break
    }

    case "add another measurement": {
      const newMeasurement: T_measurement = {
        ...DEFAULT_ANY_MEASUREMENT,
        trainer: state.loggedTrainer,
        dateStamp: dateHelper.return_todays_datestamp(),
        measurementID: randomString(15),
      }
      state.editedDoc.measurements.push(newMeasurement)
      state.editedMeasurementIndex = state.editedDoc.measurements.length - 1

      break
    }

    case "save measurements": {
      firestore()
        .collection(MEASUREMENTS_COLLECTION)
        .doc(state.editedDoc.docID)
        .update(state.editedDoc)
        .then(() => console.log("saved "))
        .catch(err => console.error(err))

      // state = getExitLocation(state)
      state.saved = true
      break
    }

    case "delete measurement": {
      state.editedDoc.measurements = state.editedDoc.measurements.filter((mes, index) => index !== action.value)
      state.editedMeasurementIndex = null
      break
    }

    case "update measurement": {
      const newMeasurement = action.value
      const mesIndex = state.editedDoc.measurements.findIndex(mes => mes.measurementID === newMeasurement.measurementID)
      state.editedDoc.measurements[mesIndex] = { ...newMeasurement }
      break
    }

    case "stop editing specific measurement": {
      state.editedMeasurementIndex = null
      break
    }

    case "choose measurement to edit": {
      // select/unselect measurement
      if (state.editedMeasurementIndex === action.value) state.editedMeasurementIndex = null
      else state.editedMeasurementIndex = action.value
      break
    }

    case "add folds": {
      state.editedDoc.measurements[mesIndex].folds = _.cloneDeep(DEFAULT_MEASUREMENT_ELEMENTS.DEFAULT_FOLDS)
      break
    }
    case "add tape measures": {
      state.editedDoc.measurements[mesIndex].tapeMeasures = _.cloneDeep(DEFAULT_MEASUREMENT_ELEMENTS.DEFAULT_TAPE_MEASURES)
      break
    }

    case "add activity calculation": {
      state.editedDoc.measurements[mesIndex].activity = DEFAULT_MEASUREMENT_ELEMENTS.DEFAULT_ACTIVITY_ElEMENTS.DEFAULT_ELEMENTS()
      break
    }

    case "change activity questions answer": {
      const Q_Index = action.questionIndex
      const A_Index = action.newAnswerIndex
      const { activity } = state.editedDoc.measurements[mesIndex]
      activity.answers[Q_Index] = A_Index
      const error = errors.activity(state.editedDoc.measurements[mesIndex], state.editedDoc)
      if (!error) activity.activityCoef = DEFAULT_ACTIVITY_ElEMENTS.getActivityCoef(activity.answers)
      state.editedDoc.measurements[mesIndex].activity = { ...activity }
      break
    }

    case "add goals": {
      state.editedDoc.measurements[mesIndex].goals = _.cloneDeep(DEFAULT_MEASUREMENT_ELEMENTS.DEFAULT_GOALS)
      break
    }

    case "delete some measures from one mesurement": {
      if (action.value === "folds") state.editedDoc.measurements[mesIndex].folds = null
      else if (action.value === "tape measures") state.editedDoc.measurements[mesIndex].tapeMeasures = null
      else if (action.value === "activity QnA") state.editedDoc.measurements[mesIndex].activity = null
      else if (action.value === "goals") state.editedDoc.measurements[mesIndex].goals = null
      break
    }

    case "change goals": {
      // let goals = action.value

      state.editedDoc.measurements[mesIndex].goals = action.value
      break
    }

    default: {
      console.error("invalid action in measurements reducer, ", action)
      break
    }
  }
  switch (action.type) {
    case "change client":
    case "change client sex":
    case "delete measurement":
    case "update measurement":
    case "delete some measures from one mesurement":
    case "change activity questions answer":
    case "change goals": {
      state.saved = false
      break
    }
  }
  return { ...state }
}

export const addNewMeasurementDocument = async (state: T_State_Measurements) => {
  const newDocument: T_measurement_Document = {
    ..._.cloneDeep(DEFAULT_MEASUREMENT_DOC),
    trainerIDs: [state.loggedTrainer.ID],
    measurements: [],
  }

  const newDocRef = await firestore()
    .collection(MEASUREMENTS_COLLECTION)
    .add(newDocument)
    .catch(err => {
      console.error(err)
      return null
    })

  const updatedDoc: T_measurement_Document = { ...newDocument, docID: newDocRef.id }
  firestore()
    .collection(MEASUREMENTS_COLLECTION)
    .doc(updatedDoc.docID)
    .update(updatedDoc)
    .catch(err => console.error(err))
}

const getExitLocation = (state: T_State_Measurements) => {
  let newState = state
  //if we are editing a specific measurement - stop that only.
  // if (state.editedMeasurementIndex !== null) newState.editedMeasurementIndex = null
  // If we are looking at all client measurements => exit client's measurements' list

  //scratch top one, just go back entirely

  newState.editedDoc = null
  newState.isEditing = false
  newState.editedMeasurementIndex = null
  newState.saved = true

  return newState
}
