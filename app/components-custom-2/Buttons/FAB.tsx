import React, { useEffect, useState } from "react"
import { View, useWindowDimensions } from "react-native"
import { Button } from "react-native-paper"

import { colors, icons } from "../../screens/trainer-screens/edit-program-screen/Constants"

type FAB_Props = {
  message?: string
  messageDisappearDelay?: number
  icon?: string
  color?: string
  onPress: any
  position?: any
}

export const FAB: React.FC<FAB_Props> = props => {
  const initialMessage = props.message ? props.message : ""
  const [message, setMessage] = useState(initialMessage)

  const { width, height } = useWindowDimensions()

  let mounted = true

  const messageDisappearDelay = props.messageDisappearDelay ? props.messageDisappearDelay : 5000
  useEffect(() => {
    setTimeout(() => {
      if (mounted && props.message) setMessage("")
    }, messageDisappearDelay)

    return () => (mounted = false)
  }, [])

  const position = props.position ? props.position : height * 0.8

  return (
    <Button
      icon={props.icon || icons.plus}
      mode={"contained"}
      compact={true}
      color={props.color || colors.green3}
      onPress={props.onPress}
      style={{
        position: "absolute",
        // top: props.state.isButtonsRowExpanded ? "67.6%" : "75%",
        top: position,
        right: "5%",
        zIndex: 1,
      }}
      labelStyle={{ fontSize: 14 }}
    >
      {message}
    </Button>
  )
}
