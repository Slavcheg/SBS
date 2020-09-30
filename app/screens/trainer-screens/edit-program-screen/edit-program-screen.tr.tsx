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
} from "react-native"

import _ from "lodash"

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", // TODO: Remove when fixed
])

import { spacing, color, styles } from "../../../theme"
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
} from "./ProgramsTool - Helper functions"

import iStyles from "./Constants/Styles"
import { getSnapshot, onSnapshot } from "mobx-state-tree"
import {
  EMPTY_PROGRAM_DATA2,
  state,
  TRAINING_PROGRAMS_COLLECTION,
  DEFAULT_SET_DATA2,
} from "../../../models/sub-stores"
import * as fb from "../../../services/firebase/firebase.service"

import { MAX_SETS, MAX_REPS } from "./Constants/programCreationConstants"

interface EditProgramScreenProps extends NavigationProps {}

const removeDayAlert = (currentDaysLength: number, onRemove: Function) => {
  if (currentDaysLength === 1)
    Alert.alert("", "В програмата има само един ден", [{ text: "Добре" }], {
      cancelable: false,
    })
  else
    Alert.alert(
      "Внимание",
      "Сигурен ли си, че искаш да изтриеш целия ден?",
      [
        {
          text: "Не искам",
          // style: 'cancel',
        },
        {
          text: "Да!",
          onPress: onRemove,
        },
      ],
      { cancelable: true },
    )
}

type EditExerciseModalProps = {
  visible: boolean
  exercise: any
  onClose: Function
}

const EditExerciseModal = (props: EditExerciseModalProps) => {
  const { visible } = props
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height

  const [exerciseState, setExerciseState] = useState(props.exercise)

  useEffect(() => {
    setExerciseState({ ...props.exercise })
  }, [props.exercise])

  const onChangeNumberOfSets = newNumberOfSets => {
    const newSets = []
    for (let i = 0; i < newNumberOfSets; i++)
      newSets.push({
        ...DEFAULT_SET_DATA2,
        Reps: exerciseState.Sets[0].Reps,
        Weight: exerciseState.Sets[0].Weight,
        WeightType: exerciseState.Sets[0].WeightType,
      })

    setExerciseState({ ...exerciseState, Sets: [...newSets] })
  }
  const onChangeReps = (newValue, setIndex) => {
    let newSets = [...exerciseState.Sets]

    if (setIndex === 0) {
      for (let i = 0; i < newSets.length; i++) {
        newSets[i].Reps = newValue
      }
    } else newSets[setIndex].Reps = newValue

    setExerciseState({ ...exerciseState, Sets: [...newSets] })
  }

  const onChangeWeight = (newValue, setIndex) => {
    let dummyExercise = { ...exerciseState }

    // weight value is saved as string

    //if is not a number > change type to 'other'
    //if first set > change all sets

    if (Number.isNaN(parseInt(newValue))) {
      for (let i = 0; i < dummyExercise.Sets.length; i++) dummyExercise.Sets[i].WeightType = "other"
    }
    if (setIndex === 0) {
      for (let i = 0; i < dummyExercise.Sets.length; i++) {
        dummyExercise.Sets[i].Weight = newValue
      }
    } else dummyExercise.Sets[setIndex].Weight = newValue

    setExerciseState({ ...exerciseState, ...dummyExercise })
  }

  const onUpdateRepsProgression = newValue => {
    setExerciseState({ ...exerciseState, increaseReps: newValue })
  }
  const onUpdateWeightProgression = newValue => {
    setExerciseState({ ...exerciseState, increaseWeight: newValue })
  }
  if (!visible) return <View></View>
  else
    return (
      <Modal visible={visible}>
        <View
          style={{
            position: "absolute",
            top: 10,
            bottom: 10,
            backgroundColor: "white",
            justifyContent: "center",
            height: windowHeight * 0.85,
            width: windowWidth,
          }}
        >
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                width: windowWidth,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...iStyles.text2,
                    textAlign: "center",
                  }}
                >
                  {exerciseState.Name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  position: "absolute",
                  right: 10,
                }}
              >
                <Button
                  onPress={() => {
                    props.onClose(exerciseState)
                  }}
                >
                  ok
                </Button>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // borderWidth: 1,
              }}
            >
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <Text style={iStyles.text1}>Sets</Text>
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <EasyNumberPicker
                    easyNumbers={[2, 3, 4, 5]}
                    isActive={true}
                    currentlySelected={exerciseState.Sets.length}
                    textStyle={{ color: iStyles.text1.color }}
                    easyMode="horizontal"
                    onLongPressMode="picker"
                    validSelection={MAX_SETS}
                    onChange={value => {
                      onChangeNumberOfSets(value)
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <Text
                    style={{
                      ...iStyles.text1,
                      fontSize: 17,
                      textAlign: "center",
                    }}
                  >
                    +Reps progession
                  </Text>
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <EasyNumberPicker
                    easyNumbers={[0, 1, 2]}
                    easyMode="horizontal"
                    onLongPressMode="get text"
                    isActive={true}
                    currentlySelected={exerciseState.increaseReps}
                    onChange={value => {
                      onUpdateRepsProgression(value)
                    }}
                    textStyle={{ color: iStyles.text1.color }}
                  />
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <Text
                    style={{
                      ...iStyles.text1,
                      fontSize: 17,
                      textAlign: "center",
                    }}
                  >
                    +Weight progession
                  </Text>
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <EasyNumberPicker
                    easyNumbers={[0, 1, 2.5]}
                    easyMode="horizontal"
                    onLongPressMode="get text"
                    isActive={exerciseState.WeightType === "pureWeight" ? false : true}
                    currentlySelected={exerciseState.increaseWeight}
                    onChange={value => {
                      onUpdateWeightProgression(value)
                    }}
                    textStyle={{ color: iStyles.text1.color }}
                  />
                </View>
              </View>
            </View>
            {exerciseState.Sets.map((set, setIndex) => (
              <View key={setIndex}>
                <Text style={{ ...iStyles.text1, textAlign: "center" }}>Set {setIndex + 1}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <Text style={{ ...iStyles.text1, fontSize: 17 }}>Reps</Text>
                    </View>
                  </View>

                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <Picker
                        mode={"dropdown"}
                        selectedValue={exerciseState.Sets[setIndex].Reps}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(itemValue, itemIndex) => {
                          onChangeReps(itemValue, setIndex)
                        }}
                      >
                        {MAX_REPS.map(value => (
                          <Picker.Item key={value} label={value.toString()} value={value} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  {/* //// Weight management */}

                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <Text style={{ ...iStyles.text1, fontSize: 17 }}>Weight</Text>
                    </View>
                  </View>

                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <GetText
                        isNumber={true}
                        convertToString={true}
                        startingValue={exerciseState.Sets[setIndex].Weight}
                        onEnd={value => {
                          onChangeWeight(value, setIndex)
                          // dispatch({
                          //   type: 'change weight',
                          //   value: value,
                          //   currentSetIndex: setIndex,
                          // });
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    )
}

type ShowProgramProps = {
  state: state

  onRemoveDay: Function
  onAddNewDay: Function
  onChangeDay: Function
  onChangeWeek: Function
  onChangeDayName: Function
  onToggleDayCompleted: Function
  onExpandMoreInfoAllExercises: Function
  onDragEndHandler: Function
  onDeleteExerciseHandler: Function
  onEditPositionHandler: Function
  onEditSetsRepsHandler: Function
  onExpandExerciseInfo: Function
  onChangeProgramName: Function
}

const ShowProgram: React.FC<ShowProgramProps> = observer(props => {
  const {
    onRemoveDay,
    onAddNewDay,
    onChangeDay,
    onChangeDayName,
    onToggleDayCompleted,
    onExpandMoreInfoAllExercises,
    onDragEndHandler,
    onDeleteExerciseHandler,
    onEditPositionHandler,
    onEditSetsRepsHandler,
    onExpandExerciseInfo,
    onChangeWeek,
    onChangeProgramName,
    state,
  } = props
  const { currentProgram, currentWeekIndex, currentDayIndex, currentExerciseIndex } = props.state

  return (
    <View>
      <ProgramViewHeader
        state={state}
        onChangeProgramName={onChangeProgramName}
        onChangeWeek={onChangeWeek}
      />

      <ShowProgramDays
        state={state}
        mode="allDays"
        //  client={client}
        onRemoveDay={onRemoveDay}
        onAddNewDay={onAddNewDay}
        onChangeDay={onChangeDay}
        onChangeDayName={onChangeDayName}
        onToggleDayCompleted={onToggleDayCompleted}
        onExpandMoreInfoAllExercises={onExpandMoreInfoAllExercises}
        onDragEndHandler={onDragEndHandler}
        onDeleteExerciseHandler={onDeleteExerciseHandler}
        onEditPositionHandler={onEditPositionHandler}
        onEditSetsRepsHandler={onEditSetsRepsHandler}
        onExpandExerciseInfo={onExpandExerciseInfo}
      />
    </View>
  )
})

export const EditProgramScreen: React.FC<EditProgramScreenProps> = observer(props => {
  const { navigation, route } = props
  const programID = route.params.programID
  const sessionStore = useStores().sessionStore
  const userStore2 = useStores().userStore2
  const programsStore = useStores().trainingProgramsStore
  const exercisesStore = useStores().exerciseDataStore
  const rootStore = useStores()

  const initialState = {
    selectedMuscleGroup: "chest",
    // currentProgram: programsStore.programSnapshot(programID),
    currentProgram: null,
    programID: route.params.programID,
    isExercisePickerShown: false,
    isButtonsRowShown: true,
    isProgramViewBig: true,
    shownExercises: [],

    currentWeekIndex: 0,
    currentDayIndex: 0,
    currentExerciseIndex: 0,
    isEditExerciseModalVisible: false,
    isManuallySearchingExercises: false,
    isKeyboardActive: false,
    isProgramSaving: false,
    isProgramSaved: true,
    isProgramViewShown: true,
    isProgramSettingsModalVisible: false,
    autoFocusSearch: false,
  }

  const [state, dispatch] = useReducer(EditProgramReducer, initialState)

  const getPrograms = async () => {
    let allPrograms = await fb.getItems(TRAINING_PROGRAMS_COLLECTION)

    let ourProgram = allPrograms.find(program => program.id === programID)

    dispatch({ type: "update current program", value: ourProgram.item })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPrograms()
    })
    return unsubscribe
  }, [navigation])

  const {
    currentProgram,
    currentProgramID,
    currentWeekIndex,
    currentDayIndex,
    currentExerciseIndex,
  } = state

  useEffect(() => {
    const onBackPress = () => {
      if (state.isExercisePickerShown) {
        dispatch({ type: "close exercise picker" })
        return true
        // } else if (state.isEditExerciseModalVisible) {
        //   dispatch({ type: "stop editing an exercise" })
        //   return true
      } else {
        onSaveProgramHandler()
        return false
      }
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [state.isExercisePickerShown, state.isEditExerciseModalVisible])

  const testHandler = () => {
    console.log("test complete")
  }

  const onGoBackHandler = () => {
    if (state.isExercisePickerShown) {
      dispatch({ type: "close exercise picker" })
    } else if (state.isEditExerciseModalVisible) {
      dispatch({ type: "stop editing an exercise" })
    } else {
      onSaveProgramHandler()
      navigation.goBack()
    }
  }

  const onSaveProgramHandler = () => {
    console.log("currentProgram", currentProgram)
    fb.updateItem(programID, currentProgram, TRAINING_PROGRAMS_COLLECTION)

    // programsStore.saveProgram(programID, currentProgram)
  }

  const onPressSearchHandler = () => {
    dispatch({ type: "search exercies directly" })
  }

  const onPressMuscleGroupFilterHandler = newMuscleGroup => {
    dispatch({ type: "choose another muscle group", value: newMuscleGroup })
  }

  const onAddNewExerciseHandler = exercise => {
    dispatch({ type: "add exercise from picker", value: exercise })
  }

  const onChangeDay = newIndex => {
    dispatch({ type: "change day", value: newIndex })
  }

  type increaseDecrease = "increase" | "decrease"
  const onChangeWeek = (increseDecrease: increaseDecrease) => {
    dispatch({
      type: "change current week by one",
      value: increseDecrease,
      weekLength: currentProgram.Weeks.length,
    })
  }

  const onChangeProgramName = (newName: string) => {
    dispatch({ type: "edit field", field: "program name", value: newName })
  }

  const onRemoveDayHandler = dayIndexToRemove => {
    const onRemoveInsideHandler = () => {
      dispatch({ type: "remove day" })
    }
    if (currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length !== 0)
      removeDayAlert(currentProgram.Weeks[currentWeekIndex].Days.length, onRemoveInsideHandler)
    else onRemoveInsideHandler()
  }
  const onAddNewDayHandler = () => {
    dispatch({ type: "add new day" })
  }

  const onChangeDayNameHandler = (newName, dayIndex) => {
    dispatch({
      type: "edit field",
      field: "day name",
      value: newName,
      dayIndex: dayIndex,
    })
  }
  const onToggleDayCompletedHandler = dayIndex => {
    dispatch({ type: "toggle day completed", value: dayIndex })
  }
  const onExpandMoreInfoAllExercisesHandler = () => {
    let expand = true
    const exercises = currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises
    if (exercises.length > 0) if (exercises[0].isExpanded) expand = false
    dispatch({
      type: "expand more info all exercises",
      expand: expand,
    })
  }

  const onDragEndHandler = (newArray: any[]) => {
    dispatch({
      type: "reorder current program",
      exercises: newArray,
    })
  }

  const onDeleteExerciseHandler = index => {
    dispatch({ type: "delete exercise", value: index })
  }
  const onEditPositionHandler = index => {
    dispatch({ type: "change position number", value: index })
  }
  const onExpandExerciseInfo = index => {
    dispatch({
      type: "expand exercise info",
      value: index,
    })
  }
  const onEditSetsRepsHandler = exerciseIndex => {
    dispatch({ type: "open modal and start editing exercise", value: exerciseIndex })
  }

  const onCloseExerciseModal = newExercise => {
    dispatch({ type: "close modal and update exercise", value: newExercise })
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ButtonsRow
        // isVisible={true}
        isVisible={state.isButtonsRowShown}
        onPressMuscleGroup={onPressMuscleGroupFilterHandler}
        onPressSearch={onPressSearchHandler}
        goBack={onGoBackHandler}
      />

      <ExercisePicker
        shownArray={exercisesStore.filteredByMuscleGroup[state.selectedMuscleGroup]}
        onClickMainText={onAddNewExerciseHandler}
        isVisible={state.isExercisePickerShown}
        autoFocusSearch={state.autoFocusSearch}
      />
      {currentProgram &&
        currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length > 0 && (
          <EditExerciseModal
            visible={state.isEditExerciseModalVisible}
            exercise={
              currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises[
                currentExerciseIndex
              ]
            }
            onClose={onCloseExerciseModal}
          />
        )}
      {currentProgram && (
        <ShowProgram
          state={state}
          onChangeDay={onChangeDay}
          onRemoveDay={onRemoveDayHandler}
          onAddNewDay={onAddNewDayHandler}
          onChangeDayName={onChangeDayNameHandler}
          onToggleDayCompleted={onToggleDayCompletedHandler}
          onExpandMoreInfoAllExercises={onExpandMoreInfoAllExercisesHandler}
          onDragEndHandler={onDragEndHandler}
          onDeleteExerciseHandler={onDeleteExerciseHandler}
          onEditPositionHandler={onEditPositionHandler}
          onEditSetsRepsHandler={onEditSetsRepsHandler}
          onExpandExerciseInfo={onExpandExerciseInfo}
          onChangeProgramName={onChangeProgramName}
          onChangeWeek={onChangeWeek}
        />
      )}

      {/* <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Button onPress={testHandler}>test</Button>
      </View> */}
    </View>
  )
})
