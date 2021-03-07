import React from "react"
import { View, useWindowDimensions } from "react-native"
import { BackButton, MenuButton } from "./index"

import { colors, icons, fonts } from "../Constants"
import { Text } from "./index"

type EditProgramHeaderProps = {
  onPressBack?: any
  onPressMenu?: any
}

export const EditProgramHeader: React.FC<EditProgramHeaderProps> = props => {
  const width = useWindowDimensions().width
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.blue3,
        width: width,
        justifyContent: "space-between",
      }}
    >
      <BackButton onPress={props.onPressBack} mode="text" color="white" />
      <Text style={{ fontSize: 20, color: "white", fontFamily: fonts.optimum.bold }}>
        Редактиране на програма
      </Text>
      <MenuButton onPress={props.onPressMenu} mode="text" color="white" />
    </View>
  )
}
