import { Alert } from "react-native"

const ConfirmDelete = (card, onConfirm) => {
  Alert.alert(
    `Внимание! `,
    `Сигурен ли си, че искаш да изтриеш тази карта? Не може да се възстанови след това! ${JSON.stringify(
      card,
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

const Has_Unpaid_Sessions = unPaidSessionsNumber => {
  Alert.alert(
    `Внимание! `,
    `Този клиент има друга карта с неплатени тренировки, преместихме ${unPaidSessionsNumber} тренировки от нея в тази`,
    [
      {
        text: "Добре",
        // style: 'cancel',
      },
    ],
    { cancelable: true },
  )
}

export const Alerts = {
  ConfirmDelete: ConfirmDelete,
  Has_Unpaid_Sessions: Has_Unpaid_Sessions,
}
