import React, { createContext, useContext, useReducer } from "react"
import { Text } from "react-native"

import firestore, { firebase } from "@react-native-firebase/firestore"
import { return_todays_datestamp } from "../../global-helper"
import { GoogleSignOut } from "../../services/auth/auth.service"

import _ from "lodash"

import AsyncStorage from "@react-native-community/async-storage"
import { muscleGroups, muscleGroups2 } from "../Constants/MuscleGroups"

const getAdminClients = (allClients: any[], onDownloadClients: Function) => {
  const newClients = allClients || []

  firestore()
    .collection("trainees")
    .get()
    .then(docs => {
      docs.forEach(doc => {
        let duplicateID = false
        newClients.forEach(client => {
          if (client.ID === doc.data().ID) duplicateID = true
        })
        if (!duplicateID) newClients.push(doc.data())
      })
      console.log("got all clients (admin): ", newClients.length)
      onDownloadClients(newClients)
    })
}

const DEFAULT_EMPTY_USER = {
  Name: "",
  email: "",
  ID: "",
  FamilyName: "",
}

const initialState: globalStore = {
  allPrograms: [],
  allUsers: [],
  customExercises: [],
  allExercises: [],
  allClientsAdmin: [],
  allTrainers: [],
  loggedUser: { ...DEFAULT_EMPTY_USER },
  currentProgramID: "",
  test: "no success yet",
}

const Reducer = (state: globalStore, action) => {
  const { allPrograms, allUsers, customExercises, allExercises } = state

  const { value } = action

  switch (action.type) {
    case "login with user": {
      state.loggedUser = action.user
      state.userDiary = action.userDiary
      if (action.user.Clients) state.allUsers = action.user.Clients

      console.log(`${action.user.Name} logged in`)
      console.log(`Found ${action.user.Clients.length} clients`)
      break
    }

    case "signOut": {
      GoogleSignOut()
      action.navigation.navigate("welcome")
      state = { ...initialState }
      break
    }

    case "create new user": {
      const newUser = action.value
      state.allClientsAdmin.push(newUser)
      firestore()
        .collection("trainees")
        .doc(newUser.ID)
        .set(newUser)
      break
    }

    case "update user in database": {
      const updatedUser = action.value
      if (action.value && action.value.ID) {
        const userIndex = state.allClientsAdmin.findIndex(client => client.ID === updatedUser.ID)
        state.allClientsAdmin[userIndex] = updatedUser
        firestore()
          .collection("trainees")
          .doc(updatedUser.ID)
          .update(updatedUser)
      } else console.error("tried to update invalid user")
      break
    }

    case "delete user": {
      const deletedUser = action.value

      state.allClientsAdmin = state.allClientsAdmin.filter(client => client.ID !== deletedUser.ID)

      console.log("deleted user,  ", deletedUser.Name)

      firestore()
        .collection("trainees")
        .doc(deletedUser.ID)
        .delete()
      break
    }

    case "update all programs": {
      state.allPrograms = _.cloneDeep(action.value)
      break
    }

    case "update currentProgramID": {
      state.currentProgramID = action.value
      break
    }

    case "update all users": {
      state.allUsers = action.value
      console.log("got all users: ", action.value)
      break
    }

    case "update all clients(admin)": {
      state.allTrainers = []
      state.allClientsAdmin = action.value
      state.allClientsAdmin.forEach(client => {
        if (client.isTrainer) state.allTrainers.push(client)
      })
      console.log("got all users (admin): ", action.value.length, "Trainers: ", state.allTrainers.length)
      break
    }

    // case "update other trainers (after adding a trainer)": {
    //   //when we attach a trainer to a client => we want to add this person as a client to those trainers as well
    //   const updatedUser = action.client
    //   const trainer = action.newTrainer

    //   state.allClientsAdmin
    //     .find(client => client.ID === trainer.ID)
    //     .Clients.push({
    //       Name: updatedUser.Name,
    //       ID: updatedUser.ID,
    //       FamilyName: updatedUser.FamilyName,
    //       ClientNumber: updatedUser.ClientNumber || 0,
    //     })

    //   const updated = state.allClientsAdmin.find(client => client.ID === trainer.ID)
    //   console.log("updated ", updated.Name, " New Clients: ", updated.Clients)

    //   firestore()
    //     .collection("trainees")
    //     .doc(updated.ID)
    //     .update(updated)

    //   // state.allClientsAdmin.forEach((client, index) => {
    //   //   if (client.ID !== updatedUser.ID) {
    //   //     if (client.isTrainer) {
    //   // client.Clients.push({
    //   //   Name: updatedUser.Name,
    //   //   ID: updatedUser.ID,
    //   //   FamilyName: updatedUser.FamilyName,
    //   //   ClientNumber: updatedUser.ClientNumber,
    //   // })
    //   //       console.log("updated client: ", client.Name, " newTrainees: ", client.Clients)
    //   //     }
    //   //   }
    //   // })
    //   break
    // }

    // case "update other trainers (after removing a trainer)": {
    //   //if you remove a trainer from a client => remove the client from that trainer's client list as well

    //   const updatedUser = action.client
    //   const trainer = action.removedTrainer

    //   console.log(`___________ Removing ${updatedUser.Name} from ${trainer.Name}'s list`)

    //   //filtering out the removed client from trainer's list
    //   const foundIndex = state.allClientsAdmin.findIndex(cli => cli.ID === trainer.ID)

    //   const oldClients = state.allClientsAdmin[foundIndex].Clients

    //   state.allClientsAdmin[foundIndex].Clients = oldClients.filter(cli => cli.ID != updatedUser.ID)

    //   const updated = state.allClientsAdmin[foundIndex]
    //   const newClientsString = state.allClientsAdmin[foundIndex].Clients.map(client => {
    //     return client.Name
    //   })
    //   console.log("updated ", updated.Name, "ID: ", updated.ID, " New Clients: ", newClientsString)
    //   firestore()
    //     .collection("trainees")
    //     .doc(updated.ID)
    //     .update(updated)
    //   break
    // }

    // case "update other trainers (after removing a client)": {
    //   //if you remove a client from a trainer => remove the trainer from client's trainers' list as well
    //   // const

    //   break
    // }

    // case "update one client": {
    //   const newClient = action.value
    //   const oldClientIndex = state.allClientsAdmin.findIndex(cli => cli.ID === newClient.ID)

    //   state.allClientsAdmin[oldClientIndex] = { ...newClient }

    //   firestore()
    //     .collection("trainees")
    //     .doc(newClient.ID)
    //     .update(newClient)
    //   console.log(
    //     "updated ",
    //     state.allClientsAdmin[oldClientIndex].Name,
    //     ": ",
    //     state.allClientsAdmin[oldClientIndex],
    //   )

    //   const onlyOthers = state.allClientsAdmin.filter(cli => cli.ID != newClient.ID)

    //   onlyOthers.forEach(randomClient => {
    //     let isChanging = false
    //     const newTrainerClients = []
    //     const newTrainers = []
    //     randomClient.Clients.forEach((trainerClient, clientIndex) => {
    //       let newTrainerClient = { ...trainerClient }
    //       if (trainerClient.ID === newClient.ID) {
    //         isChanging = true
    //         for (const property in trainerClient) {
    //           if (newClient[property]) newTrainerClient[property] = newClient[property]
    //         }
    //       }
    //       newTrainerClients.push(newTrainerClient)
    //     })

    //     randomClient.Trainers.forEach(trainer => {
    //       let newTrainer = { ...trainer }
    //       if (newTrainer.ID === newClient.ID) {
    //         isChanging = true
    //         for (const property in trainer) {
    //           if (newClient[property]) newTrainer[property] = newClient[property]
    //         }
    //       }
    //       newTrainers.push(newTrainer)
    //     })
    //     let newRandomClient = {}

    //     newRandomClient = {
    //       ...randomClient,
    //       Trainers: newTrainers,
    //       Clients: newTrainerClients,
    //     }
    //     if (isChanging) {
    //       console.log("Also changed this client:", newRandomClient.Name, ": ", newRandomClient)
    //       firestore()
    //         .collection("trainees")
    //         .doc(newRandomClient.ID)
    //         .update(newRandomClient)
    //     }
    //   })

    //   break
    // }

    case "update one program": {
      const programID = action.programID
      const foundIndex = state.allPrograms.findIndex(program => program.id === programID)
      state.allPrograms[foundIndex].item = _.cloneDeep(action.value)

      break
    }

    case "update custom exercises": {
      state.customExercises = action.exercises
      state.filteredExercisesCustom = action.filtered
      break
    }

    case "update all exercises": {
      state.allExercises = action.allExercises

      //съединяваме 2та обекта от филтрирани упражнения
      const customEx = state.filteredExercisesCustom
      const regularEx = state.filteredExercisesRegular

      state.filteredExercises = regularEx

      for (const muscle in regularEx) {
        //ако случайно се добави мускул в custom, който да липсва в Regular - ще се счупи

        if (customEx[muscle]) state.filteredExercises[muscle] = [...regularEx[muscle], ...customEx[muscle]]
      }
      break
    }

    case "update filtered exercises (regular)": {
      state.filteredExercisesRegular = action.filteredObj
      break
    }

    case "add one exercise": {
      const { exercise, userID } = action

      let newExercise = exercise

      let newID

      const getNewId = () => {
        newID = Math.random().toString(25)
        let duplicateID = false
        state.allExercises.forEach(exercise => {
          if (exercise.ID === newID) duplicateID = true
        })
        if (duplicateID) getNewId()
        else return newID
      }
      getNewId()

      newExercise.ID = newID
      if (!newExercise.YouTubeLink) newExercise.YouTubeLink = "No link"
      if (!newExercise.MainMuscleGroup) newExercise.MainMuscleGroup = "No group"
      newExercise.AddedOn = return_todays_datestamp()

      let exerciseWithAllCoefs = _.cloneDeep(newExercise)

      firestore()
        .collection("personalExercisesAdded")
        .doc(userID)
        .get()
        .then(docs => {
          let oldExercises = []
          if (docs.data()) oldExercises = docs.data().exercises
          oldExercises.push(newExercise)
          firestore()
            .collection("personalExercisesAdded")
            .doc(userID)
            .set({ exercises: oldExercises, ownerID: userID })
        })

      muscleGroups2.forEach(muscle => {
        if (!exerciseWithAllCoefs.Coefs[muscle]) exerciseWithAllCoefs.Coefs[muscle] = 0
      })

      state.allExercises.push(exerciseWithAllCoefs)
      state.customExercises.push(exerciseWithAllCoefs)
      state.filteredExercises[newExercise.MainMuscleGroup] = [
        ...state.filteredExercises[newExercise.MainMuscleGroup],
        newExercise,
      ]

      break
    }

    case "remove one exercise from own collection": {
      const { exercise, userID } = action

      const foundIndexAll = state.allExercises.findIndex(ex => ex.ID === exercise.ID)
      state.allExercises.splice(foundIndexAll, 1)

      const foundIndexOwn = state.customExercises.findIndex(ex => ex.ID === exercise.ID)
      state.customExercises.splice(foundIndexOwn, 1)

      const filtered = state.filteredExercises[exercise.MainMuscleGroup]
      const foundIndexFiltered = filtered.findIndex(ex => ex.ID === exercise.ID)
      state.filteredExercises[exercise.MainMuscleGroup].splice(foundIndexFiltered, 1)

      let toBeUploadedCustomExercises = []
      state.customExercises.forEach(ex => {
        let newCoefs = {}
        for (const coef in ex.Coefs) if (ex.Coefs[coef] > 0) newCoefs[coef] = ex.Coefs[coef]
        toBeUploadedCustomExercises.push({ ...ex, Coefs: { ...newCoefs } })
      })

      firestore()
        .collection("personalExercisesAdded")
        .doc(userID)
        .set({ exercises: toBeUploadedCustomExercises, ownerID: userID })

      break
    }

    case "update custom exercise": {
      const { exercise, userID } = action

      const foundIndexAll = state.allExercises.findIndex(ex => ex.ID === exercise.ID)
      state.allExercises[foundIndexAll] = exercise

      const foundIndexOwn = state.customExercises.findIndex(ex => ex.ID === exercise.ID)
      state.customExercises[foundIndexOwn] = exercise

      const filtered = state.filteredExercises[exercise.MainMuscleGroup]
      const foundIndexFiltered = filtered.findIndex(ex => ex.ID === exercise.ID)
      state.filteredExercises[exercise.MainMuscleGroup][foundIndexFiltered] = _.cloneDeep(exercise)

      let toBeUploadedCustomExercises = []
      state.customExercises.forEach(ex => {
        let newCoefs = {}
        for (const coef in ex.Coefs) if (ex.Coefs[coef] > 0) newCoefs[coef] = ex.Coefs[coef]
        toBeUploadedCustomExercises.push({ ...ex, Coefs: { ...newCoefs } })
      })

      firestore()
        .collection("personalExercisesAdded")
        .doc(userID)
        .set({ exercises: toBeUploadedCustomExercises, ownerID: userID })

      break
    }

    case "add client info": {
      const foundIndex = state.allPrograms.findIndex(program => program.id === action.programID)
      state.allPrograms[foundIndex].item = {
        ...state.allPrograms[foundIndex].item,
        ClientInfo: action.info,
        programID: action.programID,
      }
      console.log("newProgram: ", state.allPrograms[foundIndex].id)
      console.log("newProgramClientInfo: ", state.allPrograms[foundIndex].item.ClientInfo)
      console.log("newProgramClient: ", state.allPrograms[foundIndex].item.Client)
      firestore()
        .collection("trainingPrograms")
        .doc(action.programID)
        .update(state.allPrograms[foundIndex].item)
      break
    }

    case "update state from storage": {
      const newState = action.value
      if (state.loggedUser.ID === newState.loggedUser.ID) {
        console.log("didnt reupdate state since we had it already")
        return state
      }
      state = newState

      break
    }

    case "update diary": {
      state.userDiary = action.diary
      break
    }

    case "test": {
      state.test = "success"
      break
    }

    case "test2": {
      console.log("test2")
      break
    }

    default: {
      console.error("Unexpected action in global reducer")
      return state
    }
  }

  storeState(state)
  return { ...state }
}

type globalStore = {}

const Context = createContext(initialState)
// const Context = createContext<T_GlobalReducer>(GlobalStateTest1 as T_GlobalReducer)

export const useGlobalState = () => useContext(Context)

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)

  return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

// export const GlobalStateProvider = ({ children }) => {
//   const [state, dispatch] = GlobalStateTest1()
//   return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
// }

const storeState = async state => {
  try {
    await AsyncStorage.setItem("state", JSON.stringify(state))
  } catch (err) {
    console.error(err)
  }
}
export const getState = async reducer => {
  const fallBackUpdate = () => {
    console.log("global state updated")
  }

  const stateString = await AsyncStorage.getItem("state")
  const state = JSON.parse(stateString)
  if (state)
    reducer({
      type: "update state from storage",
      value: state,
    })
}
