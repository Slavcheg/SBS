import React, { useState, useEffect, useCallback } from "react"
import { View, FlatList, Pressable, Text, StyleSheet, Modal, Alert } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { SearchBar } from "react-native-elements"
import iStyles from "../Constants/Styles"
import { StoreContext } from "../../StoreProvider"
import { useGlobalState } from "../../../../models/global-state-regular"
// import { Picker } from "@react-native-community/picker"
import { Picker } from "@react-native-picker/picker"

import { COLLECTION, DB_EXERCISE_COLLECTION, YOUTUBE_API_KEY } from "../Constants/DatabaseConstants"
import YouTube, { YouTubeStandaloneAndroid } from "react-native-youtube"
import { getVideoID, getVideoTime } from "./smallFunctions"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"

import { EditableText, PressableTextPickerCustomColors, getColorByMuscleName } from "./index"
import { muscleGroups, muscleGroups2 } from "../Constants"

import {
  return_todays_datestamp,
  displayDateFromTimestamp2,
  return_timeStamp_x_days_ago,
} from "../../../../global-helper"

import _ from "lodash"
import { type } from "ramda"

const EXERCISE_ITEM_HEIGHT = 30

//split into words and search for containing all words in any order
function filterExercises2(text, array) {
  let words = text.split(" ")
  let newArray = [...array]
  words.forEach(word => {
    newArray = newArray.filter(exercise => exercise.Name.toUpperCase().includes(word.toUpperCase()))
  })
  return newArray
}

function filterExercises(text, array) {
  function filterFunction(exercise) {
    if (exercise.Name.toUpperCase().includes(text.toUpperCase())) return true
  }
  let newArray = array.filter(exercise => filterFunction(exercise))

  return newArray
}

export const ExercisePicker = React.memo(function ExercisePicker(props: any) {
  // console.log('rendered ExercisePicker');
  const emptyExercise = { Name: "", Coefs: {}, MainMuscleGroup: props.state.selectedMuscleGroup }

  const [searchText, setSearchText] = useState("")
  const [currentArray, setCurrentArray] = useState(props.shownArray)
  const [selectedExercise, setSelectedExercise] = useState(emptyExercise)
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false)
  const [globalState, setGlobalState] = useGlobalState()

  const allExercises = globalState.allExercises

  useEffect(() => {
    setCurrentArray(props.shownArray)
    return () => {
      setCurrentArray(props.shownArray)
    }
  }, [props.shownArray])

  useEffect(() => {
    setSearchText("")
    setCurrentArray(props.shownArray)
  }, [props.isVisible])

  const onCancelHandler = useCallback(() => {
    setSearchText("")
    setCurrentArray(props.shownArray)
  }, [])

  const onChangeTextHandler = useCallback(text => {
    setCurrentArray(currentArray => filterExercises2(text, allExercises))
    setSearchText(searchText => text)
  }, [])

  const onDeleteExercise = exercise => {
    const where = whereDoesExerciseExist(exercise, allExercises, globalState.customExercises)
    console.log(allExercises.length, globalState.customExercises.length)
    console.log(exercise)
    console.log(where)

    const onDeleteOwn = () => {
      setGlobalState({
        type: "remove one exercise from own collection",
        exercise: exercise,
        userID: globalState.loggedUser.ID,
      })
    }

    if (where === "custom") {
      Alert.alert(
        "Внимание",
        `Сигурен ли си, че искаш да си изтриеш упражнението ${exercise.Name}`,
        [
          { text: "Не искам да го трия" },
          { text: "Да, искам да го изтрия!", onPress: onDeleteOwn },
        ],
        { cancelable: true },
      )
    }
    if (where === "all") {
      Alert.alert(
        "Внимание",
        "Не може да се трият от основните упражнения",
        [{ text: "Еми добре" }],
        { cancelable: true },
      )
    }

    console.log("tried deleting ", exercise.Name)
  }

  const renderExerciseDB = ({ item }) => {
    return (
      <ExpandableExercise
        item={item}
        onClickMainText={() => props.onClickMainText(item)}
        onDeleteExercise={onDeleteExercise}
        onEditExercise={onEditExercise}
      />
    )
  }

  const onCancelExerciseModal = () => {
    setIsExerciseModalVisible(false)
    setSelectedExercise(emptyExercise)
  }

  const onConfirmAddEditExercise = exercise => {
    const newEx = exercise
    const userID = globalState.loggedUser.ID

    const where = whereDoesExerciseExist(exercise, allExercises, globalState.customExercises)
    if (where === "nowhere") {
      setGlobalState({
        type: "add one exercise",
        exercise: { ...newEx },
        userID: userID,
      })
    }
    if (where === "custom")
      setGlobalState({ type: "update custom exercise", exercise: newEx, userID: userID })

    setIsExerciseModalVisible(false)
  }

  const onPressAddNewExercise = () => {
    setSelectedExercise(emptyExercise)
    setIsExerciseModalVisible(true)
  }

  const onEditExercise = exercise => {
    const where = whereDoesExerciseExist(exercise, allExercises, globalState.customExercises)

    if (where === "all") {
      Alert.alert(
        "Внимание",
        "Не може да се редактират от основните упражнения",
        [{ text: "Еми добре" }],
        { cancelable: true },
      )
    }

    if (where === "custom") {
      setSelectedExercise(exercise)
      setIsExerciseModalVisible(true)
    }
  }

  if (!props.isVisible) return <View></View>
  else
    return (
      <View
        style={{
          // flexDirection: 'row',
          width: "100%",
          height: "100%",
          // height: props.state.isButtonsRowExpanded ? "90%" : "100%",
          // flex: 1,
          // display: props.isVisible ? 'flex' : 'none',
          // borderWidth: 3,
          // borderColor: 'red',
        }}
      >
        <FAB onPress={onPressAddNewExercise} state={props.state} />
        <ExerciseModal
          exercise={selectedExercise}
          onCancel={onCancelExerciseModal}
          onConfirm={onConfirmAddEditExercise}
          visible={isExerciseModalVisible}
          onRequestClose={() => setIsExerciseModalVisible(false)}
        />
        <FlatList
          data={currentArray}
          keyExtractor={(item, index) => {
            return `${item.ID}-${index}`
          }}
          initialNumToRender={15}
          renderItem={renderExerciseDB}
          keyboardShouldPersistTaps="always"
          getItemLayout={(data, index) => ({
            length: EXERCISE_ITEM_HEIGHT,
            offset: EXERCISE_ITEM_HEIGHT * index,
            index,
          })}
        />
        <View
          style={{
            justifyContent: "flex-end",
            // marginBottom: props.state.isButtonsRowExpanded ? 82 : 40,
            marginBottom: props.state.isButtonsRowExpanded ? "34%" : "22%",
          }}
        >
          <SearchBar
            placeholder="Search for an exercise"
            containerStyle={{ backgroundColor: iStyles.text1.color, height: 60 }}
            inputContainerStyle={{ backgroundColor: iStyles.backGround.color }}
            round={true}
            value={searchText}
            onChangeText={text => onChangeTextHandler(text)}
            onCancel={onCancelHandler}
            onClear={onCancelHandler}
            autoFocus={props.autoFocusSearch}
          />
        </View>
      </View>
    )
  // };
})
// export const ExercisePicker = React.memo(SlowExercisePicker);

const styles = StyleSheet.create({
  renderContainer: {
    flexDirection: "row",
    width: "100%",
    height: EXERCISE_ITEM_HEIGHT,
  },
})

const FAB = props => {
  const [message, setMessage] = useState("добави твое")
  let mounted = true
  useEffect(() => {
    setTimeout(() => {
      if (mounted) setMessage("")
    }, 5000)

    return () => (mounted = false)
  }, [])
  return (
    <Button
      icon="plus-circle"
      mode={"contained"}
      compact={true}
      color={iStyles.text2.color}
      onPress={props.onPress}
      style={{
        position: "absolute",
        // top: props.state.isButtonsRowExpanded ? "67.6%" : "75%",
        top: props.state.isButtonsRowExpanded ? "57.6%" : "65%",
        right: "5%",
        zIndex: 1,
      }}
      labelStyle={{ fontSize: 14 }}
    >
      {message}
    </Button>
  )
}

type ExpandableExerciseProps = {
  onClickMainText: Function
  item: any
  onDeleteExercise?: Function
  onEditExercise?: Function
}

const ExpandableExercise: React.FC<ExpandableExerciseProps> = props => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { item } = props

  let isNew = false
  if (item.AddedOn) if (item.AddedOn > return_timeStamp_x_days_ago(3)) isNew = true

  const onLongPress = () => {
    setIsExpanded(true)
  }

  const regularColor = iStyles.text0.color

  return (
    <View>
      <View style={{ position: "absolute", top: "1%", left: "1%" }}>
        {isNew && <Text style={iStyles.text2}>New</Text>}
      </View>
      {!isExpanded && (
        <View style={{ width: "100%", alignContent: "center" }}>
          <Pressable onPress={onLongPress} onLongPress={onLongPress}>
            {({ pressed }) => (
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    ...iStyles.selectedText,
                    fontSize: pressed ? 25 : 23,
                    color: pressed ? iStyles.text1.color : regularColor,
                  }}
                >
                  {item.Name}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      )}
      {isExpanded && (
        <View>
          <TouchableOpacity onPress={() => setIsExpanded(false)}>
            <Text style={{ ...iStyles.text1, fontSize: 27, textAlign: "center" }}>{item.Name}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Button
              onPress={() => props.onClickMainText(item)}
              color={iStyles.text2.color}
              icon="plus-circle"
              labelStyle={{ fontSize: 30 }}
            >
              {}
            </Button>
            <Button
              onPress={() => playVideo(item)}
              color={iStyles.text1.color}
              icon="video"
              labelStyle={{ fontSize: 30 }}
            >
              {}
            </Button>
            <Button
              onPress={() => props.onEditExercise(item)}
              color={iStyles.textYellow.color}
              icon="square-edit-outline"
              labelStyle={{ fontSize: 30 }}
            >
              {}
            </Button>
            <Button
              onPress={() => props.onDeleteExercise(item)}
              icon="trash-can-outline"
              color="red"
              labelStyle={{ fontSize: 30 }}
            >
              {}
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}

const playVideo = item => {
  YouTubeStandaloneAndroid.playVideo({
    apiKey: YOUTUBE_API_KEY, //
    videoId: getVideoID(item.YouTubeLink),
    autoplay: true,
    lightboxMode: true,
    startTime: getVideoTime(item.YouTubeLink),
  })
    .then(() => console.log("Standalone Player Exited"))
    .catch(errorMessage => console.error(errorMessage))
}

type ExerciseModalProps = {
  visible: boolean
  exercise: any
  onCancel: Function
  onConfirm: Function
  onRequestClose: Function
}

const ExerciseModal: React.FC<ExerciseModalProps> = props => {
  const initialCoefArray = []

  muscleGroups2.forEach(muscle => {
    initialCoefArray.push({ Name: muscle, Value: 0 })
  })

  const coefValueRange = []

  for (let i = 0; i < 11; i++) coefValueRange.push((i / 10).toFixed(1))

  const [exerciseState, setExerciseState] = useState(_.cloneDeep(props.exercise))

  const [coefArray, setCoefArray] = useState(initialCoefArray)
  useEffect(() => {
    setExerciseState(_.cloneDeep(props.exercise))

    let isEditingOld = false //ако няма данни за стари коефициенти - приемаме, че правим ново упражнение и нулираме коефициентите
    let oldCoefArray = [...initialCoefArray]
    for (const coef in props.exercise.Coefs)
      if (props.exercise.Coefs[coef] > 0) {
        isEditingOld = true
        const foundIndex = oldCoefArray.findIndex(oldCoefArr => oldCoefArr.Name === coef)

        oldCoefArray[foundIndex] = { Name: coef, Value: props.exercise.Coefs[coef].toString() }
      }

    if (isEditingOld) {
      oldCoefArray.sort((a, b) => b.Value - a.Value)

      setCoefArray(oldCoefArray)
    } else setCoefArray(initialCoefArray)
  }, [props.visible])

  const onPickMuscle = newMuscle => {
    setExerciseState({ ...exerciseState, MainMuscleGroup: newMuscle })
  }

  const onChangeYouTubeLink = newLink => {
    setExerciseState({ ...exerciseState, YouTubeLink: newLink })
  }

  const onConfirm = () => {
    let showAlert = true

    let newExercise = {
      ...exerciseState,
    }
    coefArray.forEach(muscle => {
      let value = parseFloat(muscle.Value)
      // if (Math.round(value) === value) value = Math.round(value)
      if (value > 0) {
        newExercise.Coefs[muscle.Name] = value
        showAlert = false
      }
    })

    if (showAlert) {
      Alert.alert(
        "",
        `Трябва да избереш поне един коефициент над нула за това упражнение. \nВероятно ${exerciseState.MainMuscleGroup}: 1.0 е добър избор`,
        [{ text: "ОК" }],
        { cancelable: true },
      )
    } else props.onConfirm(newExercise)
  }

  const onPickCoefValue = (index, newValue) => {
    let oldCoefs = coefArray
    oldCoefs[index].Value = newValue

    oldCoefs.sort((a, b) => b.Value - a.Value)
    // oldCoefs.map(item => console.log(item.Value, typeof item.Value))

    setCoefArray([...oldCoefs])
  }

  const RenderCoefs = ({ item, index }) => {
    const leftStyle = { ...iStyles.text0, fontSize: 24 }
    const rightStyle = parseFloat(item.Value) > 0 ? iStyles.text2 : iStyles.greyText
    console.log(item.Value, typeof item.Value)
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 5 }}>
        <Text style={leftStyle}>{item.Name}</Text>

        {/* <PressableTextPickerCustomColors
          currentValue={item.Value}
          onPick={newValue => onPickCoefValue(index, newValue)}
          pickingFromArray={coefValueRange}
          textStyle={rightStyle}
        /> */}
        <Picker
          mode="dialog"
          selectedValue={item.Value === "1" ? "1.0" : item.Value} ///!? if value is '1' it shows 0!!!! But '1.0' works... wtf
          style={{ height: 50, width: 90, color: rightStyle.color }}
          onValueChange={(itemValue, itemIndex) => {
            onPickCoefValue(index, itemValue)
          }}
          itemStyle={{ color: iStyles.text1.color }}
        >
          {coefValueRange.map((value, index) => {
            return (
              <Picker.Item
                key={`${value}+${index.toString()}`}
                label={value.toString()}
                value={value}
                color={rightStyle.color}
              />
            )
          })}
        </Picker>
      </View>
    )
  }

  return (
    <Modal visible={props.visible} onRequestClose={props.onRequestClose}>
      <ScrollView>
        <View style={{ ...iStyles.screenViewWrapper, padding: 10 }}>
          {/* <Text style={{ ...iStyles.text1, textAlign: "center" }}>{exerciseState.Name}</Text> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ ...iStyles.text2, ...iStyles.text0 }}>Name</Text>
            <View style={{ width: "80%" }}>
              <TextInput
                style={{ ...iStyles.text1, textAlign: "center" }}
                label={"Име на упражнението"}
                mode="outlined"
                underlineColor={iStyles.text1.color}
                onChangeText={newValue => setExerciseState({ ...exerciseState, Name: newValue })}
                value={exerciseState.Name}
              />
            </View>
          </View>
          {/* <EditableText
          startingValue={exerciseName}
          onEnd={newName => setExerciseState({ ...exerciseState, Name: newName })}
          textStyle={{ ...iStyles.text1, textAlign: "center" }}
          style={{ justifyContent: "center" }}
        >
          {exerciseState.YouTubeLink}
        </EditableText> */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ ...iStyles.text2, ...iStyles.text0 }}>ID</Text>
            <Text style={iStyles.text2}>{exerciseState.ID}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text style={{ ...iStyles.text2, ...iStyles.text0 }}>YT Link</Text>
            {/* <Text style={{ ...iStyles.text2, fontSize: 12, textAlignVertical: "center" }}> */}
            <View style={{ width: "80%" }}>
              <TextInput
                style={{ ...iStyles.text2, fontSize: 12, textAlignVertical: "center" }}
                label={"YouTube Link"}
                mode="outlined"
                underlineColor={iStyles.text1.color}
                onChangeText={newValue => onChangeYouTubeLink(newValue)}
                value={exerciseState.YouTubeLink}
              />
            </View>

            {/* </Text> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 80,
              alignItems: "center",
            }}
          >
            <Text style={{ ...iStyles.text2, ...iStyles.text0 }}>Muscle</Text>

            {/* <PressableTextPickerCustomColors
              currentValue={
                mainMuscleGroupRedacted || exerciseState.MainMuscleGroup || "No muscle group"
              }
              onCancel={() => console.log("tried cancelling")}
              onPick={onPickMuscle}
              pickingFromArray={muscleGroups2}
              textStyle={nonRedactedStyle}
            /> */}
            <Picker
              mode="dialog"
              selectedValue={exerciseState.MainMuscleGroup}
              style={{
                height: 80,
                width: "50%",
                color: getColorByMuscleName(exerciseState.MainMuscleGroup),
              }}
              onValueChange={(itemValue, itemIndex) => {
                onPickMuscle(itemValue)
              }}
              itemStyle={{ color: iStyles.text1.color }}
            >
              {muscleGroups.map(value => (
                <Picker.Item
                  key={value}
                  label={value}
                  value={value}
                  color={getColorByMuscleName(value)}
                />
              ))}
            </Picker>
          </View>
          <Text style={{ textAlign: "center", fontSize: 24, color: iStyles.text1.color }}>
            Coefs
          </Text>
          <FlatList
            data={coefArray}
            renderItem={RenderCoefs}
            keyExtractor={(item, index) => `${item.Name}${index}`}
            scrollEnabled={false}
          />
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button color={iStyles.textYellow.color} onPress={props.onCancel} mode="contained">
                cancel
              </Button>
              <Button color={iStyles.text1.color} onPress={onConfirm} mode="contained">
                Save
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  )
}

const whereDoesExerciseExist = (exercise, allExercises, customExercises) => {
  let returnValue = "nowhere"
  allExercises.forEach(allEx => {
    if (allEx.ID === exercise.ID) returnValue = "all"
  })
  customExercises.forEach(customEx => {
    if (customEx.ID === exercise.ID) returnValue = "custom"
  })
  return returnValue
}
