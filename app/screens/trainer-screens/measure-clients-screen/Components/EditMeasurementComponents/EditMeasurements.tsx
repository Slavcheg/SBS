import React, { useEffect, useMemo, useState } from "react"
import { ScrollView, TextStyle, View } from "react-native"

import {
  Button,
  T_measurement,
  colors,
  GetSomeNumber,
  Text,
  calFormulas,
  icons,
  T_formula,
  TextInput,
  deficit_surplus,
} from "../../../../../components3"
import _ from "lodash"

import { T_State_Measurements, T_Dispatch_Measurements } from "../../MeasureClients_Reducer"

import { SkinFoldMeasures } from "./SkinFoldMeasures"
import { TapeMeasures } from "./TapeMeasures"
import { errors } from "./errors"
import { ActivityMeasures } from "./ActivityMeasures"
import { getSkinfoldResults, getTapeMeasureResults } from "./smallFunctions"

type EditMeasurementsProps = {
  state: T_State_Measurements
  dispatch: T_Dispatch_Measurements
  measurement: T_measurement
}

export const EditMeasurements: React.FC<EditMeasurementsProps> = props => {
  const { state, dispatch, measurement } = props

  const EditProps = {
    state: state,
    dispatch: dispatch,
    measurement: measurement,
  }
  return (
    <ScrollView>
      <BasicValues {...EditProps} />
      {measurement.folds && <SkinFoldMeasures {...EditProps} />}
      {measurement.tapeMeasures && <TapeMeasures {...EditProps} />}
      {measurement.activity && <ActivityMeasures {...EditProps} />}
      {measurement.goals && <ShowGoals state={state} dispatch={dispatch} measurement={measurement} />}
      {!measurement.folds && (
        <Button color={colors.green2} onPress={() => dispatch({ type: "add folds" })}>
          добави гънки калипер
        </Button>
      )}
      {!measurement.tapeMeasures && (
        <Button color={colors.green2} onPress={() => dispatch({ type: "add tape measures" })}>
          добави шивашки метър
        </Button>
      )}
      {!measurement.activity && (
        <Button color={colors.green2} onPress={() => dispatch({ type: "add activity calculation" })}>
          добави сметки активност
        </Button>
      )}
      {!measurement.goals && (
        <Button color={colors.green2} onPress={() => dispatch({ type: "add goals" })}>
          добави 'цели'
        </Button>
      )}
    </ScrollView>
  )
}

export type EditBasicMeasurementProps = {
  state: T_State_Measurements
  dispatch: T_Dispatch_Measurements
  measurement: T_measurement
}

export const BasicValues: React.FC<EditBasicMeasurementProps> = props => {
  const { state, dispatch, measurement } = props

  const onChangeValue = (propName, newValue) => {
    const newObj: T_measurement = { ...measurement, [propName]: newValue }
    if (propName === "weight" && measurement.goals && measurement.goals.goalProteinCoef) {
      const { goalProteinCoef: proteinCoef } = measurement.goals
      newObj.goals.goalProtein = Math.round(parseFloat(proteinCoef) * parseFloat(newObj.weight))
    }

    dispatch({ type: "update measurement", value: newObj })
  }

  const error = errors.basic(measurement, state.editedDoc)

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <GetSomeNumber value={measurement.weight} label={"Тегло"} onChangeText={text => onChangeValue("weight", text)} />
        <GetSomeNumber
          value={`${measurement.height || ""}`}
          label={"Ръст"}
          onChangeText={text => onChangeValue("height", text)}
        />
        <GetSomeNumber value={`${measurement.age || ""}`} label={"Години"} onChangeText={text => onChangeValue("age", text)} />
      </View>
      {error && <Text style={{ color: colors.red }}>{error}</Text>}
    </View>
  )
}

const ShowGoals: React.FC<EditBasicMeasurementProps> = props => {
  const { state, dispatch, measurement } = props

  const error = errors.getError_goals(measurement, state.editedDoc)
  if (error) return <Text style={errors.errorStyle}>{error}</Text>

  let formula: T_formula = measurement.goals.transformationGoal === "bulk" ? "bulk" : "cut"
  const { goals } = measurement
  const maintenance = Math.round(
    calFormulas.getMaintenance(
      state.editedDoc.sex,
      parseFloat(measurement.weight),
      measurement.age,
      measurement.height,
      formula,
      measurement.activity.activityCoef,
    ),
  )
  const bodyFat = measurement.folds
    ? getSkinfoldResults(measurement, state.editedDoc).fatPercent
    : getTapeMeasureResults(measurement, props.state.editedDoc).fatPercent
  const recommendedDeficit = useMemo(() => calFormulas.getMaxDeficit(state.editedDoc.sex, bodyFat), [
    state.editedDoc.sex,
    bodyFat,
  ])

  const deficitSurplus: deficit_surplus = useMemo(() => (goals.transformationGoal === "cut" ? "deficit" : "surplus"), [
    goals.transformationGoal,
  ])

  const calorieTarget = calFormulas.getCalories(deficitSurplus, maintenance, parseFloat(goals.targetPercent))
  const onChangePercent = newDeficitPercent => {
    let newObj = measurement
    newObj.goals.targetPercent = newDeficitPercent
    dispatch({ type: "update measurement", value: newObj })
  }

  const onChangeProtein = newProteinCoef => {
    let newMes = measurement
    newMes.goals.goalProteinCoef = newProteinCoef
    newMes.goals.goalProtein = Math.round(parseFloat(newProteinCoef) * parseFloat(newMes.weight))
    dispatch({ type: "update measurement", value: newMes })
  }

  const onChangeGoals = goalName => {
    if (goals.transformationGoal !== goalName) {
      let newPercent = null
      if (goalName === "bulk") newPercent = "8"
      else newPercent = `${calFormulas.getMaxDeficit(state.editedDoc.sex, bodyFat)}`

      dispatch({ type: "change goals", value: { ...goals, transformationGoal: goalName, targetPercent: newPercent } })
    }
  }

  const goalTypes: typeof goals.transformationGoal[] = ["bulk", "cut", "maintenance"]
  return (
    <View>
      <View style={{ height: 10, borderWidth: 1 }}></View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Goal: </Text>
        {goalTypes.map(goalName => {
          return (
            <Button
              key={goalName}
              color={goals.transformationGoal === goalName ? colors.blue1 : colors.grey1}
              onPress={() => onChangeGoals(goalName)}
            >
              {goalName}
            </Button>
          )
        })}
      </View>
      <Text>Ориентировъчни калории за поддръжка: {maintenance}</Text>
      <GetSomeNumber
        value={`${goals.goalProteinCoef}`}
        onChangeText={onChangeProtein}
        label={"избери коефициент за прием на протеин"}
        style={{ flex: 1 }}
      />
      {measurement.goals.transformationGoal === "cut" && (
        <View>
          <Text>Препоръчителен максимален дефицит {`${recommendedDeficit}%`}</Text>
          <View style={{ flexDirection: "row" }}>
            <GetSomeNumber
              value={goals.targetPercent}
              onChangeText={onChangePercent}
              label={"избери % дефицит"}
              style={{ flex: 1 }}
            />
          </View>
          <ShowCalorieAndProteinGoal calorie={calorieTarget} protein={measurement.goals.goalProtein} />
        </View>
      )}
      {measurement.goals.transformationGoal === "bulk" && (
        <View>
          <Text>Препоръчителен максимален излишък 5-10%</Text>
          <View style={{ flexDirection: "row" }}>
            <GetSomeNumber
              value={goals.targetPercent}
              onChangeText={onChangePercent}
              label={"избери % излишък"}
              style={{ flex: 1 }}
            />
          </View>
          <ShowCalorieAndProteinGoal calorie={calorieTarget} protein={measurement.goals.goalProtein} />
        </View>
      )}
      {measurement.goals.transformationGoal === "maintenance" && (
        <View>
          <ShowCalorieAndProteinGoal calorie={maintenance} protein={measurement.goals.goalProtein} />
        </View>
      )}
      <Text></Text>
      <Button
        style={{ bottom: 0 }}
        icon={icons.trash}
        color={colors.red}
        onPress={() => dispatch({ type: "delete some measures from one mesurement", value: "goals" })}
      >
        цели
      </Button>
    </View>
  )
}

type CalProtProps = {
  calorie: number
  protein: number
}
const ShowCalorieAndProteinGoal: React.FC<CalProtProps> = props => {
  const { calorie, protein } = props
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text>Цел калории </Text>
        <Text style={{ fontSize: 20, color: colors.blue3, fontWeight: "bold" }}>{Math.round(calorie)}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text>Цел протеин </Text>
        <Text style={{ fontSize: 20, color: colors.green3, fontWeight: "bold" }}>{protein}</Text>
      </View>
    </View>
  )
}
