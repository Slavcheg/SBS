import React, { useEffect, useState, useRef } from "react"
import { Text, View, TouchableOpacity, Pressable, Alert, Dimensions } from "react-native"
import { spacing, color, styles } from "../../../theme"
import { Screen, MainHeader_Tr, ButtonSquare, PageHeader_Tr } from "../../../components"
import ProgressCircle from "react-native-progress-circle"
import { displayDateFromTimestamp, today_vs_last_day } from "../../../global-helper"
import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"
import { SwipeRow } from "react-native-swipe-list-view"

import { useGlobalState, getState } from "../../../components3/globalState/global-state-regular"
import { muscleGroups, muscleGroups2, muscleGroupsObject } from "../../../components3/Constants"

import { Button, Checkbox } from "react-native-paper"
import firestore, { firebase } from "@react-native-firebase/firestore"

import _ from "lodash"

import {
  EMPTY_PROGRAM_DATA2,
  state,
  TRAINING_PROGRAMS_COLLECTION,
  DEFAULT_SET_DATA2,
  useGlobalState3,
  T_Program,
} from "../../../components3"
import * as fb from "../../../services/firebase/firebase.service"

import iStyles from "../../../components3/Constants/Styles"

import { getProgramInfo, alertWithInfoString, InfoButton } from "../edit-program-screen/ProgramsTool - Helper functions"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Item } from "react-native-paper/lib/typescript/src/components/List/List"
import { icons, colors } from "../../../components3/Constants"

interface ShowProgramsListProps {
  programs: T_Program[]
  style?: object
  onPressEdit?: Function
  onPressDeleteProgram?: Function
  onPressEditProgram?: Function
  selectedPrograms: string[]
  onPressItem: Function
  removeCompletedPrograms: Function
}

const ShowProgramsList: React.FunctionComponent<ShowProgramsListProps> = props => {
  const [hideCompleted, setHideCompleted] = useState(true)

  const onHideCompleted = () => {
    setHideCompleted(!hideCompleted)

    const newSelectedPrograms = []

    props.programs.forEach((program: T_Program) => {
      if (props.selectedPrograms.includes(program.ID)) if (!program.isCompleted) newSelectedPrograms.push(program.ID)
    })
    props.removeCompletedPrograms(newSelectedPrograms)
  }

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox status={hideCompleted ? "checked" : "unchecked"} onPress={onHideCompleted} color={iStyles.text1.color} />
        <Text style={{ color: iStyles.text0.color }}>Hide completed programs</Text>
      </View>
      {/* {props.programs.length === 1 && (
        <Text style={{ textAlign: "center" }}>
          {translate("selectPrograms.ProgramsFound1")} {props.programs.length}{" "}
          {translate("selectPrograms.ProgramsFound2")}
        </Text>
      )}
      {props.programs.length !== 1 && (
        <Text style={{ textAlign: "center" }}>
          {translate("selectPrograms.ProgramsFound1")} {props.programs.length}{" "}
          {translate("selectPrograms.ProgramsFound2-Plural")}
        </Text>
      )} */}

      {props.programs.length > 0 &&
        props.programs.map((program: T_Program, index) => {
          const programName = props.programs[index].Name
          let programSelected = props.selectedPrograms.includes(program.ID) ? true : false
          let textStyle = {
            fontSize: 19,
            color: programSelected ? iStyles.text1.color : iStyles.text0.color,
          }

          let checkedStatus = false
          if (props.selectedPrograms.length > 0)
            props.selectedPrograms.forEach(programIDList => {
              if (programIDList === program.ID) checkedStatus = true
            })
          if (hideCompleted) if (program.isCompleted) return <View key={program.ID}></View>

          let moreInfoString = ""
          let infoObject = getProgramInfo(program, true)
          if (infoObject.LastTrainedOn !== "Never")
            moreInfoString = `${infoObject.TrainingsDone} done, last on ${infoObject.LastTrainedOn}`
          else moreInfoString = `${infoObject.TrainingsDone} trainings done`
          return (
            <View key={program.ID}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ backgroundColor: iStyles.backGround.color }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onLongPress={() => props.onPressDeleteProgram(program.ID)}
                    onPress={() => props.onPressItem(program, checkedStatus)}
                  >
                    <Text style={textStyle}>{programName}</Text>

                    <Text style={{ fontSize: 12, color: textStyle.color }}>
                      {/* {clientName} */}
                      {/* {", "} */}
                      {moreInfoString}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button
                  icon="square-edit-outline"
                  onPress={() => props.onPressEditProgram(program.ID)}
                  color={textStyle.color}
                  labelStyle={{ fontSize: 20 }}
                  compact={true}
                  // color={"transparent"}
                ></Button>
              </View>
            </View>
          )
        })}
    </View>
  )
}

interface ProgramsScreenProps extends NavigationProps {}

export const TrainingProgramsScreen: React.FunctionComponent<ProgramsScreenProps> = props => {
  const { navigation } = props

  const [selectedPrograms, setSelectedPrograms] = useState([])

  const [globalState, setGlobalState] = useGlobalState()
  const { state: global3, dispatch: setGlobal3 } = useGlobalState3()

  const [isUserLoaded, setIsUserLoaded] = useState(false)

  const onStartViewingHandler = () => {
    if (selectedPrograms.length === 0)
      Alert.alert("", "Не си избрал нито 1 програма. Избери програма и пробвай пак", [{ text: "Добре" }], {
        cancelable: false,
      })
    else {
      let routeParams = {}
      selectedPrograms.forEach((programID, index) => {
        routeParams = {
          ...routeParams,
          [index]: programID,
        }
      })
      navigation.navigate("TrainClientsScreen", { ...routeParams })
    }
  }

  const addProgramHandler = async () => {
    const defProgram = {
      ..._.cloneDeep(EMPTY_PROGRAM_DATA2),
      Name: "NewProgram",
      Trainers: [globalState.loggedUser.ID],
      Client: `No client yet`,
    }
    const newPrograms = [...globalState.allPrograms]
    newPrograms.push({ id: "bogus", item: defProgram })
    // setState({ ...state, userPrograms: newPrograms })
    setGlobalState({ type: "update all programs", value: [...newPrograms] })

    await firestore()
      .collection(TRAINING_PROGRAMS_COLLECTION)
      .add(defProgram)
      .then(res => {
        console.log("Added new program with id: ", res.id)
        // newPrograms.push({ id: res.id, item: defProgram })
        newPrograms[newPrograms.length - 1].id = res.id
        // setState({ ...state, userPrograms: newPrograms })
        setGlobalState({ type: "update all programs", value: newPrograms })
      })
  }

  const onPressDeleteProgramHandler = async deleteID => {
    const onConfirmDelete = async () => {
      // programsStore.deleteProgram(deleteID)
      // programsStore.getItems()
      let newPrograms = globalState.allPrograms.filter(program => program.id != deleteID)
      // setState({ ...state, userPrograms: newPrograms })
      setGlobalState({ type: "update all programs", value: [...newPrograms] })
      await fb.deleteItem(deleteID, TRAINING_PROGRAMS_COLLECTION)
    }
    Alert.alert(
      `${translate("editProgramScreen.Warning")}`,
      `${translate("selectPrograms.alertDeleteProgram")}`,
      [
        {
          text: `${translate("alerts.no")}`,
          // style: 'cancel',
        },
        {
          text: `${translate("alerts.yes")}`,
          onPress: onConfirmDelete,
        },
      ],
      { cancelable: true },
    )
  }

  const onPressEditProgramHandler = editID => {
    const editedProgram = global3.programs.find(program => program.ID === editID)
    const thisClientAllPrograms = global3.programs.filter(program => program.Client === editedProgram.Client)
    // setGlobalState({ type: "update currentProgramID", value: editID })
    const thisClientOtherPrograms = thisClientAllPrograms.filter(program => program.ID != editID)
    const otherProgramIDs = []
    thisClientOtherPrograms.forEach(program => {
      otherProgramIDs.push(program.ID)
    })

    navigation.navigate("EditProgramScreen", {
      programID: editedProgram.ID,
      trainerID: globalState.loggedUser.ID,
      otherProgramIDs: otherProgramIDs,
    })
  }

  const onPressItem = (program: T_Program, checkedStatus: boolean) => {
    let arr = selectedPrograms

    //проверка за check. ако вече е чекнато - връщаме списък без него. ако го няма - добавяме го

    if (arr.includes(program.ID)) {
      arr = arr.filter(value => {
        return value != program.ID
      })
    } else arr.push(program.ID)
    setSelectedPrograms([...arr])
  }

  const removeCompletedPrograms = newList => {
    setSelectedPrograms(newList)
  }

  const updateDescs = () => {
    firestore()
      .collection("trainees")
      .get()
      .then(docRefs => {
        docRefs.forEach(docRef => {
          const doc = docRef.data()
          let roleDesc = {
            email: "",
            ID: "",
            isClient: false,
            isTrainer: false,
            isExerciseEditor: false,
            isAdmin: false,
          }
          const { isTrainer, isExerciseEditor, isAdmin, email, ID } = doc
          if (doc.email && (doc.isTrainer || doc.email === "sbsbgclient@gmail.com" || doc.email === "aod.blizzard@gmail.com")) {
            roleDesc = {
              email: email,
              ID: ID,
              isClient: true,
              isTrainer: isTrainer || false,
              isExerciseEditor: isExerciseEditor || false,
              isAdmin: isAdmin || false,
            }
            firestore()
              .collection("rolesDesc")
              .doc(doc.email)
              .set(roleDesc)
          }
        })
      })
  }

  const testHandler = () => {
    // updateDescs()
  }

  return (
    <Screen
      preset="scroll"
      unsafe={false}
      style={{
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: iStyles.backGround.color,
      }}
    >
      {/* <View style={{ backgroundColor: "white", alignItems: "center" }}> */}
      <PageHeader_Tr navigation={navigation} style={{ paddingHorizontal: 25 }} title={translate("selectPrograms.Header")} />

      <ShowProgramsList
        programs={global3.programs}
        onPressEditProgram={onPressEditProgramHandler}
        onPressDeleteProgram={onPressDeleteProgramHandler}
        selectedPrograms={selectedPrograms}
        onPressItem={onPressItem}
        removeCompletedPrograms={removeCompletedPrograms}
      />
      <Button onPress={addProgramHandler} color={iStyles.text2.color}>
        {translate("selectPrograms.AddNewProgram")}
      </Button>
      <Button onPress={onStartViewingHandler} mode="contained" color={iStyles.text1.color}>
        {translate("selectPrograms.TrainButton")}
      </Button>
      {/* <Button onPress={testHandler} color={iStyles.text1.color}>
        test
      </Button> */}
    </Screen>
  )
}
