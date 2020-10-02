import React, { useState, useEffect, useReducer, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Picker } from "@react-native-community/picker"

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

import { spacing, color } from "../../../theme"
import { Screen, MainHeader_Tr, ButtonSquare } from "../../../components"
import ProgressCircle from "react-native-progress-circle"
import { displayDateFromTimestamp, today_vs_last_day } from "../../../global-helper"
import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { values } from "mobx"
import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"
import { SwipeRow } from "react-native-swipe-list-view"

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
} from "../edit-program-screen/ProgramsTool - Helper functions"

import iStyles from "../edit-program-screen/Constants/Styles"
import { getSnapshot, onSnapshot } from "mobx-state-tree"
import {
  EMPTY_PROGRAM_DATA2,
  state,
  TRAINING_PROGRAMS_COLLECTION,
  DEFAULT_SET_DATA2,
} from "../../../models/sub-stores"
import * as fb from "../../../services/firebase/firebase.service"

import { MAX_SETS, MAX_REPS } from "./Constants/programCreationConstants"

const text1 = iStyles.text1
const text2 = iStyles.text2
const text3 = iStyles.text3
const greyText = iStyles.greyText

const DaysBox = props => {
  const { program, state } = props
  const [isChoosing, setIsChoosing] = useState(false)

  let styles = {
    completed: { ...text2, fontWeight: "bold" },
    notCompleted: greyText,
  }

  let buttonColor = state.locked ? greyText.color : text1.color

  return (
    <View>
      <Button
        onPress={() => setIsChoosing(!isChoosing)}
        color={buttonColor}
        disabled={state.locked}
      >
        Day{state.currentDayIndex + 1} W{state.currentWeekIndex + 1}
      </Button>
      {isChoosing && (
        <View style={{ flexDirection: "row" }}>
          {program.Weeks.map((week, weekIndex) => {
            return (
              <View key={weekIndex}>
                <Text style={{ ...text1, fontSize: 15, textAlign: "center" }}>
                  W{weekIndex + 1}
                </Text>
                {program.Weeks[weekIndex].Days.map((day, dayIndex) => {
                  let textStyle = styles.notCompleted
                  let selected = false
                  if (weekIndex === state.currentWeekIndex)
                    if (dayIndex === state.currentDayIndex) selected = true
                  if (program.Weeks[weekIndex].Days[dayIndex].isCompleted)
                    textStyle = styles.completed
                  return (
                    <Pressable
                      key={dayIndex}
                      onPress={() => {
                        setIsChoosing(false)
                        props.onPressDay(weekIndex, dayIndex)
                      }}
                    >
                      <View style={{ margin: 2, borderWidth: selected ? 1 : 0 }}>
                        <Text style={textStyle}>D{dayIndex + 1}</Text>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

const Header = props => {
  // const {client, program} = props;

  const { currentWeekIndex, currentDayIndex } = props.state
  const program = props.state.currentProgram
  let greyStyle = iStyles.greyText

  let lockIcon = props.state.locked ? "lock-open-variant-outline" : "lock-outline"
  let lockText = props.state.locked ? "unlock" : "lock"
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
          <Text style={style1}>Completed?</Text>
          <Checkbox
            color={iStyles.text1.color}
            status={
              program.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted
                ? "checked"
                : "unchecked"
            }
            disabled={props.state.locked}
            onPress={props.onToggleDayCompleted}
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

//find first uncompleted day
const getInitialState = program => {
  let state = {
    locked: true,
    currentWeekIndex: 0,
    currentDayIndex: 0,
    currentExerciseIndex: 0,
    currentProgram: program,
  }

  let breakFlag = false
  for (let weekIndex = 0; weekIndex < program.Weeks.length; weekIndex++) {
    if (breakFlag === true) break
    for (let dayIndex = 0; dayIndex < program.Weeks[weekIndex].Days.length; dayIndex++) {
      if (breakFlag) break
      if (program.Weeks[weekIndex].Days[dayIndex].isCompleted !== true) {
        breakFlag = true
        state = { ...state, locked: true, currentWeekIndex: weekIndex, currentDayIndex: dayIndex }
      }
    }
  }
  return state
}

const ProgramView = props => {
  // const client = store.getClient(program.ClientID);
  const [state, setState] = useState(() => getInitialState(props.program))
  const { currentWeekIndex, currentDayIndex, locked, currentProgram } = state

  useEffect(() => {
    const onBackPress = () => {
      saveProgram()

      return false
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [])

  const onToggleLockedHandler = () => {
    let newState = state
    newState.locked = !newState.locked
    setState({ ...newState })
  }

  const onToggleDayCompletedHandler = () => {
    let newState = currentProgram
    newState.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted = !newState.Weeks[
      currentWeekIndex
    ].Days[currentDayIndex].isCompleted
    setState({ ...state, currentProgram: { ...newState } })
  }

  const saveProgram = () => {
    if (currentProgram)
      fb.updateItem(props.programID, currentProgram, TRAINING_PROGRAMS_COLLECTION).catch(error =>
        console.error(error),
      )
  }

  return (
    <View style={{ height: "90%", flex: 1 }}>
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
      />
      {/* <ShowDay program={program} client={client} state={state} /> */}
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
        // onEditSetsRepsHandler={onEditSetsRepsHandler}
        // onExpandExerciseInfo={onExpandExerciseInfo}
      />
    </View>
  )
}

export const TrainClientsScreen = ({ navigation, route }) => {
  const [programs, setPrograms] = useState([])
  const rootStore = useStores()

  const getPrograms = async () => {
    let programIDsArray = []
    Object.keys(route.params).forEach(key => {
      programIDsArray.push(route.params[key])
    })
    console.log("programIDsArray", programIDsArray)

    let allPrograms = await fb.getItems(TRAINING_PROGRAMS_COLLECTION)
    let newProgramsArray = allPrograms.filter(program => programIDsArray.includes(program.id))
    setPrograms([...newProgramsArray])
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPrograms().catch(error => console.error(error))
    })
    return unsubscribe
  }, [navigation])

  const testHandler = () => {
    console.log("hi")
  }

  return (
    <ScrollView horizontal={true} pagingEnabled={true}>
      {programs.map(program => (
        <View key={program.id} style={styles.container}>
          <ProgramView
            program={program.item}
            programID={program.id}
            onGoBack={() => navigation.goBack()}
          />
          <Button onPress={testHandler}>test</Button>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
})
