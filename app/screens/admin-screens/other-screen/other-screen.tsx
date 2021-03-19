import { Button } from "react-native-paper"
import _ from "lodash"

import firestore from "@react-native-firebase/firestore"
const COLLECTION = "exerciseData"
import { useGlobalState } from "../../../components3/globalState/global-state-regular"
import { useStores } from "../../../models/root-store"
import iStyles from "../../../components3/Constants/Styles"

import React, { useState, useEffect, useCallback, VoidFunctionComponent } from "react"
import { View, FlatList, Pressable, Text, StyleSheet, Modal, TouchableOpacity } from "react-native"

import { SearchBar } from "react-native-elements"
import { ButtonsRow } from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions/ButtonsRow"

import { EditableText } from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"

import { YOUTUBE_API_KEY } from "../../../components3/Constants/DatabaseConstants"
import YouTube, { YouTubeStandaloneAndroid } from "react-native-youtube"
import {
  getVideoID,
  getVideoTime,
  getColorByMuscleName,
} from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions/smallFunctions"

import { muscleGroups2 } from "../../../components3/Constants"

export const AdminOtherScreen = ({ navigation }) => {
  const [globalState, setGlobalState] = useGlobalState()
  const exercisesStore = useStores().exerciseDataStore
  const [programsLoaded, setProgramsLoaded] = useState(false)
  const allPrograms = []

  let dbExercises = exercisesStore.getAllExercises()

  useEffect(() => {
    firestore()
      .collection("trainingPrograms")
      .get()
      .then(docs => {
        docs.forEach(doc => {
          allPrograms.push({ id: doc.id, item: doc.data() })
        })
        console.log("allProgramsGot: ", allPrograms.length)
        setProgramsLoaded(true)
      })
  }, [])

  const textStyle = { fontSize: 20 }
  const testHandler = () => {
    if (allPrograms.length !== 0) {
      // let right = 0
      // let wrong = 0
      // let corrected = 0
      // console.log(dbExercises.find(ex => ex.ID === "0.1j00o33ojojbe"))
      // allPrograms.forEach(program => {
      //   let newProgram = program
      //   program.item.Weeks.forEach((week, weekIndex) => {
      //     week.Days.forEach((day, dayIndex) => {
      //       day.Exercises.forEach((exercise, exerciseIndex) => {
      //         dbExercises.forEach(dbEx => {
      //           if (dbEx.Name === exercise.Name)
      //             if (dbEx.ID === exercise.ID) right++
      //             else {
      //               wrong++
      //               newProgram.item.Weeks[weekIndex].Days[dayIndex].Exercises[exerciseIndex].ID =
      //                 dbEx.ID
      //               corrected++
      //             }
      //         })
      //       })
      //     })
      //   })
      // firestore()
      //   .collection("trainingPrograms")
      //   .doc(program.id)
      //   .update(newProgram.item)
      //   .then(() => console.log("updated program ", newProgram.item.Name))
      // })
      // console.log(right, wrong, corrected)
      // right = 0
      // wrong = 0
      // allPrograms.forEach(program => {
      //   let newProgram = program
      //   program.item.Weeks.forEach((week, weekIndex) => {
      //     week.Days.forEach((day, dayIndex) => {
      //       day.Exercises.forEach((exercise, exerciseIndex) => {
      //         dbExercises.forEach(dbEx => {
      //           if (dbEx.Name === exercise.Name)
      //             if (dbEx.ID === exercise.ID) right++
      //             else {
      //               wrong++
      //             }
      //         })
      //       })
      //     })
      //   })
      // })
      // console.log(right, wrong)
      // console.log(exercisesStore.getAllExercises().find(ex => ex.Name === "Deadlift"))
    }
  }

  return (
    <View style={iStyles.screenViewWrapper}>
      <Button
        color={iStyles.text1.color}
        onPress={testHandler}
        style={{ justifyContent: "flex-end", flex: 1 }}
        disabled={!programsLoaded}
        loading={!programsLoaded}
      >
        test
      </Button>
    </View>
  )
}
