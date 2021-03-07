import React, { useState, useEffect } from "react"
import { View, ScrollView, Alert, useWindowDimensions, FlatList } from "react-native"
import { Button, TextInput } from "react-native-paper"

import iStyles from "../../../trainer-screens/edit-program-screen/Constants/Styles"
import { icons } from "../../../trainer-screens/edit-program-screen/Constants"

import {
  Text,
  EditableProperty,
  CancelConfirm,
  PressableText,
  alertWithInfoString,
  PickAnItem,
} from "../../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"

import { useGlobalState } from "../../../../models/global-state-regular"

type EditProgramProps = {
  onCancel: any
  onConfirmEdit: any
  selectedProgramID: string
}

export const EditProgram: React.FC<EditProgramProps> = props => {
  const [globalState, setGlobalState] = useGlobalState()
  const [currentProgram, setCurrentProgram] = useState(null)
  const [currentProgramClient, setCurrentProgramClient] = useState({ Name: "", ID: "" })
  const [currentProgramTrainers, setCurrentProgramTrainers] = useState([{ Name: "", ID: "" }])

  useEffect(() => {
    let newTrainers
    const newProgram = globalState.allPrograms.find(
      program => program.ID === props.selectedProgramID,
    )

    setCurrentProgram(newProgram)
    const newClient = globalState.allClientsAdmin.find(client => (client.ID = newProgram.Client))
    setCurrentProgramClient(newClient ? newClient.Name : "client not found")
    newTrainers = []
    newProgram.Trainers.forEach(trainerID => {
      console.log("newTrainer set", trainerID)
      const newTrainer = globalState.allClientsAdmin.find(client => client.ID === trainerID)
      if (newTrainer && newTrainer.Name)
        newTrainers.push({ Name: newTrainer.Name, ID: newTrainer.ID })
      else newTrainers.push({ Name: "not found", ID: newTrainer.ID })
    })
    setCurrentProgramTrainers(newTrainers)

    console.log("new program set: ", newProgram.ID)
  }, [props.selectedProgramID])

  if (!currentProgram) return <Button onPress={props.onCancel}>program not found</Button>

  const onCancel = () => {
    props.onCancel()
  }

  const onConfirmEdit = () => {
    props.onConfirmEdit()
  }

  const renderTrainers = ({ item }) => {
    const trainer = globalState.allClientsAdmin.find(client => client.ID === item)
    console.log("trainer: ", trainer)
    return (
      <View>
        <Text>
          asdf {trainer.Name} {trainer.ID}
        </Text>
      </View>
    )
  }

  const renderAllTrainers = ({ item }) => {
    if (!item.isTrainer) return <View></View>
    return (
      <View>
        <PressableText onPress={() => alertWithInfoString(item)}>{item.Name}</PressableText>
      </View>
    )
  }

  return (
    <View>
      <Text>Program: {currentProgram.ID}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Program: {currentProgram.Name}</Text>
        <Text>Client: {currentProgramClient.Name}</Text>
      </View>
      <FlatList
        data={currentProgram.Trainers}
        renderItem={renderTrainers}
        keyExtractor={item => item}
      />
      <CancelConfirm onCancel={onCancel} onConfirm={onConfirmEdit} />
      <FlatList
        data={globalState.allClientsAdmin}
        renderItem={renderAllTrainers}
        keyExtractor={item => item.ID}
      />
    </View>
  )
}
