import firestore from "@react-native-firebase/firestore"
import { useEffect } from "react"

import {
  EXERCISES_GLOBAL_COLLECTION,
  EXERCISES_PERSONAL_COLLECTION,
  T_Exercise_In_Database,
  randomString,
} from "../../../../components3"

export const getGlobalExercises = (loggedUserID: string, onDownload) => {
  firestore()
    .collection(EXERCISES_GLOBAL_COLLECTION)
    .get()
    .then(docsRef => {
      let exercises: T_Exercise_In_Database[] = []
      docsRef.docs.forEach(doc => {
        const exercisesInDoc: T_Exercise_In_Database[] = doc.data().exercises
        exercises = [...exercises, ...exercisesInDoc]
      })
      onDownload(exercises)
    })
}

export const getPersonalExercises = (loggedUserID: string, onDownload) => {
  if (loggedUserID)
    firestore()
      .collection(EXERCISES_PERSONAL_COLLECTION)
      .doc(loggedUserID)
      .get()
      .then(docsRef => {
        const personalExercises: T_Exercise_In_Database[] = docsRef.exists ? [...docsRef.data().exercises] : []
        onDownload(personalExercises)
      })
}

export const deleteOnePersonalExercise = (loggedUserID: string, exercise: T_Exercise_In_Database, onDelete = null) => {
  if (loggedUserID) {
    firestore()
      .collection(EXERCISES_PERSONAL_COLLECTION)
      .doc(loggedUserID)
      .get()
      .then(docRef => {
        const oldExercises: T_Exercise_In_Database[] = docRef.data().exercises
        const newExercises: T_Exercise_In_Database[] = oldExercises.filter(ex => ex.ID !== exercise.ID)
        const newExDoc = { exercises: [...newExercises] }
        firestore()
          .collection(EXERCISES_PERSONAL_COLLECTION)
          .doc(loggedUserID)
          .update(newExDoc)
          .then(() => {
            console.log("deleted exercise")
            onDelete ? onDelete() : null
          })
      })
  }
}

export const addOnePersonalExercise = (loggedUserID: string, exercise: T_Exercise_In_Database, onAdd = null) => {
  if (loggedUserID) {
    firestore()
      .collection(EXERCISES_PERSONAL_COLLECTION)
      .doc(loggedUserID)
      .get()
      .then(docRef => {
        const oldEx = docRef.data().exercises ? docRef.data().exercises : []
        oldEx.push(exercise)
        const newDocFile = { exercises: oldEx }
        firestore()
          .collection(EXERCISES_PERSONAL_COLLECTION)
          .doc(loggedUserID)
          .update(newDocFile)
      })
  }
}
export const updateOnePersonalExercise = (loggedUserID: string, exercise: T_Exercise_In_Database, onUpdate = null) => {
  if (loggedUserID) {
    firestore()
      .collection(EXERCISES_PERSONAL_COLLECTION)
      .doc(loggedUserID)
      .get()
      .then(docRef => {
        let oldEx: T_Exercise_In_Database[] = docRef.data().exercises ? docRef.data().exercises : []
        const foundIndex: number = oldEx.findIndex(ex => ex.ID === exercise.ID)
        oldEx[foundIndex] = { ...exercise }
        const newDocFile = { exercises: oldEx }
        firestore()
          .collection(EXERCISES_PERSONAL_COLLECTION)
          .doc(loggedUserID)
          .update(newDocFile)
          .then(() => {
            console.log("updated exercise")
            onUpdate ? onUpdate() : null
          })
      })
  }
}

export const getNewExerciseID = (allExercises: T_Exercise_In_Database[]) => {
  let newID = randomString(10)
  let duplicateID = false
  allExercises.forEach(exercise => {
    if (exercise.ID === newID) duplicateID = true
  })
  if (duplicateID) getNewExerciseID(allExercises)
  else return newID
}
