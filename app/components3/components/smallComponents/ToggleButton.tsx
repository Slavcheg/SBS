import React from "react"
import { Text as TextOriginal, View, Pressable } from "react-native"
import iStyles from "../Constants/Styles"
import { colors, fonts } from "../../Constants"
import { Button } from "../smallWrappers/smallWrappers"

type ToggleButtonProps = {
  iconTrue?: string
  iconFalse?: string
  value: boolean
  onChangeValue: () => void
  textTrue?: string
  textFalse?: string
  otherTrueProps?: React.ComponentProps<typeof Button>
  otherFalseProps?: React.ComponentProps<typeof Button>
}

export const ToggleButton: React.FC<ToggleButtonProps> = props => {
  const {
    iconTrue,
    iconFalse,
    value,
    onChangeValue,
    textTrue,
    textFalse,
    otherTrueProps,
    otherFalseProps,
  } = props
  if (value) {
    return (
      <Button onPress={onChangeValue} icon={iconTrue} {...otherTrueProps}>
        {textTrue}
      </Button>
    )
  } else {
    return (
      <Button onPress={onChangeValue} icon={iconFalse} {...otherFalseProps}>
        {textFalse}
      </Button>
    )
  }
}
