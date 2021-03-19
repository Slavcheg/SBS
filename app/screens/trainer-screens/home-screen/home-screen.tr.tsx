import React, { useEffect, useState } from "react"
import { Text, View, BackHandler } from "react-native"
import { Button } from "react-native-paper"
import { spacing, color } from "../../../theme"
import { Screen, MainHeader_Tr, ButtonSquare } from "../../../components"
import ProgressCircle from "react-native-progress-circle"
import { displayDateFromTimestamp, today_vs_last_day } from "../../../global-helper"
import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"
import { useGlobalState, getState } from "../../../components3/globalState/global-state-regular"
import {
  colors,
  T_card,
  T_session,
  useGlobalState3,
  useLoggedTrainerCards,
  useTrainerSessions,
  useAsyncState3,
} from "../../../components3/"
import { useFocusEffect } from "@react-navigation/native"

import { ShowSessions } from "./Components"
interface menuProps extends NavigationProps {}

const MenuButtonsList: React.FunctionComponent<menuProps> = props => {
  const { navigation } = props

  const [globalState, setGlobalState] = useGlobalState()

  const menuList = require("./menu-list-tr.json")
  return menuList.map((el, i) => {
    const onPress = el.onClick !== "goSomewhere" ? () => navigation.navigate(el.onClick) : null

    if (el.needsAdminRights && !globalState.loggedUser.isAdmin) return null
    return el.show ? (
      <ButtonSquare
        style={{ marginTop: 20 }}
        key={i}
        title={translate(el.title)}
        onPress={onPress}
        leftIcon={el.iconLeft}
        rightIcon={el.iconRight}
      ></ButtonSquare>
    ) : null
  })
}

interface HomeScreenTrainerProps extends NavigationProps {}

export const HomeScreenTrainer: React.FunctionComponent<HomeScreenTrainerProps> = props => {
  const { navigation } = props

  const [globalState, setGlobalState] = useGlobalState()
  const [isUserLoaded, setIsUserLoaded] = useState(false)

  // const { state, dispatch } = useGlobalState3()
  useAsyncState3()
  useEffect(() => {
    if (!isUserLoaded) {
      if (!globalState.loggedUser.ID) {
        console.log("trying to get state")
        getState(setGlobalState)
        if (globalState.loggedUser.ID) setIsUserLoaded(true)
      } else setIsUserLoaded(true)
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
    <Screen
      preset="scroll"
      unsafe={false}
      style={{
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: color.palette.transparent,
      }}
    >
      <MainHeader_Tr navigation={navigation} style={{ paddingHorizontal: 25 }} />
      <ShowSessions />
      <MenuButtonsList navigation={navigation} />
      <ButtonSquare title={"Измервания"} onPress={() => navigation.navigate("measureClients_trainer")}></ButtonSquare>
      {globalState.loggedUser.isExerciseEditor && (
        <ButtonSquare
          title={"Edit exercise database"}
          onPress={() => navigation.navigate("exerciseDatabase_admin")}
        ></ButtonSquare>
      )}
      {globalState.loggedUser.isAdmin && (
        <ButtonSquare title={"Тренировки 2"} onPress={() => navigation.navigate("choose_Program_Screen_trainer")}></ButtonSquare>
      )}
      <ButtonSquare title={"Към клиентско меню"} onPress={() => navigation.navigate("homeScreenClient2")}></ButtonSquare>
    </Screen>
  )
}
