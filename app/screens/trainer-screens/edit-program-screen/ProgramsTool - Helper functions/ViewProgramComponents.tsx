import { Button, Portal, Modal, TextInput } from "react-native-paper"

import React, { useState, useEffect, useReducer } from "react"

import {
  View,
  Text,
  Button as ButtonOriginal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Pressable,
  useWindowDimensions,
  TextInput as TextInput2,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  YellowBox,
  LogBox,
  Modal as Modal2,
  Alert,
} from "react-native"

import _ from "lodash"
import { observer } from "mobx-react-lite"

import { GetText } from "./index"
import iStyles from "../Constants/Styles"
import { muscleGroups } from "../Constants/MuscleGroups"
import { EditableText } from "./smallComponents"
import { getColorByExercisePosition } from "./index"
// import StoreProvider, { StoreContext } from "../../StoreProvider"

export const ExerciseMoreInfoButtons = props => {
  let fontSizeZ: number
  let showVideo = props.showVideo === false ? false : true
  let showDelete = props.showDelete === false ? false : true
  if (props.size) fontSizeZ = props.size
  else fontSizeZ = 14
  return (
    <View style={{ flexDirection: "row" }}>
      {showVideo && (
        <Button
          icon="video"
          compact={true}
          mode="contained"
          style={iStyles.smallIcon}
          onPress={props.onViewVideo}
          disabled={!props.isClickable}
          color={iStyles.text1.color}
        >
          {""}
        </Button>
      )}

      {showDelete && (
        <Button
          icon="trash-can-outline"
          compact={true}
          mode="contained"
          style={iStyles.smallIcon}
          onPress={props.onPressDelete}
          disabled={!props.isClickable}
          color="red"
        >
          {""}
        </Button>
      )}
    </View>
  )
}

export const zeroMuscleVolume = () => {
  // initialize muscleVolumeValues
  //return an array of objects with 0 values for each muscle group

  let programMuscleVolume = []
  let currentDayMuscleVolume = {}

  //make all values 0
  muscleGroups.forEach(muscleName => {
    currentDayMuscleVolume = {
      ...currentDayMuscleVolume,
      [muscleName]: 0,
    }
  })
  programMuscleVolume.push(currentDayMuscleVolume)

  return currentDayMuscleVolume
}

export const ClientName = props => {
  // const store: any = React.useContext(StoreContext)
  let clientName = props.client.Name
  const [state, setState] = useState({ isPicking: false })
  // props.client.Name
  //   ? (clientName = props.client.Name)
  //   : (clientName = 'no client yet');
  return (
    <View>
      {state.isPicking && (
        <View>
          {props.allClients.map(client => {
            if (client === props.client.ID) return
            return (
              <TouchableOpacity key={client} onPress={() => props.onChange(client)}>
                {/* <Text style={iStyles.text1}>{store.getClient(client).Name}</Text> */}
              </TouchableOpacity>
            )
          })}
        </View>
      )}
      <TouchableOpacity onPress={() => setState({ ...state, isPicking: !state.isPicking })}>
        <Text style={props.style}>{clientName}</Text>
      </TouchableOpacity>
    </View>
  )
}

export const getAverageRepsAndReturnFlag = item => {
  //small flag to check wether we should show more sets
  //by default we only show reps for the first set. if true, will show reps for each set
  let averageReps = 0
  item.Sets.forEach((set, index) => {
    averageReps += set.Reps
  })
  averageReps /= item.Sets.length
  if (item.Sets[0].Reps !== averageReps) return true
  else return false
}

export const getAverageWeight = sets => {
  let averageWeight = 0
  sets.forEach((set, index) => {
    averageWeight += parseFloat(set.Weight)
  })
  averageWeight /= sets.length
  return Math.round(averageWeight)
}

export const ShowAllSets = props => {
  //small function to show all sets properly with comma inbetween
  const sets = props.sets
  const isActive = props.isActive
  let setsString = ""

  for (let i = 0; i < sets.length - 1; i++) setsString += `${sets[i].Reps},`
  setsString += sets[sets.length - 1].Reps

  return <Text>{setsString}</Text>
}

export const SaveProgramButton = props => {
  const isProgramSaved = props.isProgramSaved

  if (!isProgramSaved)
    return (
      <Button mode="contained" color={iStyles.text2.color} onPress={props.onPress}>
        Save program
      </Button>
    )
  else
    return (
      <Button
        mode="contained"
        // onPress={onSaveProgramHandler}
        color={iStyles.text1.color}
      >
        Program saved
      </Button>
    )
}

export const ShowWeight = props => {
  const sets = props.sets
  const textStyle = props.textStyle
  let showKG
  if (sets[0].WeightType === "pureWeight") {
    showKG = true

    let averageWeight = getAverageWeight(sets)

    return <Text style={textStyle}>{`  ${averageWeight}kg`}</Text>
  } else {
    return <Text style={textStyle}>{` ${sets[0].Weight}`}</Text>
  }
}

export const SetsAndReps = props => {
  let textStyle = { ...props.textStyle, fontSize: props.isActive ? 20 : 18 }
  const item = props.exercise
  let showItemRepsProgression = false
  let showItemWeightProgression = false
  if (item.isExpanded) {
    if (item.increaseReps !== 0) showItemRepsProgression = true
    if (item.increaseWeight !== 0) showItemWeightProgression = true
  }
  return (
    <View>
      <Pressable disabled={props.isClickable} onPress={props.onPress}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={textStyle}>
              {item.Sets.length}x
              {props.showAllSetsReps ? (
                <ShowAllSets sets={item.Sets} isActive={props.isActive} />
              ) : (
                <Text>{item.Sets[0].Reps}</Text>
              )}
            </Text>
            {showItemRepsProgression && <Text style={textStyle}>+{item.increaseReps}</Text>}
          </View>
          <View style={{ width: "40%" }}>
            <ShowWeight sets={item.Sets} textStyle={textStyle} />
            {showItemWeightProgression && <Text style={textStyle}>+{item.increaseWeight}</Text>}
          </View>
        </View>
      </Pressable>
    </View>
  )
}

export const ShowExercise = observer(props => {
  const {
    onPressIn,
    onPressPosition,
    item,
    onPressExercise,
    onDeleteExercise,
    onPressSetsAndReps,
    isDragged,
    isClickable,
  } = props

  let someStyle = {
    color: getColorByExercisePosition(item.Position),
  }

  let textStyle = props.textStyle ? props.textStyle : someStyle
  if (!textStyle) textStyle = iStyles.text1
  if (!item) return <Text>No exercise found</Text>

  return (
    <View>
      <Text>es{item.Position}</Text>
      <Pressable onPressIn={onPressIn} delayLongPress={0} disabled={!isClickable}>
        <View
          style={{
            flexDirection: "row",
            padding: 1,
            marginHorizontal: 1,
            // width: '100%',
            justifyContent: "space-between",
            // height: EXERCISE_ITEM_HEIGHT,
          }}
        >
          <View style={{ width: "3%", justifyContent: "center" }}>
            <Pressable
              onPress={onPressPosition}
              onLongPress={onPressIn}
              delayLongPress={0}
              hitSlop={25}
              disabled={!isClickable}
            >
              <Text
                style={{
                  ...iStyles.text1,
                  fontSize: 20,
                  color: textStyle.color || "black",
                }}
              >
                {item.Position}
              </Text>
            </Pressable>
          </View>
          <View style={{ width: "50%", alignItems: "flex-start" }}>
            <Pressable
              onPress={onPressExercise}
              onLongPress={onPressIn}
              disabled={!isClickable}
              delayLongPress={0}
            >
              <Text
                style={{
                  color: textStyle.color || "black",
                  fontSize: isDragged ? 20 : 18,
                }}
              >
                {item.Name}
              </Text>
            </Pressable>
            {item.isExpanded && (
              <ExerciseMoreInfoButtons
                onPressDelete={onDeleteExercise}
                onPressEdit={() => console.log("tried editing")}
                isClickable={isClickable}
                onViewVideo={props.onViewVideo}
                showVideo={props.showVideoButton}
                showDelete={props.showDeleteButton}
              />
            )}
          </View>

          <View
            style={{
              width: "40%",

              justifyContent: "flex-end",
              // right: 5,
              // borderWidth: 2,
              // borderColor: 'red',
            }}
          >
            <SetsAndReps
              onPress={onPressSetsAndReps}
              showAllSetsReps={getAverageRepsAndReturnFlag(item)}
              isActive={isDragged}
              exercise={item}
              textStyle={{ ...textStyle, textAlign: "right" }}
              isClickable={!isClickable}
            />
          </View>
        </View>
      </Pressable>
    </View>
  )
})

export const ShowWeekName = props => {
  const { isCurrent, index, onPress } = props

  let weekStyleSelected = { ...iStyles.text2, fontSize: 22 }
  let weekStyleNotSelected = { ...iStyles.greyText, fontSize: 21 }
  if (isCurrent) {
    return (
      <View style={{ marginHorizontal: 2 }}>
        <Text style={weekStyleSelected}>Week {index + 1}</Text>
      </View>
    )
  } else
    return (
      <View style={{ marginHorizontal: 2 }}>
        <Pressable onPress={onPress}>
          <Text style={weekStyleNotSelected}>Week {index + 1}</Text>
        </Pressable>
      </View>
    )
}

export const ShowDayName = props => {
  const { isCurrent, day, onPress } = props
  let dayStyleSelected = { ...iStyles.text2, fontSize: 22 }
  let dayStyleNotSelected = { ...iStyles.greyText, fontSize: 21 }
  if (isCurrent) {
    return (
      <View style={{ marginHorizontal: 2 }}>
        <EditableText onEnd={props.onEdit} textStyle={dayStyleSelected}>
          {day.DayName}
        </EditableText>
      </View>
    )
  } else
    return (
      <View style={{ marginHorizontal: 2 }}>
        <EditableText onEnd={props.onEdit} onPress={onPress} textStyle={dayStyleNotSelected}>
          {day.DayName}
        </EditableText>
      </View>
    )
}
