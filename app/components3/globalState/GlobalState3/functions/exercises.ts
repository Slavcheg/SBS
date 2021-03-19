import firestore from "@react-native-firebase/firestore"
import { useEffect } from "react"

import { EXERCISES_GLOBAL_COLLECTION, EXERCISES_PERSONAL_COLLECTION, T_Exercise_In_Database } from "../../../../components3"

export const getGlobalExercises = (loggedUser, onDownload) => {
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

export const getPersonalExercises = (loggedUser, onDownload) => {
  if (loggedUser)
    firestore()
      .collection(EXERCISES_PERSONAL_COLLECTION)
      .doc(loggedUser.ID)
      .get()
      .then(docsRef => {
        const personalExercises: T_Exercise_In_Database[] = docsRef.exists ? [...docsRef.data().exercises] : []
        onDownload(personalExercises)
      })
}
