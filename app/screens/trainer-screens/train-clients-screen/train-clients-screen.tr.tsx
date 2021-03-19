import React, { useState, useEffect, useReducer, useCallback } from "react"
import firestore from "@react-native-firebase/firestore"
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
  Modal,
  Alert,
  Dimensions,
} from "react-native"

import _ from "lodash"

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", // TODO: Remove when fixed
])

import {
  return_todays_datestamp,
  displayDateFromTimestamp,
  border_boxes,
  getStampFromDate,
  displayDateFromTimestamp2,
} from "../../../global-helper"

import { useGlobalState } from "../../../components3/globalState/global-state-regular"

import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"

import DraggableFlatList from "react-native-draggable-flatlist"
import { Button, TextInput, Checkbox } from "react-native-paper"

import {
  ExercisePicker,
  ButtonsRow,
  ShowProgramDays,
  EditProgramReducer,
  ProgramViewHeader,
  EasyNumberPicker,
  GetText,
  ClientName,
  EditExerciseModal,
  updateFollowingWeeks,
  DayCompletedCheckbox,
  DaysBox,
  getInitialState,
} from "../edit-program-screen/ProgramsTool - Helper functions"

import iStyles from "../../../components3/Constants/Styles"
import { getSnapshot, onSnapshot } from "mobx-state-tree"
import {
  EMPTY_PROGRAM_DATA2,
  state,
  TRAINING_PROGRAMS_COLLECTION,
  DEFAULT_SET_DATA2,
} from "../../../components3"
import * as fb from "../../../services/firebase/firebase.service"

import { MAX_SETS, MAX_REPS } from "./Constants/programCreationConstants"

const text1 = iStyles.text1
const text2 = iStyles.text2
const text3 = iStyles.text3
const greyText = iStyles.greyText

const Header = props => {
  // const {client, program} = props;

  const { currentWeekIndex, currentDayIndex } = props.state
  const program = props.state.currentProgram
  let greyStyle = iStyles.greyText

  let lockIcon = props.state.locked ? "lock-open-variant-outline" : "lock-outline"
  let lockText = props.state.locked
    ? translate("trainClientsScreen.Unlock")
    : translate("trainClientsScreen.Lock")
  let lockColor = props.state.locked ? text2.color : "red"
  let lockButtonMode: any = props.state.locked ? "contained" : "text"
  let style1 = props.state.locked ? greyStyle : text1

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 2 }}>
      <View>
        {/* <Text style={{...text2, fontWeight: 'bold'}}>{client.Name}</Text> */}
        {/* <Text style={style1}>{program.Name}</Text> */}
        <ClientName clientID={program.Client} disabled={true} style={iStyles.text1} />
        <View style={{ flexDirection: "row" }}>
          {/* <Text style={style1}>{translate("trainClientsScreen.Completed")}?</Text> */}

          <DayCompletedCheckbox
            isCompleted={program.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted}
            currentDate={program.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn}
            onToggle={newDate => props.onToggleDayCompleted(currentDayIndex, newDate)}
            color={iStyles.text1.color}
            uncheckedColor={iStyles.text0.color}
          />
        </View>
      </View>
      <View style={{ alignItems: "flex-start", marginHorizontal: 10 }}>
        <Button
          style={{ height: 40, width: 100 }}
          onPress={props.onToggleLocked}
          icon={lockIcon}
          compact={true}
          color={lockColor}
          mode={lockButtonMode}
        >
          {lockText}
        </Button>
        <DaysBox state={props.state} program={program} onPressDay={props.onPressDay} />
      </View>
    </View>
  )
}

type ProgramArrangeBoxProps = {
  programs: any
  onReArrange: Function
  onStartPicking: Function
  isPicking: boolean
}

const ProgramArrangeBox: React.FC<ProgramArrangeBoxProps> = props => {
  const { isPicking } = props

  const userStore = useStores().userStore2

  let programColorsByID = {}
  const colorArray = [
    "#3498DB",
    "#2475B0",
    "#74B9FF",
    "#0A79DF",
    "#4834DF",
    "#30336B",
    "#487EB0",
    "#3498DB",
    "#2475B0",
    "#74B9FF",
    "#0A79DF",
    "#4834DF",
    "#30336B",
    "#487EB0",
    "#3498DB",
    "#2475B0",
    "#74B9FF",
    "#0A79DF",
    "#4834DF",
    "#30336B",
    "#487EB0",
  ]

  useEffect(() => {
    props.programs.forEach(program => {
      programColorsByID = {
        ...programColorsByID,
        [program.id]: colorArray[Math.floor(Math.random() * 18)],
      }
    })
  }, [props.programs])

  const renderPrograms = ({ item, index, drag, isActive }) => {
    // const userName =
    //   userStore.getUserByID(item.item.Client) !== null
    //     ? userStore.getUserByID(item.item.Client).item.first
    //     : "No name yet"
    return (
      <Pressable onPressIn={() => drag()}>
        <View
          style={{
            ...styles.programArrangeBoxBox,
            // backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            // backgroundColor: programColorsByID[item.id] ? programColorsByID[item.id] : "blue",
          }}
        >
          <View>
            <Text style={{ ...text1, textAlign: "center", textAlignVertical: "center" }}>
              {item.item.Name}
            </Text>
            {/* <Text style={{ ...text1, textAlign: "center", textAlignVertical: "center" }}>
              {index + 1}
            </Text> */}
          </View>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={{ justifyContent: "flex-end", width: "100%" }}>
      {isPicking && (
        <View
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            alignSelf: "flex-start",
          }}
        >
          <View
            style={{
              minHeight: Dimensions.get("window").height - 75,
            }}
          >
            <DraggableFlatList
              data={props.programs}
              numColumns={1}
              keyExtractor={item => item.id}
              renderItem={({ item, index, drag, isActive }) =>
                renderPrograms({ item, index, drag, isActive })
              }
              onDragEnd={({ data }) => {
                props.onReArrange(data)
              }}
            />
          </View>
        </View>
      )}
      <Button color={iStyles.text3.color} onPress={props.onStartPicking}>
        Подреди програмите
      </Button>
    </View>
  )
}

const ProgramView = props => {
  // const client = store.getClient(program.ClientID);
  const [state, setState] = useState(() => getInitialState(props.program))
  const [globalState, setGlobalState] = useGlobalState()

  const {
    currentWeekIndex,
    currentDayIndex,
    currentExerciseIndex,
    isExerciseModalVisible,
    locked,
    currentProgram,
  } = state

  const dayEmpty =
    state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length === 0
      ? true
      : false

  const onToggleLockedHandler = () => {
    let newState = state
    newState.locked = !newState.locked
    setState({ ...newState })
  }

  const onToggleDayCompletedHandler = (dayIndex, newDate) => {
    let newState = currentProgram
    newState.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted = !newState.Weeks[
      currentWeekIndex
    ].Days[currentDayIndex].isCompleted
    const updatedDate =
      newDate || newState.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn

    newState.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn = updatedDate
    saveProgram(newState)
    setState({ ...state, currentProgram: { ...newState } })
  }

  const saveProgram = async updatedProgram => {
    if (updatedProgram) {
      setGlobalState({
        type: "update one program",
        programID: props.programID,
        value: updatedProgram,
      })

      await firestore()
        .collection(TRAINING_PROGRAMS_COLLECTION)
        .doc(props.programID)
        .update(updatedProgram)
        .catch(err => console.error(err))
    }
  }

  const onChangeDate = newDate => {
    console.log(newDate)
    const newState = currentProgram
    newState.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn = getStampFromDate(newDate)
    saveProgram(newState)
    setState({ ...state, currentProgram: { ...newState } })
  }

  const onEditSetsRepsHandler = exerciseIndex => {
    setState({ ...state, isExerciseModalVisible: true, currentExerciseIndex: exerciseIndex })
    saveProgram(currentProgram)
  }

  const onCloseExerciseModal = newExercise => {
    let newProgram = currentProgram
    newProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
      currentExerciseIndex
    ] = newExercise
    if (currentWeekIndex < currentProgram.Weeks.length - 1)
      newProgram = updateFollowingWeeks({ ...state, currentProgram: newProgram })
    setState({ ...state, isExerciseModalVisible: false, currentProgram: newProgram })
    saveProgram(newProgram)
  }

  return (
    <ScrollView style={{ height: "100%" }}>
      {currentProgram &&
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length > 0 && (
          <EditExerciseModal
            visible={state.isExerciseModalVisible}
            exercise={
              currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
                currentExerciseIndex
              ]
            }
            onClose={onCloseExerciseModal}
          />
        )}
      <Header
        //   client={client}
        state={state}
        onPressDay={(weekIndex, dayIndex) =>
          setState({
            ...state,
            currentWeekIndex: weekIndex,
            currentDayIndex: dayIndex,
          })
        }
        onToggleLocked={onToggleLockedHandler}
        onToggleDayCompleted={onToggleDayCompletedHandler}
        onChangeDate={onChangeDate}
      />

      {!dayEmpty && (
        <ShowProgramDays
          state={state}
          mode="oneDay"
          //  client={client}
          // onRemoveDay={onRemoveDay}
          // onAddNewDay={onAddNewDay}
          // onChangeDay={onChangeDay}
          // onChangeDayName={onChangeDayName}
          // onToggleDayCompleted={onToggleDayCompleted}
          // onExpandMoreInfoAllExercises={onExpandMoreInfoAllExercises}
          // onDragEndHandler={onDragEndHandler}
          // onDeleteExerciseHandler={onDeleteExerciseHandler}
          // onEditPositionHandler={onEditPositionHandler}
          onEditSetsRepsHandler={onEditSetsRepsHandler}
          // onExpandExerciseInfo={onExpandExerciseInfo}
        />
      )}
      {dayEmpty && (
        <Text style={{ ...iStyles.greyText, color: "red" }}>
          This day is empty. Go to program and add some exercises
        </Text>
      )}
    </ScrollView>
  )
}

export const TrainClientsScreen = ({ navigation, route }) => {
  const [programs, setPrograms] = useState([])
  const [isRearranging, setIsRearranging] = useState(false)
  const [globalState, setGlobalState] = useGlobalState()

  const rootStore = useStores()

  const getPrograms = () => {
    console.log("went to get programs")
    let programIDsArray = []
    Object.keys(route.params).forEach(key => {
      programIDsArray.push(route.params[key])
    })

    let allPrograms = globalState.allPrograms
    let newProgramsArray = allPrograms.filter(program => programIDsArray.includes(program.id))
    setPrograms([...newProgramsArray])
  }

  useEffect(() => {
    console.log("went here")
    setTimeout(() => {
      if (globalState.allPrograms.length === 0) navigation.goBack()
    }, 1000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (programs.length === 0) {
        console.log("programs got with useEffect []")
        getPrograms()
      }
    }, 100)
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPrograms()
    })
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const onBackPress = () => {
      if (isRearranging) {
        setIsRearranging(false)
        return true
      } else return false
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [isRearranging])

  const testHandler = () => {
    console.log("hii")
  }

  const onReArrange = newOrder => {
    setPrograms([...newOrder])
  }

  return (
    <ScrollView horizontal={true} pagingEnabled={true}>
      {programs.map(program => (
        <View key={program.id} style={styles.container}>
          {!isRearranging && (
            <ProgramView
              program={program.item}
              programID={program.id}
              onGoBack={() => navigation.goBack()}
            />
          )}
          {/* <Button onPress={testHandler}>test</Button> */}
          {programs.length > 1 && (
            <ProgramArrangeBox
              programs={programs}
              onReArrange={onReArrange}
              isPicking={isRearranging}
              onStartPicking={() => setIsRearranging(!isRearranging)}
            />
          )}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: iStyles.backGround.color,
    // height: Dimensions.get("window").height,
  },
  programArrangeBoxBox: {
    height: 50,
    width: Dimensions.get("window").width - 20,
    borderWidth: 2,
    margin: 5,
    justifyContent: "center",
  },
})
