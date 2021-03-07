import React, { useEffect } from "react"
import { View } from "react-native"
import { Button } from "react-native-paper"
import { getState, useGlobalState } from "../../../models/global-state-regular"

import { colors } from "../../trainer-screens/edit-program-screen/Constants"
import { Text } from "../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions"

export const HomeScreenClient2 = props => {
  const [globalState, setGlobalState] = useGlobalState()

  useEffect(() => {
    getState(setGlobalState)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center" }}>
        Тук ще е новият клиентски екран, все още е леко празен :)
      </Text>
      <Button
        color={colors.green3}
        onPress={() =>
          props.navigation.navigate("diaryScreen", { diaryID: globalState.loggedUser.ID })
        }
      >
        My diary
      </Button>
      {globalState.loggedUser.isTrainer && (
        <Button color={colors.blue3} onPress={() => props.navigation.navigate("home_tr")}>
          trainer menu
        </Button>
      )}
      <View style={{ justifyContent: "flex-end", flex: 1 }}>
        <Button
          color={colors.grey1}
          onPress={() => setGlobalState({ type: "signOut", navigation: props.navigation })}
        >
          sign out
        </Button>
      </View>
    </View>
  )
}
