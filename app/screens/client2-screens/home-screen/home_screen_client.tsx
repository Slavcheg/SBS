import React, { useEffect } from "react"
import { Alert, BackHandler, useWindowDimensions, View } from "react-native"
import { Button } from "react-native-paper"
import { getState, useGlobalState } from "../../../components3/globalState/global-state-regular"

import { colors } from "../../../components3/Constants"
import { Text } from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"
import { TrainingsSummary, Alerts } from "./Components"
import { useHomeScreenState } from "./home_screen_reducer"
import firestore from "@react-native-firebase/firestore"

import { CARDS_COLLECTION, Header_ClientHome } from "../../../components3"
import { ScrollView } from "react-native-gesture-handler"
import { useFocusEffect } from "@react-navigation/native"

export const HomeScreenClient2 = props => {
  const [globalState, setGlobalState] = useGlobalState()
  const [state, dispatch] = useHomeScreenState()
  const window = useWindowDimensions()
  useEffect(() => {
    getState(setGlobalState)
  }, [])

  useEffect(() => {
    let subscriber
    const handleChange = newCards => {
      if (globalState.loggedUser.ID) dispatch({ type: "load cards", value: newCards, clientID: globalState.loggedUser.ID })
    }
    if (globalState.loggedUser.ID) {
      subscriber = firestore()
        .collection(CARDS_COLLECTION)
        .where("clientIDs", "array-contains", globalState.loggedUser.ID)
        .onSnapshot(query => {
          const downloadedCards = []
          query.forEach(doc => {
            downloadedCards.push(doc.data())
          })
          handleChange(downloadedCards)
        })
    }
    return () => {
      if (subscriber) subscriber()
    }
  }, [globalState.loggedUser.ID])

  useFocusEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  })

  return (
    <ScrollView style={{ height: window.height }}>
      <Header_ClientHome
        onPressBack={() => setGlobalState({ type: "signOut", navigation: props.navigation })}
        onPressRight={() => Alerts.WhatToDo()}
      />
      <Text style={{ textAlign: "center" }}>Тук ще е новият клиентски екран, все още е леко празен :)</Text>
      <TrainingsSummary state={state} dispatch={dispatch} />
      <Button
        color={colors.green3}
        onPress={() => props.navigation.navigate("diaryScreen", { diaryID: globalState.loggedUser.ID })}
      >
        My diary
      </Button>

      <View
        style={{
          height: window.height * 0.3,
          justifyContent: "flex-end",
        }}
      >
        {globalState.loggedUser.isTrainer && (
          <Button color={colors.blue3} onPress={() => props.navigation.navigate("home_tr")}>
            trainer menu
          </Button>
        )}
      </View>
    </ScrollView>
  )
}
