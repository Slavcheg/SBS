import React, { useState, useEffect } from "react"
import { View, FlatList } from "react-native"

import {
  Button,
  Text,
  colors,
  fonts,
  icons,
  T_client_short,
  T_session,
  T_card,
} from "../../../../../components3"
import * as dateHelper from "../../../../../global-helper/global-date-helper/global-date-helper"

type T_RenderCard = {
  // useState: typeof useSessionsState
  card: T_card
  // pair: T_cardClientPair
}

export const RenderCard: React.FC<T_RenderCard> = props => {
  const [isExpanded, setIsExpanded] = useState(false)

  const { card } = props

  const sessionsString = `Remaining ${card.cardType.sessions_limit - card.sessions.length} / ${
    card.cardType.sessions_limit
  }`
  const [textColor, status] = getCardColorAndStatus(card)

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text>{sessionsString}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text>Status: </Text>
            <Text style={{ color: textColor }}>{status}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            icon={isExpanded ? icons.arrowUp : icons.arrowDown}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {""}
          </Button>
        </View>
      </View>

      {isExpanded && (
        <View>
          <FlatList
            data={card.sessions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => renderSessions(item, card)}
            ItemSeparatorComponent={() => <View style={{ height: 5 }}></View>}
            ListHeaderComponent={() => <Text>Sessions: </Text>}
          />
        </View>
      )}
    </View>
  )
}

const renderSessions = (item, card) => {
  const session: T_session = item
  return (
    <View>
      {/* <Text>Client: {getClient(session.clientID, card).Name}</Text> */}
      <Text>
        Клиент: {session.client.Name} Треньор: {session.trainer.Name}
      </Text>
      <Text>{dateHelper.displayDateFromTimestamp2(session.doneOn)}</Text>
    </View>
  )
}

const getClient = (clientID, card: T_card) => {
  return card.clients.find(client => client.ID === clientID)
}

//   const getCardColorAndStatus = (cardID: string, pair: T_cardClientPair) => {
//     const colorInactive = colors.grey1
//     const colorActive = colors.blue3
//     const colorCurrent = colors.green3

//     let textColor = colorCurrent
//     let cardCondition: T_cardCondition = "inactive"
//     if (cardID === pair.currentCardID) cardCondition = "current"
//     else if (pair.activeCardIDs.includes(cardID)) cardCondition = "active"

//     if (cardCondition === "inactive") textColor = colorInactive
//     else if (cardCondition === "active") textColor = colorActive
//     return [textColor, cardCondition]
//   }

const getCardColorAndStatus = (card: T_card) => {
  const color = card.isActive ? colors.green2 : colors.grey1
  const status = card.isActive ? "active" : "inactive"
  return [color, status]
}
