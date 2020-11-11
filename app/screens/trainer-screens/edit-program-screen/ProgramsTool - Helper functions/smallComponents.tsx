import React, {
  useState,
  useEffect,
  Children,
  PropsWithChildren,
  ReactChild,
  ReactNode,
  ReactChildren,
} from "react"
import {
  View,
  Text,
  TextInput as TextInput2,
  Pressable,
  ImageBackground,
  StyleProp,
} from "react-native"
import { Button } from "react-native-paper"
import { RNCamera } from "react-native-camera"
import { ImageSource } from "react-native-vector-icons/Icon"
import iStyles from "../Constants/Styles"

type ExpandableContentProps = {
  startMinimized?: boolean
  title: string
  titleStyle?: object
}

export const ExpandableContent: React.FC<ExpandableContentProps> = props => {
  let initialState = props.startMinimized === true ? false : true

  useEffect(() => {
    initialState = props.startMinimized === true ? false : true
  }, [props.startMinimized])
  const [isExpanded, setIsExpanded] = useState(initialState)
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text style={props.titleStyle}>{props.title}</Text>
        <ExpandCollapseButton status={isExpanded} onPress={() => setIsExpanded(!isExpanded)} />
      </View>
      {isExpanded && <View>{props.children}</View>}
    </View>
  )
}

type ExpandCollapseButtonProps = {
  onPress: Function
  status: Boolean
  color?: string
  colorFalse?: string
  icon?: string
  iconFalse?: string
  text?: string
  style?: any
  compact?: boolean
}

export const ExpandCollapseButton: React.FC<ExpandCollapseButtonProps> = props => {
  const { onPress, status, color, colorFalse, icon, iconFalse, text, style, compact } = props

  return (
    <ToggleButton
      onPress={props.onPress}
      status={status}
      color="red"
      colorFalse="green"
      icon="arrow-expand-up"
      iconFalse="arrow-expand-down"
      compact={true}
    />
  )
}

type ToggleButtonProps = {
  onPress: Function
  status: Boolean
  color?: string
  colorFalse?: string
  icon?: string
  iconFalse?: string
  text?: string
  style?: any
  compact?: boolean
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  onPress,
  status,
  color,
  children,
  colorFalse,
  icon,
  iconFalse,
  text,
  style,
  compact,
}) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {status && (
        <Button
          onPress={onPress}
          icon={icon}
          color={color ? color : "dodgerblue"}
          style={style}
          compact={compact}
        >
          {text ? text : ""}
        </Button>
      )}
      {!status && (
        <Button
          onPress={onPress}
          icon={iconFalse ? iconFalse : icon}
          color={colorFalse ? colorFalse : "grey"}
          style={style}
          compact={compact}
        >
          {text ? text : ""}
        </Button>
      )}
    </View>
  )
}

type ImageBackgroundToggleProps = {
  status: Boolean
  imageURL: ImageSource
  tintColor?: string
  opacity?: number
  children: any
}

export const ImageBackgroundToggle: React.FC<ImageBackgroundToggleProps> = ({
  status,
  imageURL,
  tintColor,
  opacity,
  children,
}) => {
  if (status)
    return (
      <View>
        <ImageBackground
          imageStyle={{
            tintColor: tintColor ? tintColor : "dodgerblue",
            opacity: opacity ? opacity : 1,
            resizeMode: "contain",
          }}
          source={imageURL}
          style={{ width: "100%", height: "100%" }}
        >
          {children}
        </ImageBackground>
      </View>
    )
  else return <View>{children}</View>
}

type GetTextProps = {
  startingValue?: any
  onEnd: any
  style?: object
  numeric?: boolean
  autoFocus?: boolean
  isNumber?: boolean
  convertToString?: boolean
  editable?: boolean
}

export const GetText = (props: GetTextProps) => {
  const [text, setText] = useState(props.startingValue.toString())
  useEffect(() => {
    setText(text => props.startingValue.toString())
  }, [props.startingValue])

  const onSubmitHandler = () => {
    let output = text
    if (props.isNumber) {
      if (!isNaN(parseFloat(output))) {
        output = parseFloat(output).toFixed(1)
        if (output.toString().includes(".0")) {
          let string = output.toString().split("")
          if (string[output.length - 2] === ".") {
            string.splice(output.length - 2, 2)
          }
          output = string.join("")
        }
      }
    }
    if (props.convertToString) output = output.toString()

    props.onEnd(output)
  }

  return (
    <TextInput2
      style={props.style}
      value={text}
      onChangeText={value => setText(text => value)}
      onEndEditing={onSubmitHandler}
      keyboardType={props.numeric ? "numeric" : "default"}
      autoFocus={props.autoFocus}
      editable={props.editable}
      // placeholder={props.startingValue}
    />
  )
}

type EditableTextProps = {
  onEnd: any
  style?: object
  textStyle?: object
  startingValue?: string
  children: ReactChildren
  onPress?: any
}

export const EditableText = (props: EditableTextProps) => {
  const [isEditable, setIsEditable] = useState(false)
  const [text, setText] = useState(props.children)

  useEffect(() => {
    setText(props.children)
  }, [props.children])

  const onEndHandler = newValue => {
    setIsEditable(false)
    setText(newValue)
    props.onEnd(newValue)
  }

  return (
    <View style={props.style}>
      {isEditable ? (
        <GetText
          style={props.textStyle}
          onEnd={onEndHandler}
          startingValue={props.children}
          editable={isEditable}
          autoFocus={true}
        />
      ) : (
        <Pressable onLongPress={() => setIsEditable(true)} onPress={props.onPress}>
          <Text style={props.textStyle}>{text}</Text>
        </Pressable>
      )}
    </View>
  )
}

export const PlusButton = props => {
  return (
    <Button
      icon="plus-circle"
      mode={"contained"}
      compact={true}
      color={iStyles.text2.color}
      style={iStyles.mediumRoundIcon}
      onPress={props.onPress}
    >
      {""}
    </Button>
  )
}

export const TrashButton = props => {
  return (
    <Button
      icon="trash-can-outline"
      mode={"contained"}
      compact={true}
      color="red"
      style={iStyles.mediumRoundIcon}
      onPress={props.onPress}
    >
      {""}
    </Button>
  )
}
