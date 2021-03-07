import { Alert } from "react-native"

const ConfirmDeleteDay = (dayString, onConfirm) => {
  Alert.alert(
    ``,
    `Сигурен ли си, че искаш да изтриеш този ден (${dayString})?`,
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
  ConfirmDeleteDay: ConfirmDeleteDay,
}
