import React, { useEffect, useState } from "react"

import { Picker } from "@react-native-picker/picker"

import { View, ScrollView, useWindowDimensions, Modal, TextStyle } from "react-native"

import { Text } from "./index"

import _ from "lodash"

import { Button, TextInput, Checkbox } from "react-native-paper"

import {
  ExercisePicker,
  ButtonsRow,
  ShowProgramDays,
  EditProgramReducer,
  ProgramViewHeader,
  EasyNumberPicker,
  GetText,
  PressableModalPicker,
} from "."

import iStyles from "../Constants/Styles"

import { DEFAULT_SET_DATA2 } from "../../../../components3"

import { MAX_SETS, MAX_REPS } from "../Constants/programCreationConstants"
import { icons, colors, fonts } from "../Constants/"

type EditExerciseModalProps = {
  visible: boolean
  exercise: any
  onClose: (state: object) => void
  onRequestClose: () => void
}

export const EditExerciseModal = (props: EditExerciseModalProps) => {
  const { visible } = props
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height

  const [exerciseState, setExerciseState] = useState(_.cloneDeep(props.exercise))
  const [weightArrow, setWeightArrow] = useState(-1)
  const [repsArrow, setRepsArrow] = useState(-1)

  React.useMemo(() => {
    const newEx = _.cloneDeep(props.exercise)
    setExerciseState(newEx)
  }, [visible])

  const onChangeNumberOfSets = newNumberOfSets => {
    const newSets = []
    for (let i = 0; i < newNumberOfSets; i++)
      newSets.push({
        ...DEFAULT_SET_DATA2,
        Reps: exerciseState.Sets[0].Reps,
        Weight: exerciseState.Sets[0].Weight,
        WeightType: exerciseState.Sets[0].WeightType,
      })

    setExerciseState({ ...exerciseState, Sets: [...newSets] })
  }
  const onChangeReps = (newValue, setIndex) => {
    let newSets = [...exerciseState.Sets]

    newSets[setIndex].Reps = newValue

    setExerciseState({ ...exerciseState, Sets: [...newSets] })
    setRepsArrow(setIndex + 1)
    setTimeout(() => setRepsArrow(-1), 9000)
  }

  const onSpreadWeight = (setIndex: number) => {
    let newSets = [...exerciseState.Sets]
    for (let i = setIndex; i < exerciseState.Sets.length; i++)
      newSets[i].Weight = newSets[i - 1].Weight
    setExerciseState({ ...exerciseState, Sets: [...newSets] })
    setWeightArrow(-1)
  }

  const onSpreadReps = (setIndex: number) => {
    let newSets = [...exerciseState.Sets]
    for (let i = setIndex; i < exerciseState.Sets.length; i++) newSets[i].Reps = newSets[i - 1].Reps
    setExerciseState({ ...exerciseState, Sets: [...newSets] })
    setRepsArrow(-1)
  }

  const onChangeWeight = (newValue, setIndex) => {
    let dummyExercise = { ...exerciseState }
    setWeightArrow(setIndex + 1)
    setTimeout(() => setWeightArrow(-1), 9000)
    // weight value is saved as string

    //if is not a number > change type to 'other'
    //if first set > change all sets

    if (Number.isNaN(parseInt(newValue))) {
      for (let i = 0; i < dummyExercise.Sets.length; i++) dummyExercise.Sets[i].WeightType = "other"
    }

    if (parseFloat(newValue).toString().length === newValue.toString().length)
      dummyExercise.Sets[setIndex].WeightType = "pureWeight"

    dummyExercise.Sets[setIndex].Weight = newValue

    setExerciseState({ ...exerciseState, ...dummyExercise })
  }

  const onUpdateRepsProgression = newValue => {
    setExerciseState({ ...exerciseState, increaseReps: newValue })
  }
  const onUpdateWeightProgression = newValue => {
    setExerciseState({ ...exerciseState, increaseWeight: newValue })
  }

  const onClose = () => {
    props.onClose(_.cloneDeep(exerciseState))
    setExerciseState(null)
  }

  const width1Left = "30%"
  const width1Right = "70%"

  const textStyle1: TextStyle = {
    ...iStyles.text0,
    fontFamily: fonts.jost.semi_bold,
    textAlign: "center",
    fontSize: 20,
  }

  const textStyle2: TextStyle = {
    ...textStyle1,
    fontFamily: fonts.jost.regular,
  }

  const pickerProps1 = {}

  if (!visible || !exerciseState) return <View></View>
  else
    return (
      <Modal visible={visible} onRequestClose={props.onRequestClose}>
        <View
          style={{
            position: "absolute",
            height: windowHeight - 10,
            // width: windowWidth,
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: colors.grey1,
          }}
        >
          <View
            style={{
              // // position: "absolute",
              // top: 10,
              // bottom: 10,
              backgroundColor: iStyles.backGround.color,
              // justifyContent: "center",
              height: windowHeight * 0.85,
              // width: windowWidth,
            }}
          >
            <ScrollView style={{ width: windowWidth - 20 }}>
              <Text style={textStyle1}>{exerciseState.Name}</Text>
              <View style={{ height: 10 }}></View>
              <TwoColumns
                leftWidth="30%"
                rightWidth="70%"
                LeftContent={() => <Text style={textStyle2}>Sets</Text>}
                RightContent={() => (
                  // <View style={iStyles.smallImputBox}>
                  <EasyNumberPicker
                    easyNumbers={[2, 3, 4, 5]}
                    isActive={true}
                    currentlySelected={exerciseState.Sets.length}
                    textStyle={{ ...textStyle1, color: colors.blue3 }}
                    inactiveTextStyle={{ ...textStyle1, color: colors.grey1 }}
                    easyMode="horizontal"
                    onLongPressMode="picker"
                    validSelection={MAX_SETS}
                    onChange={value => {
                      onChangeNumberOfSets(value)
                    }}
                    separatorMargin={4}
                  />
                  // </View>
                )}
              />
              <View style={{ height: 5 }}></View>
              <TwoColumns
                leftWidth="30%"
                rightWidth="70%"
                LeftContent={() => <Text style={textStyle2}>+ Reps</Text>}
                RightContent={() => (
                  // <View style={iStyles.smallImputBox}>
                  <EasyNumberPicker
                    easyNumbers={[0, 1, 2]}
                    easyMode="horizontal"
                    onLongPressMode="get text"
                    isActive={true}
                    currentlySelected={exerciseState.increaseReps}
                    onChange={value => {
                      onUpdateRepsProgression(value)
                    }}
                    textStyle={{ ...textStyle1, color: colors.blue3 }}
                    inactiveTextStyle={{ ...textStyle1, color: colors.grey1 }}
                    separatorMargin={4}
                  />
                  // </View>
                )}
              />
              <View style={{ height: 5 }}></View>
              <TwoColumns
                leftWidth="30%"
                rightWidth="70%"
                LeftContent={() => <Text style={textStyle2}>+ Weight</Text>}
                RightContent={() => (
                  // <View style={iStyles.smallImputBox}>
                  <EasyNumberPicker
                    easyNumbers={[0, 1, 2.5]}
                    easyMode="horizontal"
                    onLongPressMode="get text"
                    isActive={exerciseState.WeightType === "pureWeight" ? false : true}
                    currentlySelected={exerciseState.increaseWeight}
                    onChange={value => {
                      onUpdateWeightProgression(value)
                    }}
                    textStyle={{ ...textStyle1, color: colors.blue3 }}
                    inactiveTextStyle={{ ...textStyle1, color: colors.grey1 }}
                    separatorMargin={4}
                  />
                  // </View>
                )}
              />
              <View style={{ height: 10 }}></View>
              {exerciseState.Sets.map((set, setIndex) => (
                <View key={setIndex}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    {repsArrow === setIndex && (
                      <View
                        style={{
                          position: "absolute",
                          left: 15,
                          top: -10,
                        }}
                      >
                        <Button
                          icon={icons.arrowDownBoldOutline}
                          labelStyle={{ fontSize: 25 }}
                          // compact={true}
                          color={iStyles.text1.color}
                          onPress={() => onSpreadReps(setIndex)}
                        ></Button>
                      </View>
                    )}
                    <Text style={textStyle1}>Set {setIndex + 1}</Text>
                    {weightArrow === setIndex && (
                      <View
                        style={{
                          position: "absolute",
                          right: 5,
                          top: -10,
                        }}
                      >
                        <Button
                          icon={icons.arrowDownBoldOutline}
                          labelStyle={{ fontSize: 25 }}
                          // compact={true}
                          color={iStyles.text1.color}
                          onPress={() => onSpreadWeight(setIndex)}
                        ></Button>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={iStyles.smallImputBox}>
                      {/* <View style={iStyles.smallerOutlineOverInputBox}> */}
                      <Text style={textStyle2}>Reps</Text>
                      {/* </View> */}
                    </View>
                    {/* 
                    <View style={iStyles.smallImputBox}>
                
                      <Picker
                        mode={"dropdown"}
                        selectedValue={exerciseState.Sets[setIndex].Reps}
                        style={{ height: 50, width: 100, color: colors.color1 }}
                        onValueChange={(itemValue, itemIndex) => {
                          onChangeReps(itemValue, setIndex)
                        }}

                      >
                        {MAX_REPS.map(value => (
                          <Picker.Item
                            key={value}
                            label={value.toString()}
                            value={value}
                            color={colors.color1}
                          />
                        ))}
                      </Picker>
         
                    </View> */}
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                      <PressableModalPicker
                        currentValue={exerciseState.Sets[setIndex].Reps}
                        onPick={newValue => onChangeReps(parseInt(newValue), setIndex)}
                        pickingFromArray={MAX_REPS}
                        textStyle={{ ...textStyle1, color: colors.color1 }}
                      />
                    </View>
                    {/* //// Weight management */}

                    <View style={iStyles.smallImputBox}>
                      {/* <View style={iStyles.smallerOutlineOverInputBox}> */}
                      <Text style={textStyle2}>Weight</Text>
                      {/* </View> */}
                    </View>

                    <View style={iStyles.smallImputBox}>
                      {/* <View style={iStyles.smallerOutlineOverInputBox}> */}
                      <GetText
                        style={{ ...textStyle1, color: colors.color1 }}
                        isNumber={true}
                        convertToString={true}
                        startingValue={exerciseState.Sets[setIndex].Weight}
                        onEnd={value => {
                          onChangeWeight(value, setIndex)
                          // dispatch({
                          //   type: 'change weight',
                          //   value: value,
                          //   currentSetIndex: setIndex,
                          // });
                        }}
                      />
                      {/* </View> */}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <FAB message="" onPress={onClose} />
        </View>
      </Modal>
    )
}

type FABProps = {
  message: string
  onPress: Function
}

const FAB: React.FC<FABProps> = props => {
  const [message, setMessage] = useState(props.message || "")
  let mounted = true
  useEffect(() => {
    setTimeout(() => {
      if (mounted) setMessage("")
    }, 5000)

    return () => (mounted = false)
  }, [])
  return (
    <View style={{ alignItems: "flex-end", width: "100%", padding: 2 }}>
      <Button
        icon={icons.check}
        mode={"contained"}
        compact={true}
        color={colors.green3}
        onPress={props.onPress}
        style={{
          // position: "absolute",
          // // top: props.state.isButtonsRowExpanded ? "67.6%" : "75%",
          // top: "85%",
          // right: "5%",
          // zIndex: 1,
          borderRadius: 40,
          width: message === "" ? 50 : "100%",
        }}
        labelStyle={{ fontSize: 21 }}
      >
        {message}
      </Button>
    </View>
  )
}

type TwoColumnsProps = {
  leftWidth: string
  rightWidth: string
  LeftContent: React.FC
  RightContent: React.FC
}

const TwoColumns: React.FC<TwoColumnsProps> = props => {
  const { leftWidth, rightWidth, LeftContent, RightContent } = props

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: leftWidth, alignItems: "center", justifyContent: "center" }}>
        <LeftContent />
      </View>
      <View style={{ width: rightWidth, alignItems: "center", justifyContent: "center" }}>
        <RightContent />
      </View>
    </View>
  )
}
