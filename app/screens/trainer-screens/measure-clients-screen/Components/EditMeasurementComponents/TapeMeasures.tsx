import React from "react"
import { View, FlatList } from "react-native"
import { Text, GetSomeNumber, colors, Button, icons } from "../../../../../components3"
import _ from "lodash"
import { errors } from "./errors"
import { getTapeMeasureResults } from "./smallFunctions"
import { EditBasicMeasurementProps } from "./EditMeasurements"
import { FatEvalRow } from "./FatEvalRow"

export const TapeMeasures: React.FC<EditBasicMeasurementProps> = props => {
  const { measurement, state, dispatch } = props

  const onChangeMes = (mesIndex, newVal) => {
    let newTapeMeasurements = [...measurement.tapeMeasures]
    newTapeMeasurements[mesIndex].Value = newVal
    const newMes = { ...measurement, tapeMeasures: [...newTapeMeasurements] }
    dispatch({ type: "update measurement", value: newMes })
  }

  const error = errors.tapeMeasures(measurement, props.state.editedDoc)
  const showResults = measurement.folds ? false : true // only show tape measure results if no caliper folds taken
  const results = showResults ? getTapeMeasureResults(measurement, props.state.editedDoc) : null

  return (
    <View>
      <FlatList
        data={measurement.tapeMeasures}
        keyExtractor={(item, index) => `${index}`}
        numColumns={4}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          return (
            <GetSomeNumber
              key={`${index}`}
              value={`${item.Value || ""}`}
              label={item.Name}
              onChangeText={text => onChangeMes(index, text)}
            />
          )
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          {error && (
            <View>
              <Text style={{ color: colors.red }}>{error}</Text>
            </View>
          )}

          {!error && showResults && (
            <View>
              <Text>Резултати</Text>
              <Text>{`Мазнини ${results.fatPercent}%`}</Text>
              <Text>{`Мазнини ${results.fatWeight} кг`}</Text>
              <Text>{`Чисто тегло ${results.leanWeight} кг`}</Text>
            </View>
          )}
        </View>
        <View>
          <Button
            icon={icons.trash}
            color={colors.red}
            onPress={() => dispatch({ type: "delete some measures from one mesurement", value: "tape measures" })}
          >
            мерки
          </Button>
        </View>
      </View>
      {!error && showResults && (
        <FatEvalRow person={{ sex: state.editedDoc.sex, age: measurement.age, fatPercent: results.fatPercent }} />
      )}
    </View>
  )
}
