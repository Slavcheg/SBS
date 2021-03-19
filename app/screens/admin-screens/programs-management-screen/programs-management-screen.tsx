import React, { useState, useEffect, useReducer } from "react"
import {
  View,
  Text,
  FlatList,
  Modal,
  Pressable,
  useWindowDimensions,
  Alert,
  ScrollView,
} from "react-native"
import _ from "lodash"

import { Button, TextInput } from "react-native-paper"
import firestore from "@react-native-firebase/firestore"
import { SearchBar } from "react-native-elements"

import { icons, colors } from "../../../components3/Constants"
import {
  PickAnItem,
  alertWithInfoString,
  InfoButton,
  PressableText,
} from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"
import iStyles from "../../../components3/Constants/Styles"

import { useGlobalState } from "../../../components3/globalState/global-state-regular"
import { filterByStringAndTrainer } from "../../../global-helper"

import { randomString } from "../../../global-helper"

import { EditProgram } from "./Components"
import { filter } from "ramda"
import { firebase } from "@react-native-firebase/crashlytics"

const downloadClientsAdmin = (onDownloadClients: Function) => {
  firestore()
    .collection("trainees")
    .get()
    .then(docs => {
      const newClients = []
      docs.forEach(doc => {
        newClients.push(doc.data())
      })
      onDownloadClients(newClients)
    })
}

const downloadProgramsAdmin = (onDownloadPrograms: Function) => {
  firestore()
    .collection("trainingPrograms")
    .get()
    .then(docs => {
      const programs = []
      docs.forEach(doc => {
        programs.push({ ...doc.data(), ID: doc.id })
      })
      onDownloadPrograms(programs)
    })
}

export const AdminPrograms = props => {
  const [globalState, setGlobalState] = useGlobalState()
  const [clients, setClients] = useState([])
  const [programs, setPrograms] = useState([])
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [trainers, setTrainers] = useState([])
  const [searchText, setSearchText] = useState("")
  const [filterByTrainer, setFilterByTrainer] = useState(false)
  const [selectedTrainerToFilterBy, setSelectedTrainerToFilterBy] = useState(null)
  const [visibleProgramsArray, setVisibleProgramsArray] = useState([])
  const [visibleClientsArray, setVisibleClientsArray] = useState([])
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [isEditingProgram, setIsEditingProgram] = useState(false)
  const [selectedProgramID, setSelectedProgramID] = useState("")

  let screenMounted = true //if unmounted - do not change state variables

  useEffect(() => {
    return () => (screenMounted = false)
  }, [])

  useEffect(() => {
    console.log("getting all clients & programs")
    downloadClientsAdmin(onDownloadClients)
    downloadProgramsAdmin(onDownloadPrograms)
  }, [])

  const onDownloadClients = newClients => {
    if (screenMounted) {
      setGlobalState({ type: "update all clients(admin)", value: newClients })

      setClients(newClients)
      setVisibleClientsArray(newClients)

      const newTrainers = []
      newClients.forEach(client => {
        if (client.isTrainer) newTrainers.push(client)
      })
      setTrainers(newTrainers)
      setSelectedTrainerToFilterBy(newTrainers[0])
      console.log(`${newClients.length} clients loaded. ${newTrainers.length} trainers`)
    }
  }

  const onDownloadPrograms = programs => {
    if (screenMounted) {
      setGlobalState({ type: "update all programs", value: programs })
      setPrograms(programs)
      setVisibleProgramsArray(programs)
      console.log(`${programs.length} programs loaded`)
    }
  }

  const onPressProgram = programID => {
    setIsEditingProgram(true)
    setSelectedProgramID(programID)
  }

  const renderProgram = ({ item, index }) => {
    const program = item
    const programID = item.ID
    if (clients.length === 0) return <Text>clients not loaded yet</Text>
    const errorString = "error"
    const programName = program.Name || errorString
    const client = clients.find(client => client.ID === program.Client)

    let programClientName
    if (!client) programClientName = "client not found"
    else programClientName = client.Name

    const trainers = []
    clients.forEach(client => {
      program.Trainers.forEach(trainerID => {
        if (trainerID === client.ID) trainers.push({ ID: client.ID, Name: client.Name })
      })
    })
    let trainersString = trainers.reduce(function(accumulator, trainer) {
      return `${accumulator} ${trainer.Name}`
    }, "")
    return (
      <View>
        <Text>ID: {item.ID}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <PressableText onPress={() => onPressProgram(programID)} style={{ fontSize: 15 }}>
            {programName}
          </PressableText>
          {/* <InfoButton item={item.item} /> */}
          <Text>Client: {programClientName}</Text>
        </View>
        <Text>Trainers: {trainersString}</Text>
        <View style={{ height: 15 }}></View>
      </View>
    )
  }

  //   const onFinishEditingClient = () => {
  //     setVisibleClientsArray(globalState.allClientsAdmin)
  //     setIsEditingClient(false)
  //   }

  const onConfirmEditingProgram = () => {
    setIsEditingProgram(false)
  }

  const onCancelEditingProgram = () => {
    setIsEditingProgram(false)
  }

  const onChangeTextHandler = newText => {
    setSearchText(newText)
  }

  const onClearText = () => {
    setSearchText("")
  }

  //   useEffect(() => {
  //     // setVisibleClientsArray(getClientFilter())
  //     const trainerFilter = filterByTrainer ? selectedTrainerToFilterBy.ID : ""
  //     setVisibleClientsArray(
  //       filterByStringAndTrainer(globalState.allClientsAdmin, searchText, trainerFilter),
  //     )
  //   }, [searchText, selectedTrainerToFilterBy, filterByTrainer])

  const onFixPrograms = () => {
    globalState.allPrograms.forEach(program => {
      console.log(program.Name)
      firestore()
        .collection("trainingPrograms")
        .doc(program.ID)
        .set({ ...program, ID: program.ID })
    })
  }

  return (
    <View style={{ paddingHorizontal: 5 }}>
      {/* <Button onPress={onFixPrograms}>fix programs</Button> */}
      {isEditingProgram && (
        <EditProgram
          onCancel={onCancelEditingProgram}
          onConfirmEdit={onConfirmEditingProgram}
          selectedProgramID={selectedProgramID}
        />
      )}
      {!isEditingProgram && (
        <View>
          <SearchBar
            placeholder="Search for a program/client/trainer"
            containerStyle={{ backgroundColor: colors.blue3, height: 60, width: "100%" }}
            inputContainerStyle={{ backgroundColor: iStyles.backGround.color }}
            round={true}
            value={searchText}
            onChangeText={text => onChangeTextHandler(text)}
            onCancel={onClearText}
            onClear={onClearText}
            autoFocus={props.autoFocusSearch}
          />
          <FlatList
            data={visibleProgramsArray}
            keyExtractor={item => item.ID}
            renderItem={renderProgram}
          />
        </View>
      )}
    </View>
  )
}
