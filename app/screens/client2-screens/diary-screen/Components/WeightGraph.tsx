import React, { useState } from "react"
import { View, useWindowDimensions } from "react-native"

import {
  VictoryBar,
  VictoryTheme,
  VictoryLine,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryArea,
} from "victory-native"

import { Text, colors, icons } from "../../../../components3"

import * as diaryTypes from "../diaryTypes"
import * as dateHelper from "../../../../global-helper/global-date-helper/global-date-helper"
import { round } from "react-native-reanimated"

type WeightGraphProps = {
  diary: diaryTypes.DiaryType
  setDiary?: any
}

type weightGraphT = {
  weight: number
  date: any
  fill: string
}

export const WeightGraph: React.FC<WeightGraphProps> = props => {
  const windowWidth = useWindowDimensions().width
  const { diary } = props
  const graphArray: weightGraphT[] = []
  let maxKG = 0
  let minKG = 9999999
  diary.Days.forEach(day => {
    if (day.weight) {
      if (day.weight > maxKG) maxKG = day.weight
      if (day.weight < minKG) minKG = day.weight
      graphArray.push({
        date: dateHelper.displayDateFromTimestamp2(day.date),
        weight: day.weight,
        fill: colors.green3,
      })
    }
  })

  return (
    <View>
      <VictoryChart
        width={windowWidth * 0.9}
        minDomain={{ y: minKG - 5 }}
        maxDomain={{ y: maxKG + 5 }}
        // style={{
        //   background: {
        //     fill: colors.blue_transparent,
        //   },
        // }}
      >
        <VictoryLine
          domainPadding={15}
          data={graphArray}
          x="date"
          y="weight"
          labels={({ datum }) => `${formatWeight(datum.weight)}`}
          animate={{
            duration: 2500,
            onLoad: { duration: 2500 },
          }}
          style={{
            data: {
              //   fill: ({ datum }) => datum.fill,
              fontSize: 8,

              stroke: colors.blue3,
              //   fill: colors.blue3,
            },

            // labels: {
            //   fontSize: 15,
            //   fill: ({ datum }) => datum.fill,
            // },
          }}
        />
      </VictoryChart>
    </View>
  )
}

const formatWeight = (weightNumber: number) => {
  if (Math.round(weightNumber) === parseFloat(weightNumber.toFixed(1)))
    return Math.round(weightNumber).toString()
  else return weightNumber.toFixed(1)
}
