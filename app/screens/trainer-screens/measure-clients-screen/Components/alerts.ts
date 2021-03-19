import { Alert } from "react-native"
import { T_measurement_Document, T_measurementTypes, T_measurement, dateFuncs } from "../../../../components3"

const TrainerNotFound = () => {
  Alert.alert(
    `Грешка`,
    `Треньорът не е открит`,
    [
      {
        text: "ок",
      },
    ],
    { cancelable: true },
  )
}

const ConfirmDeleteDoc = (doc: T_measurement_Document, onConfirm) => {
  Alert.alert(
    `Внимание! `,
    `Сигурен ли си, че искаш да изтриеш измерванията на този трениращ? Не може да се възстановят след това!`,
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
const ConfirmDeleteMeasurement = (measurement: T_measurement, onConfirm) => {
  Alert.alert(
    `Внимание! `,
    `Сигурен ли си, че искаш да изтриеш това измерване? Не може да се възстанови след това! ${JSON.stringify(
      dateFuncs.displayDateFromTimestampFullMonth(measurement.dateStamp),
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
const ChooseMeasurementType = (onChoose: (choice: T_measurementTypes) => any) => {
  Alert.alert(
    ` `,
    `Какъв вид измерване искаш да правиш?`,
    [
      {
        text: "Не искам, обърках се",
        style: "cancel",
      },
      {
        text: "Калипер",
        onPress: onChoose("skinfold caliper"),
      },
      {
        text: "Дневна активност!",
        onPress: onChoose("daily activity calculator"),
      },
      {
        text: "Шивашки метър!",
        onPress: onChoose("tape measure"),
      },
    ],
    { cancelable: true },
  )
}

export const Alerts = {
  TrainerNotFound: TrainerNotFound,
  ConfirmDeleteDoc: ConfirmDeleteDoc,
  ChooseMeasurementType: ChooseMeasurementType,
  ConfirmDeleteMeasurement: ConfirmDeleteMeasurement,
}
