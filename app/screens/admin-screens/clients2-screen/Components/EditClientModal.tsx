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

type EditClientModalProps = {
  isVisible?: boolean
  onCancel: any
  onFinishEditing: any
  clientID: string
}

type client = {
  Name: ""
  ID: ""
  Clients: any[]
  Trainers: any[]
  FamilyName?: ""
  ClientNumber?: number
  isTrainer?: boolean
  email?: ""
}

const defaultClient: client = {
  Name: "",
  FamilyName: "",
  ID: "",
  Trainers: [],
  Clients: [],
  ClientNumber: 0,
  isTrainer: false,
  email: "",
}

export const EditClientModal: React.FC<EditClientModalProps> = props => {
  const [globalState, setGlobalState] = useGlobalState()
  const [client, setClient] = useState(defaultClient)
  const windowWidth = useWindowDimensions().width

  const { clientID } = props

  useEffect(() => {
    setClient(globalState.allClientsAdmin.find(client => client.ID === clientID))
  }, [clientID])

  const onDeleteClient = () => {
    const onConfirmDelete = () => {
      console.log(`tried deleting ${client.Name}`)
      Alert.alert("Внимание", `${client.Name} беше изтрит`, [{ text: "OK" }], { cancelable: true })
      setGlobalState({ type: "delete user", value: client })
      props.onFinishEditing()
      setClient(defaultClient)
    }
    Alert.alert(
      "Внимание",
      `Confirm deleting client ${client.Name}?`,
      [{ text: "Върни ме назад" }, { text: "Да, изтрий го!", onPress: onConfirmDelete }],
      { cancelable: true },
    )
  }

  const onChangeName = newName => {
    setClient({ ...client, Name: newName })
  }

  const onChangeClientNumber = newValue => {
    setClient({ ...client, ClientNumber: parseInt(newValue) ? parseInt(newValue) : 0 })
  }

  const onChangeFamilyName = newFamilyName => {
    setClient({ ...client, FamilyName: newFamilyName })
  }

  const onChangeEmail = newMail => {
    setClient({ ...client, email: newMail })
  }

  const isNumberTakenTest = newNumber => {
    let isTaken = false
    globalState.allClientsAdmin.forEach(client => {
      if (newNumber === client.ClientNumber) isTaken = true
    })
    return isTaken
  }

  const onAddTrainer = item => {
    const newTrainers = client.Trainers
    let addNew = true
    client.Trainers.forEach(trainer => {
      if (trainer.ID === item.ID) addNew = false
    })
    if (addNew) {
      newTrainers.push({ Name: item.Name, ID: item.ID })
      //   setGlobalState({
      //     type: "update other trainers (after adding a trainer)",
      //     newTrainer: item,
      //     client: client,
      //   })
      setClient({ ...client, Trainers: newTrainers })
    }
  }

  const onRemoveTrainer = removedTrainer => {
    const newTrainers = client.Trainers.filter(trainer => trainer.ID !== removedTrainer.ID)
    setClient({ ...client, Trainers: newTrainers })
  }

  const onRemoveClient = removedClient => {
    const newClients = client.Clients.filter(client => client.ID !== removedClient.ID)
    setClient({ ...client, Clients: newClients })
  }

  const onConfirmEdit = () => {
    const { Name, FamilyName, ClientNumber, ID } = client
    const newUserAsClient = {
      Name: Name,
      FamilyName: FamilyName,
      ClientNumber: ClientNumber || null,
      ID: ID,
    }

    const usersToChange = [] // to update in global state and database after

    // add trainee in other trainers' lists

    globalState.allClientsAdmin.forEach((user, userIndex) => {
      if (user.isTrainer)
        client.Trainers.forEach(trainer => {
          if (trainer.ID === user.ID) {
            let addAsTrainee = true //add as trainee unless person already exists in this trainer's list

            user.Clients.forEach(trainerClient => {
              if (trainerClient.ID === client.ID) addAsTrainee = false
            })
            if (addAsTrainee) {
              const newTrainees = user.Clients
              newTrainees.push(newUserAsClient)
              usersToChange.push({ ...user, Clients: newTrainees })
            }
          }
        })
    })

    setGlobalState({ type: "update user in database", value: client })

    usersToChange.forEach(user => {
      console.log("Updated trainer: ", user.Name, "\n Clients:")
      user.Clients.forEach(client => {
        console.log(client.Name)
      })
      setGlobalState({ type: "update user in database", value: user })
    })

    props.onFinishEditing()
  }

  const addSelfClientTrainer = () => {
    const { Name, ID, FamilyName, ClientNumber } = client

    const newTrainers = client.Trainers
    newTrainers.push({ Name: Name, ID: ID })

    const newClients = client.Clients
    newClients.push({
      Name: Name,
      ID: ID,
      FamilyName: FamilyName,
      ClientNumber: ClientNumber ? ClientNumber : 0,
    })
    setClient({ ...client, Clients: newClients, Trainers: newTrainers })
  }

  const renderClients = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <PressableText onPress={() => alertWithInfoString(item)}>{item.Name}</PressableText>
        <Button
          icon={icons.trash}
          color="red"
          onPress={() => onRemoveClient(item)}
          //   disabled={item.ID === client.ID}
        ></Button>
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
          //   disabled={item.ID === client.ID}
        ></Button>
      </View>
    )
  }

  if (!props.isVisible) return <View></View>
  if (!client) return <Text>error</Text>

  return (
    <ScrollView>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>hello, {client.Name}</Text>
        <Button color="red" onPress={onDeleteClient}>
          Delete client
        </Button>
      </View>
      <Text>ID: {client.ID}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <EditableProperty
          PropertyName="Name"
          PropertyValue={client.Name}
          onChangeValue={onChangeName}
          width={windowWidth / 2.5}
        />
        <View>
          <EditableProperty
            PropertyName="ClientNumber"
            PropertyValue={client.ClientNumber.toString()}
            onChangeValue={onChangeClientNumber}
            width={windowWidth / 2.5}
            // disabled={true}
          />
          {/* {isNumberTakenTest(client.ClientNumber) && (
            <Text style={{ fontSize: 15, color: "red" }}>TAKEN!!!</Text>
          )} */}
        </View>
      </View>
      <EditableProperty
        PropertyName="FamilyName"
        PropertyValue={client.FamilyName}
        onChangeValue={(newValue: string) => onChangeFamilyName(newValue)}
      />
      <EditableProperty
        PropertyName="email"
        PropertyValue={client.email}
        onChangeValue={(newValue: string) => onChangeEmail(newValue)}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <FlatList
          data={client.Trainers}
          keyExtractor={item => item.ID}
          renderItem={renderTrainers}
          ListHeaderComponent={() => <Text style={iStyles.text1}>Trainers:</Text>}
        />
        <FlatList
          data={client.Clients}
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
      <Button onPress={addSelfClientTrainer}>add self as client/trainer</Button>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CancelConfirm onCancel={props.onCancel} onConfirm={onConfirmEdit} />
      </View>
    </ScrollView>
  )
}
