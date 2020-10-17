import React, { useState, useEffect, useReducer, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Picker } from "@react-native-community/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"

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

import { DatePicker } from "../../../components-custom/date-picker/date-picker"
import {
  return_todays_datestamp,
  displayDateFromTimestamp,
  border_boxes,
  getStampFromDate,
  displayDateFromTimestamp2,
} from "../../../global-helper"

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
        {translate("trainClientsScreen.Day")}
        {state.currentDayIndex + 1} {translate("trainClientsScreen.W")}
        {state.currentWeekIndex + 1}
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
  let lockText = props.state.locked
    ? translate("trainClientsScreen.Unlock")
    : translate("trainClientsScreen.Lock")
  let lockColor = props.state.locked ? text2.color : "red"
  let lockButtonMode: any = props.state.locked ? "contained" : "text"
  let style1 = props.state.locked ? greyStyle : text1
  const [seeDatePicker, setSeeDatePicker] = useState(false)
  const dateRandom = new Date(1598051730000)

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 2 }}>
      <View>
        {/* <Text style={{...text2, fontWeight: 'bold'}}>{client.Name}</Text> */}
        {/* <Text style={style1}>{program.Name}</Text> */}
        <ClientName clientID={program.Client} disabled={true} style={iStyles.text1} />
        <View style={{ flexDirection: "row" }}>
          <Text style={style1}>{translate("trainClientsScreen.Completed")}?</Text>
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
        {seeDatePicker ? (
          <View
            style={[
              {
                width: "100%",
              },
            ]}
          >
            {/* moment(inputDateStamp).toDate() */}
            <DateTimePicker
              value={
                moment(
                  program.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn,
                ).toDate() || dateRandom
              }
              onChange={(event, newDate) => {
                const date2 = newDate || dateRandom
                setSeeDatePicker(false)
                props.onChangeDate(date2)
              }}
              mode={"date"}
              display="default"
            />
          </View>
        ) : (
          <Pressable onPress={() => setSeeDatePicker(true)}>
            <Text style={iStyles.text2}>
              {displayDateFromTimestamp2(
                program.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn,
              )}
            </Text>
          </Pressable>
        )}
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
    // console.log(item.id)
    // console.log(programColorsByID)
    // console.log(programColorsByID[item.id])
    const userName =
      userStore.getUserByID(item.item.Client) !== null
        ? userStore.getUserByID(item.item.Client).item.first
        : "No name yet"
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
              {userName}
            </Text>
            <Text style={{ ...text1, textAlign: "center", textAlignVertical: "center" }}>
              {index + 1}
            </Text>
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
      <Button onPress={props.onStartPicking}>Подреди програмите</Button>
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

  const dayEmpty =
    state.currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length === 0
      ? true
      : false

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

  const onChangeDate = newDate => {
    console.log(newDate)
    const newState = currentProgram
    newState.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn = getStampFromDate(newDate)
    setState({ ...state, currentProgram: { ...newState } })
  }

  const onEditSetsRepsHandler = exerciseIndex => {
    console.log("tried editing", exerciseIndex)
  }

  return (
    <ScrollView style={{ height: "100%" }}>
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
