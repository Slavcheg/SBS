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
} from "../../../components3"
import * as fb from "../../../services/firebase/firebase.service"

import iStyles from "../../../components3/Constants/Styles"

import {
  getProgramInfo,
  alertWithInfoString,
  InfoButton,
} from "../edit-program-screen/ProgramsTool - Helper functions"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Item } from "react-native-paper/lib/typescript/src/components/List/List"
import { icons, colors } from "../../../components3/Constants"

// const getExerciseDB = async (onDownload: Function) => {
//   const JSON_SHEET_ID =
//     "https://spreadsheets.google.com/feeds/cells/10p7fr48q1AUOwndsZkmvv-ExkJKcD3SqsSmtwsOc4NE/od6/public/basic?alt=json"

//   let data

//   fetch(JSON_SHEET_ID)
//     .then(response => response.json())
//     .then(json => (data = json.feed.entry))
//     .catch(error => console.error(error))
//     .finally(() => {
//       let newFalseDB = []
//       let colA = [] //Exercise Name
//       let colB = [] //MainMuscleGroup
//       let colC = [] //YouTubeLink
//       let colF = [] //glutes
//       let colG = [] //chest
//       let colH = [] //shoulders
//       let colI = [] //triceps
//       let colJ = [] //back
//       let colK = [] //rear shoulders
//       let colL = [] //quads
//       let colM = [] //hamstrings
//       let colN = [] //biceps
//       let colO = [] //lats
//       let colP = [] //abs
//       let colQ = [] //calves
//       let colR = [] //cardio
//       let colS = [] //forearms
//       let colT = [] //lower back
//       let colU = [] //traps
//       let colV = [] //low traps
//       let colW = [] //neck
//       let colX = [] //adductors
//       let colY = [] //abductors

//       data.forEach((entry, index) => {
//         let title = entry.title.$t.replace(/[0-9]/g, "") //remove numbers from title
//         let number = entry.title.$t.replace(/\D/g, "") //remove letters from title
//         let content = entry.content.$t

//         //ръчно проверяваме всяка клетка в базата данни отдясно на въведеното име. ако се правят размествания на колоните трябва да се внимава, съответно

//         if (title === "A") colA[number] = content
//         if (title === "B") colB[number] = content
//         if (title === "C") colC[number] = content
//         if (title === "F") colF[number] = content
//         if (title === "G") colG[number] = content
//         if (title === "H") colH[number] = content
//         if (title === "I") colI[number] = content
//         if (title === "J") colJ[number] = content
//         if (title === "K") colK[number] = content
//         if (title === "L") colL[number] = content
//         if (title === "M") colM[number] = content
//         if (title === "N") colN[number] = content
//         if (title === "O") colO[number] = content
//         if (title === "P") colP[number] = content
//         if (title === "Q") colQ[number] = content
//         if (title === "R") colR[number] = content
//         if (title === "S") colS[number] = content
//         if (title === "T") colT[number] = content
//         if (title === "U") colU[number] = content
//         if (title === "V") colV[number] = content
//         if (title === "W") colW[number] = content
//         if (title === "X") colX[number] = content
//         if (title === "Y") colY[number] = content
//       })

//       colA.forEach((exerciseName, index) => {
//         newFalseDB.push({
//           Name: exerciseName,
//           ID: Math.random().toString(25),
//           MainMuscleGroup: colB[index] ? colB[index] : "No group",
//           YouTubeLink: colC[index] ? colC[index] : "No link",
//           Coefs: {
//             glutes: colF[index] ? parseFloat(colF[index]) : 0,
//             chest: colG[index] ? parseFloat(colG[index]) : 0,
//             shoulders: colH[index] ? parseFloat(colH[index]) : 0,
//             triceps: colI[index] ? parseFloat(colI[index]) : 0,
//             back: colJ[index] ? parseFloat(colJ[index]) : 0,
//             rShoulders: colK[index] ? parseFloat(colK[index]) : 0,
//             quads: colL[index] ? parseFloat(colL[index]) : 0,
//             hamstrings: colM[index] ? parseFloat(colM[index]) : 0,
//             biceps: colN[index] ? parseFloat(colN[index]) : 0,
//             lats: colO[index] ? parseFloat(colO[index]) : 0,
//             abs: colP[index] ? parseFloat(colP[index]) : 0,
//             calves: colQ[index] ? parseFloat(colQ[index]) : 0,
//             cardio: colR[index] ? parseFloat(colR[index]) : 0,
//             forearms: colS[index] ? parseFloat(colS[index]) : 0,
//             lowBack: colT[index] ? parseFloat(colT[index]) : 0,
//             traps: colU[index] ? parseFloat(colU[index]) : 0,
//             lowTraps: colV[index] ? parseFloat(colV[index]) : 0,
//             neck: colW[index] ? parseFloat(colW[index]) : 0,
//             adductors: colX[index] ? parseFloat(colX[index]) : 0,
//             abductors: colY[index] ? parseFloat(colY[index]) : 0,
//           },
//         })
//       })
//       onDownload(newFalseDB)
//     })
// }

// const getExerciseDB = async (onDownload: Function) => {

//   let downloadedExerciseDB = []
//   await firestore()
//     .collection("exerciseData")
//     .get()
//     .then(items => {
//       items.forEach(item => {
//         downloadedExerciseDB.push(item.data())
//       })
//       // console.log(downloadedExerciseDB.length, downloadedExerciseDB[0])
//       onDownload(downloadedExerciseDB)
//     })
// }

const arrangeWithZeroCoefs = exercisesArray => {
  const newExercises = { plainArray: [], filtered: muscleGroupsObject() }
  exercisesArray.forEach(exercise => {
    let newExObject = {
      Name: exercise.Name,
      ID: exercise.ID,
      MainMuscleGroup: exercise.MainMuscleGroup,
      YouTubeLink: exercise.YouTubeLink,
      Coefs: exercise.Coefs,
      AddedOn: exercise.AddedOn || 0,
    }
    muscleGroups2.forEach(muscleName => {
      if (!exercise.Coefs[muscleName]) newExObject.Coefs[muscleName] = 0
    })
    newExercises.plainArray.push(newExObject)

    if (!exercise.MainMuscleGroup) return
    if (!exercise.Name) return
    let newArray = newExercises.filtered[exercise.MainMuscleGroup]
      ? newExercises.filtered[exercise.MainMuscleGroup]
      : []
    newArray.push(exercise)
    newExercises.filtered = {
      ...newExercises.filtered,
      [exercise.MainMuscleGroup]: newArray,
    }
  })
  return newExercises
}

const getExerciseDB = async (onDownload: Function) => {
  console.log("getting exercises v3...")
  let downloadedExerciseDB = []
  let allFiltered = {}
  await firestore()
    .collection("exercisesDocPerGroup")
    .get()
    .then(allDocs => {
      allDocs.forEach(doc => {
        const arranged = arrangeWithZeroCoefs(doc.data().exercises)
        const newExercises = arranged.plainArray
        const filteredNew = arranged.filtered

        downloadedExerciseDB = [...downloadedExerciseDB, ...newExercises]
        for (const muscleName in filteredNew) {
          if (allFiltered[muscleName])
            allFiltered[muscleName] = [...allFiltered[muscleName], ...filteredNew[muscleName]]
          else allFiltered[muscleName] = [...filteredNew[muscleName]]
        }
      })
      onDownload(downloadedExerciseDB, allFiltered)
    })
}

interface ShowProgramsListProps {
  programs: any[]
  style?: object
  onPressEdit?: Function
  onPressDeleteProgram?: Function
  onPressEditProgram?: Function
  selectedPrograms: string[]
  onPressItem: Function
  removeCompletedPrograms: Function
}

const ShowProgramsList: React.FunctionComponent<ShowProgramsListProps> = props => {
  const userStore2 = useStores().userStore2
  const [hideCompleted, setHideCompleted] = useState(true)

  const onHideCompleted = () => {
    setHideCompleted(!hideCompleted)

    const newSelectedPrograms = []

    props.programs.forEach(program => {
      if (props.selectedPrograms.includes(program.id))
        if (!program.item.isCompleted) newSelectedPrograms.push(program.id)
    })
    props.removeCompletedPrograms(newSelectedPrograms)
  }

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox
          status={hideCompleted ? "checked" : "unchecked"}
          onPress={onHideCompleted}
          color={iStyles.text1.color}
        />
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
        props.programs.map((program: any, index) => {
          const programName = props.programs[index].item.Name
          let programSelected = props.selectedPrograms.includes(program.id) ? true : false
          let textStyle = {
            fontSize: 19,
            color: programSelected ? iStyles.text1.color : iStyles.text0.color,
          }

          let checkedStatus = false
          if (props.selectedPrograms.length > 0)
            props.selectedPrograms.forEach(programIDList => {
              if (programIDList === program.id) checkedStatus = true
            })
          if (hideCompleted) if (program.item.isCompleted) return <View key={program.id}></View>

          let moreInfoString = ""
          let infoObject = getProgramInfo(program.item, true)
          if (infoObject.LastTrainedOn !== "Never")
            moreInfoString = `${infoObject.TrainingsDone} done, last on ${infoObject.LastTrainedOn}`
          else moreInfoString = `${infoObject.TrainingsDone} trainings done`
          return (
            <View key={program.id}>
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
                    onLongPress={() => props.onPressDeleteProgram(program.id)}
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
                  onPress={() => props.onPressEditProgram(program.id)}
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

  // const [state, setState] = useState({
  //   currentProgram: "",
  //   userPrograms: [],
  // })

  const [selectedPrograms, setSelectedPrograms] = useState([])

  const [exercisesLoaded, setExercisesLoaded] = useState(false)
  const [regularExercisesDownloaded, setRegularExercisesDownloaded] = useState([])
  const [customExercisesLoaded, setCustomExercisesLoaded] = useState([])
  const [loadedAnyCustom, setLoadedAnyCustom] = useState(false)
  const [allExercises, setAllExercises] = useState([])
  const [programsLoaded, setProgramsLoaded] = useState(false)

  const [globalState, setGlobalState] = useGlobalState()
  const [isUserLoaded, setIsUserLoaded] = useState(false)

  let mounted = true

  useEffect(() => {
    if (!isUserLoaded) {
      if (!globalState.loggedUser.ID) {
        console.log("trying to get state")
        getState(setGlobalState)
        if (globalState.loggedUser.ID) setIsUserLoaded(true)
      } else setIsUserLoaded(true)
    }
  }, [isUserLoaded, globalState.loggedUser.ID])

  useEffect(() => {
    // userStore2.getItems()
    // cardStore2.getItems()

    return () => (mounted = false)
  }, [])

  useEffect(() => {
    if (isUserLoaded) {
      // let mounted = true
      setTimeout(() => {
        if (mounted) {
          if (!customExercisesLoaded) setAllExercises(regularExercisesDownloaded)
          setExercisesLoaded(true)
        }
      }, 5000)

      // return () => (mounted = false)
    }
  }, [isUserLoaded])

  useEffect(() => {
    // getCustomExerciseDB(onDownloadCustomExercises);
    // let mounted = true
    if (isUserLoaded) {
      getExerciseDB((allEx, filteredObj) => {
        if (mounted) onDownload(allEx, filteredObj)
      })
      firestore()
        .collection("personalExercisesAdded")
        .doc(globalState.loggedUser.ID)
        .get()
        .then(doc => {
          if (mounted) {
            let customExercises = { plainArray: [], filtered: {} }
            if (doc.exists) {
              if (doc.data()) customExercises = arrangeWithZeroCoefs(doc.data().exercises)

              setLoadedAnyCustom(true)
              setGlobalState({
                type: "update custom exercises",
                exercises: customExercises.plainArray,
                filtered: customExercises.filtered,
              })
              setCustomExercisesLoaded(customExercises.plainArray)
              console.log("Downloaded ", customExercises.plainArray.length, " custom exercises")
            } else {
              setLoadedAnyCustom(true),
                setGlobalState({
                  type: "update custom exercises",
                  exercises: customExercises.plainArray,
                  filtered: customExercises.filtered,
                })
            }
          }
        })
        .catch(err => {
          let customExercises = arrangeWithZeroCoefs([])
          console.log(err)
          setLoadedAnyCustom(true),
            setGlobalState({
              type: "update custom exercises",
              exercises: customExercises.plainArray,
              filtered: customExercises.filtered,
            })
        })
      // return () => (mounted = false)
    }
  }, [isUserLoaded])

  useEffect(() => {
    if (isUserLoaded) {
      // let mounted = true
      if (mounted)
        if (regularExercisesDownloaded.length > 0 && customExercisesLoaded.length > 0) {
          setAllExercises([...customExercisesLoaded, ...regularExercisesDownloaded])
          setExercisesLoaded(true)
        } else if (regularExercisesDownloaded.length > 0 && loadedAnyCustom) {
          setAllExercises([...customExercisesLoaded, ...regularExercisesDownloaded])
          setExercisesLoaded(true)
        }
      // return () => (mounted = false)
    }
  }, [regularExercisesDownloaded, customExercisesLoaded, loadedAnyCustom, isUserLoaded])

  useEffect(() => {
    // let mounted = true
    if (isUserLoaded) {
      if (mounted)
        if (allExercises.length > 0)
          setGlobalState({ type: "update all exercises", allExercises: allExercises })

      // return () => (mounted = false)
    }
  }, [allExercises, isUserLoaded])

  // useEffect(() => {
  //   if (mounted) {
  //     firestore()
  //       .collection("trainees")
  //       .doc(globalState.loggedUser.ID)
  //       .get()
  //       .then(doc => {
  //         if (mounted) {
  //           setGlobalState({ type: "login with user", user: doc.data() })
  //           console.log("#logged in again")
  //         }
  //       })
  //   }
  // }, [])

  // useEffect(() => {     // we used to download users from here, not anymore since they are got when logging in now
  //   // firestore()
  //   //   .collection("trainees")
  //   //   .doc(rootStore.loggedUser.id)
  //   //   .get()
  //   //   .then(doc => {
  //       // if (mounted)
  //       //   setGlobalState({ type: "update all users", value: doc.data().Clients })
  //       // else {
  //       //   let user = rootStore.loggedUser
  //       //   let newUser = {
  //       //     Name: user.item.first,
  //       //     ID: user.id,
  //       //     ClientNumber: 0,
  //       //     FamilyName: user.item.last || "",
  //       //     isTrainer: user.item.isTrainer,
  //       //     email: user.item.email,
  //       //     Clients: [],
  //       //     Trainers: [],
  //       //   }
  //       //   let newTrainer = { Name: newUser.Name, ID: newUser.ID }
  //       //   let newClient = { ...newTrainer, FamilyName: newUser.FamilyName, ClientNumber: 0 }
  //       //   newUser.Clients.push(newClient)
  //       //   newUser.Trainers.push(newTrainer)

  //       //   const clientsEmails = cardStore2.getYouClientsEmails(newUser.email)
  //       //   const newClients = []
  //       //   clientsEmails.map(email => {
  //       //     const newClient = userStore2.getUserByEmail(email)

  //       //     const { first, last } = newClient.item
  //       //     if (newClient) newClients.push({ Name: first, FamilyName: last })
  //       //   })
  //       //   console.log("Trainer: ", newClient)
  //       //   console.log("his trainees: ", newClients)
  //       // }
  //     // })
  //     // .catch(err => {
  //     //   console.error(err)
  //     // })
  // }, [])

  const onDownloadPrograms = (allPrograms, mounted) => {
    if (mounted) {
      setProgramsLoaded(true)
      setGlobalState({ type: "update all programs", value: [...allPrograms] })
    }
  }

  useEffect(() => {
    if (isUserLoaded) {
      // let mounted = true
      if (mounted) getPrograms(allPrograms => onDownloadPrograms(allPrograms, mounted))
    }
    return () => (mounted = false)
  }, [isUserLoaded])

  const getPrograms = async onDownload => {
    // if (globalState.allPrograms.length === 0) {
    let allPrograms = []
    await firestore()
      .collection(TRAINING_PROGRAMS_COLLECTION)
      .where("Trainers", "array-contains", globalState.loggedUser.ID)
      .get()
      .then(allDocs => {
        allDocs.forEach(doc => {
          allPrograms.push({ id: doc.id, item: doc.data() })
        })

        console.log("all programs got ", allPrograms.length)
        allPrograms.sort(
          (a, b) =>
            b.item.Weeks[0].Days[0].Exercises.length - a.item.Weeks[0].Days[0].Exercises.length,
        )

        onDownload(allPrograms)
      })

    // await firestore()
    //   .collection(USERS_COLLECTION)
    //   .get()
    //   .then(usersArray => {
    //     console.log("downloaded all users")
    //     const newUsers = []
    //     usersArray.forEach(user => {
    //       const userItem = user.data()
    //       newUsers.push({
    //         id: user.id,
    //         item: { first: userItem.first, last: userItem.last, picture: userItem.picture },
    //       })
    //     })

    //     setGlobalState({ type: "update all users", value: newUsers })
    //   })
    //   .catch(error => console.error(error))
    // } else {
    //   setProgramsLoaded(true)
    //   setExercisesLoaded(true)
    // }
  }

  const onDownload = (allExercises, allFilteredObj) => {
    console.log("Downloaded ", allExercises.length, " regular exercises")

    setRegularExercisesDownloaded(allExercises)
    setGlobalState({ type: "update filtered exercises (regular)", filteredObj: allFilteredObj })
  }

  const onStartViewingHandler = () => {
    if (selectedPrograms.length === 0)
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
    const editedProgram = globalState.allPrograms.find(program => program.id === editID)
    const thisClientAllPrograms = globalState.allPrograms.filter(
      program => program.item.Client === editedProgram.item.Client,
    )
    setGlobalState({ type: "update currentProgramID", value: editID })
    const thisClientOtherPrograms = thisClientAllPrograms.filter(program => program.id != editID)
    const otherProgramIDs = []
    thisClientOtherPrograms.forEach(program => {
      otherProgramIDs.push(program.id)
    })

    navigation.navigate("EditProgramScreen", {
      programID: editedProgram.id,
      trainerID: globalState.loggedUser.ID,
      otherProgramIDs: otherProgramIDs,
    })
  }

  const onPressItem = (program, checkedStatus: boolean) => {
    let arr = selectedPrograms

    //проверка за check. ако вече е чекнато - връщаме списък без него. ако го няма - добавяме го

    if (arr.includes(program.id)) {
      arr = arr.filter(value => {
        return value != program.id
      })
    } else arr.push(program.id)
    setSelectedPrograms([...arr])
  }

  const removeCompletedPrograms = newList => {
    setSelectedPrograms(newList)
  }

  // const bachupHandler = () => {
  //   globalState.allPrograms.forEach(program => {
  //     firestore()
  //       .collection("trainingProgramsBackup")
  //       .doc(program.id)
  //       .set(program.item)
  //   })
  // }

  // const clientsUpdateHandler = () => {
  //   type user = {
  //     Name: string
  //     ID: string
  //     ClientNumber?: number
  //     FamilyName?: string
  //   }
  //   let users: user[] = []

  //   userStore2.users.forEach(user => {
  //     users.push({
  //       Name: user.item.first,
  //       ID: user.id,
  //       FamilyName: user.item.last,
  //       ClientNumber: 0,
  //     })
  //   })

  //   const newPrograms = []

  //   globalState.allPrograms.forEach(program => {
  //     users.forEach(user => {
  //       if (program.item.Client === user.ID)
  //         setGlobalState({ type: "add client info", info: user, programID: program.id })
  //     })
  //   })
  // }

  // const testHandlerOld = () => {
  //   type user = {
  //     Name: string
  //     ID: string
  //     ClientNumber?: number
  //     FamilyName?: string
  //     Trainers?: any[]
  //     Clients?: any[]
  //     isTrainer: boolean
  //   }
  //   let users: user[] = []

  //   userStore2.users.forEach(user => {
  //     users.push({
  //       Name: user.item.first,
  //       ID: user.id,
  //       FamilyName: user.item.last,
  //       ClientNumber: 0,
  //       Trainers: [],
  //       Clients: [],
  //       isTrainer: user.item.isTrainer,
  //     })
  //   })

  //   globalState.allPrograms.forEach(program => {})

  //   let users2 = []
  //   users.forEach((user, index) => {
  //     let thisTrainerclientsList = []
  //     globalState.allPrograms.forEach(program => {
  //       if (program.item.Client === user.ID)
  //         program.item.Trainers.forEach(trainerID => {
  //           let addnewTrainer = true
  //           users[index].Trainers.forEach(trainer => {
  //             if (trainer.ID === trainerID) addnewTrainer = false
  //           })
  //           if (addnewTrainer)
  //             users[index].Trainers.push({
  //               ID: trainerID,
  //               Name: userStore2.getUserByID(trainerID).item.first,
  //             })
  //         })
  //       if (user.isTrainer) {
  //         if (program.item.Trainers.includes(user.ID)) {
  //           if (!thisTrainerclientsList.includes(program.item.Client)) {
  //             thisTrainerclientsList.push(program.item.Client)
  //             users[index].Clients.push(program.item.ClientInfo)
  //           }
  //         }
  //       }
  //     })
  //   })

  //   // users.forEach(user => {
  //   //   if (user.Trainers.length > 0) users2.push(user)
  //   // })

  //   // const trainers = []
  //   // const trainersList = []

  //   // users2.forEach((user, userIndex) => {
  //   //   if (!trainersList.includes(user.Trainers[0].ID)) {
  //   //     trainers.push(user.Trainers[0])
  //   //     trainersList.push(user.Trainers[0].ID)
  //   //   }
  //   //   // console.log(user.Trainers[0])
  //   // })

  //   // users.forEach((trainer, trainerIndex) => {
  //   //   trainersList.forEach(trainerID => {
  //   //     if (trainerID === trainer.ID)
  //   //       users2.forEach(client => {
  //   //         if (client.Trainers[0].ID === trainerID)
  //   //           users2[trainerIndex].Clients.push({
  //   //             Name: client.Name,
  //   //             ID: client.ID,
  //   //             ClientNumber: client.ClientNumber,
  //   //             FamilyName: client.FamilyName,
  //   //           })
  //   //       })
  //   //   })
  //   // })

  //   users.forEach(user => {
  //     console.log("user: ", user, "  Trainers: ", user.Trainers)
  //     firestore()
  //       .collection("trainees")
  //       .doc(user.ID)
  //       .set(user)
  //   })
  // }

  // const testHandlerUpdateTrainees = () => {
  //   //updating clients values if something breaks
  //   // console.log(allClients.find(client => client.ID === "JMxV035wcHXjmYjYyHGR"))
  //   firestore()
  //     .collection("trainingPrograms")
  //     .get()
  //     .then(docs => {
  //       let programs = []
  //       docs.forEach(doc => {
  //         programs.push(doc.data())
  //       })
  //       console.log("got all programs ", programs.length)

  //       firestore()
  //         .collection("users2")
  //         .get()
  //         .then(users => {
  //           let newUsers = []
  //           users.forEach(user => {
  //             if (user.data().first)
  //               newUsers.push({
  //                 Name: user.data().first,
  //                 ID: user.id,
  //                 FamilyName: user.data().last,
  //                 ClientNumber: 0,
  //                 email: user.data().email,
  //                 Trainers: [{ Name: user.data().first, ID: user.id }],
  //                 Clients: [
  //                   {
  //                     ClientNumber: 0,
  //                     FamilyName: user.data().last || "",
  //                     Name: user.data().first,
  //                     ID: user.id,
  //                   },
  //                 ],
  //                 isTrainer: user.data().isTrainer,
  //               })
  //           })

  //           console.log("got all users ", newUsers.length)

  //           newUsers.forEach((user, index) => {
  //             let thisTrainerclientsList = [user.ID]
  //             programs.forEach(program => {
  //               if (program.Client === user.ID)
  //                 program.Trainers.forEach(trainerID => {
  //                   let addnewTrainer = true
  //                   newUsers[index].Trainers.forEach(trainer => {
  //                     if (trainer.ID === trainerID) addnewTrainer = false
  //                   })
  //                   if (addnewTrainer)
  //                     newUsers[index].Trainers.push({
  //                       ID: trainerID,
  //                       Name: newUsers.find(user => user.ID === trainerID).Name,
  //                     })
  //                 })
  //               if (user.isTrainer) {
  //                 if (program.Trainers.includes(user.ID)) {
  //                   if (!thisTrainerclientsList.includes(program.Client)) {
  //                     thisTrainerclientsList.push(program.Client)
  //                     const newClient = newUsers.find(user => user.ID === program.Client)
  //                     if (newClient) {
  //                       const newClientInfo = {
  //                         Name: newClient.Name,
  //                         FamilyName: newClient.FamilyName,
  //                         ClientNumber: newClient.ClientNumber,
  //                         ID: newClient.ID,
  //                       }
  //                       newUsers[index].Clients.push(newClientInfo)
  //                     }
  //                   }
  //                 }
  //               }
  //             })
  //           })
  //           newUsers.forEach(user => {
  //             firestore()
  //               .collection("trainees")
  //               .doc(user.ID)
  //               .set(user)
  //           })
  //         })
  //     })
  // }

  // const testHandler = () => {
  //   console.log(globalState.loggedUser)
  // }

  if (!isUserLoaded)
    return (
      <View>
        <Text>loading...</Text>
        <Button onPress={() => console.log(isUserLoaded, globalState.loggedUser)}>asdf</Button>
      </View>
    )

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
          if (
            doc.email &&
            (doc.isTrainer ||
              doc.email === "sbsbgclient@gmail.com" ||
              doc.email === "aod.blizzard@gmail.com")
          ) {
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
      <PageHeader_Tr
        navigation={navigation}
        style={{ paddingHorizontal: 25 }}
        title={translate("selectPrograms.Header")}
      />

      <ShowProgramsList
        programs={globalState.allPrograms}
        onPressEditProgram={onPressEditProgramHandler}
        onPressDeleteProgram={onPressDeleteProgramHandler}
        selectedPrograms={selectedPrograms}
        onPressItem={onPressItem}
        removeCompletedPrograms={removeCompletedPrograms}
      />
      <Button
        onPress={addProgramHandler}
        loading={!(exercisesLoaded && programsLoaded)}
        disabled={!(exercisesLoaded && programsLoaded)}
        color={iStyles.text2.color}
      >
        {translate("selectPrograms.AddNewProgram")}
      </Button>
      <Button
        onPress={onStartViewingHandler}
        mode="contained"
        color={iStyles.text1.color}
        loading={!(exercisesLoaded && programsLoaded)}
        disabled={!(exercisesLoaded && programsLoaded)}
      >
        {translate("selectPrograms.TrainButton")}
      </Button>
      {/* <Button onPress={testHandler} color={iStyles.text1.color}>
        test
      </Button> */}
    </Screen>
  )
}
