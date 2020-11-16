import React from "react"
import { Text as TextOriginal, View } from "react-native"
import iStyles from "../Constants/Styles"

export const Text = props => {
  return (
    <TextOriginal style={{ color: iStyles.text0.color, ...props.style }}>
      {props.children}
    </TextOriginal>
  )
}
