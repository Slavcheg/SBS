import React, { useEffect, useState } from "react"
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

import { Button, Checkbox } from "react-native-paper"

import _ from "lodash"

import iStyles from "../edit-program-screen/Constants/Styles"

const getExerciseDB = async (onDownload: Function) => {
  const JSON_SHEET_ID =
    "https://spreadsheets.google.com/feeds/cells/10p7fr48q1AUOwndsZkmvv-ExkJKcD3SqsSmtwsOc4NE/od6/public/basic?alt=json"

  let data
  console.log("trying to get exercises...")
  fetch(JSON_SHEET_ID)
    .then(response => response.json())
    .then(json => (data = json.feed.entry))
    .catch(error => console.error(error))
    .finally(() => {
      let newFalseDB = []
      let colA = [] //Exercise Name
      let colB = [] //MainMuscleGroup
      let colC = [] //YouTubeLink
      let colF = [] //glutes
      let colG = [] //chest
      let colH = [] //shoulders
      let colI = [] //triceps
      let colJ = [] //back
      let colK = [] //rear shoulders
      let colL = [] //quads
      let colM = [] //hamstrings
      let colN = [] //biceps
      let colO = [] //lats
      let colP = [] //abs
      let colQ = [] //calves
      let colR = [] //cardio
      let colS = [] //forearms
      let colT = [] //lower back
      let colU = [] //traps
      let colV = [] //low traps
      let colW = [] //neck
      let colX = [] //adductors
      let colY = [] //abductors

      data.forEach((entry, index) => {
        let title = entry.title.$t.replace(/[0-9]/g, "") //remove numbers from title
        let number = entry.title.$t.replace(/\D/g, "") //remove letters from title
        let content = entry.content.$t

        //ръчно проверяваме всяка клетка в базата данни отдясно на въведеното име. ако се правят размествания на колоните трябва да се внимава, съответно

        if (title === "A") colA[number] = content
        if (title === "B") colB[number] = content
        if (title === "C") colC[number] = content
        if (title === "F") colF[number] = content
        if (title === "G") colG[number] = content
        if (title === "H") colH[number] = content
        if (title === "I") colI[number] = content
        if (title === "J") colJ[number] = content
        if (title === "K") colK[number] = content
        if (title === "L") colL[number] = content
        if (title === "M") colM[number] = content
        if (title === "N") colN[number] = content
        if (title === "O") colO[number] = content
        if (title === "P") colP[number] = content
        if (title === "Q") colQ[number] = content
        if (title === "R") colR[number] = content
        if (title === "S") colS[number] = content
        if (title === "T") colT[number] = content
        if (title === "U") colU[number] = content
        if (title === "V") colV[number] = content
        if (title === "W") colW[number] = content
        if (title === "X") colX[number] = content
        if (title === "Y") colY[number] = content
      })

      colA.forEach((exerciseName, index) => {
        newFalseDB.push({
          Name: exerciseName,
          ID: Math.random().toString(25),
          MainMuscleGroup: colB[index] ? colB[index] : "No group",
          YouTubeLink: colC[index] ? colC[index] : "No link",
          Coefs: {
            glutes: colF[index] ? parseFloat(colF[index]) : 0,
            chest: colG[index] ? parseFloat(colG[index]) : 0,
            shoulders: colH[index] ? parseFloat(colH[index]) : 0,
            triceps: colI[index] ? parseFloat(colI[index]) : 0,
            back: colJ[index] ? parseFloat(colJ[index]) : 0,
            rShoulders: colK[index] ? parseFloat(colK[index]) : 0,
            quads: colL[index] ? parseFloat(colL[index]) : 0,
            hamstrings: colM[index] ? parseFloat(colM[index]) : 0,
            biceps: colN[index] ? parseFloat(colN[index]) : 0,
            lats: colO[index] ? parseFloat(colO[index]) : 0,
            abs: colP[index] ? parseFloat(colP[index]) : 0,
            calves: colQ[index] ? parseFloat(colQ[index]) : 0,
            cardio: colR[index] ? parseFloat(colR[index]) : 0,
            forearms: colS[index] ? parseFloat(colS[index]) : 0,
            lowBack: colT[index] ? parseFloat(colT[index]) : 0,
            traps: colU[index] ? parseFloat(colU[index]) : 0,
            lowTraps: colV[index] ? parseFloat(colV[index]) : 0,
            neck: colW[index] ? parseFloat(colW[index]) : 0,
            adductors: colX[index] ? parseFloat(colX[index]) : 0,
            abductors: colY[index] ? parseFloat(colY[index]) : 0,
          },
        })
      })
      onDownload(newFalseDB)
    })
}

interface ShowProgramsListProps {
  programs: any[]
  style?: object
  onPressEdit?: Function
  onPressDeleteProgram?: Function
  onPressEditProgram?: Function
  selectedPrograms: string[]
  onPressCheckbox: Function
  onPressItem: Function
}

const ShowProgramsList: React.FunctionComponent<ShowProgramsListProps> = observer(props => {
  const userStore2 = useStores().userStore2
  return (
    <View style={props.style}>
      {props.programs.length === 1 && (
        <Text>
          {translate("selectPrograms.ProgramsFound1")} {props.programs.length}{" "}
          {translate("selectPrograms.ProgramsFound2")}
        </Text>
      )}
      {props.programs.length !== 1 && (
        <Text>
          {translate("selectPrograms.ProgramsFound1")} {props.programs.length}{" "}
          {translate("selectPrograms.ProgramsFound2-Plural")}
        </Text>
      )}

      {/* <Button onPress={() => console.log(props.programs)}>test</Button> */}
      {props.programs.map((program: any, index) => {
        const programName =
          props.programs[index].item.Client === "No client yet"
            ? "No client yet"
            : userStore2.getUserByID(props.programs[index].item.Client).item.first
        let programSelected = props.selectedPrograms.includes(program.id) ? true : false
        let textStyle = {
          fontSize: 19,
          color: programSelected ? iStyles.text1.color : "black",
        }

        let checkedStatus = false
        if (props.selectedPrograms.length > 0)
          props.selectedPrograms.forEach(programIDList => {
            if (programIDList === program.id) checkedStatus = true
          })

        return (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ backgroundColor: "white" }}>
              <Pressable
                activeOpacity={0.6}
                onLongPress={() => props.onPressDeleteProgram(program.id)}
                onPress={() => props.onPressCheckbox(program, checkedStatus)}
              >
                <Text style={textStyle}>{programName}</Text>
              </Pressable>
            </View>
            <Button
              icon="square-edit-outline"
              onPress={() => props.onPressEditProgram(program.id)}
              color={textStyle.color}
              labelStyle={{ fontSize: 20 }}
              // color={"transparent"}
            ></Button>
          </View>
        )
      })}
    </View>
  )
})

interface ProgramsScreenProps extends NavigationProps {}

export const TrainingProgramsScreen: React.FunctionComponent<ProgramsScreenProps> = observer(
  props => {
    const { navigation } = props
    const sessionStore = useStores().sessionStore
    const userStore2 = useStores().userStore2
    const programsStore = useStores().trainingProgramsStore
    const exercisesStore = useStores().exerciseDataStore
    const rootStore = useStores()
    const cardStore2 = useStores().cardyStore2

    const [state, setState] = useState({
      currentProgram: "",
      loadedExercises: false,
      selectedPrograms: [],
    })

    useEffect(() => {
      programsStore.getItems()
      cardStore2.getItems()
    }, [programsStore])

    useEffect(() => {
      getExerciseDB(onDownload)
    }, [])

    const onDownload = exerciseDatabase => {
      exercisesStore.updateAllExercises(exerciseDatabase)
      console.log("Exercises got")
      setState({ ...state, loadedExercises: true })
    }

    const onStartViewingHandler = () => {
      if (state.selectedPrograms.length === 0)
        Alert.alert(
          "",
          "Не си избрал нито 1 програма. Избери програма и пробвай пак",
          [{ text: "Добре" }],
          {
            cancelable: false,
          },
        )
      else {
        let routeParams = {}
        state.selectedPrograms.forEach((programID, index) => {
          routeParams = {
            ...routeParams,
            [index]: programID,
          }
        })
        navigation.navigate("TrainClientsScreen", { ...routeParams })
      }
    }

    const addProgramHandler = () => {
      programsStore.createProgram({
        Name: `Program number ${programsStore.trainersPrograms(rootStore.loggedUser.id).length +
          1}`,
        Trainers: [rootStore.loggedUser.id],
        Client: `${translate("selectPrograms.NoClientYet")}`,
      })
      programsStore.getItems()
    }

    const onPressDeleteProgramHandler = deleteID => {
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
            onPress: () => {
              programsStore.deleteProgram(deleteID)
              programsStore.getItems()
            },
          },
        ],
        { cancelable: true },
      )
    }

    const onPressEditProgramHandler = editID => {
      navigation.navigate("EditProgramScreen", {
        programID: editID,
      })
    }

    const onPressCheckbox = (program, checkedStatus: boolean) => {
      let arr = state.selectedPrograms

      //проверка за check. ако вече е чекнато - връщаме списък без него. ако го няма - добавяме го

      if (arr.includes(program.id)) {
        arr = arr.filter(value => {
          return value != program.id
        })
      } else arr.push(program.id)
      setState({ ...state, selectedPrograms: [...arr] })
    }

    const onPressItem = program => {
      setState({ ...state, selectedPrograms: [program.id] })
    }

    const testHandler = () => {
      let mailArr = _.uniq(cardStore2.getYouClientsEmails("dobrev.jordan@gmail.com"))
      console.log(mailArr)
      let idArr = mailArr.map(mail => userStore2.getUserIDByEmail(mail))
      console.log(idArr)
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
          backgroundColor: color.palette.transparent,
        }}
      >
        <PageHeader_Tr
          navigation={navigation}
          style={{ paddingHorizontal: 25 }}
          title={translate("selectPrograms.Header")}
        />
        <ShowProgramsList
          programs={programsStore.trainersPrograms(rootStore.loggedUser.id)}
          onPressEditProgram={onPressEditProgramHandler}
          onPressDeleteProgram={onPressDeleteProgramHandler}
          selectedPrograms={state.selectedPrograms}
          onPressCheckbox={onPressCheckbox}
          onPressItem={onPressItem}
          // onPressEditProgram={onPressEditProgramHandler}
        />
        <Button
          onPress={addProgramHandler}
          loading={!state.loadedExercises}
          disabled={!state.loadedExercises}
          color={iStyles.text2.color}
        >
          {translate("selectPrograms.AddNewProgram")}
        </Button>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* <Button
          // onPress={() => console.log(exercisesStore.exercises[0].item.Name)}
          onPress={() => console.log(rootStore.loggedUser.id)}
        >
          Test
        </Button> */}
          {/* <Button onPress={() => console.log(state.currentProgram)}>test</Button> */}
          <Button
            onPress={onStartViewingHandler}
            mode="contained"
            color={iStyles.text1.color}
            loading={!state.loadedExercises}
            disabled={!state.loadedExercises}
          >
            {translate("selectPrograms.TrainButton")}
          </Button>
          {/* <Button onPress={testHandler}>test</Button> */}
        </View>
      </Screen>
    )
  },
)
