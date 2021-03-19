import { Alert } from "react-native"

const ChangeCard = () => {
  Alert.alert(
    ``,
    `Грешна карта, смени активната карта (натисни името вляво)`,
    [
      {
        text: "Не искам",
        // style: 'cancel',
      },
    ],
    { cancelable: true },
  )
}

const WrongTrainer = (trainerName: string) => {
  Alert.alert(
    ``,
    `Тази тренировка е направена от ${trainerName}`,
    [
      {
        text: "Еми добре",
      },
    ],
    { cancelable: true },
  )
}

export const Alerts = {
  ChangeCard: ChangeCard,
  WrongTrainer: WrongTrainer,
}
