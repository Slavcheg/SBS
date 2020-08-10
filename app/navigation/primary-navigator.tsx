import React from "react"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { 
  _WelcomeScreen, 
  _DemoScreen,
  _PlayScreen,
  
  WelcomeScreen,
  SignInScreen, 
  RegistrationScreen,

  HomeScreenClient,
  HomeScreenTrainer,
  RenewCardScreen,
  PaymentsScreen,
  ClientsListScreen,
  TrainingTodayScreen,
  TrainingsHistoryScreen,
  ContactUsScreen,
  TrainingsHistoryScreen_Cl,
  CardsHistoryScreen,
  HomeScreenAdmin,
  TrainersListScreen,
  ReportScreen,
  DiaryScreen,
  ClientsListScreenAd,
  ReferralsScreen,
  GymHallsScreen,
  VisitsCardsScreen,
  MonthlyCardsScreen

} from "../screens"
// import { PrimaryParamList } from "./types"

const Stack = createNativeStackNavigator()

export function PrimaryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName="welcome"
    >
      <Stack.Screen name="_welcome" component={_WelcomeScreen} />
      <Stack.Screen name="_demo" component={_DemoScreen} />
      <Stack.Screen name="play" component={_PlayScreen} />

      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="registration" component={RegistrationScreen} />
      <Stack.Screen name="signin" component={SignInScreen} />

      <Stack.Screen name="home_cl" component={HomeScreenClient} />
      <Stack.Screen name="diary" component={DiaryScreen} />
      <Stack.Screen name="renewCard" component={RenewCardScreen} />
      <Stack.Screen name="home_tr" component={HomeScreenTrainer} />
      <Stack.Screen name="payments" component={PaymentsScreen} />
      <Stack.Screen name="clients_list" component={ClientsListScreen} />
      <Stack.Screen name="training_today" component={TrainingTodayScreen} />
      <Stack.Screen name="trainings_history" component={TrainingsHistoryScreen} />
      <Stack.Screen name="contact_us" component={ContactUsScreen} />     
      <Stack.Screen name="trainings_history_cl" component={TrainingsHistoryScreen_Cl} />  
      <Stack.Screen name="cards_history_cl" component={CardsHistoryScreen} />
      <Stack.Screen name="home_ad" component={HomeScreenAdmin} /> 
      <Stack.Screen name="trainers_list" component={TrainersListScreen} />
      <Stack.Screen name="clients_list_ad" component={ClientsListScreenAd} />
      <Stack.Screen name="reports" component={ReportScreen} />
      <Stack.Screen name="gymhalls" component={GymHallsScreen} />
      <Stack.Screen name="referrals" component={ReferralsScreen} />
      <Stack.Screen name="monthlyCards" component={MonthlyCardsScreen} />
      <Stack.Screen name="visitsCards" component={VisitsCardsScreen} />
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
export const exitRoutes: string[] = ["welcome"]
