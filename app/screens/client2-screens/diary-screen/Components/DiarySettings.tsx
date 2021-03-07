import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { Button, Checkbox } from "react-native-paper"

import { Text, colors, icons, fonts } from "../../../../components3"

import * as diaryTypes from "../diaryTypes"

type DiarySettingsButtonType = {
  diary: diaryTypes.DiaryType
  setDiary: any
}

export const DiarySettingsButton: React.FC<DiarySettingsButtonType> = props => {
  const [areSettingsVisible, setAreSettingsVisible] = useState(false)
  const { diary, setDiary } = props

  useEffect(() => {
    if (!diary.settings) setDiary({ ...diary, settings: { ...diaryTypes.defaultSettings } })
  }, [])

  return (
    <View>
      <Button
        color={colors.blue3}
        icon={icons.settingsCog}
        onPress={() => setAreSettingsVisible(!areSettingsVisible)}
      ></Button>
      <DiarySettings diary={diary} setDiary={setDiary} isVisible={areSettingsVisible} />
    </View>
  )
}

type DiarySettingsType = {
  diary: diaryTypes.DiaryType
  setDiary: any
  isVisible: boolean
}

export const DiarySettings: React.FC<DiarySettingsType> = props => {
  const { diary, setDiary } = props

  const onChangeSetting = (settingString, value?: any) => {
    let newSettings = { ...diary.settings }
    console.log("value", value)
    newSettings[settingString] = value ? value : !newSettings[settingString]
    console.log(newSettings)
    setDiary({ ...diary, settings: { ...newSettings } })
  }

  if (!props.isVisible) return <View></View>
  return (
    <View>
      <DiarySettingRow
        settingName="Track weight"
        settingValue={diary.settings.showWeight}
        onChange={() => onChangeSetting("showWeight")}
      />
      <DiarySettingRow
        settingName="Track calories"
        settingValue={diary.settings.showCalories}
        onChange={() => onChangeSetting("showCalories")}
      />
      <DiarySettingRow
        settingName="Track protein"
        settingValue={diary.settings.showProtein}
        onChange={() => onChangeSetting("showProtein")}
      />
    </View>
  )
}
const DiarySettingRow = ({ settingName, settingValue, onChange }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Checkbox
        status={settingValue ? "checked" : "unchecked"}
        onPress={onChange}
        color={colors.blue3}
      />
      <Text>{settingName}</Text>
    </View>
  )
}
