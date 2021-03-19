import React, { useEffect, useState } from "react"
import { View, FlatList } from "react-native"

import { Text, colors, fonts, icons, useGlobalState, getState, Button } from "../../../components3"

export const CardTypesScreen = ({ navigation }) => {
  const [globalState, setGlobalState] = useGlobalState()

  useEffect(() => {
    getState(setGlobalState)
  }, [])

  if (!globalState) return <View></View>
  return (
    <View>
      <Text>card types screen</Text>
    </View>
  )
}
