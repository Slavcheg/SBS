import { useFocusEffect } from "@react-navigation/core"
import React, { useEffect, useState } from "react"
import { View, FlatList, Pressable } from "react-native"

import {
  getState,
  useGlobalState,
  Text,
  Button,
  DefaultHeader,
  useGlobalState3,
  T_Global_State,
  T_Program,
} from "../../../components3"

export const ChooseProgramScreen = props => {
  const { state, dispatch } = useGlobalState3()
  const [refresh, setRefresh] = useState(false)

  const backHandler = () => {
    props.navigation.goBack()
  }

  const renderPrograms = ({ item, index }: { item: T_Program; index: number }) => {
    return (
      <Pressable onPress={() => onPressProgram(item)}>
        <View>
          <Text>{item.Name}</Text>
        </View>
      </Pressable>
    )
  }

  const onPressProgram = (program: T_Program) => {
    console.log(program.ID)
  }

  return (
    <View>
      <DefaultHeader mainText={"тренировъчни програми"} onPressLeft={backHandler} />
      <ShowBasicInfo gState={state} />
      <FlatList data={state.programs || []} keyExtractor={(item, index) => `${item.ID}+${index}`} renderItem={renderPrograms} />
    </View>
  )
}

const ShowBasicInfo = ({ gState }) => {
  const state: T_Global_State = gState
  const allEx = state.exercises && state.exercises.allExercises ? state.exercises.allExercises.length : 0
  const globalEx = state.exercises && state.exercises.downloadedGlobal ? state.exercises.downloadedGlobal.length : 0
  const personalEx = state.exercises && state.exercises.downloadedPersonal ? state.exercises.downloadedPersonal.length : 0

  return (
    <View>
      <Text>{`${state.loggedUser ? `logged in ${state.loggedUser.Name}` : "not logged in"}`}</Text>
      <Text>{`exercises ${allEx} ${globalEx} ${personalEx}`}</Text>
      <Text>{`programs ${state.programs ? state.programs.length : "0"}`}</Text>
    </View>
  )
}
