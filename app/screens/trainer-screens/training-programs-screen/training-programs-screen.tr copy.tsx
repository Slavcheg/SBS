// backup с global state. В оригинала ще пробвам само с local state

import React, { useEffect, useState } from "react"
import { Text, View, TouchableOpacity, Pressable } from "react-native"
import { spacing, color, styles } from "../../../theme"
import { Screen, MainHeader_Tr, ButtonSquare } from "../../../components"
import ProgressCircle from "react-native-progress-circle"
import { displayDateFromTimestamp, today_vs_last_day } from "../../../global-helper"
import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"
import { SwipeRow } from "react-native-swipe-list-view"

import { Button } from "react-native-paper"

interface ShowProgramsListProps {
  programs: object[]
  style?: object
  onPressProgram?: Function
  selectedProgram?: Number
  onPressDeleteProgram?: Function
  onPressEditProgram?: Function
}

const ShowProgramsList: React.FunctionComponent<ShowProgramsListProps> = observer(props => {
  return (
    <View style={props.style}>
      {props.programs.length === 1 && <Text>Намираме {props.programs.length} програмa</Text>}
      {props.programs.length !== 1 && <Text>Намираме {props.programs.length} програми</Text>}

      {/* <Button onPress={() => console.log(props.programs)}>test</Button> */}
      {props.programs.map((program, index) => {
        let textStyle = { fontSize: 25, color: props.selectedProgram === index ? "blue" : "black" }
        return (
          <View key={index} style={{ flexDirection: "row" }}>
            <SwipeRow rightOpenValue={-75} leftOpenValue={75}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                {/* <Button onPress={() => props.onPressEditProgram(index)}>Edit</Button> */}
                <Button onPress={() => props.onPressDeleteProgram(index)} color="red">
                  Delete
                </Button>
              </View>

              <View style={{ width: "100%", backgroundColor: "white" }}>
                <Pressable activeOpacity={0.6} onPress={() => props.onPressProgram(index)}>
                  <Text style={textStyle}>{props.programs[index].item.Name}</Text>
                </Pressable>
              </View>
            </SwipeRow>
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

    const [state, setState] = useState({ selectedProgram: 0, loadedExercises: false })

    useEffect(() => {
      programsStore.getItems()
    }, [programsStore])

    useEffect(() => {
      getExerciseDB()
    }, [])

    const getExerciseDB = async () => {
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

          exercisesStore.updateAllExercises(newFalseDB)
          console.log("Exercises got")
          setState({ ...state, loadedExercises: true })
          // console.log(newFalseDB.length)
          // console.log(exercisesStore.exercises.length)
          // let exampleEx = newFalseDB[113]
          // console.log(exampleEx.Name)
          // console.log("Coefs.glutes", exampleEx.Coefs.glutes)
          // console.log("Coefs.hamstrings", exampleEx.Coefs.hamstrings)
          // console.log("Coefs.back", exampleEx.Coefs.back)

          // exerciseDataArray = [...newFalseDB]
        })
    }

    const getPrograms = async () => {}

    const addProgramHandler = () => {
      programsStore.createProgram({
        Name: `Program number ${programsStore.programs.length + 1}`,
        Trainers: [rootStore.loggedUser.id],
        Client: rootStore.loggedUser.id,
      })
      programsStore.getItems()
    }

    const onPressProgramHandler = newIndex => {
      setState({ ...state, selectedProgram: newIndex })
    }

    const onPressDeleteProgramHandler = deleteIndex => {
      console.log("tried deleting item ", deleteIndex)
      programsStore.deleteProgram(programsStore.programs[deleteIndex].id)
      programsStore.getItems()
      setState({ ...state, selectedProgram: 0 })
    }

    const onPressEditProgramHandler = editIndex => {
      let programID = programsStore.programs[editIndex].id
      console.log("tried editing program ", programID)

      navigation.navigate("EditProgramScreen", {
        programID: programID,
      })
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
        <MainHeader_Tr navigation={navigation} style={{ paddingHorizontal: 25 }} />
        <ShowProgramsList
          programs={programsStore.programs}
          onPressProgram={onPressProgramHandler}
          selectedProgram={state.selectedProgram}
          onPressDeleteProgram={onPressDeleteProgramHandler}
          // onPressEditProgram={onPressEditProgramHandler}
        />
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* <Button
          // onPress={() => console.log(exercisesStore.exercises[0].item.Name)}
          onPress={() => console.log(rootStore.loggedUser.id)}
        >
          Test
        </Button> */}

          <Button
            onPress={() => onPressEditProgramHandler(state.selectedProgram)}
            loading={!state.loadedExercises}
            disabled={!state.loadedExercises}
          >
            Edit
          </Button>
          <Button
            onPress={addProgramHandler}
            loading={!state.loadedExercises}
            disabled={!state.loadedExercises}
          >
            Добави нова програма
          </Button>
        </View>
      </Screen>
    )
  },
)
