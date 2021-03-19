import React, { Dispatch } from "react"
import { View, FlatList, Pressable, useWindowDimensions } from "react-native"

import { Text, T_card, icons, colors, Button, fonts } from "../../../../../components3"

import { T_State_Client_HomeScreen, T_Action_Client_HomeScreen } from "../../home_screen_reducer"

import { VictoryLabel, VictoryPie } from "victory-native"

import { Svg } from "react-native-svg"
import { RenderCard } from "./RenderCards"

type T_TrainingsSummary = {
  state: T_State_Client_HomeScreen
  dispatch: Dispatch<T_Action_Client_HomeScreen>
}

export const TrainingsSummary: React.FC<T_TrainingsSummary> = props => {
  const { state, dispatch } = props
  const windowWidth = useWindowDimensions().width

  let trainingsDone = 0
  let trainingsBought = 0

  state.cards.forEach(card => {
    trainingsBought += card.cardType.sessions_limit || 0
    trainingsDone += card.sessions.length
  })
  const remainingTraings = trainingsBought - trainingsDone

  const pieWidthHeight = windowWidth * 0.7
  const pieInner = pieWidthHeight / 3
  const labelWidthHeight = pieWidthHeight / 2
  if (state.cards.length === 0) return <Text>Няма намерени карти за този клиент</Text>
  return (
    <View>
      {/* <Text>
        {remainingTraings !== 1
          ? `Остават ти ${remainingTraings} тренировки`
          : `Остава ти 1 тренировка`}
      </Text> */}
      <View style={{ alignItems: "center" }}>
        <Svg
          style={{
            height: windowWidth / 1.5,
            width: windowWidth / 1.5,
            // borderWidth: 1,
          }}
          onPress={() => dispatch({ type: "toggle trainings more info" })}
          color="red"
        >
          <VictoryPie
            standalone={true}
            width={pieWidthHeight}
            height={pieWidthHeight}
            colorScale={["green", "gainsboro"]}
            innerRadius={pieInner}
            data={[
              {
                y: Math.round(remainingTraings),
              },
              { y: Math.round(trainingsBought - remainingTraings) },
            ]}
            labels={["", ""]}
            animate={{
              duration: 2500,
              onLoad: { duration: 2500 },
            }}
          />

          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={labelWidthHeight}
            y={labelWidthHeight}
            style={{ fontSize: 16, fontFamily: fonts.jost.semi_bold }}
            text={
              remainingTraings !== 1
                ? `Остават ти ${remainingTraings}\n тренировки`
                : "Остава ти 1 \n тренировка"
            }
          />
        </Svg>
      </View>
      {/* <Button
        icon={state.trainingsMoreInfo ? icons.arrowUp : icons.arrowDown}
        onPress={() => dispatch({ type: "toggle trainings more info" })}
      >
        {""}
      </Button> */}
      {state.trainingsMoreInfo && (
        <FlatList
          data={state.cards}
          keyExtractor={item => item.cardID}
          renderItem={({ item, index }) => <RenderCard card={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 15, borderWidth: 1 }}></View>}
        />
      )}
    </View>
  )
}
