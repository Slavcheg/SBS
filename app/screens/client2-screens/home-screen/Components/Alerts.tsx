import { Alert } from "react-native"

const WhatToDo = () => {
  Alert.alert(
    ``,
    `Още не сме го измислили това :(`,
    [
      {
        text: "Еми добре",
      },
    ],
    { cancelable: true },
  )
}

export const Alerts = {
  WhatToDo: WhatToDo,
}
