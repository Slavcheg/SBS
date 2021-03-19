import React, { useEffect, useState } from "react"
import {
  View,
  FlatList,
  TextStyle,
  ViewStyle,
  useWindowDimensions,
  Pressable,
  BackHandler,
} from "react-native"
import { Button, TextInput } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import {
  return_todays_datestamp,
  displayDateFromTimestamp,
  displayDateFromTimestampFullMonth,
  border_boxes,
  getStampFromDate,
  displayDateFromTimestamp2,
  subtractDaysFromDateStamp,
  addDaysFromDateStamp,
} from "../../../../global-helper"

import { useGlobalState, getState } from "../../../../components3/globalState/global-state-regular"

import { fonts, colors, Text } from "../../../../components3"
import {
  PickAFlatItem,
  PickAFlatItemModalVersion,
  PressableModalPicker2,
} from "../../../trainer-screens/edit-program-screen/ProgramsTool - Helper functions/smallComponents"
import { Alerts } from "./Alerts"
import firestore from "@react-native-firebase/firestore"

import { diaryDay, defaultDiaryDay, DiaryType } from "../diaryTypes"

type ShowDiaryDaysProps = {
  diary: DiaryType
  setDiary: any
}

export const ShowDiaryDays: React.FC<ShowDiaryDaysProps> = props => {
  const [globalState, setGlobalState] = useGlobalState()
  // const [localDiary, setLocalDiary] = useState<DiaryType>()
  const [saved, setSaved] = useState(true)
  const localDiary = props.diary
  const setLocalDiary = props.setDiary

  let mounted = true

  useEffect(() => {
    getState(setGlobalState)

    return () => (mounted = false)
  }, [])

  useEffect(() => {
    if (props.diary) {
      if (props.diary.Days.length === 0) setLocalDiary({ ...props.diary, Days: [defaultDiaryDay] })
    }
  }, [props.diary])

  useEffect(() => {
    const onBackPress = () => {
      mounted = false
      if (localDiary && !saved) onSaveDiary()
      return false
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [saved])

  const onChangeDate = (newValue, index) => {
    let newDiaryDays = [...localDiary.Days]
    newDiaryDays[index].date = newValue
    setLocalDiary({ ...localDiary, Days: [...newDiaryDays] })
    setSaved(false)
  }
  const onChangeWeight = (newValue, index) => {
    let newDiaryDays = [...localDiary.Days]
    newDiaryDays[index].weight = parseFloat(newValue) || 0
    setLocalDiary({ ...localDiary, Days: [...newDiaryDays] })
    setSaved(false)

    // const oldValueArray = localDiary.Days[index].weight.toString().split("")
    // const newValueArray = newValue.split("")

    // console.log("oldValueArray", oldValueArray.length)
    // console.log("newValueArray", newValueArray.length)
    // if (
    //   !(
    //     newValueArray.length === oldValueArray.length + 1 &&
    //     newValueArray[newValueArray.length - 1] === "."
    //   )
    // ) {
    //   console.log("went here")
    //   let newDiaryDays = [...localDiary.Days]
    //   newDiaryDays[index].weight = parseFloat(newValue) || 0
    //   setLocalDiary({ ...localDiary, Days: [...newDiaryDays] })
    //   setSaved(false)
    // }
  }
  const onChangeKCal = (newValue, index) => {
    let newDiaryDays = [...localDiary.Days]
    newDiaryDays[index].kcal = parseInt(newValue) || 0
    setLocalDiary({ ...localDiary, Days: [...newDiaryDays] })
    setSaved(false)
  }
  const onChangeProtein = (newValue, index) => {
    let newDiaryDays = [...localDiary.Days]
    newDiaryDays[index].protein = parseInt(newValue) || 0
    setLocalDiary({ ...localDiary, Days: [...newDiaryDays] })
    setSaved(false)
  }

  const onAddEmptyDay = () => {
    const newDate = addDaysFromDateStamp(localDiary.Days[localDiary.Days.length - 1].date, 1)
    const newDefaultDay: diaryDay = {
      ...defaultDiaryDay,
      date: newDate,
    }
    setLocalDiary({ ...localDiary, Days: [...localDiary.Days, { ...newDefaultDay }] })
    setSaved(false)
  }

  const onAddEmptyDayBeginning = () => {
    const newDate = subtractDaysFromDateStamp(localDiary.Days[0].date, 1)
    const newDefaultDay: diaryDay = {
      ...defaultDiaryDay,
      date: newDate,
    }
    setLocalDiary({ ...localDiary, Days: [newDefaultDay, ...localDiary.Days] })
    setSaved(false)
  }

  const onDeleteDay = deleteIndex => {
    setLocalDiary({
      ...localDiary,
      Days: localDiary.Days.filter((day, dayIndex) => dayIndex !== deleteIndex),
    })
    setSaved(false)
  }

  const onSaveDiary = () => {
    setGlobalState({ type: "update diary", diary: localDiary })
    firestore()
      .collection("diaries")
      .doc(localDiary.clientID)
      .update(localDiary)
      .then(() => {
        if (mounted) setSaved(true)
      })
  }

  const diaryHeader = () => {
    const width = "20%"
    return (
      <View>
        {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ViewText width={width} text="date" />
          <ViewText width={width} text="weight" />
          <ViewText width={width} text="kcal" />
          <ViewText width={width} text="protein" />
        </View> */}
        <Button onPress={onAddEmptyDayBeginning} color={colors.green2}>
          add new day
        </Button>
      </View>
    )
  }

  const renderDiaryDays = ({ item, index }) => {
    const day: diaryDay = item
    const dayString = displayDateFromTimestamp2(day.date)
    const width = "20%"

    return (
      <EditableDiaryDayRow
        day={day}
        onChangeDate={newDate => onChangeDate(newDate, index)}
        onChangeWeight={newWeight => onChangeWeight(newWeight, index)}
        onChangeKCal={newKCal => onChangeKCal(newKCal, index)}
        onChangeProtein={newProtein => onChangeProtein(newProtein, index)}
        onDeleteDay={() => onDeleteDay(index)}
        diary={localDiary}
      />
    )
  }
  const diaryFooter = () => {
    return (
      <Button onPress={onAddEmptyDay} color={colors.green2}>
        add day
      </Button>
    )
  }

  return (
    <View>
      {!localDiary && <Text>търсим дневникът...</Text>}
      {localDiary && (
        <View>
          <FlatList
            renderItem={renderDiaryDays}
            data={localDiary.Days}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={diaryHeader}
            ListFooterComponent={diaryFooter}
            scrollEnabled={false}
          />
        </View>
      )}
      <View style={{ justifyContent: "flex-end" }}>
        <Button color={colors.blue3} onPress={onSaveDiary} disabled={saved}>
          {saved ? "saved" : "save"}
        </Button>
      </View>
    </View>
  )
}

type ViewTextProps = {
  width?: any
  viewStyle?: ViewStyle
  text: string
  textStyle?: TextStyle
}
const ViewText: React.FC<ViewTextProps> = props => {
  return (
    <View style={{ width: props.width, ...props.viewStyle }}>
      <Text style={{ textAlign: "center", fontSize: 20, ...props.textStyle }}>{props.text}</Text>
    </View>
  )
}

type EditableDiaryDayRowProps = {
  onChangeDate: any
  onChangeWeight: any
  onChangeKCal: any
  onChangeProtein: any
  onDeleteDay: any
  day: diaryDay
  diary: DiaryType
}

const EditableDiaryDayRow: React.FC<EditableDiaryDayRowProps> = props => {
  const { onChangeDate, onChangeKCal, onChangeProtein, onChangeWeight } = props
  const { date, weight, kcal, protein } = props.day
  const windowWidth = useWindowDimensions().width
  const width = (windowWidth - windowWidth / 10) / 4

  const [isPickingDate, setIsPickingDate] = useState(false)

  const onPressDate = () => {
    if (!isPickingDate) setIsPickingDate(true)
    else {
    }
  }

  const onPressDeleteDay = () => {
    Alerts.ConfirmDeleteDay(displayDateFromTimestamp2(date), props.onDeleteDay)
  }

  const { diary } = props

  let averageWeight = 0
  let weightCounts = 0
  let lastWeight = 60
  diary.Days.forEach(day => {
    if (day.weight) {
      averageWeight += day.weight
      weightCounts++
      lastWeight = day.weight
    }
  })
  averageWeight = parseFloat((averageWeight / weightCounts).toFixed(1))

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      {isPickingDate && (
        <DateTimePicker
          // value={moment(currentDate).toDate() || moment(return_todays_datestamp()).toDate()}
          value={moment(date).toDate()}
          onChange={(event, newDate) => {
            if (newDate) {
              setIsPickingDate(false)
              onChangeDate(getStampFromDate(newDate))
            } else setIsPickingDate(false)
          }}
          mode={"date"}
          display="spinner"
        />
      )}
      <Pressable onPress={onPressDate} onLongPress={onPressDeleteDay}>
        <View style={{ width: width }}>
          <Text style={{ fontSize: 20, textAlign: "center" }}>
            {displayDateFromTimestamp2(date)}
          </Text>
        </View>
      </Pressable>
      {/* {diary.settings.showWeight && (
        <EditableProperty
          PropertyName="weight"
          PropertyValue={`${weight || ""}`}
          onChangeValue={onChangeWeight}
          width={width}
        />
      )} */}
      {diary.settings.showWeight && (
        // <PickAFlatItemModalVersion
        //   list={weightList(weight, 3, 0.1)}
        //   selected={weight.toString()}
        //   onChange={newValue => onChangeWeight(newValue)}
        //   renderSelected={() => (
        //     <Text style={{ fontSize: 20, color: colors.blue3 }}>{weight.toString()}</Text>
        //   )}
        //   renderItems={item => <Text style={{ fontSize: 20 }}>{item}</Text>}
        // />
        <View style={{ width: width }}>
          <PressableModalPicker2
            pickingFromArray={weightList(weight || lastWeight, 5, 0.1)}
            currentValue={weight ? `${weight}` : `${lastWeight}`}
            onPick={newValue => onChangeWeight(newValue)}
            textStyle={{ fontSize: 20, textAlign: "center" }}
            currentlySelectedStyle={{
              fontSize: 20,
              textAlign: "center",
              color: colors.grey1,
            }}
            highlightInListStyle={{ fontSize: 20, textAlign: "center", color: colors.blue3 }}
            itemHeight={20}
          />
        </View>
      )}

      {diary.settings.showCalories && (
        <EditableProperty
          PropertyName="kcal"
          PropertyValue={`${kcal || ""}`}
          onChangeValue={onChangeKCal}
          width={width}
        />
      )}
      {diary.settings.showProtein && (
        <EditableProperty
          PropertyName="protein"
          PropertyValue={`${protein || ""}`}
          onChangeValue={onChangeProtein}
          width={width}
        />
      )}
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

const EditableProperty: React.FC<EditablePropertyProps> = props => {
  const { PropertyName, PropertyValue, onChangeValue } = props
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
      underlineColor={colors.blue3}
      onChangeText={newValue => onChangeValue(newValue)}
      value={PropertyValue}
      disabled={props.disabled}
      underlineColorAndroid={colors.blue3}
      selectionColor={colors.blue3}
      placeholderTextColor={colors.blue3}
      keyboardType="decimal-pad"
    />
  )
}

const weightList = (currentWeight, range, increment) => {
  const list = []
  for (let i = currentWeight - range + 1; i < currentWeight + range; i += increment)
    list.push(`${i.toFixed(1)}`)
  return list
}
