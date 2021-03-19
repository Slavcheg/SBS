import React, { useEffect } from "react"
import { View, FlatList } from "react-native"
import {
  VictoryBar,
  VictoryTheme,
  VictoryLine,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native"
import { Button } from "react-native-paper"

import { displayDateFromTimestamp2 } from "../../../../global-helper"

import {
  getWeightEquivalent,
  getExerciseLatestSet,
  getLatestCompletedWeekIndexForOneDay,
  Text,
} from "./index"

import iStyles from "../../../../components3/Constants/Styles"

type ExerciseProgressChartProps = {
  //   exercise: any[]
  state: any
}

export const ExerciseProgressChart: React.FC<ExerciseProgressChartProps> = props => {
  const { currentProgram } = props.state
  const repPref = 8 //на колко повторения да изравняваме
  const weightWhenRepsOnly = 70 //на колко кг изравняваме с формулата, ако гледаме само повторения

  // Трябва да покрием следните case studies:
  // - направено е само веднъж упражнението
  // - нямаме isCompleted дни или имаме само 1 isCompleted ден

  type exObject = {
    Name: string
    StartingWeight: string
    StartingWeightType: "pureWeight" | string
    StartingWeightValue: number
    StartingReps: number
    StartedOn: Date | string | number
    FinishedOn: Date | string | number
    MeasuringRepsOnly: boolean
    DoneCount: number
    HighestWeight: string
    HighestReps: number
    HighestWeightType: "pureWeight" | string
    HighestWeightValue: number
    StartingPercentCoef: number
    FinishPercentCoef: number
  }

  let exerciseArray: exObject[] = []
  let includedExercisesArray: string[] = []

  currentProgram.Weeks.forEach((week, weekIndex) => {
    week.Days.forEach((day, dayIndex) => {
      if (day.isCompleted && day.Exercises.length > 0)
        day.Exercises.forEach((ex, exIndex) => {
          let currentDay = displayDateFromTimestamp2(day.completedOn)
          if (includedExercisesArray.includes(ex.Name)) {
            let exIndex = exerciseArray.findIndex(exArray => exArray.Name === ex.Name)
            exerciseArray[exIndex].DoneCount++
            exerciseArray[exIndex].FinishedOn = currentDay

            ex.Sets.forEach((set, setIndex) => {
              let currentWeightValue
              if (exerciseArray[exIndex].MeasuringRepsOnly || set.WeightType !== "pureWeight") {
                // ако е true или тепърва трябва да стане true
                exerciseArray[exIndex].MeasuringRepsOnly = true
                exerciseArray[exIndex].StartingWeightValue = getWeightEquivalent(
                  weightWhenRepsOnly,
                  exerciseArray[exIndex].StartingReps,
                  repPref,
                )
                currentWeightValue = getWeightEquivalent(weightWhenRepsOnly, set.Reps, repPref)
              } else {
                currentWeightValue = getWeightEquivalent(set.Weight, set.Reps, repPref)
              }

              if (exerciseArray[exIndex].HighestWeightValue < currentWeightValue) {
                exerciseArray[exIndex].HighestWeightValue = currentWeightValue
                exerciseArray[exIndex].HighestReps = set.Reps
                exerciseArray[exIndex].HighestWeight = set.Weight
                exerciseArray[exIndex].HighestWeightType = set.WeightType
                exerciseArray[exIndex].FinishPercentCoef =
                  currentWeightValue / exerciseArray[exIndex].StartingWeightValue
              }
            })
          } else {
            let measureRepsOnly = false //if we will compary to only reps
            if (ex.Sets[0].WeightType !== "pureWeight") measureRepsOnly = true

            let calculatingWeight = measureRepsOnly ? weightWhenRepsOnly : ex.Sets[0].Weight
            let weightValue = getWeightEquivalent(calculatingWeight, ex.Sets[0].Reps, repPref)

            includedExercisesArray.push(ex.Name)
            exerciseArray.push({
              Name: ex.Name,
              StartedOn: currentDay,
              FinishedOn: currentDay,
              StartingWeight: ex.Sets[0].Weight,
              StartingWeightType: ex.Sets[0].WeightType,
              StartingReps: ex.Sets[0].Reps,
              MeasuringRepsOnly: measureRepsOnly,
              StartingWeightValue: weightValue,
              DoneCount: 1,
              HighestWeight: ex.Sets[0].Weight,
              HighestWeightType: ex.Sets[0].WeightType,
              HighestReps: ex.Sets[0].Reps,
              HighestWeightValue: weightValue,
              StartingPercentCoef: 1,
              FinishPercentCoef: 1,
            })
          }
        })
    })
  })

  const renderExercises = ({ item, index }) => {
    const {
      Name,
      StartingReps,
      StartingWeightType,
      StartingWeightValue,
      StartedOn,
      FinishedOn,
      MeasuringRepsOnly,
      DoneCount,
      StartingWeight,
      HighestReps,
      HighestWeight,
      HighestWeightType,
      HighestWeightValue,
      StartingPercentCoef,
      FinishPercentCoef,
    } = item

    let addKg = "kg"
    if (MeasuringRepsOnly) addKg = ""

    let barData = []
    if (MeasuringRepsOnly)
      barData = [
        {
          When: "Finish",
          ProgressCoef: FinishPercentCoef * 100,
          label: HighestReps,
          fill: iStyles.text2.color,
        },
        { When: "Start", ProgressCoef: 100, label: StartingReps, fill: iStyles.text0.color },
      ]
    else
      barData = [
        {
          When: "Finish",
          ProgressCoef: FinishPercentCoef * 100,
          label: HighestWeightValue.toPrecision(3),
          fill: iStyles.text2.color,
        },
        {
          When: "Start",
          ProgressCoef: 100,

          label: StartingWeightValue.toPrecision(3),
          fill: iStyles.text0.color,
        },
      ]

    return (
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 25, color: iStyles.text0.color }}>{Name}</Text>
          <View>
            <Text style={iStyles.text0}>
              {StartingReps} reps at {StartingWeight}
              {addKg} on {StartedOn}
            </Text>
            <Text style={iStyles.text0}>
              {HighestReps} reps at {HighestWeight}
              {addKg} on {FinishedOn}
            </Text>
            <Text style={iStyles.text0}>
              {((FinishPercentCoef - 1) * 100).toPrecision(3)}% progress
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <VictoryChart
            width={300}
            height={117}
            horizontal={true}
            containerComponent={<VictoryVoronoiContainer />}
          >
            <VictoryBar
              data={barData}
              // animate={{
              //   duration: 4000,
              //   onLoad: { duration: 5000 },
              // }}
              barWidth={16}
              name="exercise"
              x={"When"}
              y={"ProgressCoef"}
              style={{
                data: {
                  fill: ({ datum }) => datum.fill,
                  fontSize: 8,
                },
                labels: {
                  fontSize: 15,
                  fill: ({ datum }) => datum.fill,
                },
              }}
              labels={({ datum }) => `x: ${datum.y}`}
            />
          </VictoryChart>
        </View>
      </View>
    )
  }
  const footer = () => {
    return <View style={{ height: 100 }}></View>
  }

  const arrangedArray = exerciseArray.sort((a, b) => b.FinishPercentCoef - a.FinishPercentCoef)

  return (
    <View>
      {exerciseArray.length === 0 && <Text>No data found</Text>}
      <FlatList
        data={arrangedArray}
        keyExtractor={(item, index) => `${item.Name}+${index}`}
        renderItem={renderExercises}
        ListFooterComponent={footer}
        initialNumToRender={1}
      />
    </View>
  )
}
