import React, { useState } from "react"
import { View, FlatList } from "react-native"

import {
  Text,
  T_session,
  useTrainerSessions,
  Button,
  icons,
  colors,
  T_client_short,
} from "../../../../components3"
import * as dateHelper from "../../../../global-helper/global-date-helper/global-date-helper"

export const ShowSessions = props => {
  const [sessions, setSessions] = useState<T_session[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  useTrainerSessions(newSessions => setSessions(newSessions))

  const renderSessions = ({ item, index }) => {
    const session: T_session = item
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Text> {session.client.Name}</Text>
        <Text>{dateHelper.displayDateFromTimestampFullMonth(session.doneOn)}</Text>
      </View>
    )
  }
  return (
    <View style={isExpanded ? { flex: 1 } : { height: 40 }}>
      {sessions.length > 0 && (
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Text>Общо тренировки досега: {sessions.length} </Text>
            <Button
              icon={isExpanded ? icons.arrowUp : icons.arrowDown}
              onPress={() => setIsExpanded(!isExpanded)}
            >
              {""}
            </Button>
          </View>
          {isExpanded && (
            <View>
              <FlatList
                data={sessions.sort((sessionA, sessionB) => sessionA.doneOn - sessionB.doneOn)}
                keyExtractor={item => item.sessionID}
                renderItem={renderSessions}
                ListHeaderComponent={() => (
                  <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <Text style={{ fontWeight: "bold" }}>Трениращ</Text>
                    <Text style={{ fontWeight: "bold" }}>Дата</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}
