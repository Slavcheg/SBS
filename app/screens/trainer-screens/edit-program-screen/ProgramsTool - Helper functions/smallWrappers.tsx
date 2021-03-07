import React from "react"
import { Text as TextOriginal, View, Pressable } from "react-native"
import iStyles from "../Constants/Styles"
import { colors, fonts } from "../Constants"
import { Button as ButtonOriginal } from "react-native-paper"

type OriginalTextProps = React.ComponentProps<typeof TextOriginal>

type TextProps = OriginalTextProps & {}

export const Text: React.FC<OriginalTextProps> = props => {
  return (
    <TextOriginal
      {...props}
      style={[
        {
          color: colors.black,
          fontFamily: fonts.jost.regular,
          textAlignVertical: "center",
        },
        props.style,
      ]}
    >
      {props.children}
    </TextOriginal>
  )
}

type PressableTextProps = OriginalTextProps & {
  onPress: Function
}

export const PressableText: React.FC<PressableTextProps> = props => {
  return (
    <Pressable onPress={props.onPress}>
      {({ pressed }) => (
        <Text style={[{ opacity: pressed ? 0.5 : 1 }, props.style]}>{props.children}</Text>
      )}
    </Pressable>
  )
}
