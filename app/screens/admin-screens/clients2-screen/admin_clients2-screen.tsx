import React, { useState, useEffect } from "react"
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

import { icons, colors } from "../../trainer-screens/edit-program-screen/Constants/"
import {
  PickAnItem,
  alertWithInfoString,
  InfoButton,
  PressableText,
} from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"
import iStyles from "../../trainer-screens/edit-program-screen/Constants/Styles"

import { useGlobalState } from "../../../models/global-state-regular"
import { filterByStringAndTrainer } from "../../../global-helper"

import { randomString } from "../../../global-helper"

import { EditClientModal, AddNewClient } from "./Components"
import { filter } from "ramda"

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

export const Admin_Clients2 = props => {
  const [globalState, setGlobalState] = useGlobalState()
  const [searchText, setSearchText] = useState("")
  const [isAddingNewUserMode, setIsAddingNewUserMode] = useState(false)
  const [filterByTrainer, setFilterByTrainer] = useState(false)
  const [selectedTrainerToFilterBy, setSelectedTrainerToFilterBy] = useState(null)
  const [visibleClientsArray, setVisibleClientsArray] = useState([])
  const [isEditingClient, setIsEditingClient] = useState(false)
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [selectedClientID, setSelectedClientID] = useState("")

  let screenMounted = true //if unmounted - do not change state variables

  useEffect(() => {
    return () => (screenMounted = false)
  }, [])

  useEffect(() => {
    downloadClientsAdmin(onDownloadClients)
  }, [])

  const onDownloadClients = newClients => {
    if (screenMounted) {
      // setAllClientNumbers(newClientNumbers)
      setGlobalState({ type: "update all clients(admin)", value: newClients })
      setVisibleClientsArray(newClients)
      const firstTrainer = newClients.find(client => client.isTrainer === true)
      setSelectedTrainerToFilterBy(firstTrainer)
      // setSelectedTrainerFilter(newClients.find(client => (client.ID = "0QfeTiAvu2V25kERRNdB")))
    }
  }

  const onPressClient = clientID => {
    setIsEditingClient(true)
    setSelectedClientID(clientID)
  }

  const renderClient = ({ item, index }) => {
    const errorString = "error"

    return (
      <View style={{ flexDirection: "row" }}>
        <PressableText onPress={() => onPressClient(item.ID)} style={{ fontSize: 20 }}>
          {item.Name || errorString}
        </PressableText>
        <InfoButton item={item} />
      </View>
    )
  }

  const onFinishEditingClient = () => {
    setVisibleClientsArray(globalState.allClientsAdmin)
    setIsEditingClient(false)
  }

  const onFinishAddingNewClient = () => {
    // setVisibleClientsArray(getClientFilter())
    const trainerFilter = filterByTrainer ? selectedTrainerToFilterBy.ID : ""
    setVisibleClientsArray(
      filterByStringAndTrainer(globalState.allClientsAdmin, searchText, trainerFilter),
    )
    setIsAddingClient(false)
    console.log("successfully added client")
  }

  const onChangeTextHandler = newText => {
    setSearchText(newText)
  }

  const onClearText = () => {
    setSearchText("")
  }

  // const getClientFilter = () => {
  //   if (filterByTrainer) {
  //     //filter by trainer
  //     const filter1 = []
  //     const filter1IDStrings = []
  //     globalState.allClientsAdmin.forEach(client => {
  //       client.Trainers.forEach(trainer => {
  //         if (trainer.ID === selectedTrainerToFilterBy.ID) {
  //           let addNewClient = true
  //           filter1IDStrings.forEach(IDstring => {
  //             if (IDstring === client.ID) addNewClient = false
  //           })
  //           if (addNewClient) {
  //             filter1.push(client)
  //             filter1IDStrings.push(client.ID)
  //           }
  //         }
  //       })
  //     })
  //     //filter by search text
  //     const filter2 = filter1.filter(client => {
  //       const clientString = client.ClientNumber
  //         ? client.Name.toUpperCase() + client.ClientNumber.toString()
  //         : client.Name.toUpperCase()
  //       return clientString.includes(searchText.toUpperCase())
  //     })

  //     return filter2
  //   } else {
  //     //filter by search text only
  //     const filter = globalState.allClientsAdmin.filter(client => {
  //       const clientString = client.ClientNumber
  //         ? client.Name.toUpperCase() + client.ClientNumber.toString()
  //         : client.Name.toUpperCase()
  //       return clientString.includes(searchText.toUpperCase())
  //     })
  //     return filter
  //   }
  // }

  useEffect(() => {
    // setVisibleClientsArray(getClientFilter())
    const trainerFilter = filterByTrainer ? selectedTrainerToFilterBy.ID : ""
    setVisibleClientsArray(
      filterByStringAndTrainer(globalState.allClientsAdmin, searchText, trainerFilter),
    )
  }, [searchText, selectedTrainerToFilterBy, filterByTrainer])

  return (
    <View style={{ paddingHorizontal: 5 }}>
      {!isEditingClient && !isAddingClient && (
        <View>
          <SearchBar
            placeholder="Search for a client"
            containerStyle={{ backgroundColor: colors.blue3, height: 60, width: "100%" }}
            inputContainerStyle={{ backgroundColor: iStyles.backGround.color }}
            round={true}
            value={searchText}
            onChangeText={text => onChangeTextHandler(text)}
            onCancel={onClearText}
            onClear={onClearText}
            autoFocus={props.autoFocusSearch}
          />
          <Button onPress={() => setIsAddingClient(true)} color={colors.blue3}>
            add new client
          </Button>
        </View>
      )}

      <AddNewClient
        onCancel={() => setIsAddingClient(false)}
        isVisible={isAddingClient}
        onFinishAdding={onFinishAddingNewClient}
      />
      <EditClientModal
        isVisible={isEditingClient}
        onCancel={() => setIsEditingClient(false)}
        onFinishEditing={onFinishEditingClient}
        clientID={selectedClientID}
      />
      {!isEditingClient && !isAddingClient && (
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {filterByTrainer ? (
              <Button onPress={() => setFilterByTrainer(!filterByTrainer)} color="grey">
                One trainer -
              </Button>
            ) : (
              <Button onPress={() => setFilterByTrainer(!filterByTrainer)} color="green">
                All trainers
              </Button>
            )}
            {filterByTrainer && (
              <PickAnItem
                list={globalState.allTrainers}
                onChange={newTrainer => setSelectedTrainerToFilterBy(newTrainer)}
                selected={selectedTrainerToFilterBy}
                renderItems={(item, index) => (
                  <Text style={{ ...iStyles.text1, fontSize: 25 }}>{item.Name}</Text>
                )}
                renderSelected={() => (
                  <Text style={{ ...iStyles.text1, fontSize: 25 }}>
                    {selectedTrainerToFilterBy.Name}
                  </Text>
                )}
              />
            )}
          </View>
          <FlatList
            data={visibleClientsArray}
            keyExtractor={item => item.ID}
            renderItem={renderClient}
          />
        </View>
      )}
    </View>
  )
}
