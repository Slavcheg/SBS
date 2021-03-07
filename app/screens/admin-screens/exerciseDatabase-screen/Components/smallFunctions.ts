import { Alert } from "react-native"
import firestore, { firebase } from "@react-native-firebase/firestore"
import { Alerts } from "./index"

export const deleteOneExerciseForever = (exercise, deletedExercisesCollection, onDelete = null) => {
  firestore()
    .collection(deletedExercisesCollection)
    .doc("deletedExercises")
    .get()
    .then(docRef => {
      const allDeletedExercises = docRef.data().exercises
      const filteredDeletedExercises = allDeletedExercises.filter(ex => ex.ID !== exercise.ID)
      const newDeletedDoc = { exercises: [...filteredDeletedExercises] }
      firestore()
        .collection(deletedExercisesCollection)
        .doc("deletedExercises")
        .update(newDeletedDoc)
        .then(() => (onDelete ? onDelete() : console.log("delete success, no callback function")))
    })
}

export const recoverOneDeletedExercise = (
  exercise,
  collection,
  deletedExercisesCollection,
  onRecover = null,
) => {
  const muscleGroupName = exercise.MainMuscleGroup

  const onCollectionFound = (docRef, deletedDocRef) => {
    const allDeletedExercises = deletedDocRef.data().exercises
    const filteredDeletedExercises = allDeletedExercises.filter(ex => ex.ID !== exercise.ID)
    const newDeletedExercisesDoc = { exercises: filteredDeletedExercises }
    const oldExercises = docRef.exists ? docRef.data().exercises : []
    oldExercises.push(exercise)
    const newOldExercisesDoc = { exercises: [...oldExercises] }

    firestore()
      .collection(deletedExercisesCollection)
      .doc("deletedExercises")
      .update(newDeletedExercisesDoc)
      .then(() => {
        firestore()
          .collection(collection)
          .doc(muscleGroupName)
          .update(newOldExercisesDoc)
          .then(() => (onRecover ? onRecover() : console.log("recovered 1 exercise successfully")))
      })
  }

  firestore()
    .collection(collection)
    .doc(muscleGroupName)
    .get()
    .then(docRef => {
      if (docRef.exists)
        firestore()
          .collection(deletedExercisesCollection)
          .doc("deletedExercises")
          .get()
          .then(deletedDocRef => {
            onCollectionFound(docRef, deletedDocRef)
          })
    })
}

export const deleteOneExercise = (
  exercise,
  collection,
  deletedExercisesCollection,
  onDelete = null,
) => {
  // firestore().collection(collection).doc(exercise.MainMuscleGroup)
  const muscleGroupName = exercise.MainMuscleGroup

  const onCollectionFound = (docRef, deletedDocRef) => {
    const allOldExercises = docRef.data().exercises
    const filteredOldExercises = allOldExercises.filter(ex => ex.ID !== exercise.ID)
    const newDoc = { exercises: filteredOldExercises }
    const deletedExercises = deletedDocRef.exists ? deletedDocRef.data().exercises : []
    deletedExercises.push(exercise)
    const newDeletedDoc = { exercises: [...deletedExercises] }

    firestore()
      .collection(deletedExercisesCollection)
      .doc("deletedExercises")
      .update(newDeletedDoc)
      .then(() => {
        firestore()
          .collection(collection)
          .doc(muscleGroupName)
          .update(newDoc)
          .then(() => (onDelete ? onDelete() : console.log("deleted 1 exercise successfully")))
      })
  }

  const onConfirmDelete = () => {
    firestore()
      .collection(collection)
      .doc(muscleGroupName)
      .get()
      .then(docRef => {
        firestore()
          .collection(deletedExercisesCollection)
          .doc("deletedExercises")
          .get()
          .then(deletedDocRef => {
            onCollectionFound(docRef, deletedDocRef)
          })
      })
  }

  Alerts.ConfirmDelete(exercise, onConfirmDelete)
}

export const updateOneExercise = (newExercise, collection, onUpdate = null) => {
  const ERROR_NOT_FOUND = "item not found"
  const SUCCESS = "success"
  const SUCCESS_ADDED_NEW = "success, added new exercise"
  const NO_ERRORS_YET = "no errors yet"
  let returnMessage = NO_ERRORS_YET
  const muscleGroupName = newExercise.MainMuscleGroup

  const onCollectionNotFound = () => {
    const onConfirmAdd = () => {
      const newDoc = { exercises: [newExercise] }
      firestore()
        .collection(collection)
        .doc(muscleGroupName)
        .set(newDoc)
        .then(() => {
          onUpdate ? onUpdate() : console.log("no update funct")
          console.log("new group and new exercise added successfully")
        })
    }

    Alerts.AddNewExerciseGroup(newExercise, onConfirmAdd)
  }

  const onCollectionFound = docRef => {
    const allOldExercises = docRef.data().exercises
    const filteredOldExercises = allOldExercises.filter(ex => ex.ID !== newExercise.ID)
    if (allOldExercises.length === filteredOldExercises.length) returnMessage = ERROR_NOT_FOUND
    const updatedExercisesArray = [...filteredOldExercises, newExercise]
    const newDoc = { exercises: updatedExercisesArray }
    console.log("new exercise: ", newExercise)
    console.log("old array length: ", filteredOldExercises.length)

    if (returnMessage === NO_ERRORS_YET) {
      firestore()
        .collection(collection)
        .doc(muscleGroupName)
        .update(newDoc)
        .then(() => {
          returnMessage = SUCCESS
          onUpdate ? onUpdate() : console.log("no update funct")
          console.log("successfully updated exercise: ", newExercise)
        })
    } else if (returnMessage === ERROR_NOT_FOUND) {
      const onConfirmAddNew = () => {
        firestore()
          .collection(collection)
          .doc(muscleGroupName)
          .update(newDoc)
          .then(() => {
            returnMessage = SUCCESS_ADDED_NEW
            onUpdate ? onUpdate() : console.log("no update funct")
            console.log("successfully added new exercise: ", newExercise)
          })
      }
      Alerts.AddNewExercise(newExercise, onConfirmAddNew)
    } else console.log(returnMessage)
  }

  firestore()
    .collection(collection)
    .doc(muscleGroupName)
    .get()
    .then(docRef => {
      if (!docRef.exists) onCollectionNotFound()
      else onCollectionFound(docRef)
    })
}
