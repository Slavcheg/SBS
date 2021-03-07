import { Alert } from "react-native"

const AddNewExercise = (newExercise, onConfirm) => {
  Alert.alert(
    "Сигурен ли си, че искаш да добавиш ново упражнение?",
    `${JSON.stringify(newExercise)}`,
    [
      {
        text: "Не искам",
        // style: 'cancel',
      },
      {
        text: "Да!",
        onPress: onConfirm,
      },
    ],
    { cancelable: true },
  )
}

const AddNewExerciseGroup = (newExercise, onConfirm) => {
  Alert.alert(
    `Внимание`,
    `Сигурен ли си, че искаш да добавиш ново упражнение в нова група '${
      newExercise.MainMuscleGroup
    }'? \n Упражнението: ${JSON.stringify(newExercise)}`,
    [
      {
        text: "Не искам",
        // style: 'cancel',
      },
      {
        text: "Да!",
        onPress: onConfirm,
      },
    ],
    { cancelable: true },
  )
}

const ExerciseNotFound = newExercise => {
  Alert.alert(
    `Внимание`,
    `Не намерихме такова упражнение ${JSON.stringify(newExercise)}`,
    [
      {
        text: "OK",
      },
    ],
    { cancelable: true },
  )
}

const ConfirmDelete = (newExercise, onConfirm) => {
  Alert.alert(
    `Внимание`,
    `Сигурен ли си, че искаш да изтриеш това упражнение? ${JSON.stringify(newExercise)}`,
    [
      {
        text: "Не искам",
        // style: 'cancel',
      },
      {
        text: "Да!",
        onPress: onConfirm,
      },
    ],
    { cancelable: true },
  )
}

const ConfirmDeleteForever = (newExercise, onConfirm) => {
  Alert.alert(
    `Внимание!!!`,
    `Сигурен ли си, че искаш да изтриеш това упражнение завинаги? Няма да може да бъде възстановено! ${JSON.stringify(
      newExercise,
    )}`,
    [
      {
        text: "Не искам",
        // style: 'cancel',
      },
      {
        text: "Да!",
        onPress: onConfirm,
      },
    ],
    { cancelable: true },
  )
}

const ConfirmRecover = (newExercise, onConfirm) => {
  Alert.alert(
    ``,
    `Сигурен ли си, че искаш да възстановиш това упражнение? ${JSON.stringify(newExercise)}`,
    [
      {
        text: "Не искам",
        // style: 'cancel',
      },
      {
        text: "Да!",
        onPress: onConfirm,
      },
    ],
    { cancelable: true },
  )
}

export const Alerts = {
  AddNewExercise: AddNewExercise,
  AddNewExerciseGroup: AddNewExerciseGroup,
  ExerciseNotFound: ExerciseNotFound,
  ConfirmDelete: ConfirmDelete,
  ConfirmDeleteForever: ConfirmDeleteForever,
  ConfirmRecover: ConfirmRecover,
}
