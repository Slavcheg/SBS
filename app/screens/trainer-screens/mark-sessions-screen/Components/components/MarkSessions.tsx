import React from "react"
import { View, FlatList, useWindowDimensions, ScrollView, Pressable } from "react-native"
import {
  useSessionsState,
  getCard,
  getClient,
  T_cardClientPair,
  T_State_MarkSessions,
} from "../markSessionsReducer"
import { Text, Button, colors, T_session } from "../../../../../components3"
import * as dateHelper from "../../../../../global-helper/global-date-helper/global-date-helper"
import { Checkbox } from "react-native-paper"

type MarkSessions = {
  useState: typeof useSessionsState
}

export const MarkSessions: React.FC<MarkSessions> = props => {
  const [state, dispatch] = props.useState()

  const NameWidth = useWindowDimensions().width / 4
  const lastFewDays = dateHelper.getLastXDaysStamps(3, state.currentDate)
  const checkboxWidth = 60
  type status = "unchecked" | "checked" | "indeterminate"

  const renderPairs = ({ item, index }) => {
    const pair: T_cardClientPair = item
    const card = getCard(pair.currentCardID, state)
    // console.log(card)
    const client = getClient(pair.clientID, state)
    let remainingSessions = ``
    pair.activeCardIDs.forEach((cardID, index) => {
      const card = getCard(cardID, state)
      if (index !== 0)
        remainingSessions += ` + ${card.cardType.sessions_limit - card.sessions.length}`
      else remainingSessions += `${card.cardType.sessions_limit - card.sessions.length}`
    })

    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: NameWidth }}>
          <Pressable onPress={() => dispatch({ type: "click client name", value: client.ID })}>
            <Text>
              {client.Name} {client.FamilyName}
            </Text>
          </Pressable>
        </View>
        <View style={{ width: checkboxWidth, alignItems: "center" }}>
          <Text style={{ textAlign: "center" }}>{remainingSessions}</Text>
        </View>
        {lastFewDays.map(dayStamp => {
          let isCompleted = false
          let isOtherTrainer = false
          getPairSessions(pair, state).forEach(session => {
            if (dateHelper.compareDates(session.doneOn, dayStamp)) {
              isCompleted = true
              if (session.trainerID !== state.trainerID) isOtherTrainer = true
            }
          })
          let status: status = isCompleted ? "checked" : "unchecked"
          return (
            <View style={{ width: checkboxWidth }} key={`${dayStamp}${card.cardID}`}>
              <Checkbox
                status={status}
                color={isOtherTrainer ? colors.grey1 : colors.blue3}
                onPress={() =>
                  status === "checked"
                    ? dispatch({
                        type: "unmark sessions",
                        value: dayStamp,
                        pair: pair,
                        pairIndex: index,
                      })
                    : dispatch({
                        type: "mark sessions",
                        value: dayStamp,
                        pair: pair,
                        pairIndex: index,
                      })
                }
              />
            </View>
          )
        })}
      </View>
    )
  }

  const header = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: NameWidth }}></View>
        <View style={{ width: checkboxWidth }}>
          <Text style={{ fontSize: 10 }}>Remaining</Text>
        </View>
        {lastFewDays.map(dayStamp => {
          let isToday = false
          if (dateHelper.compareDates(dayStamp, dateHelper.return_todays_datestamp()))
            isToday = true
          return (
            <View style={{ width: checkboxWidth }} key={dayStamp.toString()}>
              <Text key={dayStamp} style={{ color: isToday ? colors.green3 : colors.black }}>
                {dateHelper.displayDateFromTimestamp2(dayStamp)}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <ScrollView horizontal={true}>
      <FlatList
        data={state.cardClientPairs}
        keyExtractor={(item, index) => `${index + Math.random()}`}
        renderItem={renderPairs}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View style={{ height: 2, borderWidth: 1 }}></View>}
      />
    </ScrollView>
  )
}

const getPairSessions = (pair: T_cardClientPair, state: T_State_MarkSessions) => {
  const clientCardIDs = [...pair.activeCardIDs, ...pair.inactiveCardIDs]
  const thisClientSessions: T_session[] = []
  clientCardIDs.forEach(cardID => {
    getCard(cardID, state).sessions.forEach(session => {
      if (session.clientID === pair.clientID) thisClientSessions.push(session)
    })
  })
  return thisClientSessions
}
