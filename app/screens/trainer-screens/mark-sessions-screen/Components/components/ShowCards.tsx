import React, { useState, useEffect } from "react"
import { View, FlatList, useWindowDimensions, ScrollView } from "react-native"
import {
  useSessionsState,
  getCard,
  getClient,
  T_cardClientPair,
  T_Reducer_MarkSessions,
} from "../markSessionsReducer"
import { Text, Button, colors, icons, T_session } from "../../../../../components3"
import * as dateHelper from "../../../../../global-helper/global-date-helper/global-date-helper"
import { Checkbox } from "react-native-paper"

type ShowCards = {
  useState: typeof useSessionsState
}
type T_cardCondition = "current" | "active" | "inactive"

export const ShowCards: React.FC<ShowCards> = props => {
  const [state, dispatch] = props.useState()
  const pair = state.cardClientPairs.find(pair => pair.clientID === state.selectedClientID)
  const client = state.clients.find(client => client.ID === state.selectedClientID)

  if (!state.showCards || !pair) return <View></View>
  return (
    <ScrollView style={{ padding: 10 }}>
      <Text style={{ fontSize: 22 }}>Карти на: {client.Name}</Text>
      <FlatList
        data={[...pair.activeCardIDs, ...pair.inactiveCardIDs]}
        renderItem={({ item, index }) => (
          <RenderCard item={item} pair={pair} useState={() => [state, dispatch]} />
        )}
        keyExtractor={(item, index) => `${item}${index}`}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 5, borderWidth: 1 }}></View>}
      />
      <Button onPress={() => dispatch({ type: "close card view" })}>back</Button>
    </ScrollView>
  )
}

const getCardColorAndStatus = (cardID: string, pair: T_cardClientPair) => {
  const colorInactive = colors.grey1
  const colorActive = colors.blue3
  const colorCurrent = colors.green3

  let textColor = colorCurrent
  let cardCondition: T_cardCondition = "inactive"
  if (cardID === pair.currentCardID) cardCondition = "current"
  else if (pair.activeCardIDs.includes(cardID)) cardCondition = "active"

  if (cardCondition === "inactive") textColor = colorInactive
  else if (cardCondition === "active") textColor = colorActive
  return [textColor, cardCondition]
}

type T_RenderCard = {
  useState: typeof useSessionsState
  item: string
  pair: T_cardClientPair
}

const RenderCard: React.FC<T_RenderCard> = props => {
  const [state, dispatch] = props.useState()
  const [isExpanded, setIsExpanded] = useState(false)

  const { item, pair } = props

  const card = getCard(item, state)
  const cardID = item
  const sessionsString = `Remaining ${card.cardType.sessions_limit - card.sessions.length} / ${
    card.cardType.sessions_limit
  }`
  const [textColor, status] = getCardColorAndStatus(cardID, pair)

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text>{sessionsString}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            icon={isExpanded ? icons.arrowUp : icons.arrowDown}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {""}
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          {(status === "active" || status === "inactive") && (
            <Button
              compact={true}
              onPress={() => dispatch({ type: "make card current", cardID: cardID })}
            >
              activate
            </Button>
          )}
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text>Status: </Text>
        <Text style={{ color: textColor }}>{status}</Text>
      </View>
      {isExpanded && (
        <View>
          <FlatList
            data={card.sessions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => renderSessions(item, state)}
            ItemSeparatorComponent={() => <View style={{ height: 5 }}></View>}
          />
        </View>
      )}
    </View>
  )
}

const renderSessions = (item, state) => {
  const session: T_session = item
  return (
    <View>
      <Text>Client: {getClient(session.clientID, state).Name}</Text>
      <Text>Date: {dateHelper.displayDateFromTimestamp2(session.doneOn)}</Text>
    </View>
  )
}
