import React, { useState } from "react"

import { Picker } from "@react-native-community/picker"

import { View, Text, ScrollView, useWindowDimensions, Modal } from "react-native"

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
} from "."

import iStyles from "../Constants/Styles"

import {
  EMPTY_PROGRAM_DATA2,
  state,
  TRAINING_PROGRAMS_COLLECTION,
  DEFAULT_SET_DATA2,
} from "../../../../models/sub-stores"

import { MAX_SETS, MAX_REPS } from "../Constants/programCreationConstants"

type EditExerciseModalProps = {
  visible: boolean
  exercise: any
  onClose: Function
}

export const EditExerciseModal = (props: EditExerciseModalProps) => {
  const { visible } = props
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height

  const [exerciseState, setExerciseState] = useState(_.cloneDeep(props.exercise))

  React.useMemo(() => {
    const newEx = _.cloneDeep(props.exercise)
    setExerciseState(newEx)
    console.log("went here")
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

    if (setIndex === 0) {
      for (let i = 0; i < newSets.length; i++) {
        newSets[i].Reps = newValue
      }
    } else newSets[setIndex].Reps = newValue

    setExerciseState({ ...exerciseState, Sets: [...newSets] })
  }

  const onChangeWeight = (newValue, setIndex) => {
    let dummyExercise = { ...exerciseState }

    // weight value is saved as string

    //if is not a number > change type to 'other'
    //if first set > change all sets

    if (Number.isNaN(parseInt(newValue))) {
      for (let i = 0; i < dummyExercise.Sets.length; i++) dummyExercise.Sets[i].WeightType = "other"
    }
    if (setIndex === 0) {
      for (let i = 0; i < dummyExercise.Sets.length; i++) {
        dummyExercise.Sets[i].Weight = newValue
      }
    } else dummyExercise.Sets[setIndex].Weight = newValue

    setExerciseState({ ...exerciseState, ...dummyExercise })
  }

  const onUpdateRepsProgression = newValue => {
    setExerciseState({ ...exerciseState, increaseReps: newValue })
  }
  const onUpdateWeightProgression = newValue => {
    setExerciseState({ ...exerciseState, increaseWeight: newValue })
  }
  if (!visible || !exerciseState) return <View></View>
  else
    return (
      <Modal visible={visible}>
        <View
          style={{
            position: "absolute",
            top: 10,
            bottom: 10,
            backgroundColor: "white",
            justifyContent: "center",
            height: windowHeight * 0.85,
            width: windowWidth,
          }}
        >
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                width: windowWidth,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...iStyles.text2,
                    textAlign: "center",
                  }}
                >
                  {exerciseState.Name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  position: "absolute",
                  right: 10,
                }}
              >
                <Button
                  onPress={() => {
                    props.onClose(_.cloneDeep(exerciseState))
                    setExerciseState(null)
                  }}
                >
                  ok
                </Button>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // borderWidth: 1,
              }}
            >
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <Text style={iStyles.text1}>Sets</Text>
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <EasyNumberPicker
                    easyNumbers={[2, 3, 4, 5]}
                    isActive={true}
                    currentlySelected={exerciseState.Sets.length}
                    textStyle={{ color: iStyles.text1.color }}
                    easyMode="horizontal"
                    onLongPressMode="picker"
                    validSelection={MAX_SETS}
                    onChange={value => {
                      onChangeNumberOfSets(value)
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <Text
                    style={{
                      ...iStyles.text1,
                      fontSize: 17,
                      textAlign: "center",
                    }}
                  >
                    +Reps progession
                  </Text>
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <EasyNumberPicker
                    easyNumbers={[0, 1, 2]}
                    easyMode="horizontal"
                    onLongPressMode="get text"
                    isActive={true}
                    currentlySelected={exerciseState.increaseReps}
                    onChange={value => {
                      onUpdateRepsProgression(value)
                    }}
                    textStyle={{ color: iStyles.text1.color }}
                  />
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <Text
                    style={{
                      ...iStyles.text1,
                      fontSize: 17,
                      textAlign: "center",
                    }}
                  >
                    +Weight progession
                  </Text>
                </View>
              </View>
              <View style={iStyles.smallImputBox}>
                <View style={iStyles.smallerOutlineOverInputBox}>
                  <EasyNumberPicker
                    easyNumbers={[0, 1, 2.5]}
                    easyMode="horizontal"
                    onLongPressMode="get text"
                    isActive={exerciseState.WeightType === "pureWeight" ? false : true}
                    currentlySelected={exerciseState.increaseWeight}
                    onChange={value => {
                      onUpdateWeightProgression(value)
                    }}
                    textStyle={{ color: iStyles.text1.color }}
                  />
                </View>
              </View>
            </View>
            {exerciseState.Sets.map((set, setIndex) => (
              <View key={setIndex}>
                <Text style={{ ...iStyles.text1, textAlign: "center" }}>Set {setIndex + 1}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <Text style={{ ...iStyles.text1, fontSize: 17 }}>Reps</Text>
                    </View>
                  </View>

                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <Picker
                        mode={"dropdown"}
                        selectedValue={exerciseState.Sets[setIndex].Reps}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(itemValue, itemIndex) => {
                          onChangeReps(itemValue, setIndex)
                        }}
                      >
                        {MAX_REPS.map(value => (
                          <Picker.Item key={value} label={value.toString()} value={value} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  {/* //// Weight management */}

                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <Text style={{ ...iStyles.text1, fontSize: 17 }}>Weight</Text>
                    </View>
                  </View>

                  <View style={iStyles.smallImputBox}>
                    <View style={iStyles.smallerOutlineOverInputBox}>
                      <GetText
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
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    )
}
