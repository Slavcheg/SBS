import { Button, Portal, Modal, TextInput, Checkbox } from "react-native-paper"

import React, { useState, useEffect, useReducer, FunctionComponent, ReactNode } from "react"

import { useStores } from "../../../../models/root-store"
import { Exercise, state } from "../../../../models/sub-stores"

import {
  View,
  Text,
  Button as ButtonOriginal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Pressable,
  useWindowDimensions,
  TextInput as TextInput2,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Modal as Modal2,
  Alert,
} from "react-native"

import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import _ from "lodash"
import { observer } from "mobx-react-lite"
import { translate } from "../../../../i18n"

import { GetText, getDoneBeforeColor } from "./index"
import iStyles from "../Constants/Styles"
import { muscleGroups } from "../Constants/MuscleGroups"

import {
  getColorByExercisePosition,
  getColorByMuscleName,
  ExpandCollapseButton,
  ExpandableContent,
  ShowProgramDays,
  TextWithInfoBaloon,
  MoreInfoBaloon,
  EditableText,
  PlusButton,
  TrashButton,
} from "./index"
// import StoreProvider, { StoreContext } from "../../StoreProvider"

import {
  return_todays_datestamp,
  displayDateFromTimestamp,
  border_boxes,
  getStampFromDate,
  displayDateFromTimestamp2,
} from "../../../../global-helper"

type ExerciseMoreInfoButtonsProps = {
  showVideo?: Boolean
  showDelete?: Boolean
  size?: Number
  onViewVideo?: Function
  isClickable?: Boolean
  onPressDelete?: Function
  onPressReplace?: Function
}

export const ExerciseMoreInfoButtons: React.FC<ExerciseMoreInfoButtonsProps> = props => {
  let fontSizeZ: Number
  let showVideo = props.showVideo === false ? false : true
  let showDelete = props.showDelete === false ? false : true
  if (props.size) fontSizeZ = props.size
  else fontSizeZ = 14
  return (
    <View style={{ flexDirection: "row" }}>
      {showVideo && (
        <Button
          icon="video"
          compact={true}
          mode="contained"
          style={iStyles.smallIcon}
          onPress={props.onViewVideo}
          disabled={!props.isClickable}
          color={iStyles.text1.color}
        ></Button>
      )}
      {showDelete && (
        <Button
          icon="find-replace"
          compact={true}
          mode="contained"
          style={iStyles.smallIcon}
          onPress={props.onPressReplace}
          disabled={!props.isClickable}
          color="orange"
        ></Button>
      )}
      {showDelete && (
        <Button
          icon="trash-can-outline"
          compact={true}
          mode="contained"
          style={iStyles.smallIcon}
          onPress={props.onPressDelete}
          disabled={!props.isClickable}
          color="red"
        ></Button>
      )}
    </View>
  )
}

export const zeroMuscleVolume = () => {
  // initialize muscleVolumeValues
  //return an array of objects with 0 values for each muscle group

  let programMuscleVolume = []
  let currentDayMuscleVolume = {}

  //make all values 0
  muscleGroups.forEach(muscleName => {
    currentDayMuscleVolume = {
      ...currentDayMuscleVolume,
      [muscleName]: 0,
    }
  })
  programMuscleVolume.push(currentDayMuscleVolume)

  return currentDayMuscleVolume
}

type ClientNameProps = {
  clientID: string
  style?: any
  onChange?: Function
  disabled?: boolean
}

export const ClientName: React.FunctionComponent<ClientNameProps> = props => {
  // const store: any = React.useContext(StoreContext)

  const { disabled } = props

  const sessionStore = useStores().sessionStore
  const userStore2 = useStores().userStore2
  const programsStore = useStores().trainingProgramsStore
  const exercisesStore = useStores().exerciseDataStore
  const rootStore = useStores()
  const cardStore2 = useStores().cardyStore2
  const trainerEmail = sessionStore.userEmail
  const [state, setState] = useState({
    isPicking: false,
    clientName:
      props.clientID === "No client yet"
        ? "No client yet"
        : userStore2.getUserByID(props.clientID).item.first,
    allClients: [],
  })

  useEffect(() => {
    const clientName =
      props.clientID === "No client yet"
        ? "No client yet"
        : userStore2.getUserByID(props.clientID).item.first
    const allClientsEmails = [...cardStore2.getYouClientsEmails(trainerEmail), trainerEmail]
    const allClients = _.uniq(
      allClientsEmails
        .map(email => userStore2.getUserByEmail(email))
        .filter(client => client !== null),
    )
    setState({
      ...state,
      clientName: clientName,
      allClients: [...allClients, { id: "No client yet", item: { first: "No client yet" } }],
    })
  }, [props])

  // props.client.Name
  //   ? (clientName = props.client.Name)
  //   : (clientName = 'no client yet');

  //   <View>
  //   {state.isPicking && (
  //     <View>
  //       {props.allClients.map(client => {
  //         if (client === props.client.ID) return
  //         return (
  //           <TouchableOpacity key={client} onPress={() => props.onChange(client)}>
  //             {/* <Text style={iStyles.text1}>{store.getClient(client).Name}</Text> */}
  //           </TouchableOpacity>
  //         )
  //       })}
  //     </View>
  //   )}
  // </View>

  return (
    <View>
      {!state.isPicking && (
        <TouchableOpacity
          onPress={() => setState({ ...state, isPicking: !state.isPicking })}
          disabled={disabled}
        >
          <Text style={props.style}>{state.clientName}</Text>
        </TouchableOpacity>
      )}
      {state.isPicking && (
        <View>
          {state.allClients.map(client => {
            return (
              <TouchableOpacity
                key={client.id}
                onPress={() => {
                  setState({ ...state, isPicking: false })
                  props.onChange(client.id)
                }}
              >
                <Text style={props.style}>{client.item.first}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}

export const getAverageRepsAndReturnFlag = item => {
  //small flag to check wether we should show more sets
  //by default we only show reps for the first set. if true, will show reps for each set
  let averageReps = 0
  item.Sets.forEach((set, index) => {
    averageReps += set.Reps
  })
  averageReps /= item.Sets.length
  if (item.Sets[0].Reps !== averageReps) return true
  else return false
}

export const getAverageWeight = sets => {
  let averageWeight = 0
  sets.forEach((set, index) => {
    averageWeight += parseFloat(set.Weight)
  })
  averageWeight /= sets.length
  if (Math.round(averageWeight) === averageWeight) return Math.round(averageWeight)
  else return averageWeight.toPrecision(3)
}

export const ShowAllSets = props => {
  //small function to show all sets properly with comma inbetween
  const sets = props.sets
  const isActive = props.isActive
  let setsString = ""

  for (let i = 0; i < sets.length - 1; i++) setsString += `${sets[i].Reps},`
  setsString += sets[sets.length - 1].Reps

  return <Text>{setsString}</Text>
}

export const SaveProgramButton = props => {
  const isProgramSaved = props.isProgramSaved

  if (!isProgramSaved)
    return (
      <Button mode="contained" color={iStyles.text2.color} onPress={props.onPress}>
        Save program
      </Button>
    )
  else
    return (
      <Button
        mode="contained"
        // onPress={onSaveProgramHandler}
        color={iStyles.text1.color}
      >
        Program saved
      </Button>
    )
}

export const ShowWeight = props => {
  const sets = props.sets
  const textStyle = props.textStyle
  let showKG
  const averagedSets = []
  sets.forEach((set, setIndex) => {
    if (set.WeightType === "pureWeight") averagedSets.push(set)
  })
  let averageWeight
  if (averagedSets.length > 0) {
    averageWeight = getAverageWeight(averagedSets)
    showKG = true
  } else averageWeight = sets[0].Weight

  if (showKG) {
    return <Text style={textStyle}>{`  ${averageWeight}kg`}</Text>
  } else {
    return <Text style={textStyle}>{` ${sets[0].Weight}`}</Text>
  }
}

export const SetsAndReps = props => {
  let defaultStyle = { fontSize: props.isActive ? 20 : 18 }
  let textStyle = {
    ...defaultStyle,
    ...props.textStyle,
  }

  if (props.textStyle.fontSize)
    textStyle.fontSize = props.isActive ? textStyle.fontSize + 2 : textStyle.fontSize

  const item = props.exercise
  let showItemRepsProgression = false
  let showItemWeightProgression = false
  if (item.isExpanded) {
    if (item.increaseReps !== 0) showItemRepsProgression = true
    if (item.increaseWeight !== 0) showItemWeightProgression = true
  }
  return (
    <View>
      <Pressable disabled={!props.isClickable} onPress={props.onPress}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={textStyle}>
              {item.Sets.length}x
              {props.showAllSetsReps ? (
                <ShowAllSets sets={item.Sets} isActive={props.isActive} />
              ) : (
                <Text style={textStyle}>{item.Sets[0].Reps}</Text>
              )}
            </Text>
            {showItemRepsProgression && <Text style={textStyle}>+{item.increaseReps}</Text>}
          </View>
          <View style={{ width: "40%" }}>
            <ShowWeight sets={item.Sets} textStyle={textStyle} />
            {showItemWeightProgression && <Text style={textStyle}>+{item.increaseWeight}</Text>}
          </View>
        </View>
      </Pressable>
    </View>
  )
}

export const ShowExercise = observer(props => {
  const DELAY_LONG_PRESS = 0

  const {
    onPressIn,
    onPressPosition,
    item,
    onPressExercise,
    onDeleteExercise,
    onPressSetsAndReps,
    isDragged,
    isClickable,
    showVolume,
    isGreyedOut,
    showDoneBefore,
    oldExercise,
  } = props

  let someStyle = {
    color: getColorByExercisePosition(item.Position),
  }

  const [showMoreInfoBaloon, setShowMoreInfoBaloon] = useState(false)

  const exercisesStore = useStores().exerciseDataStore
  let volumeText = exercisesStore.getVolumeStrings(item)

  let textStyle = props.textStyle ? props.textStyle : someStyle

  textStyle.color = props.textStyle.color ? props.textStyle.color : someStyle.color

  if (!textStyle) textStyle = iStyles.text1
  if (!item) return <Text>No exercise found</Text>

  let positionAndExerciseNameStyle = {
    ...iStyles.text1,
    fontSize: textStyle.fontSize || 20,
    color: textStyle.color || "black",
  }

  let setsAndRepsStyle = {
    ...textStyle,
    textAlign: "right",
    textAlignVertical: "bottom",
  }
  if (isGreyedOut) setsAndRepsStyle.color = "grey"

  const doneBefore = oldExercise ? oldExercise.doneBefore : 0
  let doneBeforeStyle = { ...positionAndExerciseNameStyle, color: getDoneBeforeColor(doneBefore) }
  const doneBeforeInfoText =
    doneBefore > 0
      ? `Last time you did ${oldExercise.latestSet.wholeSetString} on ${displayDateFromTimestamp2(
          oldExercise.completedOn,
        )}`
      : `You haven't done this exercise before`

  const onPressMoreInfoBaloon = () => {
    setShowMoreInfoBaloon(false)
  }

  const onPressDoneBefore = () => {
    if (showMoreInfoBaloon) setShowMoreInfoBaloon(false)
    else {
      setShowMoreInfoBaloon(true)
      setTimeout(() => setShowMoreInfoBaloon(false), 8000)
    }
  }

  return (
    <View>
      {showMoreInfoBaloon && (
        <MoreInfoBaloon
          infoText={doneBeforeInfoText}
          onPress={onPressMoreInfoBaloon}
          infoTextStyle={{ textAlign: "center" }}
        />
      )}
      <Pressable onPressIn={onPressIn} delayLongPress={DELAY_LONG_PRESS} disabled={!isClickable}>
        <View
          style={{
            flexDirection: "row",
            padding: 1,
            marginHorizontal: 1,
            // width: '100%',
            justifyContent: "space-between",
            // height: EXERCISE_ITEM_HEIGHT,
          }}
        >
          {showDoneBefore && (
            <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
              {/* <Text style={doneBeforeStyle}>{doneBefore}</Text> */}
              <TouchableOpacity onPress={onPressDoneBefore}>
                <Text style={doneBeforeStyle}>{doneBefore}</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
            <Pressable
              onPress={onPressPosition}
              onLongPress={onPressIn}
              delayLongPress={DELAY_LONG_PRESS}
              hitSlop={15}
              disabled={!isClickable}
            >
              <Text style={positionAndExerciseNameStyle}>{item.Position}</Text>
            </Pressable>
          </View>
          {/* <View style={{ width: "40%", alignItems: "flex-start" }}> */}
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Pressable
              onPress={onPressExercise}
              onLongPress={onPressIn}
              disabled={!isClickable}
              delayLongPress={DELAY_LONG_PRESS}
            >
              <Text
                style={{
                  ...positionAndExerciseNameStyle,
                  fontSize: isDragged
                    ? positionAndExerciseNameStyle.fontSize + 2
                    : positionAndExerciseNameStyle.fontSize,
                }}
              >
                {item.Name}
              </Text>
            </Pressable>
            {item.isExpanded && (
              <ExerciseMoreInfoButtons
                onPressDelete={onDeleteExercise}
                // onPressEdit={() => console.log("tried editing")}
                isClickable={isClickable}
                onViewVideo={props.onViewVideo}
                showVideo={props.showVideoButton}
                showDelete={props.showDeleteButton}
                onPressReplace={props.onPressReplace}
              />
            )}
            {item.isExpanded && showVolume && (
              <Text style={{ color: positionAndExerciseNameStyle.color }}>{volumeText}</Text>
            )}
          </View>

          <View
            style={{
              width: "40%",

              justifyContent: "center",
              alignItems: "center",
              // borderWidth: 1,

              // right: 5,
              // borderWidth: 2,
              // borderColor: 'red',
            }}
          >
            <SetsAndReps
              onPress={onPressSetsAndReps}
              showAllSetsReps={getAverageRepsAndReturnFlag(item)}
              isActive={isDragged}
              exercise={item}
              textStyle={setsAndRepsStyle}
              isClickable={isClickable}
            />
          </View>
        </View>
      </Pressable>
    </View>
  )
})

export const ShowWeekName = props => {
  const { isCurrent, index, onPress } = props

  let weekStyleSelected = { ...iStyles.text2, fontSize: 22 }
  let weekStyleNotSelected = { ...iStyles.greyText, fontSize: 21 }
  if (isCurrent) {
    return (
      <View style={{ marginHorizontal: 2 }}>
        <Text style={weekStyleSelected}>Week {index + 1}</Text>
      </View>
    )
  } else
    return (
      <View style={{ marginHorizontal: 2 }}>
        <Pressable onPress={onPress}>
          <Text style={weekStyleNotSelected}>Week {index + 1}</Text>
        </Pressable>
      </View>
    )
}

export const ShowDayName = props => {
  const { isCurrent, day, onPress, disableEdit } = props
  let dayStyleSelected = { ...iStyles.text2, fontSize: 22 }
  let dayStyleNotSelected = { ...iStyles.greyText, fontSize: 21 }
  if (disableEdit)
    return (
      <View style={{ marginHorizontal: 2 }}>
        <Text style={dayStyleSelected}>{day.DayName}</Text>
      </View>
    )
  if (isCurrent) {
    return (
      <View style={{ marginHorizontal: 2 }}>
        <EditableText onEnd={props.onEdit} textStyle={dayStyleSelected} onPress={onPress}>
          {day.DayName}
        </EditableText>
      </View>
    )
  } else
    return (
      <View style={{ marginHorizontal: 2 }}>
        <EditableText onEnd={props.onEdit} onPress={onPress} textStyle={dayStyleNotSelected}>
          {day.DayName}
        </EditableText>
      </View>
    )
}

type ShowProgramMoreInfoProps = {
  state: state
  onChangeProgramName?: Function
  onToggleProgramCompleted?: Function
}

export const ShowProgramMoreInfo: React.FC<ShowProgramMoreInfoProps> = props => {
  const { state } = props
  const { currentProgram, currentWeekIndex, currentDayIndex } = props.state

  if (!currentProgram) return <View></View>

  return (
    <ScrollView style={{ flex: 1, padding: 2 }}>
      <ProgramGeneralInfo
        state={state}
        onChangeProgramName={props.onChangeProgramName}
        onToggleProgramCompleted={props.onToggleProgramCompleted}
      />
      <ProgramVolumeTable state={state} />
      <ProgramInfoOldPrograms state={state} />
    </ScrollView>
  )
}

export const ShowDayMoreInfo = props => {
  const { currentProgram, currentWeekIndex, currentDayIndex } = props.state
  return (
    <View>
      <ShowDayName
        isCurrent={true}
        day={currentProgram.Weeks[currentWeekIndex].Days[currentDayIndex]}
        disableEdit={true}
      />
      <Text>тест</Text>
    </View>
  )
}

const ProgramVolumeTable = props => {
  const { state } = props
  const { currentProgram, currentWeekIndex, currentDayIndex } = props.state

  const muscles = state.muscles ? state.muscles : muscleGroups

  const exercisesStore = useStores().exerciseDataStore
  const coefsArray = exercisesStore.getProgramVolume(state)

  const flatlistHeader = () => {
    const greyTextStyle = { ...iStyles.greyText, color: "black" }
    return (
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={styles.muscleColumns}>
          <Text style={greyTextStyle}>Muscle</Text>
        </View>
        <View style={styles.muscleCoefColumns}>
          <Text style={greyTextStyle}>Prog</Text>
        </View>
        {currentProgram.Weeks[currentWeekIndex].Days.map((day, index) => {
          let textString = `Day ${index + 1} `
          return (
            <View key={index} style={styles.muscleCoefColumns}>
              <Text style={greyTextStyle}>{textString}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const renderCoefs = ({ item, index }) => {
    const textStyle = {
      color: getColorByMuscleName(item.muscleName),
      fontSize: iStyles.text1.fontSize,
    }
    const greyTextStyle = { ...iStyles.greyText }
    if (item.programVolume === 0) return <View></View>

    return (
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={styles.muscleColumns}>
          <Text style={textStyle}>{item.muscleName} </Text>
        </View>
        <View style={styles.muscleCoefColumns}>
          <Text style={greyTextStyle}>{item.programVolume} </Text>
        </View>

        {currentProgram.Weeks[currentWeekIndex].Days.map((day, index) => {
          let textString = ``
          if (item.weeklyVolume[index]) textString = `${item.weeklyVolume[index]} `
          return (
            <View key={index} style={styles.muscleCoefColumns}>
              <Text style={greyTextStyle}>{textString}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <ExpandableContent title="Whole program volume" titleStyle={iStyles.text1}>
      <FlatList
        data={coefsArray}
        keyExtractor={(item, index) => `${item.Name}-${index}`}
        renderItem={renderCoefs}
        ListHeaderComponent={flatlistHeader}
      />
    </ExpandableContent>
  )
}

export const getProgramInfo = (program: any, returnObject?: boolean) => {
  let sessionsInfo = []
  let trainingsDone = 0
  let lastCompletedOn = 0
  let lastCompletedOnDayString = ""
  let numberOfSessionsInProgram = 0

  program.Weeks.forEach((week, weekIndex) => {
    program.Weeks[weekIndex].Days.forEach((day, dayIndex) => {
      numberOfSessionsInProgram++
      if (day.isCompleted) {
        if (lastCompletedOn < day.completedOn) {
          lastCompletedOn = day.completedOn
          lastCompletedOnDayString = ` (${day.DayName})`
        }
        trainingsDone++
      }
    })
  })

  sessionsInfo.push({ Name: "Program name", Value: program.Name })
  sessionsInfo.push({
    Name: "Trainings done",
    Value: `${trainingsDone}/${numberOfSessionsInProgram}`,
  })
  let lastTrainedOnStringValue =
    lastCompletedOn === 0
      ? "Never"
      : displayDateFromTimestamp2(parseInt(lastCompletedOn)) + lastCompletedOnDayString
  sessionsInfo.push({
    Name: "Last trained on",
    Value: lastTrainedOnStringValue,
  })
  const trainingsLeft = numberOfSessionsInProgram - trainingsDone
  const programStatus = program.isCompleted ? "Completed" : `${trainingsLeft} trainings left to do`
  sessionsInfo.push({ Name: "Program status", Value: programStatus })

  if (returnObject) {
    return {
      ProgramName: program.Name,
      TrainingsDone: `${trainingsDone}/${numberOfSessionsInProgram}`,
      LastTrainedOn:
        lastCompletedOn === 0 ? "Never" : displayDateFromTimestamp2(parseInt(lastCompletedOn)),
      ProgramStatus: programStatus,
    }
  }
  return sessionsInfo
}

const ProgramGeneralInfo = props => {
  const { state } = props
  const { currentProgram, currentWeekIndex, currentDayIndex } = props.state

  // преместихме инфото за програмите да се взема от тук, защото в обикновени функции не може да се ползват hooks и не можем да ползваме store-a съответно
  const rootStore = useStores()
  const thisClientPrograms = rootStore.getUserPrograms(currentProgram.Client)

  const [programInfo, setProgramInfo] = useState([
    ...getProgramInfo(currentProgram),
    { Name: "Programs count", Value: thisClientPrograms.length },
  ])

  useEffect(() => {
    setProgramInfo([
      ...getProgramInfo(currentProgram),
      { Name: "Programs count", Value: thisClientPrograms.length },
    ])
  }, [state])

  const leftTextStyle = { fontSize: 18, color: "black", fontWeight: "bold" }
  const rightTextStyle = { fontSize: 18, color: "black" }
  const clickableStyle = { ...rightTextStyle, color: iStyles.text1.color }

  return (
    <ExpandableContent title="General info" titleStyle={iStyles.text1}>
      {programInfo.map((info, index) => {
        if (info.Name === "Program name")
          return (
            <View key={index} style={{ flexDirection: "row" }}>
              <Text style={leftTextStyle}>
                {info.Name}
                {": "}
              </Text>
              <EditableText onEnd={props.onChangeProgramName} textStyle={clickableStyle}>
                {info.Value}
              </EditableText>
            </View>
          )
        else if (info.Name === "Program status")
          return (
            <View key={index} style={{ flexDirection: "row" }}>
              <Text style={leftTextStyle}>
                {info.Name}
                {": "}
              </Text>
              <TouchableOpacity onPress={props.onToggleProgramCompleted}>
                <Text style={clickableStyle}>{info.Value}</Text>
              </TouchableOpacity>
            </View>
          )
        else
          return (
            <View key={index} style={{ flexDirection: "row" }}>
              <Text style={leftTextStyle}>
                {info.Name}
                {": "}
              </Text>
              <Text style={rightTextStyle}>{info.Value}</Text>
            </View>
          )
      })}
    </ExpandableContent>
  )
}

const ProgramInfoOldPrograms = props => {
  const { state } = props
  const { currentProgram, currentWeekIndex, currentDayIndex, oldPrograms } = props.state

  return (
    <ExpandableContent title="Other programs" titleStyle={iStyles.text1} startMinimized={true}>
      {oldPrograms.length === 0 && <Text>No other programs found :(</Text>}
      {oldPrograms.map((program, index) => {
        return (
          <ExpandableContent
            title={program.item.Name}
            titleStyle={iStyles.text1}
            key={index}
            startMinimized={true}
          >
            <ShowProgramDays
              mode="smallPreview"
              state={{
                ...state,
                currentProgram: program.item,
                currentWeekIndex: program.item.Weeks.length - 1,
              }}
            />
          </ExpandableContent>
        )
      })}
    </ExpandableContent>
  )
}

type DayCompletedCheckboxProps = {
  isCompleted: boolean
  onToggle: Function
  color?: string
  uncheckedColor?: string
  currentDate?: Date
}

export const DayCompletedCheckbox: React.FC<DayCompletedCheckboxProps> = props => {
  const { isCompleted, onToggle, currentDate } = props
  const [isPicking, setIsPicking] = useState(false)
  const dateRandom = new Date(1598051730000)

  const onPressCheckbox = () => (isCompleted === true ? onToggle() : setIsPicking(true))

  return (
    <View>
      <Checkbox
        onPress={onPressCheckbox}
        status={isCompleted ? "checked" : "unchecked"}
        color={props.color}
        uncheckedColor={props.uncheckedColor}
      />
      {isPicking && (
        <DateTimePicker
          value={moment(currentDate).toDate() || dateRandom}
          onChange={(event, newDate) => {
            const date2 = newDate || currentDate || dateRandom
            setIsPicking(false)
            onToggle(getStampFromDate(date2))
          }}
          mode={"date"}
          display="default"
        />
      )}
    </View>
  )
}

const text1 = iStyles.text1
const text2 = iStyles.text2
const greyText = iStyles.greyText

type DaysBoxProps = {
  program: any
  state: any
  onPressDay: Function
  editWeeks?: boolean
  onAddWeek?: Function
  onRemoveWeek?: Function
}

export const DaysBox: React.FC<DaysBoxProps> = props => {
  const { program, state } = props
  const [isChoosing, setIsChoosing] = useState(false)

  let styles = {
    completed: { ...text2, fontWeight: "bold" },
    notCompleted: greyText,
  }

  let buttonColor = state.locked ? greyText.color : text1.color

  return (
    <View>
      <Button
        onPress={() => setIsChoosing(!isChoosing)}
        color={buttonColor}
        disabled={state.locked}
      >
        {translate("trainClientsScreen.Day")}
        {state.currentDayIndex + 1} {translate("trainClientsScreen.W")}
        {state.currentWeekIndex + 1}
      </Button>
      {isChoosing && (
        <View style={{ flexDirection: "row" }}>
          {program.Weeks.map((week, weekIndex) => {
            return (
              <View key={weekIndex}>
                <Text style={{ ...text1, fontSize: 15, textAlign: "center" }}>
                  W{weekIndex + 1}
                </Text>
                {program.Weeks[weekIndex].Days.map((day, dayIndex) => {
                  let textStyle = styles.notCompleted
                  let selected = false
                  if (weekIndex === state.currentWeekIndex)
                    if (dayIndex === state.currentDayIndex) selected = true
                  if (program.Weeks[weekIndex].Days[dayIndex].isCompleted)
                    textStyle = styles.completed
                  return (
                    <Pressable
                      key={dayIndex}
                      onPress={() => {
                        setIsChoosing(false)
                        props.onPressDay(weekIndex, dayIndex)
                      }}
                    >
                      <View style={{ margin: 2, borderWidth: selected ? 1 : 0 }}>
                        <Text style={textStyle}>D{dayIndex + 1}</Text>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            )
          })}
          {props.editWeeks && (
            <View style={{ justifyContent: "space-around" }}>
              <PlusButton onPress={props.onAddWeek} />
              <TrashButton onPress={props.onRemoveWeek} />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  muscleColumns: {
    width: "30%",
    flexDirection: "row",
  },
  muscleCoefColumns: {
    width: "15%",
    flexDirection: "row",
  },
})
