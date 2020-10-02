import React, { useState, useEffect, useCallback } from "react"
import { View, FlatList, Pressable, Text, StyleSheet, ScrollView } from "react-native"

import { Button, Portal, Modal, TextInput, Checkbox } from "react-native-paper"
import DraggableFlatList from "react-native-draggable-flatlist"
import { observer } from "mobx-react-lite"
import { onPatch, onSnapshot } from "mobx-state-tree"
import { YouTubeStandaloneAndroid } from "react-native-youtube"
import _ from "lodash"

import { useStores } from "../../../../models/root-store"
import { IProgram, state } from "../../../../models/sub-stores"

import { YOUTUBE_API_KEY } from "../Constants/DatabaseConstants"
import { getVideoID, getVideoTime, getColorByExercisePosition } from "./smallFunctions"
import iStyles from "../Constants/Styles"
import { ShowExercise, EditableText, ClientName, ShowDayName } from "./index"

type HeaderProps = {
  state: state
  onChangeWeek: Function
  onChangeProgramName: Function
  onChangeClient: Function
}

export const ProgramViewHeader: React.FunctionComponent<HeaderProps> = observer(props => {
  const { currentWeekIndex, currentDayIndex, currentProgram } = props.state
  return (
    <View>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        {/* <EditableText
          textStyle={{ ...iStyles.text1, fontSize: 21 }}
          onEnd={(newValue: string) => props.onChangeProgramName(newValue)}
        >
          {currentProgram.Name}
        </EditableText> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <ClientName
            clientID={currentProgram.Client}
            style={{ ...iStyles.text2 }}
            onChange={clientID => props.onChangeClient(clientID)}
          />
          <View style={{ flexDirection: "row" }}>
            <Button icon="arrow-left" compact={true} onPress={() => props.onChangeWeek("decrease")}>
              {""}
            </Button>
            <Text style={iStyles.text1}>Week {currentWeekIndex + 1}</Text>
            <Button
              icon="arrow-right"
              compact={true}
              onPress={() => props.onChangeWeek("increase")}
            >
              {""}
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
})

type ShowProgramDaysModes = "oneDay" | "allDays"

type ShowProgramDaysProps = {
  state: state
  mode: ShowProgramDaysModes
  onChangeDay?: Function
  onChangeDayName?: Function
  onAddNewDay?: Function
  onRemoveDay?: Function
  onToggleDayCompleted?: Function
  onExpandMoreInfoAllExercises?: Function
  onDragEndHandler?: Function
  onDeleteExerciseHandler?: Function
  onEditPositionHandler?: Function
  onEditSetsRepsHandler?: Function
  onExpandExerciseInfo?: Function
}

export const ShowProgramDays: React.FunctionComponent<ShowProgramDaysProps> = observer(props => {
  const {
    state,
    onChangeDay,
    onChangeDayName,
    onDragEndHandler,
    onDeleteExerciseHandler,
    onEditPositionHandler,
    onEditSetsRepsHandler,
    onExpandExerciseInfo,
    mode,
  } = props

  const { currentProgram, currentWeekIndex, currentDayIndex, locked } = props.state

  const exercisesStore = useStores().exerciseDataStore

  let doneTextStyle = iStyles.greyText
  let dayDone = false
  if (currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted) dayDone = true

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
            //   onDeleteExercise={onDeleteExerciseHandler}
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
          data={currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises}
          renderItem={renderExercises}
          keyExtractor={(item, index) => `${item.Name}-${index}`}
        />
      </View>
    )
  } else if (mode === "allDays") {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {currentProgram.Weeks[currentWeekIndex].Days.map((day, dayindex) => {
            let isCurrent = false
            let exercises = currentProgram.Weeks[currentWeekIndex].Days[0].Exercises
            let moreINfoExpanded = false //flag for whether expand arrow to point up or down
            if (exercises.length > 0) if (exercises[0].isExpanded) moreINfoExpanded = true
            let arrowIcon = moreINfoExpanded ? "arrow-expand-up" : "arrow-expand-down"
            let backgroundColor = "white"
            if (dayindex === currentDayIndex) {
              backgroundColor = "lightcyan"
              isCurrent = true
            } else isCurrent = false
            if (currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted)
              backgroundColor = "lavender"
            return (
              <Pressable
                key={`${dayindex}+${day.Exercises.length}`}
                onPress={() => {
                  onChangeDay(dayindex)
                }}
              >
                <View
                  style={{
                    // borderWidth: 2,
                    // minHeight: 50,
                    //ghostwhite azure aliceblue mintcream
                    // height: isProgramViewBig ? '100%' : 200,
                    width: "100%",
                    backgroundColor: backgroundColor,
                    // maxHeight: "80%",
                    // flexDirection: 'row',
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <ShowDayName
                      key={dayindex}
                      onPress={() => onChangeDay(dayindex)}
                      day={currentProgram.Weeks[currentWeekIndex].Days[dayindex]}
                      isCurrent={isCurrent}
                      onEdit={newDayName => onChangeDayName(newDayName, dayindex)}
                    />
                    {isCurrent && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          icon="plus-circle"
                          mode={"contained"}
                          compact={true}
                          color={iStyles.text2.color}
                          style={iStyles.mediumRoundIcon}
                          onPress={props.onAddNewDay}
                        >
                          {""}
                        </Button>
                        <Button
                          icon="trash-can-outline"
                          mode={"contained"}
                          compact={true}
                          color="red"
                          style={iStyles.mediumRoundIcon}
                          onPress={() => props.onRemoveDay(dayindex)}
                        >
                          {""}
                        </Button>
                      </View>
                    )}
                    <Checkbox
                      color={iStyles.text1.color}
                      status={
                        currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted
                          ? "checked"
                          : "unchecked"
                      }
                      // disabled={props.state.locked}
                      onPress={() => props.onToggleDayCompleted(dayindex)}
                    />
                    {/* {currentProgram.Weeks[currentWeekIndex].Days[dayindex]
                            .isCompleted && (
                            <View style={{marginLeft: 10}}>
                              <Text
                                style={{
                                  textAlign: 'right',
                                  color: 'grey',
                                  fontSize: 18,
                                }}>
                                Направена
                              </Text>
                            </View>
                          )} */}
                    {dayindex === 0 && (
                      <View
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                          flex: 1,
                        }}
                      >
                        <Button
                          icon={arrowIcon}
                          compact={true}
                          // onPress={() => {
                          //   dispatch({
                          //     type: "expand more info all exercises",
                          //     expand: !moreINfoExpanded,
                          //   })
                          // }}
                          onPress={props.onExpandMoreInfoAllExercises}
                        >
                          {""}
                        </Button>
                      </View>
                    )}
                    {/* <ShowWeekName
                            index={currentWeekIndex}
                            isCurrent={isCurrent}
                            onPress={() => onChangeDay(dayindex)}
                          /> */}
                  </View>
                  <View style={{ flex: 1 }}>
                    <ShowDayExercises
                      exercises={currentProgram.Weeks[currentWeekIndex].Days[dayindex].Exercises}
                      isActive={isCurrent}
                      state={state}
                      onDragEndHandler={onDragEndHandler}
                      onDeleteExerciseHandler={onDeleteExerciseHandler}
                      onEditPositionHandler={onEditPositionHandler}
                      onEditSetsRepsHandler={onEditSetsRepsHandler}
                      onExpandExerciseInfo={onExpandExerciseInfo}
                      onViewVideo={exercise => viewVideoHandler(exercise)}
                    />
                  </View>
                </View>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    )
  } else {
    return <View></View>
  }
})

type ShowDayExercisesProps = {
  exercises: any
  state: state
  onDragEndHandler: Function
  isActive: boolean
  onDeleteExerciseHandler: Function
  onEditPositionHandler: Function
  onExpandExerciseInfo: Function
  onEditSetsRepsHandler: Function
  onViewVideo: Function
}

const ShowDayExercises: React.FC<ShowDayExercisesProps> = props => {
  const {
    exercises,
    isActive,
    onDragEndHandler,
    state,
    onDeleteExerciseHandler,
    onEditPositionHandler,
    onExpandExerciseInfo,
    onEditSetsRepsHandler,
    onViewVideo,
  } = props

  const renderExercises = ({ item, index, drag, isActive }, isClickable) => {
    // const onEditPositionHandler = () => {
    //   let newPosition = item.Position;

    //   let exercises =
    //     currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex]
    //       .Exercises;
    //   // get position of last exercise and set as max for now
    //   let maxPosition = exercises[exercises.length - 1].Position;

    //   // get highest position compared to others
    //   exercises.forEach((exercise) => {
    //     if (exercise.Position > maxPosition)
    //       maxPosition = exercise.Position;
    //   });

    //   item.Position < 2 ? (newPosition = maxPosition + 1) : newPosition--;

    //   dispatch({
    //     type: 'change position number',
    //     value: newPosition,
    //     itemIndex: index,
    //   });
    // };

    // const onDragStartHandler = () => {
    //   drag();
    // };

    let textStyle = {
      color: getColorByExercisePosition(item.Position),
      fontSize: isActive ? 20 : 18,
    }

    return (
      <ShowExercise
        onPressIn={() => {
          console.log("tried dragging")
          drag()
        }}
        onPressPosition={() => onEditPositionHandler(index)}
        textStyle={textStyle}
        item={item}
        onPressExercise={() => onExpandExerciseInfo(index)}
        onDeleteExercise={() => onDeleteExerciseHandler(index)}
        onPressSetsAndReps={() => onEditSetsRepsHandler(index)}
        isDragged={isActive}
        isClickable={isClickable}
        onViewVideo={() => onViewVideo(item)}
        // onViewVideo={() => console.log('tried')}
      />
    )
  }

  if (exercises.length === 0)
    return (
      <View>
        <Text style={{ color: "grey", fontSize: 18 }}>Избери си упражнение от горе</Text>
      </View>
    )

  if (isActive)
    return (
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={exercises}
          renderItem={({ item, index, drag, isActive }) =>
            renderExercises({ item, index, drag, isActive }, true)
          }
          scrollEnabled={false}
          initialNumToRender={10}
          keyExtractor={(item: any, index) => `${item.ID}-${index}`}
          onDragEnd={({ data }) => onDragEndHandler(data)}
          // getItemLayout={(data, index) => ({
          //   length: EXERCISE_ITEM_HEIGHT,
          //   offset: EXERCISE_ITEM_HEIGHT * index,
          //   index,
          // })}
        />
      </View>
    )
  else
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={exercises}
          renderItem={({ item, index, drag, isActive }) =>
            renderExercises({ item, index, drag, isActive }, false)
          }
          scrollEnabled={false}
          initialNumToRender={10}
          keyExtractor={(item, index) => `${item.ID}-${index}`}
          // getItemLayout={(data, index) => ({
          //   length: EXERCISE_ITEM_HEIGHT,
          //   offset: EXERCISE_ITEM_HEIGHT * index,
          //   index,
          // })}
        />
      </View>
    )
}
