import React from "react"
import { View, FlatList } from "react-native"
import { Text, GetSomeNumber, colors, T_measurement, Button, icons } from "../../../../../components3"
import _ from "lodash"
import { errors } from "./errors"
import { getSkinfoldResults } from "./smallFunctions"
import { EditBasicMeasurementProps } from "./EditMeasurements"
import { FatEvalRow } from "./FatEvalRow"

const FOLD_NAME_TRANSLATION = {
  TRI: "Трицепс",
  PEC: "Гърди",
  MID: "Mid axilliary",
  SUB: "Гръб",
  ABD: "Корем",
  SUP: "Супраилиачна",
  QUAD: "Бедро",
}

export const SkinFoldMeasures: React.FC<EditBasicMeasurementProps> = props => {
  const { state, measurement, dispatch } = props

  const folds = measurement.folds

  const onChangeFold = (foldIndex, newVal) => {
    let newFolds = [...folds]
    newFolds[foldIndex].Value = newVal
    const newMeas: T_measurement = { ...measurement, folds: [...newFolds] }
    dispatch({ type: "update measurement", value: newMeas })
  }
  const error = errors.folds(measurement, state.editedDoc)
  const results = getSkinfoldResults(measurement, state.editedDoc)

  return (
    <View>
      <FlatList
        data={folds}
        keyExtractor={(fold, index) => `${index}`}
        numColumns={4}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          return (
            <GetSomeNumber
              key={`${index}`}
              value={`${item.Value || ""}`}
              label={FOLD_NAME_TRANSLATION[item.Name]}
              onChangeText={text => onChangeFold(index, text)}
              style={{ flex: 1 }}
            />
          )
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text>Резултати</Text>
          {error && (
            <View>
              <Text style={{ color: colors.red }}>{error}</Text>
            </View>
          )}

          {!error && (
            <View>
              <Text>{`Мазнини ${results.fatPercent}%`}</Text>
              <Text>{`Мазнини ${results.fatWeight} кг`}</Text>
              <Text>{`Чисто тегло ${results.leanWeight} кг`}</Text>
              <FatEvalRow person={{ sex: state.editedDoc.sex, age: measurement.age, fatPercent: results.fatPercent }} />
            </View>
          )}
        </View>
        <View>
          <Button
            icon={icons.trash}
            color={colors.red}
            onPress={() => dispatch({ type: "delete some measures from one mesurement", value: "folds" })}
          >
            гънки
          </Button>
        </View>
      </View>
    </View>
  )
}
