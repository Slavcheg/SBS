import React, { useCallback, useState } from "react"
import { View, ScrollView, TouchableOpacity, Text, FlatList } from "react-native"
import { Button } from "react-native-paper"

import iStyles from "../Constants/Styles"

// const ExerciseButton = React.memo(function ExerciseButton(props) {
const ExerciseButton = props => {
  const { title } = props

  let realMuscleGroupTitle, passedColor

  if (props.realMuscleGroupTitle === undefined) realMuscleGroupTitle = title
  else realMuscleGroupTitle = props.realMuscleGroupTitle
  if (props.passedColor === undefined) passedColor = 1
  else passedColor = props.passedColor

  // muscleVolume.forEach(value, index);
  let finalColor = iStyles.text1.color

  switch (passedColor) {
    case 2:
      finalColor = iStyles.text2.color
      break
    case 3:
      finalColor = iStyles.text3.color
      break
    default:
      break
  }
  return (
    <Button
      mode="outlined"
      compact={true}
      color={finalColor}
      style={{ margin: 2 }}
      onPress={() => {
        props.onPress()
      }}
    >
      {title}
      {/* - {props.muscleVolume} */}
      {/* {muscleVolume[currentDayIndex][title]}- */}
      {/* {store.getProgramVolume(title)} */}
    </Button>
  )
}

export const ButtonsRow = React.memo(function ButtonsRow(props: any) {
  // console.log('rendered ButtonsRow');
  let mainColorRow1 = 1
  let mainColorRow2 = 2
  let mainColorRow3 = 3
  if (!props.isVisible) return <View></View>
  else
    return (
      <View>
        <View style={{ marginVertical: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Button
              icon="arrow-left-bold"
              compact={true}
              mode="outlined"
              style={{ margin: 2 }}
              color={iStyles.text1.color}
              onPress={props.goBack}
            >
              {""}
            </Button>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <Button
                icon="magnify"
                compact={true}
                mode="outlined"
                style={{ margin: 2 }}
                color={iStyles.text3.color}
                onPress={props.onPressSearch}
              >
                {""}
              </Button>
              <ExerciseButton
                title="chest"
                onPress={props.onPressMuscleGroup.bind(this, "chest")}
                // muscleVolume={props.muscleVolume['chest']}
              />
              <ExerciseButton
                title="shoulders"
                onPress={props.onPressMuscleGroup.bind(this, "shoulders")}
                // muscleVolume={props.muscleVolume['shoulders']}
              />
              <ExerciseButton
                title="back"
                onPress={props.onPressMuscleGroup.bind(this, "back")}
                // muscleVolume={props.muscleVolume['back']}
              />
              {/* </View>
            <View style={{flexDirection: 'row'}}> */}
              <ExerciseButton
                title="glutes"
                passedColor={mainColorRow2}
                onPress={props.onPressMuscleGroup.bind(this, "glutes")}
                // muscleVolume={props.muscleVolume['glutes']}
              />
              <ExerciseButton
                title="quads"
                passedColor={mainColorRow2}
                onPress={props.onPressMuscleGroup.bind(this, "quads")}
                // muscleVolume={props.muscleVolume['quads']}
              />
              <ExerciseButton
                title="hams"
                passedColor={mainColorRow2}
                onPress={props.onPressMuscleGroup.bind(this, "hams")}
                // muscleVolume={props.muscleVolume['hams']}
              />
              <ExerciseButton
                title="biceps"
                passedColor={mainColorRow3}
                onPress={props.onPressMuscleGroup.bind(this, "biceps")}
                // muscleVolume={props.muscleVolume['biceps']}
              />
              <ExerciseButton
                title="triceps"
                passedColor={mainColorRow3}
                onPress={props.onPressMuscleGroup.bind(this, "triceps")}
                // muscleVolume={props.muscleVolume['triceps']}
              />
              <ExerciseButton
                title="core"
                passedColor={mainColorRow3}
                onPress={props.onPressMuscleGroup.bind(this, "core")}
                // muscleVolume={props.muscleVolume['core']}
              />
              <ExerciseButton
                title="traps"
                passedColor={mainColorRow3}
                onPress={props.onPressMuscleGroup.bind(this, "traps")}
                // muscleVolume={props.muscleVolume['traps']}
              />
              <ExerciseButton
                title="calves"
                passedColor={mainColorRow3}
                onPress={props.onPressMuscleGroup.bind(this, "calves")}
                // muscleVolume={props.muscleVolume['calves']}
              />
              <Button
                icon="magnify"
                compact={true}
                mode="outlined"
                style={{ margin: 2 }}
                color={iStyles.text3.color}
                onPress={props.onPressSearch}
              >
                {""}
              </Button>
            </ScrollView>
          </View>
        </View>
      </View>
    )
})
