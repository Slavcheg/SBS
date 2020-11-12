import React, { useState, useEffect, useReducer, useCallback, useRef } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Picker } from "@react-native-community/picker"

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
import { useStores } from "../../../models/root-store"
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
} from "./ProgramsTool - Helper functions"

import iStyles from "./Constants/Styles"

import {
  EMPTY_PROGRAM_DATA2,
  state,
  TRAINING_PROGRAMS_COLLECTION,
  DEFAULT_SET_DATA2,
  Exercise,
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
    state,
  } = props
  const { currentProgram, currentWeekIndex, currentDayIndex, currentExerciseIndex } = props.state

  const windowWidth = useWindowDimensions().width

  const scrollRef = useRef()

  const scroll = () => {
    if (scrollRef.current) scrollRef.current.scrollTo({ x: windowWidth, y: 0, animated: true })
  }

  useEffect(() => {
    setTimeout(() => scroll(), 10)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ProgramViewHeader
        state={state}
        onChangeProgramName={onChangeProgramName}
        onChangeWeek={onChangeWeek}
        onChangeClient={onChangeClient}
        onAddWeek={props.onAddWeek}
        onRemoveWeek={props.onRemoveWeek}
      />
      <ScrollView horizontal={true} pagingEnabled={true} ref={scrollRef}>
        {/* <View style={iStyles.carouselScreen}> */}
        <View style={{ width: windowWidth }}>
          <Text>ШШшшшт.... това е тайно меню... не казвай на другите!</Text>
        </View>
        <View style={iStyles.carouselScreen}>
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
            onReplaceExercise={onReplaceExercise}
            onToggleReorder={onToggleReorder}
          />
        </View>
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
  const { programID, otherProgramIDs, allPrograms, allUsers } = route.params
  // const  = route.params.otherProgramIDs

  const exercisesStore = useStores().exerciseDataStore

  const initialState = {
    selectedMuscleGroup: "chest",

    currentProgram: null,
    programID: route.params.programID,
    isExercisePickerShown: false,
    isButtonsRowShown: true,
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
  }

  const [state, dispatch] = useReducer(EditProgramReducer, initialState)

  const getPrograms = async () => {
    // let allProgramsDownloaded = await fb.getItems(TRAINING_PROGRAMS_COLLECTION)

    let ourProgram = allPrograms.find(program => program.id === programID)
    const oldPrograms = []
    otherProgramIDs.forEach(otherProgramID => {
      oldPrograms.push(allPrograms.find(program => program.id === otherProgramID))
    })

    dispatch({
      type: "update current program",
      value: ourProgram.item,
      oldPrograms: oldPrograms,
      allPrograms: allPrograms,
      allUsers: allUsers,
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPrograms()
    })
    console.log("refreshed with navigation")
    return unsubscribe
  }, [navigation])

  const {
    currentProgram,
    currentProgramID,
    currentWeekIndex,
    currentDayIndex,
    currentExerciseIndex,
    isReordering,
    isReplacingExercise,
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
    console.log("test complete", currentProgram.Client)
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
    if (currentProgram) fb.updateItem(programID, currentProgram, TRAINING_PROGRAMS_COLLECTION)
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
      dispatch({ type: "remove day" })
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

  const onDeleteExerciseHandler = index => {
    dispatch({ type: "delete exercise", value: index })
    setTimeout(onSaveProgramHandler, 100)
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
    const onConfirm = () =>
      dispatch({ type: "open modal and start editing exercise", value: exerciseIndex })
    if (currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted)
      greyedoutSetsAndRepsAlert(onConfirm)
    else onConfirm()
  }

  const onCloseExerciseModal = newExercise => {
    dispatch({ type: "close modal and update exercise", value: newExercise })
    setTimeout(onSaveProgramHandler, 100)
  }

  const onChangeClient = newClientID => {
    if (!currentProgram.Weeks[0].Days[0].isCompleted)
      dispatch({ type: "change client", value: newClientID })
    else changeUserAlert(() => dispatch({ type: "change client", value: newClientID }))
  }

  const onReplaceExercise = index => {
    console.log("tried replacing exercise ", index)
    dispatch({ type: "replace exercise with another from picker", value: index })
    setTimeout(onSaveProgramHandler, 100)
  }

  const onToggleReorder = () => {
    dispatch({ type: "toggle reorder" })
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

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
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
          />
        </View>
      )}

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* <Button onPress={testHandler}>test</Button> */}
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
