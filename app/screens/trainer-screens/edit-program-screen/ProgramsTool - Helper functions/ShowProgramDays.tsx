import React, { useState, useEffect, useCallback } from "react"
import { View, FlatList, Pressable, Text, StyleSheet } from "react-native"

import { Button } from "react-native-paper"
import DraggableFlatList from "react-native-draggable-flatlist"
import { observer } from "mobx-react-lite"
import { onPatch, onSnapshot } from "mobx-state-tree"
import { YouTubeStandaloneAndroid } from "react-native-youtube"
import _ from "lodash"

import { useStores } from "../../../../models/root-store"
import { IProgram } from "../../../../models/sub-stores"

import { YOUTUBE_API_KEY } from "../Constants/DatabaseConstants"
import { getVideoID, getVideoTime } from "./smallFunctions"
import iStyles from "../Constants/Styles"
import { ShowExercise, EditableText, ClientName } from "./index"

type state = {
  currentWeekIndex: number
  currentDayIndex: number
  locked: boolean
}

type HeaderProps = {
  program: IProgram
  state: state
  onChangeWeek: Function
  onChangeProgramName: Function
}

export const ProgramViewHeadeer: React.FunctionComponent<HeaderProps> = observer(props => {
  const { program } = props
  const { currentWeekIndex, currentDayIndex } = props.state
  return (
    <View>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <EditableText
          textStyle={{ ...iStyles.text1, fontSize: 21 }}
          onEnd={(newValue: string) => props.onChangeProgramName(newValue)}
        >
          {program.Name}
        </EditableText>
        {/* <Button
            onPress={settingsPressedHandler}
            icon="cog"
            compact={true}
            style={iStyles.mediumRoundIcon}>
            {''}
          </Button> */}
        <View style={{ flexDirection: "row" }}>
          <Button icon="arrow-left" compact={true} onPress={() => props.onChangeWeek("decrease")}>
            {""}
          </Button>
          <Text style={iStyles.text1}>Week {currentWeekIndex + 1}</Text>
          <Button icon="arrow-right" compact={true} onPress={() => props.onChangeWeek("increase")}>
            {""}
          </Button>
          {/* <ClientName
            client={store.getClient(currentProgram.ClientID)}
            // client={{Name: 'Iwo'}}
            style={{ ...iStyles.text2 }}
            allClients={store.userData.Clients}
            onChange={clientID => dispatch({ type: "change client", value: clientID })}
          /> */}
        </View>
      </View>
    </View>
  )
})

type ShowProgramDaysModes = "oneDay" | "allDays"

type ShowProgramDaysProps = {
  program: any
  programID: string
  state: state
  mode: ShowProgramDaysModes
}

export const ShowProgramDays: React.FunctionComponent<ShowProgramDaysProps> = observer(props => {
  const { program } = props
  const { programID } = props
  const { currentWeekIndex, currentDayIndex, locked } = props.state
  const { mode } = props
  const exercisesStore = useStores().exerciseDataStore
  const programsStore = useStores().trainingProgramsStore

  let doneTextStyle = iStyles.greyText
  let dayDone = false
  if (program.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted) dayDone = true

  const viewVideoHandler = exercise => {
    let youTubeLink = exercisesStore.getExerciseYouTubeLink(exercise.Name)
    YouTubeStandaloneAndroid.playVideo({
      apiKey: YOUTUBE_API_KEY, //
      videoId: getVideoID(youTubeLink),
      autoplay: true,
      lightboxMode: true,
      startTime: getVideoTime(youTubeLink),
    })
      .then(() => console.log("Standalone Player Exited"))
      .catch(errorMessage => console.error(errorMessage))
  }
  if (mode === "oneDay") {
    const renderExercises = ({ item, index }) => {
      let exercise = { ...item }
      dayDone ? (exercise.isExpanded = false) : (exercise.isExpanded = !locked)

      return (
        <View>
          <ShowExercise
            //   onPressIn={onDragStartHandler}
            //   onPressPosition={onEditPositionHandler}
            textStyle={dayDone ? doneTextStyle : null}
            // item={exercise}
            item={exercise}
            //   onPressExercise={() =>
            //     dispatch({
            //       type: 'expand exercise info',
            //       value: index,
            //     })
            //   }
            //   onDeleteExercise={onDeleteHandler}
            //   onPressSetsAndReps={onEditSetsRepsHandler}
            //   isDragged={isActive}
            showDeleteButton={false}
            isClickable={!locked}
            onViewVideo={() => viewVideoHandler(exercise)}
          />
        </View>
      )
    }

    return (
      <View>
        {dayDone && (
          <View style={{ alignItems: "center" }}>
            <Text>Day completed</Text>
          </View>
        )}

        <FlatList
          //   data={program.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises}
          data={program.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises}
          renderItem={renderExercises}
          keyExtractor={(item, index) => `${item.Name}-${index}`}
        />
      </View>
    )
  } else return <View></View>
})
