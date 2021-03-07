import React, { useCallback, useState } from "react"
import { View, ScrollView, TouchableOpacity, Text, FlatList } from "react-native"
import { Button } from "react-native-paper"

import { translate } from "../../../../i18n"
import iStyles from "../Constants/Styles"

import { muscleGroups, muscleGroups2 } from "../Constants/MuscleGroups"
import { getColorByMuscleName } from "../ProgramsTool - Helper functions"

// const ExerciseButton = React.memo(function ExerciseButton(props) {
const ExerciseButton = props => {
  const { title } = props

  let realMuscleGroupTitle

  if (props.realMuscleGroupTitle === undefined) realMuscleGroupTitle = title
  else realMuscleGroupTitle = props.realMuscleGroupTitle

  return (
    <Button
      mode="outlined"
      compact={true}
      color={props.passedColor || iStyles.text3.color}
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

  const [showAllButtons, setShowAllButtons] = useState(false)

  let mainMusclesArray = [
    "chest",
    "shoulders",
    "back",
    "glutes",
    "quads",
    "hams",
    "biceps",
    "triceps",
    "core",
  ]
  let arrayToShowAfterShown = []

  muscleGroups.forEach(group => {
    if (!mainMusclesArray.includes(group)) arrayToShowAfterShown.push(group)
  })

  const onPressExpand = () => {
    if (showAllButtons) {
      setShowAllButtons(false)
      props.onCollapse()
    } else {
      setShowAllButtons(true)
      props.onExpand()
    }
  }
  if (!props.isVisible) return <View></View>
  else
    return (
      <View>
        <View style={{ marginVertical: 1 }}>
          <View style={{ flexDirection: "row" }}>
            {/* <Button
              icon="arrow-left-bold"
              compact={true}
              mode="outlined"
              style={{ margin: 2 }}
              color={iStyles.text1.color}
              onPress={props.goBack}
            ></Button> */}
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {!props.disableMagnify && (
                <Button
                  icon="magnify"
                  compact={true}
                  mode="outlined"
                  style={{ margin: 2 }}
                  color={iStyles.text3.color}
                  onPress={props.onPressSearch}
                ></Button>
              )}
              <ExerciseButton
                title={translate("muscleGroups.Chest")}
                onPress={props.onPressMuscleGroup.bind(this, "chest")}
                passedColor={iStyles.text1.color}
                // muscleVolume={props.muscleVolume['chest']}
              />
              <ExerciseButton
                title={translate("muscleGroups.Shoulders")}
                onPress={props.onPressMuscleGroup.bind(this, "shoulders")}
                passedColor={iStyles.text1.color}
              />
              <ExerciseButton
                title={translate("muscleGroups.Back")}
                onPress={props.onPressMuscleGroup.bind(this, "back")}
                passedColor={iStyles.text1.color}
              />
              {/* </View>
            <View style={{flexDirection: 'row'}}> */}
              <ExerciseButton
                title={translate("muscleGroups.Glutes")}
                passedColor={iStyles.text2.color}
                onPress={props.onPressMuscleGroup.bind(this, "glutes")}
              />
              <ExerciseButton
                title={translate("muscleGroups.Quads")}
                passedColor={iStyles.text2.color}
                onPress={props.onPressMuscleGroup.bind(this, "quads")}
                // muscleVolume={props.muscleVolume['quads']}
              />
              <ExerciseButton
                title={translate("muscleGroups.Hams")}
                passedColor={iStyles.text2.color}
                onPress={props.onPressMuscleGroup.bind(this, "hams")}
                // muscleVolume={props.muscleVolume['hams']}
              />
              <ExerciseButton
                title={translate("muscleGroups.Biceps")}
                passedColor={iStyles.text3.color}
                onPress={props.onPressMuscleGroup.bind(this, "biceps")}
                // muscleVolume={props.muscleVolume['biceps']}
              />
              <ExerciseButton
                title={translate("muscleGroups.Triceps")}
                passedColor={iStyles.text3.color}
                onPress={props.onPressMuscleGroup.bind(this, "triceps")}
                // muscleVolume={props.muscleVolume['triceps']}
              />
              <ExerciseButton
                title={translate("muscleGroups.Core")}
                passedColor={iStyles.text3.color}
                onPress={props.onPressMuscleGroup.bind(this, "core")}
                // muscleVolume={props.muscleVolume['core']}
              />
              {/* <ExerciseButton
                title={translate("muscleGroups.Calves")}
                passedColor={iStyles.text3.color}
                onPress={props.onPressMuscleGroup.bind(this, "calves")}
                // muscleVolume={props.muscleVolume['calves']}
              /> */}
              <Button
                icon={showAllButtons ? "arrow-up-bold" : "arrow-down-bold"}
                compact={true}
                mode="outlined"
                style={{ margin: 2 }}
                color={iStyles.text1.color}
                onPress={onPressExpand}
              ></Button>
            </ScrollView>
          </View>
          {showAllButtons && (
            <View style={{ flexDirection: "row" }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {arrayToShowAfterShown.map((muscleName, index) => {
                  const color = getColorByMuscleName(muscleName)
                  return (
                    <ExerciseButton
                      key={index}
                      title={muscleName}
                      passedColor={color}
                      onPress={() => props.onPressMuscleGroup(muscleName)}
                    />
                  )
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    )
})
