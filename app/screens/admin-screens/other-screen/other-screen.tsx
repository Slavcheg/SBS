import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { Button } from "react-native-paper"

import firestore from "@react-native-firebase/firestore"
const COLLECTION = "exerciseData"

export const AdminOtherScreen = () => {
  const [areExercisesDownloaded, setAreExercisesDownloaded] = useState(false)
  let exerciseDataArray = []

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
              glutes: colF[index] ? colF[index] : 0,
              chest: colG[index] ? colG[index] : 0,
              shoulders: colH[index] ? colH[index] : 0,
              triceps: colI[index] ? colI[index] : 0,
              back: colJ[index] ? colJ[index] : 0,
              rShoulders: colK[index] ? colK[index] : 0,
              quads: colL[index] ? colL[index] : 0,
              hamstrings: colM[index] ? colM[index] : 0,
              biceps: colN[index] ? colN[index] : 0,
              lats: colO[index] ? colO[index] : 0,
              abs: colP[index] ? colP[index] : 0,
              calves: colQ[index] ? colQ[index] : 0,
              cardio: colR[index] ? colR[index] : 0,
              forearms: colS[index] ? colS[index] : 0,
              lowBack: colT[index] ? colT[index] : 0,
              traps: colU[index] ? colU[index] : 0,
              lowTraps: colV[index] ? colV[index] : 0,
              neck: colW[index] ? colW[index] : 0,
              adductors: colX[index] ? colX[index] : 0,
              abductors: colY[index] ? colY[index] : 0,
            },
          })
        })

        console.log("Exercises got")
        let exampleEx = newFalseDB[113]
        // console.log(exampleEx.Name)
        // console.log("Coefs.glutes", exampleEx.Coefs.glutes)
        // console.log("Coefs.hamstrings", exampleEx.Coefs.hamstrings)
        // console.log("Coefs.back", exampleEx.Coefs.back)

        exerciseDataArray = [...newFalseDB]
        setAreExercisesDownloaded(true)
      })
  }

  const massAddExercises = async exerciseDataArray => {
    console.log("tried uploading ", exerciseDataArray.length, " exercises")
    //   const batch=firestore().batch();
    //   exerciseDataArray.forEach((exercise) => {
  }

  return (
    <View>
      {areExercisesDownloaded && (
        <Button onPress={() => massAddExercises(exerciseDataArray)}>Upload exercises</Button>
      )}
      {!areExercisesDownloaded && (
        <Button disabled={true} loading={true}>
          Exercises loading
        </Button>
      )}
      <Text>За момента не се ползва</Text>
    </View>
  )
}
