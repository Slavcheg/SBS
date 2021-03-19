import React from "react"
import { useWindowDimensions, View } from "react-native"
import { Button, Text, colors, fonts, icons } from "../../../components3"

type T_DefaultHeader = {
  onPressLeft?: any
  onPressRight?: any
  iconLeft?: string
  iconRight?: string
  mainText: string
  leftButtonProps?: React.ComponentProps<typeof Button>
  rightButtonProps?: React.ComponentProps<typeof Button>
}

export const DefaultHeader: React.FC<T_DefaultHeader> = props => {
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
      <Button
        onPress={props.onPressLeft}
        compact={true}
        mode="text"
        style={{ margin: 2 }}
        color={colors.white}
        icon={props.iconLeft || icons.arrowLeftBold}
        {...props.leftButtonProps}
      />
      <Text style={{ fontSize: 20, color: "white", fontFamily: fonts.optimum.bold }}>{props.mainText || ""}</Text>
      <Button
        onPress={props.onPressRight}
        compact={true}
        mode="text"
        style={{ margin: 2 }}
        color={colors.white}
        icon={props.iconRight}
        {...props.rightButtonProps}
      />
    </View>
  )
}
