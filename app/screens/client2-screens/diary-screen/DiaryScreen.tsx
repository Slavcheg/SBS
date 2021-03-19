import React, { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { Button, TextInput } from "react-native-paper"
import firestore from "@react-native-firebase/firestore"

import { Text } from "../../../screens/trainer-screens/edit-program-screen/ProgramsTool - Helper functions/smallWrappers"
import { useGlobalState, getState } from "../../../components3/globalState/global-state-regular"
import { ShowDiaryDays, DiarySettingsButton, WeightGraph } from "./Components"
import { DiaryType, defaultSettings } from "./diaryTypes"

const downloadDiary = (diaryID: string, onDownload: any) => {
  firestore()
    .collection("diaries")
    .doc(diaryID)
    .get()
}

export const DiaryScreen = props => {
  const { navigation, route } = props

  const [globalState, setGlobalState] = useGlobalState()
  const [diary, setDiary] = useState<DiaryType>()

  useEffect(() => {
    getState(setGlobalState)
  }, [])

  useEffect(() => {
    if (globalState.loggedUser.ID) getDiary()
  }, [globalState])

  const getDiary = () => {
    console.log(route.params)
    if (route.params.diaryID === globalState.loggedUser.ID)
      globalState.userDiary.settings
        ? setDiary(globalState.userDiary)
        : setDiary({ ...globalState.userDiary, settings: { ...defaultSettings } })
  }

  return (
    <ScrollView>
      {!diary && <Text>Дневникът не е открит</Text>}
      {diary && (
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text>
              Дневникът на {diary.Name} {diary.FamilyName}
            </Text>
            <DiarySettingsButton diary={diary} setDiary={setDiary} />
          </View>
          <WeightGraph diary={diary} />
          <ShowDiaryDays diary={diary} setDiary={setDiary} />
        </View>
      )}
    </ScrollView>
  )
}
