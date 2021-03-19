import React, { useState, useEffect } from "react"
import { Text as TextOriginal, View, Pressable, KeyboardType, TextStyle } from "react-native"
import { colors, fonts } from "../../Constants"
import { Button as ButtonOriginal, TextInput as TextInputPaper } from "react-native-paper"
import { parseStringFloat } from "../smallFunctions/parseStringFloat"

export const Loading = props => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Loading...</Text>
    </View>
  )
}

type EditablePropertyProps = {
  PropertyName: string
  PropertyValue: any
  onChangeValue?: (newValue) => any
  onEndEditing?: (newValue, newValueWithnativeEvent?: object) => any
  width?: string | number
  disabled?: boolean
  color?: string
  moreProps?: TextInputPaperProps
  moreDependencies?: any[]
}

export const EditableProperty: React.FC<EditablePropertyProps> = props => {
  const { PropertyName, PropertyValue, moreDependencies } = props
  const color = props.color ? props.color : colors.blue3
  const [text, setText] = useState(PropertyValue ? `${PropertyValue}` : "")

  useEffect(() => {
    setText(PropertyValue ? `${PropertyValue}` : "")
  }, [PropertyValue, moreDependencies])

  const onChangeText = newValue => {
    setText(newValue)
    if (props.onChangeValue) props.onChangeValue(newValue)
  }

  const onEndEditing = newValueObj => {
    const newValue = newValueObj.nativeEvent.text
    setText(newValue)
    if (props.onEndEditing) props.onEndEditing(newValue, newValueObj)
  }

  return (
    <TextInput
      style={{
        fontFamily: fonts.optimum.bold,
        fontSize: 12,
        textAlignVertical: "center",
        width: props.width ? props.width : "100%",
      }}
      label={PropertyName}
      mode="flat"
      underlineColor={color}
      onChangeText={newValue => onChangeText(newValue)}
      value={text}
      disabled={props.disabled}
      underlineColorAndroid={color}
      selectionColor={color}
      placeholderTextColor={color}
      onEndEditing={newValue => onEndEditing(newValue)}
      {...props.moreProps}
    />
  )
}

type TextInputPaperProps = React.ComponentProps<typeof TextInputPaper>

export const TextInput: React.FC<TextInputPaperProps> = props => {
  return (
    <TextInputPaper
      placeholderTextColor={colors.color1}
      selectionColor={colors.color1}
      underlineColor={colors.blue1}
      underlineColorAndroid={colors.blue1}
      {...props}
    />
  )
}

type ButtonOriginalProps = React.ComponentProps<typeof ButtonOriginal>

export const Button: React.FC<ButtonOriginalProps> = props => {
  const children = props.children ? props.children : ""
  return <ButtonOriginal color={colors.color1} {...props} children={children} />
}

type OriginalTextProps = React.ComponentProps<typeof TextOriginal>
/**
 * test
 * test `sasdfasf`
 */
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
  pressedStyle?: TextStyle
  notPressedStyle?: TextStyle
}

export const PressableText: React.FC<PressableTextProps> = props => {
  return (
    <Pressable onPress={props.onPress}>
      {({ pressed }) => {
        if (pressed)
          return <Text style={[{ opacity: 0.5, backgroundColor: colors.blue1 }, props.pressedStyle]}>{props.children}</Text>
        else {
          return <Text style={[{ opacity: 1 }, props.notPressedStyle]}>{props.children}</Text>
        }
      }}
    </Pressable>
  )
}

type GetSomeTExtProps = {
  value: string
  onGet: (newText: string) => any
  keyboardType?: KeyboardType
  otherTextinputProps?: React.ComponentProps<typeof TextInputPaper>
  label?: string
}

export const GetSomeText: React.FC<GetSomeTExtProps> = props => {
  const [text, setText] = useState(props.value)
  useEffect(() => {
    setText(props.value)
  }, [props])

  return (
    <TextInput
      value={text}
      onChangeText={newText => setText(newText)}
      onEndEditing={newText => props.onGet(newText.nativeEvent.text)}
      onBlur={() => props.onGet(text)}
      label={props.label}
      underlineColor={colors.blue1}
      selectionColor={colors.blue1}
      underlineColorAndroid={colors.blue1}
      placeholderTextColor={colors.blue1}
      style={{ flex: 1 }}
      keyboardType={props.keyboardType}
      {...props.otherTextinputProps}
    />
  )
}

export const GetSomeNumber: React.FC<TextInputPaperProps> = props => {
  return (
    <TextInput
      keyboardType={"number-pad"}
      style={{ flex: 1 }}
      {...props}
      onChangeText={newText => props.onChangeText(parseStringFloat(newText))}
    />
  )
}
