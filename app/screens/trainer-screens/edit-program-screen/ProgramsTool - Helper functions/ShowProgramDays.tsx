import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ScrollView,
  ScrollViewComponent,
} from "react-native"

import { Button, Portal, Modal, TextInput, Checkbox } from "react-native-paper"
import DraggableFlatList from "react-native-draggable-flatlist"
import { observer } from "mobx-react-lite"
import { onPatch, onSnapshot } from "mobx-state-tree"
import { YouTubeStandaloneAndroid } from "react-native-youtube"
import _ from "lodash"

import {
  return_todays_datestamp,
  displayDateFromTimestamp,
  border_boxes,
  getStampFromDate,
  displayDateFromTimestamp2,
} from "../../../../global-helper"

import { useStores } from "../../../../models/root-store"
import { IProgram, state } from "../../../../models/sub-stores"

import { imgs } from "../../../../assets"

import { YOUTUBE_API_KEY } from "../Constants/DatabaseConstants"
import { getVideoID, getVideoTime, getColorByExercisePosition } from "./smallFunctions"
import iStyles from "../Constants/Styles"
import {
  ShowExercise,
  EditableText,
  ClientName,
  ShowDayName,
  ToggleButton,
  ImageBackgroundToggle,
  ShowProgramMoreInfo,
  DayCompletedCheckbox,
  DaysBox,
} from "./index"

type HeaderProps = {
  state: state
  onChangeWeek: Function
  onChangeProgramName: Function
  onChangeClient: Function
  onAddWeek?: Function
  onRemoveWeek?: Function
}

export const ProgramViewHeader: React.FunctionComponent<HeaderProps> = observer(props => {
  const { currentWeekIndex, currentDayIndex, currentProgram, deselectAllDays } = props.state
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
            <Button
              icon="arrow-left"
              compact={true}
              onPress={() => props.onChangeWeek({ type: "decrease" })}
            >
              {""}
            </Button>
            <DaysBox
              state={props.state}
              program={currentProgram}
              onPressDay={(weekIndex, dayIndex) =>
                props.onChangeWeek({ type: "custom", weekValue: weekIndex, dayValue: dayIndex })
              }
              editWeeks={true}
              onAddWeek={props.onAddWeek}
              onRemoveWeek={props.onRemoveWeek}
            />
            <Button
              icon="arrow-right"
              compact={true}
              onPress={() => props.onChangeWeek({ type: "increase" })}
            >
              {""}
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
})

type ShowProgramDaysModes = "oneDay" | "allDays" | "smallPreview"

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
  onReplaceExercise?: Function
  onToggleReorder?: Function
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
    onReplaceExercise,
    onToggleReorder,
  } = props

  const { currentProgram, currentWeekIndex, currentDayIndex, locked } = props.state
  const [isDayShown, setIsDayShown] = useState([])

  useEffect(() => {
    const initialState = []
    currentProgram.Weeks[currentWeekIndex].Days.map((day, dayindex) => {
      isDayShown[dayindex] === false
        ? (initialState[dayindex] = false)
        : (initialState[dayindex] = true)
    })
    setIsDayShown(initialState)
  }, [currentProgram.Weeks[currentWeekIndex].Days.length])

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

  const isDayShownHandler = dayIndex => {
    const tempData = [...isDayShown]
    tempData[dayIndex] = !tempData[dayIndex]
    setIsDayShown([...tempData])
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
            textStyle={dayDone ? doneTextStyle : {}}
            // item={exercise}
            item={exercise}
            //   onPressExercise={() =>
            //     dispatch({
            //       type: 'expand exercise info',
            //       value: index,
            //     })
            //   }
            //   onDeleteExercise={onDeleteExerciseHandler}
            onPressSetsAndReps={() => onEditSetsRepsHandler(index)}
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
            <Text>
              Day completed on{" "}
              {displayDateFromTimestamp2(
                currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].completedOn,
              )}
            </Text>
          </View>
        )}

        <FlatList
          data={currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].Exercises}
          renderItem={renderExercises}
          keyExtractor={(item, index) => `${item.Name}-${index}`}
        />
      </View>
    )
  } else if (mode === "smallPreview") {
    const renderExercises = ({ item, index }) => {
      let exercise = { ...item, isExpanded: false }

      return (
        <View>
          <ShowExercise
            //   onPressIn={onDragStartHandler}
            //   onPressPosition={onEditPositionHandler}
            textStyle={{ fontSize: 14 }}
            item={exercise}
            showDeleteButton={false}
            isClickable={false}
            onViewVideo={() => viewVideoHandler(exercise)}
          />
        </View>
      )
    }

    const renderHeader = DayName => {
      return <Text>{DayName}</Text>
    }

    return (
      <View>
        {currentProgram.Weeks[currentWeekIndex].Days.map((day, dayindex) => {
          return (
            <FlatList
              key={dayindex}
              data={currentProgram.Weeks[currentWeekIndex].Days[dayindex].Exercises}
              renderItem={renderExercises}
              keyExtractor={(item, index) => `${item.Name}-${index}`}
              ListHeaderComponent={() => renderHeader(day.DayName)}
            />
          )
        })}
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
            if (dayindex === currentDayIndex && !props.state.deselectAllDays) {
              backgroundColor = "lightcyan" // lightcyan azure aliceblue ivory whitesmoke
              isCurrent = true
            } else isCurrent = false
            // if (currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted)
            //   backgroundColor = "lavender"
            return (
              <Pressable
                key={`${dayindex}+${day.Exercises.length}`}
                onPress={() => {
                  onChangeDay(dayindex)
                }}
                // disabled={true}
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
                    {/* <Checkbox
                      color={iStyles.text1.color}
                      status={
                        currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted
                          ? "checked"
                          : "unchecked"
                      }
                      // disabled={props.state.locked}
                      onPress={() => props.onToggleDayCompleted(dayindex)}
                    /> */}
                    <DayCompletedCheckbox
                      isCompleted={
                        currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted
                      }
                      currentDate={
                        currentProgram.Weeks[currentWeekIndex].Days[dayindex].completedOn
                      }
                      onToggle={newDate => props.onToggleDayCompleted(dayindex, newDate)}
                      color={iStyles.text1.color}
                    />
                    {/* <Button
                      icon="arrow-split-horizontal"
                      onPress={() => isDayShownHandler(dayindex)}
                    ></Button> */}
                    <ToggleButton
                      icon="arrow-split-horizontal"
                      onPress={() => isDayShownHandler(dayindex)}
                      status={isDayShown[dayindex]}
                      color={iStyles.text1.color}
                      style={iStyles.mediumRoundIcon}
                      compact={true}
                    ></ToggleButton>
                    <ToggleButton
                      icon="swap-vertical-bold"
                      onPress={onToggleReorder}
                      status={state.isReordering}
                      color={iStyles.text1.color}
                      style={iStyles.mediumRoundIcon}
                      compact={true}
                    ></ToggleButton>
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
                    <View
                      style={{
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        flex: 1,
                        flexDirection: "row",
                      }}
                    >
                      {dayindex === 0 && (
                        <View style={{ flexDirection: "row" }}>
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
                    </View>
                    {/* <ShowWeekName
                            index={currentWeekIndex}
                            isCurrent={isCurrent}
                            onPress={() => onChangeDay(dayindex)}
                          /> */}
                  </View>
                  {currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted && (
                    <Text style={{ textAlign: "center" }}>
                      Day completed on{" "}
                      {displayDateFromTimestamp2(
                        currentProgram.Weeks[currentWeekIndex].Days[dayindex].completedOn,
                      )}
                    </Text>
                  )}
                  <View style={{ flex: 1 }}>
                    <ImageBackgroundToggle
                      imageURL={imgs.rotate}
                      status={
                        state.isReordering && isCurrent && props.state.deselectAllDays !== true
                      }
                      opacity={0.25}
                    >
                      {isDayShown[dayindex] && (
                        <ShowDayExercises
                          exercises={
                            currentProgram.Weeks[currentWeekIndex].Days[dayindex].Exercises
                          }
                          isActive={isCurrent && props.state.deselectAllDays !== true}
                          state={state}
                          onDragEndHandler={onDragEndHandler}
                          onDeleteExerciseHandler={onDeleteExerciseHandler}
                          onEditPositionHandler={onEditPositionHandler}
                          onEditSetsRepsHandler={onEditSetsRepsHandler}
                          onExpandExerciseInfo={onExpandExerciseInfo}
                          onViewVideo={exercise => viewVideoHandler(exercise)}
                          onReplaceExercise={onReplaceExercise}
                          dayIndex={dayindex}
                        />
                      )}
                    </ImageBackgroundToggle>
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
  onReplaceExercise: Function
  dayIndex?: number
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
    onReplaceExercise,
  } = props

  const { currentProgram, currentWeekIndex, currentDayIndex, currentExerciseIndex } = props.state

  const renderExercises = ({ item, index, drag, isActive }, isClickable, isDraggable) => {
    let textStyle = {
      color: getColorByExercisePosition(item.Position),
      fontSize: isActive ? 20 : 18,
    }

    return (
      <ShowExercise
        onPressIn={() => {
          console.log("tried dragging")
          if (isDraggable) drag()
        }}
        onPressPosition={() => onEditPositionHandler(index)}
        textStyle={textStyle}
        item={item}
        onPressExercise={() => onExpandExerciseInfo(index)}
        onDeleteExercise={() => onDeleteExerciseHandler(index)}
        onPressSetsAndReps={() => onEditSetsRepsHandler(index)}
        onPressReplace={() => onReplaceExercise(index)}
        isDragged={isActive}
        isClickable={isClickable}
        onViewVideo={() => onViewVideo(item)}
        showVolume={true}
        isGreyedOut={
          currentProgram.Weeks[currentWeekIndex].Days[props.dayIndex].isCompleted || false
        }
      />
    )
  }

  if (exercises.length === 0)
    return (
      <View>
        <Text style={{ color: "grey", fontSize: 18 }}>Избери си упражнение от горе</Text>
      </View>
    )

  if (isActive && state.isReordering)
    return (
      <DraggableFlatList
        data={exercises}
        renderItem={({ item, index, drag, isActive }) =>
          renderExercises({ item, index, drag, isActive }, true, state.isReordering)
        }
        scrollEnabled={false}
        initialNumToRender={20}
        keyExtractor={(item: any, index) => `${item.ID}-${index}`}
        onDragEnd={({ data }) => onDragEndHandler(data)}
      />
    )
  else if (isActive)
    return (
      <FlatList
        data={exercises}
        renderItem={({ item, index, drag, isActive }) =>
          renderExercises({ item, index, drag, isActive }, true, state.isReordering)
        }
        scrollEnabled={false}
        initialNumToRender={20}
        keyExtractor={(item, index) => `${item.ID}-${index}`}

        // getItemLayout={(data, index) => ({
        //   length: EXERCISE_ITEM_HEIGHT,
        //   offset: EXERCISE_ITEM_HEIGHT * index,
        //   index,
        // })}
      />
    )
  else
    return (
      <FlatList
        data={exercises}
        renderItem={({ item, index, drag, isActive }) =>
          renderExercises({ item, index, drag, isActive }, false, false)
        }
        scrollEnabled={false}
        initialNumToRender={20}
        keyExtractor={(item, index) => `${item.ID}-${index}`}
      />
    )
}
