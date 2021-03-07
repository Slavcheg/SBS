import React, { useState, useEffect, useReducer, useCallback, useRef } from "react"
import { useFocusEffect } from "@react-navigation/native"

import firestore from "@react-native-firebase/firestore"

import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  AlertButton,
  useWindowDimensions,
} from "react-native"

import _ from "lodash"

import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { useGlobalState, getState } from "../../../models/global-state-regular"
import { Button, TextInput, Checkbox } from "react-native-paper"

import {
  ExercisePicker,
  ButtonsRow,
  ShowProgramDays,
  EditProgramReducer,
  ProgramViewHeader,
  EasyNumberPicker,
  GetText,
  EditExerciseModal,
  ShowProgramMoreInfo,
  TextWithInfoBaloon,
  SmallIconButton,
  ProgramPicker,
  getWeightEquivalent,
  ExerciseProgressChart,
  filteredByMuscleGroup,
  getInitialState,
  EditProgramHeader,
} from "./ProgramsTool - Helper functions"

import iStyles from "./Constants/Styles"
import { NO_CLIENT_YET } from "./Constants"

import { state, TRAINING_PROGRAMS_COLLECTION } from "../../../components3"

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

const greyedoutSetsAndRepsAlert = (onConfirmEdit: Function) => {
  Alert.alert(
    "Внимание",
    "Този ден вече е направен и не трябва да се променя по случайност",
    [{ text: "Върни ме назад" }, { text: "Искам да променя нещо!", onPress: onConfirmEdit }],
    { cancelable: true },
  )
}

const changeUserAlert = (onRemove: Function) => {
  Alert.alert(
    "Внимание",
    "Сигурен ли си, че искаш да смениш трениращия? Той вече има приключени дни",
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
let scrollEnabled = true

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
  onChangeClient: Function
  onReplaceExercise: Function
  onToggleReorder?: Function
  onToggleProgramCompleted?: Function
  onAddWeek?: Function
  onRemoveWeek?: Function
  onPressCopy?: Function
  onAddExercise?: Function
  scrollPosition: number
  changeScroll: Function
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
    onChangeClient,
    onReplaceExercise,
    onToggleReorder,
    onAddExercise,
    state,
  } = props
  const { currentProgram, currentWeekIndex, currentDayIndex, currentExerciseIndex } = props.state

  const windowWidth = useWindowDimensions().width

  const scrollRef = useRef()

  useEffect(() => {
    const onBackPress = () => {
      if (props.scrollPosition === 1) {
        scroll(-1)
        return true
        // } else if (state.isEditExerciseModalVisible) {
        //   dispatch({ type: "stop editing an exercise" })
        //   return true
      } else return false
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [props.scrollPosition])

  const onScroll = obj => {
    if (obj.nativeEvent.contentOffset.x > 0) {
      if (props.scrollPosition !== 1) props.changeScroll(1)
    } else {
      if (props.scrollPosition !== 0) props.changeScroll(0)
    }
  }

  const scroll = page => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({ x: page * windowWidth, y: 0, animated: true })
  }

  // useEffect(() => {
  //   returnScrollToStart()
  // }, [])

  const SCROLL_SIZE = 3

  const scrollRef2 = useRef()
  const onScroll2 = obj => {
    console.log(obj.nativeEvent.contentOffset.x)
    // if (scrollEnabled) {
    //   if (obj.nativeEvent.contentOffset.x > SCROLL_SIZE + 1) {
    //     onChangeWeek({ type: "increase" })
    //     console.log("tried changing one up")
    //     scrollEnabled = false
    //     setTimeout(() => (scrollEnabled = true), 300)
    //   }
    //   if (obj.nativeEvent.contentOffset.x < SCROLL_SIZE - 1) {
    //     onChangeWeek({ type: "decrease" })
    //     console.log("tried changing one down")
    //     scrollEnabled = false
    //     setTimeout(() => (scrollEnabled = true), 300)
    //   }
    // }
    // returnScrollToStart()
  }
  const [currentScrolledPage, setCurrentScrolledPage] = useState(0)
  const onScroll2End = obj => {
    const pageIndex = Math.round(obj.nativeEvent.contentOffset.x / windowWidth)
    onChangeWeek({
      type: "custom",
      weekValue: pageIndex,
      dayValue: 0,
    })
    setCurrentScrolledPage(pageIndex)
  }

  const scroll2to = page => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollTo({ x: page * windowWidth, y: 0, animated: true })
      setCurrentScrolledPage(page)
    }
  }

  useEffect(() => {
    //find first uncompleted day and scroll to that day's screen
    if (currentProgram) {
      let newWeekIndex = 0
      newWeekIndex = getInitialState(currentProgram).currentWeekIndex
      scroll2to(newWeekIndex)
    }
  }, [currentProgram])

  useEffect(() => {
    if (currentProgram) {
      if (currentScrolledPage !== currentWeekIndex) scroll2to(currentWeekIndex)
    }
  }, [currentWeekIndex])

  return (
    <View style={{ flex: 1 }}>
      <ProgramViewHeader
        state={state}
        onChangeProgramName={onChangeProgramName}
        onChangeWeek={onChangeWeek}
        onChangeClient={onChangeClient}
        onAddWeek={props.onAddWeek}
        onRemoveWeek={props.onRemoveWeek}
        onPressCopy={props.onPressCopy}
      />

      <ScrollView>
        <ScrollView
          horizontal={true}
          ref={scrollRef2}
          onMomentumScrollEnd={onScroll2End}
          pagingEnabled={true}
        >
          {currentProgram.Weeks.map((week, weekIndex) => {
            return (
              <View style={iStyles.carouselScreen} key={weekIndex}>
                <ShowProgramDays
                  state={{ ...state, currentWeekIndex: weekIndex }}
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
                  onReplaceExercise={onReplaceExercise}
                  onToggleReorder={onToggleReorder}
                  onAddExercise={onAddExercise}
                />
              </View>
            )
          })}
        </ScrollView>
        <View style={iStyles.carouselScreen}>
          <ShowProgramMoreInfo
            state={state}
            onChangeProgramName={onChangeProgramName}
            onToggleProgramCompleted={props.onToggleProgramCompleted}
          />
        </View>
      </ScrollView>
    </View>
  )
})

export const EditProgramScreen: React.FC<EditProgramScreenProps> = observer(props => {
  const { navigation, route } = props
  const { programID, otherProgramIDs, trainerID } = route.params
  const [globalState, setGlobalState] = useGlobalState()
  const [scrollPosition, setScrollPosition] = useState(0)
  // const  = route.params.otherProgramIDs

  const initialState = {
    selectedMuscleGroup: "chest",

    // currentProgram: globalState.allPrograms.find(program => program.id === programID).item || null,
    currentProgram: null,
    programID: route.params.programID,
    isExercisePickerShown: false,
    isButtonsRowShown: false,
    isProgramViewBig: true,
    shownExercises: [],
    oldExercises: [],

    currentWeekIndex: 0,
    currentDayIndex: 0,
    currentExerciseIndex: 0,
    deselectAllDays: false,
    isEditExerciseModalVisible: false,
    isManuallySearchingExercises: false,
    isKeyboardActive: false,
    isProgramSaving: false,
    isProgramSaved: true,
    isProgramViewShown: true,
    isProgramSettingsModalVisible: false,
    autoFocusSearch: false,
    isReordering: false,
    isReplacingExercise: false,
    isCopyProgramViewShown: false,
    isButtonsRowExpanded: false,
  }

  const [state, dispatch] = useReducer(EditProgramReducer, initialState)
  const {
    currentProgram,
    currentProgramID,
    currentWeekIndex,
    currentDayIndex,
    currentExerciseIndex,
    isReordering,
    isReplacingExercise,
    isCopyProgramViewShown,
  } = state
  let mounted = true

  useEffect(() => {
    console.log("trying to get state")
    getState(setGlobalState)
    return () => (mounted = false)
  }, [])

  useEffect(() => {
    if (globalState.allPrograms.length > 0) {
      const allProgramsDownloaded = globalState.allPrograms
      const ourProgram = _.cloneDeep(
        allProgramsDownloaded.find(program => program.id === globalState.currentProgramID),
      )
      const oldPrograms = getOtherPrograms(allProgramsDownloaded, ourProgram.id)
      dispatch({
        type: "update current program",
        value: ourProgram.item,
        oldPrograms: oldPrograms,
        allPrograms: globalState.allPrograms,
        allUsers: globalState.allUsers,
        exercises: globalState.allExercises,
      })
      console.log("updated programs from state")
    }
  }, [globalState.allPrograms])

  useEffect(() => {
    const onTimePassed = () => {
      if (mounted && globalState.allPrograms.length === 0) {
        navigation.goBack()
      }
    }

    setTimeout(onTimePassed, 5000)
  }, [])

  useEffect(() => {
    const onBackPress = () => {
      if (state.isExercisePickerShown) {
        dispatch({ type: "close exercise picker" })
        return true
      } else {
        onSaveProgramHandler()
        return false
      }
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [state.isExercisePickerShown])

  const onGoBackHandler = () => {
    if (state.isExercisePickerShown) {
      dispatch({ type: "close exercise picker" })
      // } else if (state.isEditExerciseModalVisible) {
      //   dispatch({ type: "stop editing an exercise" })
    } else {
      onSaveProgramHandler()
      navigation.goBack()
    }
  }

  const onSaveProgramHandler = async () => {
    if (currentProgram) {
      setGlobalState({
        type: "update one program",
        programID: globalState.currentProgramID,
        value: _.cloneDeep(currentProgram),
      })
      await firestore()
        .collection(TRAINING_PROGRAMS_COLLECTION)
        .doc(globalState.currentProgramID)
        .update(currentProgram)
        .catch(err => console.error(err))
    }
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

  type increaseDecreaseObject = {
    type: "increase" | "decrease" | "custom"
    weekValue?: number
    dayValue?: number
  }
  const onChangeWeek = (increseDecrease: increaseDecreaseObject) => {
    dispatch({
      type: "change current week by one",
      value: increseDecrease.type,
      newWeekValue: increseDecrease.weekValue || 0,
      newDayValue: increseDecrease.dayValue || 0,
      weekLength: currentProgram.Weeks.length,
    })
  }

  const onChangeProgramName = (newName: string) => {
    dispatch({ type: "edit field", field: "program name", value: newName })
    setTimeout(onSaveProgramHandler, 100)
  }

  const onRemoveDayHandler = dayIndexToRemove => {
    const onRemoveInsideHandler = () => {
      dispatch({ type: "remove day", value: dayIndexToRemove })
      setTimeout(onSaveProgramHandler, 100)
    }
    if (currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises.length !== 0)
      removeDayAlert(currentProgram.Weeks[currentWeekIndex].Days.length, onRemoveInsideHandler)
    else onRemoveInsideHandler()
  }
  const onAddNewDayHandler = () => {
    dispatch({ type: "add new day" })
    setTimeout(onSaveProgramHandler, 100)
  }

  const onChangeDayNameHandler = (newName, dayIndex) => {
    dispatch({
      type: "edit field",
      field: "day name",
      value: newName,
      dayIndex: dayIndex,
    })
    setTimeout(onSaveProgramHandler, 100)
  }
  const onToggleDayCompletedHandler = (dayIndex, newDate?) => {
    dispatch({ type: "toggle day completed", dayIndex: dayIndex, newDate: newDate })
    setTimeout(onSaveProgramHandler, 100)
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
    setTimeout(onSaveProgramHandler, 100)
  }

  const onDeleteExerciseHandler = (exerciseIndex, dayIndex) => {
    dispatch({ type: "delete exercise", value: exerciseIndex, dayIndex: dayIndex })
    setTimeout(onSaveProgramHandler, 100)
  }
  const onEditPositionHandler = (exerciseIndex, dayIndex) => {
    dispatch({ type: "change position number", value: exerciseIndex, dayIndex: dayIndex })
  }
  const onExpandExerciseInfo = (exerciseIndex, dayIndex) => {
    dispatch({
      type: "expand exercise info",
      value: exerciseIndex,
      dayIndex: dayIndex,
    })
  }
  const onEditSetsRepsHandler = (exerciseIndex, dayIndex) => {
    const onConfirm = () =>
      dispatch({
        type: "open modal and start editing exercise",
        value: exerciseIndex,
        dayIndex: dayIndex,
      })
    if (currentProgram.Weeks[currentWeekIndex].Days[dayIndex].isCompleted)
      greyedoutSetsAndRepsAlert(onConfirm)
    else onConfirm()
  }

  const onCloseExerciseModal = newExercise => {
    dispatch({ type: "close modal and update exercise", value: newExercise })
    setTimeout(onSaveProgramHandler, 100)
  }

  const onRequestCloseExerciseModal = () => {
    dispatch({ type: "close EditExerciseModal" })
  }

  const onChangeClient = newClientID => {
    if (newClientID !== currentProgram.Client)
      if (!currentProgram.Weeks[0].Days[0].isCompleted)
        dispatch({ type: "change client", value: newClientID })
      else changeUserAlert(() => dispatch({ type: "change client", value: newClientID }))
  }

  const onReplaceExercise = (exerciseIndex, dayIndex) => {
    console.log("tried replacing exercise ", exerciseIndex)
    dispatch({
      type: "replace exercise with another from picker",
      value: exerciseIndex,
      dayIndex: dayIndex,
    })
    setTimeout(onSaveProgramHandler, 100)
  }

  const onToggleReorder = dayIndex => {
    dispatch({ type: "toggle reorder", dayIndex: dayIndex })
  }

  const onToggleProgramCompleted = () => {
    dispatch({ type: "toggle program completed status" })
  }

  const onAddWeek = () => {
    dispatch({ type: "add week" })
  }
  const onRemoveWeek = () => {
    dispatch({ type: "remove week" })
  }

  const onPressCopy = () => {
    dispatch({ type: "start to copy from another program" })
  }

  const onCloseProgramPicker = () => {
    dispatch({ type: "close program picker without choosing a program" })
  }

  const onCopyProgram = program => {
    dispatch({ type: "copy program and close ProgramPicker", value: program })
    console.log(program.id)
  }

  const onAddExercise = (dayIndex, weekIndex) => {
    dispatch({
      type: "add exercise from end of day button",
      dayIndex: dayIndex,
      weekIndex: weekIndex,
    })
  }

  const onChangeScroll = (newPosition: number) => {
    setScrollPosition(newPosition)
  }

  const onPressHeaderMenu = () => {
    Alert.alert("", "Това още не сме го измислили :(", [{ text: "еми ок" }], {
      cancelable: false,
    })
  }

  // const filteredAll = filteredByMuscleGroup(globalState.allExercises)
  const filteredAll = globalState.filteredExercises || []

  return (
    <View style={iStyles.screenViewWrapper}>
      <EditProgramHeader onPressBack={onGoBackHandler} onPressMenu={onPressHeaderMenu} />
      <ButtonsRow
        isVisible={state.isButtonsRowShown}
        onPressMuscleGroup={onPressMuscleGroupFilterHandler}
        onPressSearch={onPressSearchHandler}
        goBack={onGoBackHandler}
        onExpand={() => dispatch({ type: "expand buttons row" })}
        onCollapse={() => dispatch({ type: "collapse buttons row" })}
      />
      <ProgramPicker
        isVisible={isCopyProgramViewShown}
        programs={state.allPrograms}
        onGoBack={onCloseProgramPicker}
        state={state}
        onCopyWholeProgram={onCopyProgram}
      />
      <ExercisePicker
        shownArray={filteredAll[state.selectedMuscleGroup]}
        onClickMainText={onAddNewExerciseHandler}
        isVisible={state.isExercisePickerShown}
        autoFocusSearch={state.autoFocusSearch}
        state={state}
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
            onRequestClose={onRequestCloseExerciseModal}
          />
        )}
      {currentProgram && state.isProgramViewShown && (
        <View style={styles.programStyle}>
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
            onChangeClient={onChangeClient}
            onReplaceExercise={onReplaceExercise}
            onToggleReorder={onToggleReorder}
            onToggleProgramCompleted={onToggleProgramCompleted}
            onAddWeek={onAddWeek}
            onRemoveWeek={onRemoveWeek}
            onPressCopy={onPressCopy}
            onAddExercise={onAddExercise}
            changeScroll={onChangeScroll}
            scrollPosition={scrollPosition}
          />
        </View>
      )}

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* <Button onPress={testHandler}>😁 test 😁</Button>
        <Button onPress={() => setGlobalState({ type: "test" })}>success</Button>
        <Text>{globalState.allPrograms.length}</Text>
        <Text>
          {globalState.allPrograms.find(program => program.id === globalState.currentProgramID)
            ? JSON.stringify(
                globalState.allPrograms.find(program => program.id === globalState.currentProgramID)
                  .item.Weeks,
              )
            : ""}
        </Text>
        <Text>{globalState.test || ""}</Text>
        <Text>{globalState.currentProgramID || "no id"}</Text> */}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  programStyle: {
    // minHeight: 350,
    // maxHeight: "100%",
    // minHeight: Dimensions.get("window").height,
    height: "90%",
    flexGrow: 1,
  },
})

const getOtherPrograms = (allPrograms, thisProgramID) => {
  console.log("trying to get old programs, allPrograms, thisProgramID")
  console.log(allPrograms.length, thisProgramID)
  const editedProgram = allPrograms.find(program => program.id === thisProgramID)
  if (editedProgram.item.Client === NO_CLIENT_YET) return []
  const thisClientAllPrograms = allPrograms.filter(
    program => program.item.Client === editedProgram.item.Client,
  )
  const thisClientOtherPrograms = thisClientAllPrograms.filter(
    program => program.id != thisProgramID,
  )
  console.log(thisClientOtherPrograms)
  return thisClientOtherPrograms
}
