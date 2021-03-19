import React, { useState, useEffect, useCallback } from "react"
import { View, FlatList, Pressable, StyleSheet, Modal, Alert, Text } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { SearchBar } from "react-native-elements"
import firestore from "@react-native-firebase/firestore"

import iStyles from "../../../components3/Constants/Styles"

import { useGlobalState } from "../../../components3/globalState/global-state-regular"
// import { Picker } from "@react-native-community/picker"
import { Picker } from "@react-native-picker/picker"

import { YOUTUBE_API_KEY, muscleGroups, muscleGroups2 } from "../../../components3/Constants"
import YouTube, { YouTubeStandaloneAndroid } from "react-native-youtube"
import _ from "lodash"

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"

import {
  EditableText,
  PressableTextPickerCustomColors,
  getColorByMuscleName,
  getVideoID,
  getVideoTime,
  ButtonsRow,
  PickAnItem,
  PickAFlatItem,
} from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"

import {
  return_todays_datestamp,
  displayDateFromTimestamp2,
  return_timeStamp_x_days_ago,
} from "../../../global-helper"

import {
  updateOneExercise,
  deleteOneExercise,
  Alerts,
  recoverOneDeletedExercise,
  deleteOneExerciseForever,
} from "./Components"
import { FAB } from "../../../components"
import { colors, icons, fonts } from "../../../components3/Constants"
import { randomString } from "../../../global-helper"

// import { Text } from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"

const EXERCISE_COLLECTION = "exercisesDocPerGroup"
const EXERCISE_COLLECTION_BACKUP = "exercisesDocPerGroupBackup"
const DELETED_EXERCISES_COLLECTION = "deletedExercises"
const EXERCISE_ITEM_HEIGHT = 30.66666603088379

const downloadExercisesMain = onDownload => {
  firestore()
    .collection(DELETED_EXERCISES_COLLECTION)
    .get()
    .then(deletedDocRefs => {
      let deletedExercises = []
      deletedDocRefs.forEach(deletedDocRef => {
        deletedExercises = [...deletedExercises, ...deletedDocRef.data().exercises]
      })
      firestore()
        .collection(EXERCISE_COLLECTION)
        .get()
        .then(docRefs => {
          let exercises = []
          let exerciseGroups: string[] = []
          docRefs.forEach(docRef => {
            exercises = [...exercises, ...docRef.data().exercises]
            let addNewGroup = true
            exerciseGroups.forEach(groupName => {
              if (docRef.data().exercises.length > 0)
                if (groupName === docRef.data().exercises[0].MainMuscleGroup) addNewGroup = false
            })
            if (addNewGroup) exerciseGroups.push(docRef.data().exercises[0].MainMuscleGroup)
          })
          onDownload(exercises, exerciseGroups, deletedExercises)
        })
    })
}

function filterExercisesByText(text, array) {
  // function filterFunction(exercise) {
  //   if (exercise.Name.toUpperCase().includes(text.toUpperCase())) return true
  // }
  // const newArray = array.filter(exercise => filterFunction(exercise))
  return array.filter(exercise => exercise.Name.toUpperCase().includes(text.toUpperCase()))
}

function filterExercisesByMuscleGroup(muscleGroup, array) {
  return array.filter(exercise => exercise.MainMuscleGroup === muscleGroup)
}

const ExerciseLoader = props => {
  const [globalState, setGlobalstate] = useGlobalState()

  useEffect(() => {
    console.log("starting to download exercises")
    downloadExercisesMain(props.onLoad)
  }, [])

  return <View></View>
}

const createCollectionBackup = (originalCollection: string, backupCollection: string) => {
  firestore()
    .collection(originalCollection)
    .get()
    .then(docRefs => {
      docRefs.forEach(docRef => {
        firestore()
          .collection(backupCollection)
          .doc(docRef.id)
          .set(docRef.data())
      })
    })
}

const getFreeRandomString = exercisesArray => {
  let newString = ""
  newString = randomString(7)
  exercisesArray.forEach(exercise => {
    if (exercise.ID === newString) getFreeRandomString(exercisesArray)
  })
  return newString
}

export const ExerciseDatabaseScreen = ({ navigation }) => {
  const [globalState, setGlobalstate] = useGlobalState()
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(muscleGroups2[0])

  const [searchText, setSearchText] = useState("")
  const [currentArray, setCurrentArray] = useState([])
  const [emptyExercise, setEmptyExercise] = useState({
    Name: "",
    Coefs: {},
    MainMuscleGroup: selectedMuscleGroup,
  })
  const [selectedExercise, setSelectedExercise] = useState(emptyExercise)
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false)
  const [downloadedExercises, setDownloadedExercises] = useState([])
  const [downloadedDeletedExercises, setDownloadedDeletedExercises] = useState([])
  const [currentDeletedArray, setCurrentDeletedArray] = useState([])
  const [exerciseGroups, setExerciseGroups] = useState()
  const [exerciseRecovery, setExerciseRecovery] = useState(false) //managing deleted exercises

  const testUpdate = () => {
    const newExercise = {
      Coefs: {},
      ID: "0.5a3lkb4oob5d",
      MainMuscleGroup: "test",
      Name: "Casdfk",
      YouTubeLink: "https://youtu.be/omcxYSiUg5M?t=9",
    }
    // deleteOneExercise(newExercise, "test")
  }

  const testHandler = () => {
    testUpdate()
  }

  const onChangeMuscleGroup = newMuscle => {
    setSelectedMuscleGroup(newMuscle)

    if (!exerciseRecovery) {
      setEmptyExercise({ ...emptyExercise, MainMuscleGroup: newMuscle })
      setCurrentArray(filterExercisesByMuscleGroup(newMuscle, downloadedExercises))
    } else {
      setCurrentDeletedArray(filterExercisesByMuscleGroup(newMuscle, downloadedDeletedExercises))
    }
  }

  const onLoadExercises = (downloadedExercises, exerciseGroups, deletedExercises) => {
    setDownloadedExercises(downloadedExercises)
    setCurrentArray(filterExercisesByMuscleGroup(selectedMuscleGroup, downloadedExercises))
    setDownloadedDeletedExercises(deletedExercises)
    setCurrentDeletedArray(deletedExercises)
    setExerciseGroups(exerciseGroups)
  }

  const onStartEditingExercise = exercise => {
    setSelectedExercise(exercise)
    setIsExerciseModalVisible(true)
    console.log("tried editing ", exercise)
  }

  const onFinishEditingExercise = newExercise => {
    setSelectedExercise(emptyExercise)
    setIsExerciseModalVisible(false)

    updateOneExercise(newExercise, EXERCISE_COLLECTION, onFinishUpdating)

    console.log("new exercise: ", newExercise)
  }

  const onFinishUpdating = () => {
    downloadExercisesMain(onLoadExercises)
  }

  const onCancelEditingExercise = () => {
    setSelectedExercise(emptyExercise)
    setIsExerciseModalVisible(false)
  }

  const onDeleteExercise = exercise => {
    deleteOneExercise(exercise, EXERCISE_COLLECTION, DELETED_EXERCISES_COLLECTION, onFinishUpdating)
  }

  const renderExercises = ({ item, index }) => {
    return (
      <ExpandableExercise
        item={item}
        onEditExercise={onStartEditingExercise}
        onDeleteExercise={onDeleteExercise}
      />
    )
  }

  const onRecoverDeletedExercise = item => {
    const onConfirmRecover = () => {
      recoverOneDeletedExercise(
        item,
        EXERCISE_COLLECTION,
        DELETED_EXERCISES_COLLECTION,
        onFinishUpdating,
      )
    }
    Alerts.ConfirmRecover(item, onConfirmRecover)
  }

  const onDeleteForever = item => {
    const onConfirmDeleteForever = () => {
      deleteOneExerciseForever(item, DELETED_EXERCISES_COLLECTION, onFinishUpdating)
    }
    Alerts.ConfirmDeleteForever(item, onConfirmDeleteForever)
  }

  const exerciseRecoveryHeader = () => {
    const width = "22%"
    const bigTextStyle = { fontSize: 20 }
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ width: width }}>
          <Text style={bigTextStyle}>Name</Text>
        </View>
        <View style={{ width: width }}>
          <Text style={bigTextStyle}>ID</Text>
        </View>
        <View style={{ width: width }}>
          <Text style={bigTextStyle}>Recover</Text>
        </View>
        <View style={{ width: width }}>
          <Text style={bigTextStyle}>Delete</Text>
        </View>
      </View>
    )
  }

  const renderDeletedExercises = ({ item, index }) => {
    const textStyle = { fontSize: 15 }
    const width = "22%"
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ width: width }}>
          <Text style={textStyle}>{item.Name ? item.Name : "noNameFound"}</Text>
        </View>
        <View style={{ width: width }}>
          <Text style={textStyle}>{item.ID}</Text>
        </View>
        <View style={{ width: width }}>
          <Button
            onPress={() => onRecoverDeletedExercise(item)}
            icon={icons.changeCircle}
            compact={true}
            labelStyle={{ fontSize: 12 }}
          >
            recover
          </Button>
        </View>
        <View style={{ width: width }}>
          <Button
            onPress={() => onDeleteForever(item)}
            color="red"
            icon={icons.deleteForever}
            compact={true}
            labelStyle={{ fontSize: 12 }}
          >
            delete
          </Button>
        </View>
      </View>
    )
  }

  const onPressAddNewExercise = () => {
    setSelectedExercise({
      ..._.cloneDeep(emptyExercise),
      ID: getFreeRandomString(downloadedExercises),
    })
    setIsExerciseModalVisible(true)
  }

  const onCancelSearch = () => {
    setSearchText("")
    setCurrentArray(filterExercisesByMuscleGroup(selectedMuscleGroup, downloadedExercises))
  }

  const onChangeSearchText = text => {
    setSearchText(text)
    if (!exerciseRecovery) {
      if (text !== "") setCurrentArray(filterExercisesByText(text, downloadedExercises))
      else setCurrentArray(filterExercisesByMuscleGroup(selectedMuscleGroup, downloadedExercises))
    } else setCurrentDeletedArray(filterExercisesByText(text, downloadedDeletedExercises))
  }

  const onPressExerciseRecovery = () => {
    if (exerciseRecovery) {
      setCurrentArray(filterExercisesByMuscleGroup(selectedMuscleGroup, downloadedExercises))
    } else {
      setCurrentDeletedArray(downloadedDeletedExercises)
    }
    setSearchText("")
    setExerciseRecovery(!exerciseRecovery)
  }

  return (
    <View>
      {downloadedExercises.length > 0 && !exerciseRecovery && (
        <FAB onPress={onPressAddNewExercise} />
      )}
      <ExerciseLoader onLoad={onLoadExercises} />
      {/* <Button onPress={testHandler}>test</Button> */}
      {/* <Text>exercise database</Text>
        <Text>{globalState.loggedUser.ID}</Text> */}
      {downloadedExercises.length > 0 && (
        <View style={{ maxHeight: "80%" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <PickAFlatItem
              list={exerciseGroups}
              onChange={onChangeMuscleGroup}
              selected={selectedMuscleGroup}
              renderItems={(item, index) => (
                <Text style={{ ...iStyles.text1, fontSize: 25 }}>{item}</Text>
              )}
              // renderSelected={item => <Text style={{ ...iStyles.text1, fontSize: 25 }}>{item}</Text>}
              renderSelected={() => {
                return <Text style={{ ...iStyles.text1, fontSize: 25 }}>{selectedMuscleGroup}</Text>
              }}
              // disabled={exerciseRecovery}
            />
            <Button
              onPress={onPressExerciseRecovery}
              color={exerciseRecovery ? colors.green3 : colors.grey1}
              mode={exerciseRecovery ? "contained" : "text"}
              style={{ height: 35 }}
            >
              deleted
            </Button>
          </View>
          <ExerciseModal
            exercise={selectedExercise}
            onCancel={onCancelEditingExercise}
            onConfirm={onFinishEditingExercise}
            onRequestClose={onCancelEditingExercise}
            visible={isExerciseModalVisible}
          />
        </View>
      )}
      <SearchBar
        placeholder="Search for an exercise"
        containerStyle={{ backgroundColor: iStyles.text1.color, height: 60 }}
        inputContainerStyle={{ backgroundColor: iStyles.backGround.color }}
        round={true}
        value={searchText}
        onChangeText={text => onChangeSearchText(text)}
        onCancel={onCancelSearch}
        onClear={onCancelSearch}
      />
      {downloadedExercises.length > 0 && !exerciseRecovery && (
        <View style={{ height: "80%" }}>
          <FlatList
            data={currentArray}
            renderItem={renderExercises}
            keyExtractor={item => item.ID}
            getItemLayout={(data, index) => ({
              length: EXERCISE_ITEM_HEIGHT,
              offset: EXERCISE_ITEM_HEIGHT * index,
              index,
            })}
            initialNumToRender={20}
          />
        </View>
      )}
      {exerciseRecovery && (
        <View style={{ height: "80%" }}>
          <FlatList
            data={currentDeletedArray}
            renderItem={renderDeletedExercises}
            keyExtractor={item => item.ID}
            ListHeaderComponent={exerciseRecoveryHeader}
          />
        </View>
      )}
    </View>
  )
}

type ExpandableExerciseProps = {
  item: any
  onDeleteExercise: Function
  onEditExercise: Function
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

  const ShowCoefs = props => {
    if (!props.coefs) return <View></View>
    const ArrayToPrint = []
    for (const property in props.coefs) {
      ArrayToPrint.push({ Name: property, Value: props.coefs[property] })
    }

    return (
      <View>
        {ArrayToPrint.map(coef => {
          return (
            <View key={coef.Name} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold" }}>{coef.Name}</Text>
              <Text>{coef.Value}</Text>
            </View>
          )
        })}
      </View>
    )
  }

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
              onPress={() => playVideo(item)}
              color={iStyles.text1.color}
              icon="video"
              labelStyle={{ fontSize: 30 }}
            >
              {}
            </Button>
            <Button
              onPress={() => props.onDeleteExercise(item)}
              icon={icons.deleteForever}
              color="red"
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
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "bold" }}>MainExerciseGroup</Text>
            <Text>{item.MainMuscleGroup}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "bold" }}>YoutubeLink</Text>
            <Text>{item.YouTubeLink ? item.YouTubeLink : "no link found"}</Text>
          </View>
          <ShowCoefs coefs={item.Coefs} />
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
    // console.log(item.Value, typeof item.Value)
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
