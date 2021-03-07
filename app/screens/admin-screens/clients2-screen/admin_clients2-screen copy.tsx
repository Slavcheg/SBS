import React, { useState, useEffect } from "react"
import { View, Text, FlatList, Modal, Pressable, useWindowDimensions, Alert } from "react-native"
import _ from "lodash"

import { Button, TextInput } from "react-native-paper"
import firestore from "@react-native-firebase/firestore"
import { SearchBar } from "react-native-elements"

import { icons } from "../../trainer-screens/edit-program-screen/Constants/"
import {
  PickAnItem,
  alertWithInfoString,
  InfoButton,
} from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"
import iStyles from "../../trainer-screens/edit-program-screen/Constants/Styles"

import { useGlobalState } from "../../../models/global-state-regular"

import { randomString } from "../../../global-helper"

const downloadClientsAdmin = (onDownloadClients: Function) => {
  firestore()
    .collection("trainees")
    .get()
    .then(docs => {
      const newClients = []
      const newClientNumbers = []
      docs.forEach(doc => {
        let duplicateID = false
        newClients.forEach(client => {
          if (client.ID === doc.data().ID) duplicateID = true
        })
        if (!duplicateID) {
          newClients.push(doc.data()), newClientNumbers.push(doc.data().ClientNumber || 0)
        }
      })
      onDownloadClients(newClients, newClientNumbers)
    })
}

export const Admin_Clients2 = props => {
  const [globalState, setGlobalState] = useGlobalState()
  const [searchText, setSearchText] = useState("")
  const [allClientNumbers, setAllClientNumbers] = useState([])
  const [isAddingNewUser, setIsAddingNewUser] = useState(false)
  const [pickOneTrainer, setPickOneTrainer] = useState(true)

  const [selectedTrainerFilter, setSelectedTrainerFilter] = useState({ Name: "", ID: "" })
  const [clientListFilter, setClientListFilter] = useState([])

  const onDownloadClients = (newClients, newClientNumbers) => {
    setAllClientNumbers(newClientNumbers)
    setGlobalState({ type: "update all clients(admin)", value: newClients })
    setSelectedTrainerFilter(newClients.find(client => (client.ID = "0QfeTiAvu2V25kERRNdB")))
  }

  useEffect(() => {
    let mounted = true
    if (mounted) downloadClientsAdmin(onDownloadClients)

    return () => (mounted = false)
  }, [])

  const onChangeTextHandler = newText => {
    setSearchText(newText)
  }

  const onClearText = () => {
    setSearchText("")
  }

  const onSaveClient = newClient => {
    setGlobalState({ type: "update one client", value: newClient })
    setClientListFilter(getClientFilter())
    // console.log("New client:", newClient)

    // firestore()
    //   .collection("trainees")
    //   .doc(newRandomClient.ID)
    //   .update(newRandomClient)

    // firestore()
    //   .collection("trainees")
    //   .doc(client.ID)
    //   .update(client)
    //   .then(() => console.log("client ", client.Name ? client.Name : "", " updated"))
  }

  const updateTraineesHandler = () => {
    // console.log(allClients.find(client => client.ID === "JMxV035wcHXjmYjYyHGR"))
    firestore()
      .collection("trainingPrograms")
      .get()
      .then(docs => {
        let programs = []
        docs.forEach(doc => {
          programs.push(doc.data())
        })
        console.log("got all programs ", programs.length)

        firestore()
          .collection("users2")
          .get()
          .then(users => {
            let newUsers = []
            users.forEach(user => {
              if (user.data().first && user.data().email)
                newUsers.push({
                  Name: user.data().first,
                  ID: user.id,
                  FamilyName: user.data().last,
                  ClientNumber: 0,
                  Trainers: [],
                  Clients: [],
                  isTrainer: user.data().isTrainer,
                  email: user.data().email,
                })
            })

            console.log("got all users ", newUsers.length)

            newUsers.forEach((user, index) => {
              let thisTrainerclientsList = []
              programs.forEach(program => {
                if (program.Client === user.ID)
                  program.Trainers.forEach(trainerID => {
                    let addnewTrainer = true
                    newUsers[index].Trainers.forEach(trainer => {
                      if (trainer.ID === trainerID) addnewTrainer = false
                    })
                    if (addnewTrainer)
                      newUsers[index].Trainers.push({
                        ID: trainerID,
                        Name: newUsers.find(user => user.ID === trainerID).Name,
                      })
                  })
                if (user.isTrainer) {
                  if (program.Trainers.includes(user.ID)) {
                    if (!thisTrainerclientsList.includes(program.Client)) {
                      thisTrainerclientsList.push(program.Client)
                      const newClient = newUsers.find(user => user.ID === program.Client)
                      if (newClient) {
                        const newClientInfo = {
                          Name: newClient.Name,
                          FamilyName: newClient.FamilyName,
                          ClientNumber: newClient.ClientNumber,
                          ID: newClient.ID,
                        }
                        newUsers[index].Clients.push(newClientInfo)
                      }
                    }
                  }
                }
              })
            })
            newUsers.forEach(user => {
              firestore()
                .collection("trainees")
                .doc(user.ID)
                .set(user)
            })
          })
      })
  }

  const testHandler = () => {}

  const getClientFilter = () => {
    let filter = []
    if (pickOneTrainer) {
      filter = globalState.allClientsAdmin
        .filter(client => {
          if (!client.Name) return false
          const clientString = client.ClientNumber
            ? client.Name.toUpperCase() + client.ClientNumber.toString()
            : client.Name.toUpperCase()
          return clientString.includes(searchText.toUpperCase())
        })
        .filter(client => {
          const clientTrainers = []
          client.Trainers.forEach(trainer => {
            clientTrainers.push(trainer.ID)
          })
          if (clientTrainers.includes(selectedTrainerFilter.ID)) {
            return true
          } else return false
        })
    } else
      filter = globalState.allClientsAdmin.filter(client => {
        const clientString = client.ClientNumber
          ? client.Name.toUpperCase() + client.ClientNumber.toString()
          : client.Name.toUpperCase()
        return clientString.includes(searchText.toUpperCase())
      })
    return _.uniq(filter) //avoid duplicates
  }
  //   const clientFilter = getClientFilter()

  useEffect(() => {
    setClientListFilter(getClientFilter())
  }, [selectedTrainerFilter, pickOneTrainer, searchText])

  return (
    <View style={{ flex: 1, margin: 5 }}>
      <Text>Clients screen</Text>
      {/* <Button onPress={testHandler}>test</Button> */}
      <Button onPress={updateTraineesHandler}>update clients</Button>
      {!isAddingNewUser && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <SearchBar
            placeholder="Search for a client"
            containerStyle={{ backgroundColor: iStyles.text1.color, height: 60, width: "80%" }}
            inputContainerStyle={{ backgroundColor: iStyles.backGround.color }}
            round={true}
            value={searchText}
            onChangeText={text => onChangeTextHandler(text)}
            onCancel={onClearText}
            onClear={onClearText}
            autoFocus={props.autoFocusSearch}
          />
          <Button onPress={() => setIsAddingNewUser(!isAddingNewUser)}>add</Button>
        </View>
      )}
      {isAddingNewUser && (
        <AddNewUserModal
          allClients={globalState.allClientsAdmin}
          onCancel={() => setIsAddingNewUser(!isAddingNewUser)}
        />
      )}
      {!isAddingNewUser && (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {pickOneTrainer ? (
            <Button onPress={() => setPickOneTrainer(!pickOneTrainer)} color="grey">
              One trainer -
            </Button>
          ) : (
            <Button onPress={() => setPickOneTrainer(!pickOneTrainer)} color="green">
              All trainers
            </Button>
          )}
          {pickOneTrainer && (
            <PickAnItem
              list={globalState.allTrainers}
              onChange={newTrainer => setSelectedTrainerFilter(newTrainer)}
              selected={selectedTrainerFilter}
              renderItems={(item, index) => (
                <Text style={{ ...iStyles.text1, fontSize: 25 }}>{item.Name}</Text>
              )}
              renderSelected={() => (
                <Text style={{ ...iStyles.text1, fontSize: 25 }}>{selectedTrainerFilter.Name}</Text>
              )}
            />
          )}
        </View>
      )}

      {!isAddingNewUser && (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <FlatList
            data={clientListFilter}
            keyExtractor={item => item.ID}
            renderItem={({ item, index }) => (
              <RenderClient
                item={item}
                index={index}
                onSaveClient={onSaveClient}
                TakenClientNumbers={allClientNumbers.filter(number => number != item.ClientNumber)}
              />
            )}
          />
        </View>
      )}
    </View>
  )
}

type client = {
  Name: ""
  ID: ""
  Clients: any[]
  Trainers: any[]
  FamilyName?: ""
  ClientNumber?: number
  isTrainer?: boolean
}

type EditClientModalProps = {
  visible: boolean
  client: client
  onRequestClose: Function
  onSaveClient: Function
  TakenClientNumbers: number[]
}

const EditClientModal: React.FC<EditClientModalProps> = props => {
  const defaultClient: client = {
    Name: "",
    FamilyName: "",
    ID: "",
    Trainers: [],
    Clients: [],
    ClientNumber: 0,
    isTrainer: false,
  }

  const [client, setClient] = useState(defaultClient)
  const [globalState, setGlobalState] = useGlobalState()

  useEffect(() => {
    // const newClient = props.client

    // //check to see if self is added as a client and fix if not
    // const selfClient = {
    //   ClientNumber: newClient.ClientNumber || 0,
    //   FamilyName: newClient.FamilyName || "",
    //   ID: newClient.ID || "",
    //   Name: newClient.Name || "",
    // }
    // let addSelfClient = true
    // newClient.Clients.forEach(client => {
    //   if (client.ID === newClient.ID) addSelfClient = false
    // })
    // const newClientClients = newClient.Clients
    // if (addSelfClient) newClientClients.push(selfClient)

    // //check to see if self is added as a trainer and fix if not
    // const selfTrainer = { ID: newClient.ID || "", Name: newClient.Name || "" }
    // let addSelfTrainer = true
    // newClient.Trainers.forEach(trainer => {
    //   if (trainer.ID === newClient.ID) addSelfTrainer = false
    // })
    // const newClientTrainers = newClient.Trainers
    // if (addSelfTrainer) newClientTrainers.push(selfTrainer)

    // setClient({ ...newClient, Clients: newClientClients, Trainers: newClientTrainers })

    setClient(_.cloneDeep(props.client))
  }, [props.client.ID])

  const onChangeName = newName => {
    // updating self Clients and Trainers too since you are your own client and trainer
    let newTrainers = client.Trainers
    const foundIndex = newTrainers.findIndex(trainer => trainer.ID === client.ID)
    newTrainers[foundIndex].Name = newName

    let newClients = client.Clients
    const foundIndexCli = newClients.findIndex(cli => cli.ID === client.ID)
    newClients[foundIndexCli].Name = newName

    setClient({ ...client, Name: newName, Clients: newClients, Trainers: newTrainers })
  }

  const onChangeFamilyName = newName => {
    // updating self Clients too since you are your own client and trainer (not Trainers though because Trainers do not have FamilyName)
    let newClients = client.Clients
    const foundIndexCli = newClients.findIndex(cli => cli.ID === client.ID)
    newClients[foundIndexCli].FamilyName = newName

    setClient({ ...client, FamilyName: newName, Clients: newClients })
  }

  const onChangeID = newID => {
    console.error("Can't change ID")
  }

  const onChangeClientNumber = newValue => {
    const newNumber = parseInt(newValue) ? parseInt(newValue) : 0

    let newClients = client.Clients
    const foundIndexCli = newClients.findIndex(cli => cli.ID === client.ID)
    newClients[foundIndexCli].ClientNumber = newNumber

    setClient({ ...client, ClientNumber: newNumber, Clients: newClients })
  }

  const onRemoveTrainer = item => {
    console.log("clicked trainer: ", item.Name)
    const newTrainers = client.Trainers.filter(trainer => trainer.ID != item.ID)
    const newClient = { ...client, Trainers: newTrainers }
    setClient(newClient)
    setGlobalState({
      type: "update other trainers (after removing a trainer)",
      removedTrainer: item,
      client: newClient,
    })
  }

  const onAddTrainer = item => {
    const newTrainers = client.Trainers
    let addNew = true
    client.Trainers.forEach(trainer => {
      if (trainer.ID === item.ID) addNew = false
    })
    if (addNew) {
      newTrainers.push({ Name: item.Name, ID: item.ID })
      setGlobalState({
        type: "update other trainers (after adding a trainer)",
        newTrainer: item,
        client: client,
      })
      setClient({ ...client, Trainers: newTrainers })
    }
  }

  const renderTrainers = ({ item, index }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => alertWithInfoString(item)}>
          <Text style={{ ...iStyles.text0, fontSize: 20 }}>{item.Name}</Text>
        </Pressable>
        <Button
          icon={icons.trash}
          color="red"
          onPress={() => onRemoveTrainer(item)}
          disabled={item.ID === client.ID}
        ></Button>
      </View>
    )
  }

  const onRemoveClient = trainerItem => {
    console.log("removing this feature for now")
    // const newClients = client.Clients.filter(client => client.ID != trainerItem.ID)
    // setClient({ ...client, Clients: newClients })
    // setGlobalState({type:'update other trainers (after removing a client)', client: client, trainer: trainerItem})
  }

  const renderClients = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => alertWithInfoString(item)}>
          <Text style={{ ...iStyles.text0, fontSize: 20 }}>{item.Name}</Text>
        </Pressable>
        {/* <Button
          icon={icons.trash}
          color="red"
          onPress={() => onRemoveClient(item)}
          disabled={item.ID === client.ID}
        ></Button> */}
      </View>
    )
  }

  if (!props.visible) return <View></View>
  return (
    <Modal visible={props.visible}>
      <View style={{ height: "50%" }}>
        {client && (
          <View>
            <EditableProperty
              PropertyName="Name"
              PropertyValue={client.Name}
              onChangeValue={(newValue: string) => onChangeName(newValue)}
            />
            <EditableProperty
              PropertyName="FamilyName"
              PropertyValue={client.FamilyName}
              onChangeValue={(newValue: string) => onChangeFamilyName(newValue)}
            />
            <EditableProperty
              PropertyName="ID"
              PropertyValue={client.ID}
              onChangeValue={(newValue: string) => onChangeID(newValue)}
            />

            <EditableProperty
              PropertyName="ClientNumber"
              PropertyValue={client.ClientNumber.toString()}
              onChangeValue={onChangeClientNumber}
            />

            {props.TakenClientNumbers.includes(client.ClientNumber) && (
              <Text style={{ fontSize: 15, color: "red" }}>TAKEN!!!</Text>
            )}
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
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button onPress={props.onRequestClose}>cancel</Button>
              <Button
                onPress={() => props.onSaveClient(client)}
                disabled={props.TakenClientNumbers.includes(client.ClientNumber) ? true : false}
              >
                save
              </Button>
            </View>
          </View>
        )}
      </View>
    </Modal>
  )
}

type EditablePropertyProps = {
  PropertyName: string
  PropertyValue: any
  onChangeValue: Function
  width?: string | number
}

const EditableProperty: React.FC<EditablePropertyProps> = props => {
  const { PropertyName, PropertyValue, onChangeValue } = props
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TextInput
        style={{
          ...iStyles.text2,
          fontSize: 12,
          textAlignVertical: "center",
          width: props.width ? props.width : "100%",
        }}
        label={PropertyName}
        mode="outlined"
        underlineColor={iStyles.text1.color}
        onChangeText={newValue => onChangeValue(newValue)}
        value={PropertyValue}
        disabled={PropertyName === "ID" ? true : false}
      />
    </View>
  )
}

const RenderClient = ({ item, index, onSaveClient, TakenClientNumbers }) => {
  const [isEditClientModalVisible, setIsEditClientModalVisible] = useState(false)

  const onCloseModal = () => {
    setIsEditClientModalVisible(false)
  }

  const onSave = newClient => {
    onSaveClient(newClient)
    setIsEditClientModalVisible(false)
  }

  return (
    <View>
      <EditClientModal
        client={item}
        onRequestClose={onCloseModal}
        visible={isEditClientModalVisible}
        onSaveClient={onSave}
        TakenClientNumbers={TakenClientNumbers}
      />
      <Pressable onPress={() => setIsEditClientModalVisible(!isEditClientModalVisible)}>
        <ShowClientPlusNumber client={item} index={index} />
      </Pressable>
    </View>
  )
}

const ShowClientPlusNumber = ({ client, index }) => {
  const showClientNumber = client.ClientNumber ? true : false
  if (showClientNumber)
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ ...iStyles.text0, fontSize: 25 }}>
          {index + 1}. {client.Name} - {client.ClientNumber}
        </Text>
        <InfoButton item={client}></InfoButton>
      </View>
    )
  if (!showClientNumber)
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ ...iStyles.text0, fontSize: 25 }}>
          {index + 1}. {client.Name}
        </Text>
        <InfoButton item={client}></InfoButton>
      </View>
    )
}

const AddNewUserModal = ({ allClients, onCancel }) => {
  const [selectedTrainer, setSelectedTrainer] = useState(
    allClients.find(client => client.ID === "windLeTf23h0pMmKWAsb"),
  )
  const [isPickingTrainer, setIsPickingTrainer] = useState(false)
  const [trainers, setTrainers] = useState([])

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

  const isNumberTakenTest = newNumber => {
    let isTaken = false
    allClients.forEach(client => {
      if (newNumber === client.ClientNumber) isTaken = true
    })
    return isTaken
  }

  const onAddNewClient = () => {
    const newClientTrainers = [{ Name: newUser.Name, ID: newUser.ID }]

    trainers.forEach(trainer => newClientTrainers.push({ Name: trainer.Name, ID: trainer.ID }))
    const newClientClients = [{ Name: newUser.Name, ID: newUser.ID }]

    const newClient = { ...newUser, Trainers: newClientTrainers, Clients: newClientClients }
    firestore()
      .collection("trainees")
      .doc(newClient.ID)
      .set(newClient)

    setNewUser({ ...defaultUser })
    setSelectedTrainer(allClients.find(client => client.ID === "windLeTf23h0pMmKWAsb"))
    setTrainers([])
    onCancel()
  }

  const windowWidth = useWindowDimensions().width

  const onSelectTrainer = newTrainer => {
    setSelectedTrainer(newTrainer)
    setIsPickingTrainer(false)
    let addNew = true
    trainers.forEach(trainer => {
      if (trainer.ID === newTrainer.ID) addNew = false
    })

    if (addNew) {
      setTrainers([...trainers, newTrainer])
      setSelectedTrainer(allClients.find(client => client.ID === "windLeTf23h0pMmKWAsb"))
      setIsPickingTrainer(false)
    }
  }

  const onRemoveTrainer = removedTrainer => {
    const newTrainers = trainers.filter(trainer => trainer.ID != removedTrainer.ID)
    setTrainers(newTrainers)
  }

  const renderTrainers = ({ item, index }) => {
    return (
      <Pressable onPress={() => onSelectTrainer(item)}>
        <Text style={{ ...iStyles.text0, fontSize: 25, textAlign: "right" }}>
          {item.Name} {item.ClientNumber ? item.ClientNumber : ""}
        </Text>
      </Pressable>
    )
  }

  return (
    <View>
      <Text>ID: {newUser.ID}</Text>
      {/* <EditableProperty
        PropertyName="ID"
        PropertyValue={newUser.ID}
        onChangeValue={() => console.log("hi")}
      /> */}
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
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <EditableProperty
          PropertyName="FamilyName"
          PropertyValue={newUser.FamilyName}
          onChangeValue={onChangeFamilyName}
          width={windowWidth / 2.5}
        />
        {newUser.isTrainer ? (
          <Button
            onPress={() => setNewUser({ ...newUser, isTrainer: false })}
            color={iStyles.text2.color}
          >
            is a trainer!
          </Button>
        ) : (
          <Button
            onPress={() => setNewUser({ ...newUser, isTrainer: true })}
            color={iStyles.greyText.color}
          >
            not a trainer
          </Button>
        )}
      </View>
      {trainers.length > 0 &&
        trainers.map(trainer => {
          return (
            <View key={trainer.ID} style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text style={{ ...iStyles.text1, fontSize: 25, textAlign: "right" }}>
                {trainer.Name}
              </Text>
              <Button
                icon={icons.trash}
                color="red"
                onPress={() => onRemoveTrainer(trainer)}
              ></Button>
            </View>
          )
        })}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ ...iStyles.text1, fontSize: 25 }}>Add trainer:</Text>

        <Pressable
          onPress={() =>
            isPickingTrainer ? onSelectTrainer(selectedTrainer) : setIsPickingTrainer(true)
          }
        >
          <Text style={{ ...iStyles.text0, fontSize: 25 }}>{selectedTrainer.Name}</Text>
        </Pressable>
      </View>

      {isPickingTrainer && (
        <FlatList
          data={allClients //choose from only trainers minus already selected ones
            .filter(client => client.isTrainer && client.ID !== selectedTrainer.ID)
            .filter(trainer => {
              let returnedValue = true
              trainers.forEach(tr => {
                if (tr.ID === trainer.ID) returnedValue = false
              })
              return returnedValue
            })}
          keyExtractor={item => item.ID}
          renderItem={renderTrainers}
        />
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button onPress={onCancel} color="red">
          cancel
        </Button>
        <Button
          disabled={isNumberTakenTest(newUser.ClientNumber)}
          onPress={onAddNewClient}
          color={iStyles.text1.color}
        >
          add new
        </Button>
      </View>
    </View>
  )
}
