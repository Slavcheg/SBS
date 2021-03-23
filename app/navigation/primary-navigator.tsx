import React, { useEffect, useState } from "react"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { useAsyncState3, useGlobalState3 } from "../components3"
import {
  WelcomeScreen,
  SignInScreen,
  RegistrationScreen,
  HomeScreenTrainer,
  PaymentsScreen,
  HomeScreenAdmin,
  TrainersListScreen,
  ReportScreen,
  ClientsListScreenAd,
  ReferralsScreen,
  GymHallsScreen,
  CardTypesListScreen,
  PurchasedCardsListScreen,
  AddCardScreen,
  TrainingProgramsScreen,
  AdminOtherScreen,
  EditProgramScreen,
  TrainClientsScreen,
  ExerciseDatabaseScreen,
  Admin_Clients2,
  AdminPrograms,
  HomeScreenClient2,
  DiaryScreen,
  MarkSessionsScreen,
  CardTypesScreen,
  ManageCardsScreen,
  Measure_Clients_Screen,
  ChooseProgramScreen,
} from "../screens"
// import { PrimaryParamList } from "./types"

const Stack = createNativeStackNavigator()

const NAVIGATION = {
  home_client: "homeScreenClient2",
  home_trainer: "home_tr",
  home_notLoggedIn: "welcome",
}

export function PrimaryNavigator() {
  const { home_client, home_notLoggedIn, home_trainer } = NAVIGATION
  const { state, dispatch } = useGlobalState3()
  const [initialRouteName, setInitialRouteName] = useState(null)
  useAsyncState3()

  useEffect(() => {
    if (state)
      if (state.loggedUser) {
        state.loggedUser.isTrainer ? setInitialRouteName(home_trainer) : setInitialRouteName(home_client)
      } else
        setTimeout(() => {
          if (!initialRouteName) setInitialRouteName(home_notLoggedIn)
        }, 50)
  }, [state, state.loggedUser])

  // if (!state || !state.loggedUser) return null

  // if (state.loggedUser) console.log("went here", state.loggedUser.ID || "no user yet", " initialRouteName: ", initialRouteName)
  // else console.log("went here, no user found")

  if (!initialRouteName) return null
  // if (!state.loggedUser) return loginNavigator()

  if (initialRouteName === home_client) return clientNavigator()
  else
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="registration" component={RegistrationScreen} />
        <Stack.Screen name="signin" component={SignInScreen} />
        <Stack.Screen name="home_tr" component={HomeScreenTrainer} />
        <Stack.Screen name="payments" component={PaymentsScreen} />
        <Stack.Screen name="home_ad" component={HomeScreenAdmin} />
        <Stack.Screen name="trainers_list" component={TrainersListScreen} />
        <Stack.Screen name="clients_list_ad" component={ClientsListScreenAd} />
        <Stack.Screen name="reports" component={ReportScreen} />
        <Stack.Screen name="gymhalls" component={GymHallsScreen} />
        <Stack.Screen name="referrals" component={ReferralsScreen} />
        <Stack.Screen name="cardTypesList" component={CardTypesListScreen} />
        <Stack.Screen name="purchasedCardsList" component={PurchasedCardsListScreen} />
        <Stack.Screen name="addCardScreen" component={AddCardScreen} />

        <Stack.Screen name="trainingProgramsScreen" component={TrainingProgramsScreen} />
        <Stack.Screen name="EditProgramScreen" component={EditProgramScreen} />
        <Stack.Screen name="admin_other" component={AdminOtherScreen} />
        <Stack.Screen name="exerciseDatabase_admin" component={ExerciseDatabaseScreen} />
        <Stack.Screen name="TrainClientsScreen" component={TrainClientsScreen} />
        <Stack.Screen name="admin_clients2" component={Admin_Clients2} />
        <Stack.Screen name="admin_programs" component={AdminPrograms} />
        <Stack.Screen name="homeScreenClient2" component={HomeScreenClient2} />
        <Stack.Screen name="diaryScreen" component={DiaryScreen} />
        <Stack.Screen name="markSessions_trainer" component={MarkSessionsScreen} />
        <Stack.Screen name="manageCards_manager" component={ManageCardsScreen} />
        <Stack.Screen name="cardTypes_manager" component={CardTypesScreen} />
        <Stack.Screen name="measureClients_trainer" component={Measure_Clients_Screen} />
        <Stack.Screen name="choose_Program_Screen_trainer" component={ChooseProgramScreen} />
      </Stack.Navigator>
    )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["welcome,home_tr,homeScreenClient2"]

const clientNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName={NAVIGATION.home_client}
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="homeScreenClient2" component={HomeScreenClient2} />
      <Stack.Screen name="diaryScreen" component={DiaryScreen} />
    </Stack.Navigator>
  )
}

const loginNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName={NAVIGATION.home_notLoggedIn}
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      {/* <Stack.Screen name="homeScreenClient2" component={HomeScreenClient2} />
      <Stack.Screen name="diaryScreen" component={DiaryScreen} /> */}
    </Stack.Navigator>
  )
}
