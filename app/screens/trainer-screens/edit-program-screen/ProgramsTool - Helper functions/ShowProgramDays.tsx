import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  FlatList,
  Pressable,
  // Text,
  StyleSheet,
  ScrollView,
  ScrollViewComponent,
  Dimensions,
} from "react-native"

import { useGlobalState } from "../../../../models/global-state-regular"
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

import { imgs } from "../../../../assets"

import { YOUTUBE_API_KEY } from "../Constants/DatabaseConstants"
import { getVideoID, getVideoTime, getColorByExercisePosition } from "./smallFunctions"
import iStyles from "../Constants/Styles"
import { icons, colors, fonts } from "../Constants/"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

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
  TextWithInfoBaloon,
  SmallIconButton,
  DeleteButton,
  Text,
} from "./index"
import { TouchableOpacity } from "react-native-gesture-handler"
import { MediumButtonIcon } from "./smallComponents"

type HeaderProps = {
  state: any
  onChangeWeek: Function
  onChangeProgramName: Function
  onChangeClient: Function
  onAddWeek?: Function
  onRemoveWeek?: Function
  onPressCopy?: Function
}

export const ProgramViewHeader: React.FunctionComponent<HeaderProps> = observer(props => {
  const { currentWeekIndex, currentDayIndex, currentProgram, deselectAllDays } = props.state
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{ fontSize: 23, fontFamily: fonts.jost.semi_bold, textAlignVertical: "bottom" }}
        >
          Трениращ:
        </Text>
        <ClientName
          clientID={currentProgram.Client}
          style={{
            fontSize: 20,
            fontFamily: fonts.jost.semi_bold,
            color: colors.grey1,
            textAlignVertical: "top",
          }}
          onChange={clientID => props.onChangeClient(clientID)}
        />
      </View>
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
          <View
            style={{
              flexDirection: "row",
              width: windowWidth,
              justifyContent: "space-between",
            }}
          >
            {/* <Button
              icon="arrow-left"
              compact={true}
              onPress={() => props.onChangeWeek({ type: "decrease" })}
              color={iStyles.text3.color}
            >
              {""}
            </Button> */}

            <DaysBox
              state={props.state}
              program={currentProgram}
              onPressDay={(weekIndex, dayIndex) =>
                props.onChangeWeek({ type: "custom", weekValue: weekIndex, dayValue: dayIndex })
              }
              editWeeks={true}
              onAddWeek={props.onAddWeek}
              onRemoveWeek={props.onRemoveWeek}
              mode="week only"
              onPressLeft={() => props.onChangeWeek({ type: "decrease" })}
              onPressRight={() => props.onChangeWeek({ type: "increase" })}
              headerStyle={{ height: 45 }}
            />

            {/* <Button
              icon="arrow-right"
              compact={true}
              onPress={() => props.onChangeWeek({ type: "increase" })}
              color={iStyles.text3.color}
            ></Button> */}
            <View style={{ width: 10 }}></View>
            <View
              style={{
                backgroundColor: colors.blue_transparent,
                height: 45,
                flex: 1,
              }}
            >
              <TouchableOpacity onPress={props.onPressCopy}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MediumButtonIcon
                    icon={icons.copy}
                    onPress={props.onPressCopy}
                    color={colors.grey1}
                  ></MediumButtonIcon>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, color: colors.black }}>
                      Копирай от друга програма
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
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
  onAddExercise?: Function
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

  const [globalState, setGlobalState] = useGlobalState()

  let doneTextStyle = iStyles.greyText
  let dayDone = false

  const viewVideoHandler = exercise => {
    const ex = globalState.allExercises.find(ex => ex.ID === exercise.ID)
    if (!ex) console.log("exercise not found")
    else {
      const videoLink = ex.YouTubeLink
      YouTubeStandaloneAndroid.playVideo({
        apiKey: YOUTUBE_API_KEY, //
        videoId: getVideoID(videoLink),
        autoplay: true,
        lightboxMode: true,
        startTime: getVideoTime(videoLink),
      })
        .then(() => console.log("Standalone Player Exited"))
        .catch(errorMessage => console.error(errorMessage))
    }
  }

  const isDayShownHandler = dayIndex => {
    const tempData = [...isDayShown]
    tempData[dayIndex] = !tempData[dayIndex]
    setIsDayShown([...tempData])
  }

  if (mode === "oneDay") {
    if (currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex].isCompleted) dayDone = true
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
            <Text style={{ color: iStyles.text0.color }}>
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
              listKey={`${dayindex.toString()}+${currentProgram.Name}+${
                currentProgram.Client
              }+${Math.random().toString()}`}
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
            let exercises = day.Exercises
            // let exercises = currentProgram.Weeks[currentWeekIndex].Days[0].Exercises
            let moreINfoExpanded = false //flag for whether expand arrow to point up or down
            if (exercises.length > 0) if (exercises[0].isExpanded) moreINfoExpanded = true
            let backgroundColor = iStyles.backGround
            if (dayindex === currentDayIndex && !props.state.deselectAllDays) {
              // backgroundColor = "lightcyan" // lightcyan azure aliceblue ivory whitesmoke
              backgroundColor = iStyles.backGround // lightcyan azure aliceblue ivory whitesmoke
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
                disabled={true}
              >
                <View
                  style={{
                    // borderWidth: 2,
                    // minHeight: 50,
                    //ghostwhite azure aliceblue mintcream
                    // height: isProgramViewBig ? '100%' : 200,
                    width: "100%",
                    backgroundColor: backgroundColor,
                    marginVertical: 5,
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
                    {/* {isCurrent && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      > */}

                    {/* </View>
                    )} */}
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

                    {/* <Button
                      icon="arrow-split-horizontal"
                      onPress={() => isDayShownHandler(dayindex)}
                    ></Button> */}
                    <ToggleButton
                      icon={icons.chevronUp}
                      iconFalse={icons.chevronDown}
                      onPress={() => isDayShownHandler(dayindex)}
                      status={isDayShown[dayindex]}
                      color={iStyles.text1.color}
                      style={iStyles.mediumRoundIcon}
                      compact={true}
                      labelStyle={{ fontSize: iStyles.mediumRoundIcon.height }}
                    ></ToggleButton>
                    <ToggleButton
                      icon={icons.chevron_left_right}
                      onPress={() => onToggleReorder(dayindex)}
                      status={state.isReordering}
                      color={iStyles.text1.color}
                      style={iStyles.mediumRoundIcon}
                      compact={true}
                      labelStyle={{ fontSize: iStyles.mediumRoundIcon.height }}
                      disabled={!isDayShown[dayindex]}
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
                      {/* {dayindex === 0 && ( */}
                      <View style={{ flexDirection: "row" }}>
                        {/* <Button
                            style={iStyles.mediumRoundIcon}
                            icon={arrowIcon}
                            color={iStyles.text3.color}
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
                          </Button> */}
                        <ToggleButton
                          icon={icons.arrow_collapse_vertical}
                          iconFalse={icons.arrow_expand_vertical}
                          onPress={props.onExpandMoreInfoAllExercises}
                          status={moreINfoExpanded}
                          color={iStyles.text1.color}
                          style={iStyles.mediumRoundIcon}
                          compact={true}
                          labelStyle={{ fontSize: iStyles.mediumRoundIcon.height }}
                          disabled={!isDayShown[dayindex]}
                        ></ToggleButton>
                      </View>
                      {/* )} */}
                      <DayCompletedCheckbox
                        isCompleted={
                          currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted || false
                        }
                        currentDate={
                          currentProgram.Weeks[currentWeekIndex].Days[dayindex].completedOn
                        }
                        onToggle={newDate => props.onToggleDayCompleted(dayindex, newDate)}
                        color={colors.green3}
                      />
                      <DeleteButton onPress={() => props.onRemoveDay(dayindex)} forever={true} />
                    </View>
                    {/* <ShowWeekName
                            index={currentWeekIndex}
                            isCurrent={isCurrent}
                            onPress={() => onChangeDay(dayindex)}
                          /> */}
                  </View>
                  {/* {currentProgram.Weeks[currentWeekIndex].Days[dayindex].isCompleted &&
                    isDayShown[dayindex] && (
                      <Text style={{ textAlign: "center", color: iStyles.text0.color }}>
                        Day completed on{" "}
                        {displayDateFromTimestamp2(
                          currentProgram.Weeks[currentWeekIndex].Days[dayindex].completedOn,
                        )}
                      </Text>
                    )} */}
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
                          exercises={day.Exercises}
                          // exercises={
                          //   currentProgram.Weeks[currentWeekIndex].Days[dayindex].Exercises
                          // }
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
                    {isDayShown[dayindex] && (
                      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Button
                          mode="outlined"
                          compact={true}
                          color={colors.green2}
                          style={{ width: "60%" }}
                          onPress={() => props.onAddExercise(dayindex, state.currentWeekIndex)}
                        >
                          + упражнение
                        </Button>
                        {dayindex === currentProgram.Weeks[currentWeekIndex].Days.length - 1 ? (
                          <Button
                            icon="plus-circle"
                            mode={"outlined"}
                            // compact={true}
                            color={colors.blue3}
                            // style={iStyles.mediumRoundIcon}
                            style={{ width: 100 }}
                            onPress={props.onAddNewDay}
                          >
                            {" "}
                            ден{" "}
                          </Button>
                        ) : (
                          <View style={{ width: 100 }}></View>
                        )}
                      </View>
                    )}
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
    dayIndex,
  } = props

  const { currentProgram, currentWeekIndex, currentDayIndex, currentExerciseIndex } = props.state

  const renderExercises = ({ item, index, drag, isActive }, isClickable, isDraggable) => {
    let textStyle = {
      color: getColorByExercisePosition(item.Position),
      fontSize: isActive ? 20 : 18,
    }

    let oldExercise
    state.oldExercises.forEach((oldEx, oldExIndex) => {
      if (oldEx.Name === item.Name) {
        oldExercise = oldEx
      }
    })

    return (
      <ShowExercise
        onPressIn={() => {
          console.log("tried dragging")
          if (isDraggable) drag()
        }}
        onPressPosition={() => onEditPositionHandler(index, dayIndex)}
        textStyle={textStyle}
        item={item}
        onPressExercise={() => onExpandExerciseInfo(index, dayIndex)}
        onDeleteExercise={() => onDeleteExerciseHandler(index, dayIndex)}
        onPressSetsAndReps={() => onEditSetsRepsHandler(index, dayIndex)}
        onPressReplace={() => onReplaceExercise(index, dayIndex)}
        isDragged={isActive}
        isClickable={isClickable}
        onViewVideo={() => onViewVideo(item)}
        showVolume={true}
        isGreyedOut={currentProgram.Weeks[currentWeekIndex].Days[dayIndex].isCompleted || false}
        showDoneBefore={true}
        oldExercise={oldExercise}
      />
    )
  }

  if (exercises.length === 0)
    return (
      <View>
        <Text style={{ color: "grey", fontSize: 18 }}>В този ден все още няма упражнения</Text>
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
          renderExercises({ item, index, drag, isActive }, true, false)
        }
        scrollEnabled={false}
        initialNumToRender={20}
        keyExtractor={(item, index) => `${item.ID}-${index}`}
      />
    )
}
