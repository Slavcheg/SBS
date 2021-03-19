import React, { useEffect, useState } from "react"
import { View, FlatList, useWindowDimensions, BackHandler } from "react-native"

import {
  Text,
  colors,
  fonts,
  icons,
  Button,
  CARDS_COLLECTION,
  TESTERS,
  useLoggedTrainerCards,
  useBackHandler,
  T_card,
} from "../../../components3"
import { useGlobalState, getState } from "../../../components3/globalState/global-state-regular"

import { useSessionsState, ReducerLoadCards, MarkSessions, ShowCards } from "./Components"

import * as dateHelper from "../../../global-helper/global-date-helper/global-date-helper"
import firestore from "@react-native-firebase/firestore"

export const MarkSessionsScreen = ({ navigation }) => {
  const [globalState, setGlobalState] = useGlobalState()
  const [state, dispatch] = useSessionsState()
  const window = useWindowDimensions()

  let mounted = true

  useEffect(() => {
    getState(setGlobalState)
  }, [])

  useLoggedTrainerCards((cards: T_card[]) =>
    dispatch({ type: "load cards", value: cards, trainerID: globalState.loggedUser.ID }),
  )

  const onPressBack = () => {
    if (state.showCards) {
      dispatch({ type: "close card view" })
      return false
    }
    return true
  }
  useBackHandler(onPressBack, [state])

  if (!globalState) return <View></View>
  return (
    <View style={{ height: window.height - 20 }}>
      <Text>
        user: {globalState.loggedUser.Name} {"   "}cards:{state.cards.length}
        {"   "}
        clients: {state.clients.length}
      </Text>
      {state.showMarkSessions && <MarkSessions useState={() => [state, dispatch]} />}
      <ShowCards useState={() => [state, dispatch]} />
      {TESTERS.includes(globalState.loggedUser.email) && (
        <View style={{ flex: 1, justifyContent: "flex-end", bottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              icon={icons.arrowLeft}
              onPress={() => dispatch({ type: "change date -1 day" })}
              compact={true}
            >
              {" "}
            </Button>

            <Button
              style={{}}
              labelStyle={{ fontSize: 11 }}
              mode="text"
              color={colors.black}
              onPress={() => dispatch({ type: "make date today" })}
            >
              {dateHelper.displayDateFromTimestamp2(state.currentDate)}
            </Button>
            <Button
              icon={icons.arrowRight}
              onPress={() => dispatch({ type: "change date +1 day" })}
              compact={true}
            >
              {" "}
            </Button>
            <View style={{ width: window.width / 2.5 }}>
              <Text numberOfLines={3}>смени датата (само за много специални хора го има това)</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
