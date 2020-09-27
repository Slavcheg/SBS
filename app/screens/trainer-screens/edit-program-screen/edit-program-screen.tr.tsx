import React, { useState, useEffect, useReducer, useCallback } from "react"
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

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", // TODO: Remove when fixed
])

import { spacing, color, styles } from "../../../theme"
import { Screen, MainHeader_Tr, ButtonSquare } from "../../../components"
import ProgressCircle from "react-native-progress-circle"
import { displayDateFromTimestamp, today_vs_last_day } from "../../../global-helper"
import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { autorun } from "mobx"
import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"
import { SwipeRow } from "react-native-swipe-list-view"

import { Button } from "react-native-paper"

import {
  ExercisePicker,
  ButtonsRow,
  ShowProgramDays,
  EditProgramReducer,
  ProgramViewHeadeer,
} from "./ProgramsTool - Helper functions"

import iStyles from "./Constants/Styles"
import { getSnapshot, onSnapshot } from "mobx-state-tree"

interface EditProgramScreenProps extends NavigationProps {}

const initialState = {
  selectedMuscleGroup: "chest",

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

type ShowProgramProps = { programID: string }

const ShowProgram: React.FC<ShowProgramProps> = observer(props => {
  const { programID } = props
  const programsStore = useStores().trainingProgramsStore
  const [testFullProgram, setTestFullProgram] = useState(programsStore.program(programID).item)

  const [state, dispatch] = useReducer(EditProgramReducer, { ...initialState, ...props.state })

  useEffect(() => {
    programsStore.getItems()
    setTestFullProgram(programsStore.program(programID).item)
  }, [programsStore])

  type increaseDecrease = "increase" | "decrease"

  const onChangeWeekHandler = (increseDecrease: increaseDecrease) => {
    dispatch({
      type: "change current week by one",
      value: increseDecrease,
      weekLength: programsStore.program(programID).item.Weeks.length,
    })
  }

  const onChangeProgramNameHandler = (newName: string) => {
    console.log("tried changing name to ", newName)
  }

  const test = programsStore.program(programID).item.Weeks[0].Days[0].Exercises.length
  // let observedProgram = programsStore.program(programID).item
  // onSnapshot(programsStore, snapshot => {
  //   console.log("snapshot", snapshot)
  // })

  return (
    <View>
      <ProgramViewHeadeer
        program={testFullProgram}
        state={state}
        onChangeWeek={onChangeWeekHandler}
        onChangeProgramName={onChangeProgramNameHandler}
      />
      {/* <Text>{programsStore.program(programID).item.Weeks[0].Days[0].Exercises.length}</Text>
      <Text>{test}</Text> */}
      <ShowProgramDays
        program={testFullProgram}
        programID={programID}
        state={state}
        mode="oneDay"
        testProgram3={testFullProgram}
        forceRender={test}
        //  client={client}
      />
    </View>
  )
})

export const EditProgramScreen: React.FunctionComponent<EditProgramScreenProps> = observer(
  props => {
    const { navigation, route } = props
    const programID = route.params.programID
    const sessionStore = useStores().sessionStore
    const userStore2 = useStores().userStore2
    const programsStore = useStores().trainingProgramsStore
    const exercisesStore = useStores().exerciseDataStore
    const rootStore = useStores()

    const [state, dispatch] = useReducer(EditProgramReducer, initialState)

    const windowWidth = useWindowDimensions().width
    const windowHeight = useWindowDimensions().height

    useEffect(() => {
      programsStore.getItems()
    }, [programsStore])

    useEffect(() => {
      const onBackPress = () => {
        console.log(state.isExercisePickerShown)
        if (state.isExercisePickerShown) {
          dispatch({ type: "close exercise picker" })
          return true
        } else if (state.isEditExerciseModalVisible) {
          dispatch({ type: "stop editing an exercise" })
          return true
        } else {
          onSaveProgramHandler()
          return false
        }
      }

      BackHandler.addEventListener("hardwareBackPress", onBackPress)

      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
    }, [state.isExercisePickerShown, state.isEditExerciseModalVisible])

    const testHandler = () => {
      console.log(
        "test complete",
        exercisesStore.filteredByMuscleGroup[state.selectedMuscleGroup].length,
      )
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
      programsStore.saveProgram(programID)
    }

    const onPressSearchHandler = () => {
      dispatch({ type: "search exercies directly" })
    }

    const onPressMuscleGroupFilterHandler = newMuscleGroup => {
      dispatch({ type: "choose another muscle group", value: newMuscleGroup })
    }

    const onAddNewExerciseHandler = exercise => {
      // console.log(programID, state, exercisesStore.getExerciseByName(exercise.Name))
      programsStore.addExercise(programID, state, exercisesStore.getExerciseByName(exercise.Name))
      dispatch({ type: "after adding exercise from picker" })
    }

    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <ButtonsRow
          isVisible={true}
          // isVisible={state.isButtonsRowShown}
          onPressMuscleGroup={onPressMuscleGroupFilterHandler}
          // onPressSearch={onPressSearchHandler}
          onPressSearch={testHandler}
          goBack={onGoBackHandler}
        />

        <ExercisePicker
          shownArray={exercisesStore.filteredByMuscleGroup[state.selectedMuscleGroup]}
          onClickMainText={onAddNewExerciseHandler}
          isVisible={state.isExercisePickerShown}
          autoFocusSearch={state.autoFocusSearch}

          // shownArray={filteredExercises[selectedMuscleGroupName]}
          // onClickMainText={onAddNewExerciseHandler}
          // isVisible={state.isExercisePickerShown}

          // onClickV={(item) => {
          //   navigation.navigate('ViewExerciseScreen', {
          //     exercise: item,
          //   });
          // }}
        />

        <ShowProgram programID={programID} />

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Button onPress={testHandler}>test</Button>
        </View>
      </View>
    )
  },
)
