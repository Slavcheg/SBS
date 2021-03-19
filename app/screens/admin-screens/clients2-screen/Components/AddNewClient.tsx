import React, { useState, useEffect } from "react"
import { View, useWindowDimensions, Alert, FlatList } from "react-native"
import { Button, TextInput } from "react-native-paper"

import firestore from "@react-native-firebase/firestore"

import iStyles from "../../../../components3/Constants/Styles"
import { icons, colors } from "../../../../components3/Constants"

import {
  Text,
  EditableProperty,
  CancelConfirm,
  PickAnItem,
  alertWithInfoString,
  PressableText,
} from "../../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"

import { randomString } from "../../../../global-helper"

import { useGlobalState } from "../../../../components3/globalState/global-state-regular"

type AddNewClientProps = {
  onCancel: any
  isVisible: boolean
  onFinishAdding: any
}

export const AddNewClient: React.FC<AddNewClientProps> = props => {
  const [globalState, setGlobalState] = useGlobalState()
  const allClients = globalState.allClientsAdmin

  //   const [selectedTrainer, setSelectedTrainer] = useState(
  //     allClients.find(client => client.ID === "windLeTf23h0pMmKWAsb"),
  //   )
  //   const [isPickingTrainer, setIsPickingTrainer] = useState(false)
  //   const [trainers, setTrainers] = useState([])

  const windowWidth = useWindowDimensions().width

  const getNewUserID = () => {
    let newUserID = randomString(13)
    let isUnique = true
    allClients.forEach(client => {
      if (client.ID === newUserID) isUnique = false
    })
    if (isUnique) return newUserID
    else getNewUserID()
  }

  const newID = getNewUserID()

  const getClientNumber = allClients => {
    let number = 0
    allClients.map(client => {
      if (client.ClientNumber) if (client.ClientNumber > number) number = client.ClientNumber + 1
    })
    return number
  }

  const defaultUser = {
    Name: "",
    FamilyName: "",
    ID: newID,
    Trainers: [],
    Clients: [],
    ClientNumber: getClientNumber(allClients),
    isTrainer: false,
    email: "",
  }

  const [newUser, setNewUser] = useState(defaultUser)

  const onChangeName = newName => {
    setNewUser({ ...newUser, Name: newName })
  }

  const onChangeClientNumber = newValue => {
    setNewUser({ ...newUser, ClientNumber: parseInt(newValue) ? parseInt(newValue) : 0 })
  }

  const onChangeFamilyName = newFamilyName => {
    setNewUser({ ...newUser, FamilyName: newFamilyName })
  }

  const onChangeEmail = newMail => {
    setNewUser({ ...newUser, email: newMail })
  }

  const isNumberTakenTest = newNumber => {
    let isTaken = false
    globalState.allClientsAdmin.forEach(client => {
      if (newNumber === client.ClientNumber) isTaken = true
    })
    return isTaken
  }

  const onCancel = () => {
    setNewUser(defaultUser)
    props.onCancel()
  }

  const onConfirm = () => {
    if (isNumberTakenTest(newUser.ClientNumber))
      Alert.alert(
        "Внимание",
        "Този клиентски номер е зает. Въведете друг, за да продължите",
        [{ text: "ОК" }],
        { cancelable: true },
      )
    else {
      //if proceeding with adding new user - add himself as trainer/client
      const newUserTrainers = newUser.Trainers
      const newUserClients = newUser.Clients

      const { Name, FamilyName, ClientNumber, ID } = newUser
      const newUserAsClient = {
        Name: Name,
        FamilyName: FamilyName,
        ClientNumber: ClientNumber || null,
        ID: ID,
      }

      newUserTrainers.push({ Name: newUser.Name, ID: newUser.ID })
      newUserClients.push(newUserAsClient)

      const usersToChange = [] // to update in global state and database after

      // add trainee in other trainers' lists

      globalState.allClientsAdmin.forEach((user, userIndex) => {
        if (user.isTrainer)
          newUserTrainers.forEach(trainer => {
            if (trainer.ID === user.ID) {
              const newTrainees = user.Clients
              newTrainees.push(newUserAsClient)
              usersToChange.push({ ...user, Clients: newTrainees })
            }
          })
      })

      //update user and his trainers in global state and database

      setGlobalState({ type: "create new user", value: newUser })

      usersToChange.forEach(user => {
        console.log("Updated trainer: ", user.Name, "\n Clients:")
        user.Clients.forEach(client => {
          console.log(client.Name)
        })
        setGlobalState({ type: "update user in database", value: user })
      })

      props.onFinishAdding()
      setNewUser(defaultUser)
    }
  }

  const onAddTrainer = item => {
    const newTrainers = newUser.Trainers
    let addNew = true
    newUser.Trainers.forEach(trainer => {
      if (trainer.ID === item.ID) addNew = false
    })
    if (addNew) {
      newTrainers.push({ Name: item.Name, ID: item.ID })
      //   setGlobalState({
      //     type: "update other trainers (after adding a trainer)",
      //     newTrainer: item,
      //     client: client,
      //   })
      setNewUser({ ...newUser, Trainers: newTrainers })
    }
  }

  const onRemoveTrainer = removedTrainer => {
    const newTrainers = newUser.Trainers.filter(trainer => trainer.ID !== removedTrainer.ID)
    setNewUser({ ...newUser, Trainers: newTrainers })
  }

  const renderClients = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <PressableText onPress={() => alertWithInfoString(item)}>{item.Name}</PressableText>
        {/* <Button
          icon={icons.trash}
          color="red"
          onPress={() => onRemoveClient(item)}
          disabled={item.ID === client.ID}
        ></Button> */}
      </View>
    )
  }

  const renderTrainers = ({ item, index }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <PressableText onPress={() => alertWithInfoString(item)}>{item.Name}</PressableText>

        <Button
          icon={icons.trash}
          color="red"
          onPress={() => onRemoveTrainer(item)}
          disabled={item.ID === newUser.ID}
        ></Button>
      </View>
    )
  }

  if (!props.isVisible) return <View></View>
  return (
    <View>
      <Text>ID: {newUser.ID}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <EditableProperty
          PropertyName="Name"
          PropertyValue={newUser.Name}
          onChangeValue={onChangeName}
          width={windowWidth / 2.5}
        />
        <View>
          <EditableProperty
            PropertyName="ClientNumber"
            PropertyValue={newUser.ClientNumber.toString()}
            onChangeValue={onChangeClientNumber}
            width={windowWidth / 2.5}
          />
          {isNumberTakenTest(newUser.ClientNumber) && (
            <Text style={{ fontSize: 15, color: "red" }}>TAKEN!!!</Text>
          )}
        </View>
      </View>
      <EditableProperty
        PropertyName="FamilyName"
        PropertyValue={newUser.FamilyName}
        onChangeValue={(newValue: string) => onChangeFamilyName(newValue)}
      />
      <EditableProperty
        PropertyName="email"
        PropertyValue={newUser.email}
        onChangeValue={(newValue: string) => onChangeEmail(newValue)}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <FlatList
          data={newUser.Trainers}
          keyExtractor={item => item.ID}
          renderItem={renderTrainers}
          ListHeaderComponent={() => <Text style={iStyles.text1}>Trainers:</Text>}
        />
        <FlatList
          data={newUser.Clients}
          keyExtractor={item => item.ID}
          renderItem={renderClients}
          ListHeaderComponent={() => <Text style={iStyles.text1}>Clients:</Text>}
        />
        <View>
          <Text>Add a trainer</Text>
          {globalState.allTrainers.length > 0 && (
            <PickAnItem
              list={globalState.allTrainers}
              onChange={onAddTrainer}
              selected={globalState.allTrainers[0]}
              renderItems={item => <Text style={iStyles.text1}>{item.Name}</Text>}
              renderSelected={() => (
                <Text style={iStyles.text1}>{globalState.allTrainers[0].Name}</Text>
              )}
            />
          )}
        </View>
      </View>

      <CancelConfirm onCancel={onCancel} onConfirm={onConfirm} />
    </View>
  )
}
