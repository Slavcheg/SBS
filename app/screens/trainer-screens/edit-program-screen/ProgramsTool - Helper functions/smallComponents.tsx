import React, {
  useState,
  useEffect,
  Children,
  PropsWithChildren,
  ReactChild,
  ReactNode,
  ReactChildren,
  VoidFunctionComponent,
  useRef,
  useLayoutEffect,
} from "react"
import {
  View,
  Text,
  TextInput as TextInput2,
  Pressable,
  ImageBackground,
  StyleProp,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Easing,
} from "react-native"
import { Button, TextInput } from "react-native-paper"
import { ImageSource } from "react-native-vector-icons/Icon"
import iStyles from "../Constants/Styles"
import { icons, colors } from "../Constants/"
import { getColorByMuscleName } from "./index"
import { Callback } from "react-powerplug"

type BackButtonProps = React.ComponentProps<typeof Button>

export const BackButton: React.FC<BackButtonProps> = props => {
  return (
    <Button
      icon={icons.arrowLeftBold}
      compact={true}
      mode="contained"
      style={{ margin: 2 }}
      color={colors.blue3}
      {...props}
    ></Button>
  )
}

export const MenuButton: React.FC<BackButtonProps> = props => {
  return (
    <Button
      icon={icons.menu}
      compact={true}
      mode="contained"
      style={{ margin: 2 }}
      color={colors.blue3}
      {...props}
    ></Button>
  )
}

type CancelConfirmProps = {
  onCancel: any
  onConfirm: any
}

export const CancelConfirm: React.FC<CancelConfirmProps> = props => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
      <Button onPress={props.onCancel} color="red">
        cancel
      </Button>
      <Button onPress={props.onConfirm}>confirm</Button>
    </View>
  )
}

type EditablePropertyProps = {
  PropertyName: string
  PropertyValue: any
  onChangeValue: Function
  width?: string | number
  disabled?: boolean
}

export const EditableProperty: React.FC<EditablePropertyProps> = props => {
  const { PropertyName, PropertyValue, onChangeValue } = props
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TextInput
        style={{
          ...iStyles.text2,
          fontSize: 12,
          textAlignVertical: "center",
          width: props.width ? props.width : "100%",
        }}
        label={PropertyName}
        mode="outlined"
        underlineColor={iStyles.text1.color}
        onChangeText={newValue => onChangeValue(newValue)}
        value={PropertyValue}
        disabled={props.disabled}
      />
    </View>
  )
}

export const InfoButton = ({ item }) => {
  return <Button icon={icons.info} onPress={() => alertWithInfoString(item)}></Button>
}

export const alertWithInfoString = item => {
  // const alertString = `${item.Name || "no name"} ${item.FamilyName || "no family name"}`
  const alertString = JSON.stringify(item, null, "\t")
  Alert.alert("", `${alertString}`, [{ text: "ОК" }], { cancelable: true })
}

type PickAnItemProps = {
  list: any[]
  selected: any
  onChange: any
  renderSelected?: any
  renderItems?: any
  keyExtractor?: any
  disabled?: boolean
}

export const PickAFlatItem: React.FC<PickAnItemProps> = props => {
  const { list, selected, onChange, renderSelected, renderItems } = props
  // has to have an ID as object prop
  const [isPicking, setIsPicking] = useState(false)

  const renderInternal = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setIsPicking(false)
          onChange(item)
        }}
      >
        {() => renderItems(item, index)}
      </Pressable>
    )
  }

  const onPressMainText = () => {
    if (isPicking) {
      setIsPicking(false)
      onChange(selected)
    } else setIsPicking(true)
  }

  return (
    <View>
      {/* <View style={{ position: "absolute", zIndex: 1 }}> */}
      <Pressable onPress={onPressMainText} disabled={props.disabled}>
        {renderSelected}
      </Pressable>
      {isPicking && !props.disabled && (
        <FlatList
          data={list.filter(item => item != selected)}
          renderItem={renderInternal}
          keyExtractor={item => item}
        />
      )}
    </View>
  )
}

export const PickAFlatItemModalVersion: React.FC<PickAnItemProps> = props => {
  const { list, selected, onChange, renderSelected, renderItems } = props
  // has to have an ID as object prop
  const [isPicking, setIsPicking] = useState(false)

  const renderInternal = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setIsPicking(false)
          onChange(item)
        }}
      >
        {() => renderItems(item, index)}
      </Pressable>
    )
  }

  const onPressMainText = () => {
    if (isPicking) {
      setIsPicking(false)
      onChange(selected)
    } else setIsPicking(true)
  }
  const ITEM_HEIGHT = 20
  return (
    <View>
      {/* <View style={{ position: "absolute", zIndex: 1 }}> */}
      <Pressable onPress={onPressMainText} disabled={props.disabled}>
        {renderSelected}
      </Pressable>
      <Modal visible={isPicking && !props.disabled}>
        <FlatList
          data={list}
          renderItem={renderInternal}
          keyExtractor={(item, index) => index.toString()}
          initialScrollIndex={list.findIndex(item => item === selected)}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </Modal>
      {/* {isPicking && !props.disabled && ( */}

      {/* )} */}
    </View>
  )
}

export const PickAnItem: React.FC<PickAnItemProps> = props => {
  const { list, selected, onChange, renderSelected, renderItems } = props
  // has to have an ID as object prop
  const [isPicking, setIsPicking] = useState(false)

  const renderInternal = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setIsPicking(false)
          onChange(item)
        }}
      >
        {() => renderItems(item, index)}
      </Pressable>
    )
  }

  const onPressMainText = () => {
    if (isPicking) {
      setIsPicking(false)
      onChange(selected)
    } else setIsPicking(true)
  }

  const keyExtractor = item => {
    let returnFunct

    props.keyExtractor ? (returnFunct = props.keyExtractor(item)) : (returnFunct = item.ID)
    return returnFunct
  }

  return (
    <View>
      {/* <View style={{ position: "absolute", zIndex: 1 }}> */}
      <Pressable onPress={onPressMainText}>{() => renderSelected(selected)}</Pressable>
      {isPicking && (
        <FlatList
          data={list.filter(item => item.ID != selected.ID)}
          renderItem={renderInternal}
          // keyExtractor={item => item.ID}
          keyExtractor={keyExtractor}
        />
      )}
      {/* </View> */}
    </View>
  )
}

type PressableTextPickerCustomColorsProps = {
  pickingFromArray: any[]
  onPick: Function
  onCancel?: Function
  currentValue: string
  textStyle: any
}

export const PressableTextPickerCustomColors: React.FC<PressableTextPickerCustomColorsProps> = props => {
  const [isPicking, setIsPicking] = useState(false)

  const onPick = item => {
    props.onPick(item)
    setIsPicking(false)
  }

  const renderItem = ({ item, index }) => {
    return (
      <Pressable onPress={() => onPick(item)}>
        <Text style={{ ...props.textStyle, color: getColorByMuscleName(item) }}>{item}</Text>
      </Pressable>
    )
  }

  const RenderHeader = () => {
    return (
      <Button color={iStyles.textYellow.color} onPress={() => setIsPicking(false)}>
        Cancel
      </Button>
    )
  }

  if (!isPicking)
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setIsPicking(true)
          }}
        >
          <Text style={props.textStyle}>{props.currentValue}</Text>
        </TouchableOpacity>
      </View>
    )

  return (
    <View style={{ height: "80%" }}>
      <RenderHeader />
      <FlatList
        data={props.pickingFromArray}
        keyExtractor={(item, index) => Math.random().toString()}
        renderItem={renderItem}
      />
    </View>
  )
}

type PressableModalPickerProps = {
  //identical as top one, but a modal version and without special colors. trying to improve upon without breaking previous functionality
  pickingFromArray: any[]
  onPick: Function
  onCancel?: Function
  currentValue: string
  textStyle: any
}

export const PressableModalPicker: React.FC<PressableModalPickerProps> = props => {
  const [isPicking, setIsPicking] = useState(false)

  const onPick = item => {
    props.onPick(item)
    setIsPicking(false)
  }

  const renderItem = ({ item, index }) => {
    return (
      <Pressable onPress={() => onPick(item)}>
        <Text style={props.textStyle}>{item}</Text>
      </Pressable>
    )
  }

  const RenderHeader = () => {
    return (
      <Button color={iStyles.textYellow.color} onPress={() => setIsPicking(false)}>
        Cancel
      </Button>
    )
  }

  if (!isPicking)
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setIsPicking(true)
          }}
        >
          <Text style={props.textStyle}>{props.currentValue}</Text>
        </TouchableOpacity>
      </View>
    )
  else
    return (
      <View>
        <Modal>
          <RenderHeader />
          <FlatList
            data={props.pickingFromArray}
            keyExtractor={(item, index) => Math.random().toString()}
            renderItem={renderItem}
          />
        </Modal>
      </View>
    )
}

type PressableModalPicker2Props = {
  pickingFromArray: any[]
  onPick: Function
  onCancel?: Function
  currentValue: string
  textStyle: any
  itemHeight: number
  currentlySelectedStyle: any
  highlightInListStyle: any
}

export const PressableModalPicker2: React.FC<PressableModalPicker2Props> = props => {
  const [isPicking, setIsPicking] = useState(false)

  const ITEM_HEIGHT = props.itemHeight

  const onPick = item => {
    props.onPick(item)
    setIsPicking(false)
  }

  const renderItem = ({ item, index }) => {
    return (
      <Pressable onPress={() => onPick(item)}>
        <Text style={item === props.currentValue ? props.highlightInListStyle : props.textStyle}>
          {item}
        </Text>
      </Pressable>
    )
  }

  const RenderHeader = () => {
    return (
      <Button color={colors.grey1} onPress={() => setIsPicking(false)}>
        Cancel
      </Button>
    )
  }

  if (!isPicking)
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setIsPicking(true)
          }}
        >
          <Text style={props.currentlySelectedStyle}>{props.currentValue}</Text>
        </TouchableOpacity>
      </View>
    )
  else
    return (
      <View>
        <Modal>
          <RenderHeader />
          <FlatList
            data={props.pickingFromArray}
            keyExtractor={(item, index) => Math.random().toString()}
            renderItem={renderItem}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            initialScrollIndex={props.pickingFromArray.findIndex(
              item => item === props.currentValue,
            )}
          />
        </Modal>
      </View>
    )
}

type SmallIconButtonProps = ButtonProps

export const SmallIconButton: React.FC<SmallIconButtonProps> = props => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Button
        icon={props.icon}
        onPress={props.onPress}
        style={iStyles.smallIcon}
        color={props.color || iStyles.text1.color}
        compact={true}
        mode={props.mode ? props.mode : "text"}
        {...props}
      >
        {props.children}
      </Button>
    </View>
  )
}

type MoreInfoBaloonProps = {
  infoText: string
  infoTextStyle?: any
  onPress?: VoidFunctionComponent
}

export const MoreInfoBaloon: React.FC<MoreInfoBaloonProps> = props => {
  const windowWidth = useWindowDimensions().width

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          borderWidth: 1,
          // right: 0,
          width: windowWidth,
          backgroundColor: iStyles.backGround.color,
          left: 0,
        }}
      >
        <Text style={props.infoTextStyle || iStyles.text0}>{props.infoText}</Text>
      </View>
    </TouchableOpacity>
  )
}

type TextWithInfoBaloonProps = {
  text?: string
  textStyle?: any
  infoText: string
  infoTextStyle?: any
  baloonDuration?: number
  disabled?: boolean
}

export const TextWithInfoBaloon: React.FC<TextWithInfoBaloonProps> = props => {
  const [showBaloon, setShowBaloon] = useState(false)

  const onPress = () => {
    console.log(props.infoText)
    if (showBaloon) setShowBaloon(false)
    else {
      setShowBaloon(true)
      setTimeout(() => setShowBaloon(false), props.baloonDuration || 3000)
    }
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={props.disabled}>
      <Text style={props.textStyle}>{props.text}</Text>
      {showBaloon && (
        <MoreInfoBaloon infoText={props.infoText} infoTextStyle={props.infoTextStyle} />
      )}
    </TouchableOpacity>
  )
}

type ExpandableContentProps = {
  startMinimized?: boolean
  title: string
  titleStyle?: object
}

export const ExpandableContent: React.FC<ExpandableContentProps> = props => {
  let initialState = props.startMinimized === true ? false : true

  const [isExpanded, setIsExpanded] = useState(initialState)

  const animatedHeight = useRef(new Animated.Value(0)).current

  // const animatedValue = useRef(new Animated.Value(0)).current

  // // const animatedStyle = { backgroundColor: `rgb(255,0,${animatedValue})` }

  // const interpolateColor = animatedValue.interpolate({
  //   inputRange: [0, 150],
  //   outputRange: ["rgb(0,100,0)", colors.green_transparent],
  // })
  // const animatedStyle = { backgroundColor: interpolateColor }

  // useEffect(() => {
  //   animatedValue.setValue(0)

  //   Animated.timing(animatedValue, {
  //     toValue: 150,
  //     duration: 350,
  //     useNativeDriver: false,
  //   }).start()
  //   console.log("fired animation")
  // }, [currentWeekIndex])

  //  const onLayout = obj => {
  //   if (!isAnimating) {
  //     setStyle({ ...style, height: animatedHeight })
  //     setHeight(obj.nativeEvent.layout.height)
  //     setIsAnimating(true)
  //   }
  //   // finalHeight = obj.nativeEvent.layout.height
  //   // animatedHeight.setValue(obj.nativeEvent.layout.height)
  // }
  // useLayoutEffect(() => {
  //   if (isAnimating) {
  //     if (height > 0) {
  //       animatedHeight.setValue(1)
  //       Animated.timing(animatedHeight, {
  //         toValue: height,
  //         duration: 1000,
  //         useNativeDriver: false,
  //       }).start(() => {
  //         setStyle({ backgroundColor: "white" })
  //         setHeight(0)
  //         setIsAnimating(false)
  //       })
  //     }
  //   }
  // }, [isAnimating])

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ textAlignVertical: "bottom", ...props.titleStyle }}>{props.title}</Text>
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
      color={iStyles.textYellow.color}
      colorFalse={iStyles.text2.color}
      icon="arrow-expand-up"
      iconFalse="arrow-expand-down"
      compact={true}
    />
  )
}

type MediumButtonIconProps = ButtonProps & {}

export const MediumButtonIcon: React.FC<MediumButtonIconProps> = props => {
  return (
    <Button
      style={iStyles.mediumRoundIcon}
      labelStyle={{ fontSize: iStyles.mediumRoundIcon.height }}
      compact={true}
      color={colors.black}
      {...props}
    >
      {props.children}
    </Button>
  )
}

type AlternativeCheckboxProps = {
  onPress: Function
  status: boolean
  disabled?: boolean
}

export const AlternativeCheckbox: React.FC<AlternativeCheckboxProps> = props => {
  const {
    onPress,
    status,
    color,
    colorFalse,
    icon,
    iconFalse,
    text,
    style,
    compact,
    disabled,
  } = props

  return (
    <ToggleButton
      onPress={onPress}
      status={status}
      color={colors.black}
      colorFalse={colors.black}
      icon={icons.check}
      iconFalse={icons.checkBoxOutline}
      compact={true}
      labelStyle={{ fontSize: 20 }}
      disabled={disabled}
    />
  )
}

type ToggleButtonProps = ButtonProps & {
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

export const ToggleButton: React.FC<ToggleButtonProps> = props => {
  const {
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
    disabled,
  } = props
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {status && (
        <Button
          {...props}
          onPress={onPress}
          icon={icon}
          color={color ? color : "dodgerblue"}
          style={style}
          compact={compact}
          disabled={disabled}
        >
          {text ? text : ""}
        </Button>
      )}
      {!status && (
        <Button
          {...props}
          onPress={onPress}
          icon={iconFalse ? iconFalse : icon}
          color={colorFalse ? colorFalse : "grey"}
          style={style}
          compact={compact}
          disabled={disabled}
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

type TextInputProps = React.ComponentProps<typeof TextInput>

type ClickableEditableTextProps = TextInputProps & {
  autoBlurTime?: number
}

export const ClickableEditableText: React.FC<ClickableEditableTextProps> = props => {
  const [isEditable, setIsEditable] = useState(false)
  const [blurTime, setBlurTime] = useState(30000)
  const inputRef = useRef()

  let mounted = true

  const onChangeText = newText => {
    setBlurTime(props.autoBlurTime)
    // if (props.autoBlurTime)
    //   setTimeout(() => {
    //     if (inputRef.current) inputRef.current.blur()
    //   }, props.autoBlurTime)
    props.onChangeText(newText)
  }

  useEffect(() => {
    if (blurTime <= 0) {
      if (inputRef.current) inputRef.current.blur()
    } else
      setTimeout(() => {
        if (mounted) setBlurTime(blurTime - 500)
      }, 500)

    return () => (mounted = false)
  })

  if (!isEditable)
    return (
      <Pressable onPress={() => setIsEditable(true)}>
        <Text {...props}>{`${props.value}`}</Text>
      </Pressable>
    )

  return (
    <TextInput
      {...props}
      onBlur={() => setIsEditable(false)}
      onChangeText={onChangeText}
      ref={inputRef}
    />
  )
}

type EditableTextProps = {
  onEnd: any
  style?: object
  textStyle?: object
  startingValue?: string
  children: any
  onPress?: any
  clickToEdit?: boolean
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
      {isEditable && (
        <GetText
          style={props.textStyle}
          onEnd={onEndHandler}
          startingValue={props.children}
          editable={isEditable}
          autoFocus={true}
        />
      )}
      {!isEditable && !props.clickToEdit && (
        <Pressable onLongPress={() => setIsEditable(true)} onPress={props.onPress}>
          <Text style={props.textStyle}>{text}</Text>
        </Pressable>
      )}
      {!isEditable && props.clickToEdit && (
        <Pressable
          onPress={() => setIsEditable(true)}
          onLongPress={() => setIsEditable(true)}
          onPressIn={() => setIsEditable(true)}
        >
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
      {...props}
    >
      {""}
    </Button>
  )
}

type ButtonProps = React.ComponentProps<typeof Button>

type DeleteButtonProps = ButtonProps & {
  forever?: boolean
  fontSize?: number
}

export const DeleteButton: React.FC<DeleteButtonProps> = props => {
  const icon = props.forever ? icons.deleteForever : icons.delete
  const fontSize = props.fontSize ? props.fontSize : 25
  return (
    <Button
      icon={icon}
      mode={"text"}
      compact={true}
      color="red"
      style={iStyles.mediumRoundIcon}
      labelStyle={{ fontSize: 25 }}
      {...props}
    ></Button>
  )
}
