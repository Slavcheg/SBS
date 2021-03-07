import { Button, Portal, Modal, TextInput, Checkbox } from "react-native-paper"

import firestore from "@react-native-firebase/firestore"
import React, { useState, useEffect, useReducer, FunctionComponent, ReactNode, useRef } from "react"

import { useStores } from "../../../../models/root-store"
import { state } from "../../../../components3"

import { useGlobalState } from "../../../../models/global-state-regular"

import {
  View,
  // Text,
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
  useColorScheme,
  Animated,
  Easing,
} from "react-native"

import {
  Text,
  AlternativeCheckbox,
  MediumButtonIcon,
  SmallIconButton,
  getAverageReps,
  CancelConfirm,
  ClickableEditableText,
} from "../ProgramsTool - Helper functions"

import { NO_CLIENT_YET } from "../Constants"

import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import _ from "lodash"
import { observer } from "mobx-react-lite"
import { translate } from "../../../../i18n"

import { GetText, getDoneBeforeColor, getVolumeStrings, getProgramVolume } from "./index"
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
  ExerciseProgressChart,
} from "./index"
// import StoreProvider, { StoreContext } from "../../StoreProvider"

import {
  return_todays_datestamp,
  displayDateFromTimestamp,
  displayDateFromTimestampFullMonth,
  border_boxes,
  getStampFromDate,
  displayDateFromTimestamp2,
} from "../../../../global-helper"
import { icons, fonts, colors } from "../Constants"
import { Touch } from "react-powerplug"
import { firebase } from "@react-native-firebase/firestore"

type ExerciseMoreInfoButtonsProps = {
  showVideo?: Boolean
  showDelete?: Boolean
  size?: Number
  onViewVideo?: Function
  isClickable?: Boolean
  onPressDelete?: Function
  onPressReplace?: Function
  onPressMoreInfo?: Function
}

export const ExerciseMoreInfoButtons: React.FC<ExerciseMoreInfoButtonsProps> = props => {
  let fontSizeZ: Number
  let showVideo = props.showVideo === false ? false : true
  let showDelete = props.showDelete === false ? false : true
  if (props.size) fontSizeZ = props.size
  else fontSizeZ = 14
  return (
    <View style={{ flexDirection: "row" }}>
      <SmallIconButton
        icon={icons.info}
        onPress={props.onPressMoreInfo}
        disabled={!props.isClickable}
      />
      {showVideo && (
        <Button
          icon="video"
          compact={true}
          mode="text"
          style={iStyles.smallIcon}
          onPress={props.onViewVideo}
          disabled={!props.isClickable}
          color={iStyles.text1.color}
          labelStyle={{ fontSize: 20 }}
        ></Button>
      )}
      {showDelete && (
        <Button
          icon={icons.changeCircle}
          compact={true}
          mode="text"
          style={iStyles.smallIcon}
          onPress={props.onPressReplace}
          disabled={!props.isClickable}
          color={iStyles.text2.color}
          labelStyle={{ fontSize: 20 }}
        ></Button>
      )}
      {showDelete && (
        <Button
          icon={icons.delete}
          compact={true}
          mode="text"
          style={iStyles.smallIcon}
          onPress={props.onPressDelete}
          disabled={!props.isClickable}
          color="red"
          labelStyle={{ fontSize: 20 }}
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
  const noClient = { Name: "No client yet", ID: "No client yet" }
  const [globalState, setGlobalState] = useGlobalState()
  const [allClients, setAllClients] = useState([])
  const [isPicking, setIsPicking] = useState(false)
  const [currentClient, setCurrentClient] = useState(noClient)

  useEffect(() => {
    setAllClients([...globalState.allUsers, noClient])
    if (props.clientID === noClient.ID) setCurrentClient(noClient)
    else
      globalState.allUsers.forEach(user => {
        if (user) if (user.ID === props.clientID) setCurrentClient(user)
      })
  }, [props.clientID])

  const { disabled } = props

  return (
    <View style={{ justifyContent: "flex-end" }}>
      {!isPicking && (
        <TouchableOpacity onPress={() => setIsPicking(!isPicking)} disabled={disabled}>
          {currentClient.ClientNumber ? (
            <Text style={props.style}>
              {currentClient.Name} - {currentClient.ClientNumber}
            </Text>
          ) : (
            <Text style={props.style}>{currentClient.Name}</Text>
          )}
        </TouchableOpacity>
      )}
      {isPicking && (
        <View>
          {allClients.map(client => {
            if (client) {
              return (
                <TouchableOpacity
                  key={client.ID}
                  onPress={() => {
                    setIsPicking(!isPicking)
                    props.onChange(client.ID)
                  }}
                >
                  {client.ClientNumber ? (
                    <Text style={props.style}>
                      {client.Name} - {client.ClientNumber}
                    </Text>
                  ) : (
                    <Text style={props.style}>{client.Name}</Text>
                  )}
                </TouchableOpacity>
              )
            }
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
  // console.log("props.sets ", props.sets)
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

export const cutDecimalpoint = (number: number | string) => {
  let returnFull = true
  let numberNumber
  if (typeof number === "string") numberNumber = parseFloat(number)
  else numberNumber = number
  if (Math.round(numberNumber) === numberNumber) returnFull = false

  if (returnFull) return numberNumber
  else return Math.round(numberNumber)
}

export const formatRepsWeight = (number: number | string, toPrecision: number = 2) => {
  let returnFull = true
  let numberNumber
  if (typeof number === "string") numberNumber = parseFloat(number)
  else numberNumber = number

  if (Math.round(numberNumber) === numberNumber) returnFull = false

  if (returnFull) return parseFloat(numberNumber.toPrecision(toPrecision))
  return Math.round(numberNumber)
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

  const averageReps = getAverageReps(item)
  const averageRepsString =
    averageReps < 100
      ? `${cutDecimalpoint(averageReps.toFixed(1))}`
      : `${cutDecimalpoint(averageReps.toFixed())}`

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "50%" }}>
          <Pressable disabled={!props.isClickable} onPress={props.onPress}>
            {/* <Text style={textStyle}>
              {item.Sets.length}x
              {props.showAllSetsReps ? (
                <ShowAllSets sets={item.Sets} isActive={props.isActive} />
              ) : (
                <Text style={textStyle}>{item.Sets[0].Reps}</Text>
              )}
            </Text> */}
            <Text style={textStyle}>
              {item.Sets.length}x{averageRepsString}
            </Text>
          </Pressable>
          {showItemRepsProgression && <Text style={textStyle}>+{item.increaseReps}</Text>}
        </View>
        <View style={{ width: "50%" }}>
          <Pressable disabled={!props.isClickable} onPress={props.onPress}>
            <ShowWeight sets={item.Sets} textStyle={textStyle} />
            {showItemWeightProgression && <Text style={textStyle}>+{item.increaseWeight}</Text>}
          </Pressable>
        </View>
      </View>
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
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const [globalState, setGlobalState] = useGlobalState()

  let volumeText = getVolumeStrings(item, globalState.allExercises)

  let textStyle = props.textStyle ? props.textStyle : someStyle

  textStyle.color = props.textStyle.color ? props.textStyle.color : someStyle.color

  if (!textStyle) textStyle = iStyles.text1
  if (!item) return <Text style={{ color: iStyles.text0.color }}>No exercise found</Text>

  let positionAndExerciseNameStyle = {
    ...iStyles.text1,
    fontSize: textStyle.fontSize || 18,
    color: textStyle.color || iStyles.text0.color,
    fontFamily: fonts.jost.regular,
  }

  let setsAndRepsStyle = {
    fontFamily: fonts.jost.regular,
    ...textStyle,
    textAlign: "right",
    textAlignVertical: "bottom",
  }
  if (isGreyedOut) {
    setsAndRepsStyle.color = colors.grey1
    positionAndExerciseNameStyle.color = colors.grey1
  }

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
          infoTextStyle={{ textAlign: "center", color: iStyles.text0.color }}
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
            <View style={{ width: "5%", justifyContent: "center", alignItems: "center" }}>
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
          <View style={{ flex: 1, alignItems: "flex-start", width: "40%" }}>
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
                onPressMoreInfo={() => setShowMoreInfo(!showMoreInfo)}
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
              // showAllSetsReps={getAverageRepsAndReturnFlag(item)}
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
  let dayStyleSelected = { ...iStyles.text0, fontSize: 22, fontFamily: fonts.jost.semi_bold }
  let dayStyleNotSelected = dayStyleSelected
  // let dayStyleSelected = { ...iStyles.text2, fontSize: 22 }
  // let dayStyleNotSelected = { ...iStyles.greyText, fontSize: 21 }
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

const downloadClientNotes = (clientID: string, ownerID: string, onDownload: any) => {
  firestore()
    .collection("notes")
    .where("noteClient", "==", clientID) // .where("noteOwner", "==", ownerID)
    .get()
    .then(query => {
      console.log("downloaded ", query.docs.length, " docs")
      if (query.docs.length > 0)
        //if we find a doc = send  it.
        onDownload(query.docs[0].data())
      else {
        //if we do not find a doc for this client = create it

        const newNote = {
          ID: "",
          noteClient: clientID,
          noteContent: "",
          noteOwner: ownerID,
        }
        firestore()
          .collection("notes")
          .add(newNote)
          .then(newDocReference => {
            console.log("newDocReference: ", newDocReference.id)
            const finalnewNote = { ...newNote, ID: newDocReference.id }
            firestore()
              .collection("notes")
              .doc(finalnewNote.ID)
              .update(finalnewNote)
            onDownload(finalnewNote)
          })
      }
    })
}

const saveClientNote = note => {
  console.log("tried saving ", note)
  const updatedNote = { ID: note.ID, noteContent: note.noteContent }

  firestore()
    .collection("notes")
    .doc(updatedNote.ID)
    .update(updatedNote)
}

type ProgramNotesType = {
  clientID: string
}

export const ProgramNotes: React.FC<ProgramNotesType> = ({ clientID }) => {
  const [note, setNote] = useState({ noteContent: "", noteClientName: "" })
  const [downloadedNote, setDownloadedNote] = useState({ noteContent: "", noteClientName: "" })
  const [savable, setSavable] = useState(false)
  const [programHasClient, setProgramHasClient] = useState(false)
  const [globalState, setGlobalState] = useGlobalState()

  useEffect(() => {
    if (clientID) {
      if (clientID === NO_CLIENT_YET) setProgramHasClient(false)
      else {
        downloadClientNotes(clientID, globalState.loggedUser.ID, afterDownloadingClients)
      }
    }
  }, [clientID])

  const afterDownloadingClients = clientNote => {
    const client = globalState.allUsers.find(user => user.ID === clientID)

    const downloadedDoc = clientNote

    const noteclientName = client ? client.Name : "no client found"
    const content = downloadedDoc.noteContent
    const noteContent = content ? content : "no content found"

    const newNote = {
      noteContent: noteContent,
      noteClientName: noteclientName,
      ID: downloadedDoc.ID,
    }

    setDownloadedNote({ ...newNote })
    setNote({ ...newNote })
    setProgramHasClient(true)
  }

  const onEditNote = newText => {
    console.log(newText)
    setNote({ ...note, noteContent: newText })
    setSavable(true)
  }

  const onPressSave = () => {
    saveClientNote(note)
    setDownloadedNote(note)
    setSavable(false)
  }

  const onPressCancel = () => {
    setNote({ ...downloadedNote })
    setSavable(false)
  }

  const noteTextStyle = { ...iStyles.greyText }

  if (!clientID) return <ExpandableContent title="Бележки (зареждат..)"></ExpandableContent>
  if (!programHasClient)
    return (
      <ExpandableContent
        title="Бележки (no client found)"
        titleStyle={iStyles.text1}
      ></ExpandableContent>
    )
  return (
    <ExpandableContent title={`Бележки (${note.noteClientName})`} titleStyle={iStyles.text1}>
      <View>
        <ClickableEditableText
          value={note.noteContent}
          onChangeText={onEditNote}
          multiline={true}
          style={noteTextStyle}
          autoBlurTime={3000}
          label={"бележки за твоя клиент"}
          placeholder={"пиши тук"}
        />
        {savable && <CancelConfirm onCancel={onPressCancel} onConfirm={onPressSave} />}
      </View>
    </ExpandableContent>
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

  const HEIGHT_SEPERATOR = () => {
    return <View style={{ height: 15 }}></View>
  }

  return (
    <ScrollView style={{ flex: 1, padding: 2 }}>
      <ProgramGeneralInfo
        state={state}
        onChangeProgramName={props.onChangeProgramName}
        onToggleProgramCompleted={props.onToggleProgramCompleted}
      />
      <HEIGHT_SEPERATOR />
      <ProgramNotes clientID={state.currentProgram.Client} />
      <HEIGHT_SEPERATOR />
      <ProgramVolumeTable state={state} />
      <HEIGHT_SEPERATOR />
      <ExpandableContent title="Прогрес" startMinimized={true} titleStyle={iStyles.text1}>
        <ExerciseProgressChart state={state} />
      </ExpandableContent>
      <HEIGHT_SEPERATOR />
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
  const [globalState, setGlobalState] = useGlobalState()

  const coefsArray = getProgramVolume(state, globalState.allExercises)

  const columnsCount = currentProgram.Weeks[currentWeekIndex].Days.length + 1
  const deviceWidth = useWindowDimensions().width
  // const dayVolumeWidth = `${100 / daysCount + 1}%`
  const dayVolumeWidth = deviceWidth / 1.4 / columnsCount

  const muscleCoefColumnStyle = {
    // flexDirection: "row",
    width: dayVolumeWidth,
  }
  const fontSize = columnsCount < 6 ? 20 : 15 //Programs with less than 5 days have bigger fontSize

  const flatlistHeader = () => {
    const greyTextStyle = { ...iStyles.greyText, color: iStyles.text0.color, fontSize: fontSize }
    return (
      <View>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.muscleColumns}>
            <Text style={{ ...greyTextStyle, fontSize: 23 }}>Muscle</Text>
          </View>
          <View style={muscleCoefColumnStyle}>
            <Text style={greyTextStyle}>Prog</Text>
          </View>
          <View>
            <View style={{ alignItems: "center", width: "100%" }}>
              <Text>Day</Text>
            </View>
            <View style={{ flexDirection: "row", width: "100%" }}>
              {currentProgram.Weeks[currentWeekIndex].Days.map((day, index) => {
                let textString = `${index + 1}`
                return (
                  <View key={index} style={muscleCoefColumnStyle}>
                    <Text style={greyTextStyle}>{textString}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderCoefs = ({ item, index }) => {
    const textStyle = {
      color: getColorByMuscleName(item.muscleName),
      fontSize: iStyles.text1.fontSize,
    }
    const greyTextStyle = { ...iStyles.greyText, fontSize: fontSize }
    if (item.programVolume === 0) return <View></View>

    return (
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={styles.muscleColumns}>
          <Text style={textStyle}>{_.capitalize(item.muscleName)} </Text>
        </View>
        <View style={muscleCoefColumnStyle}>
          <Text style={greyTextStyle}>{item.programVolume} </Text>
        </View>

        {currentProgram.Weeks[currentWeekIndex].Days.map((day, index) => {
          let textString = ``
          if (item.weeklyVolume[index]) textString = `${item.weeklyVolume[index]} `
          return (
            <View key={index} style={muscleCoefColumnStyle}>
              <Text style={greyTextStyle}>{textString}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <ExpandableContent title="Тренировъчен обем" titleStyle={iStyles.text1}>
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
  const [globalState, setGlobalState] = useGlobalState()

  const thisClientPrograms = globalState.allPrograms.filter(
    program => program.item.Client === currentProgram.Client,
  )

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

  const leftTextStyle = { fontSize: 18, color: iStyles.text0.color, fontWeight: "bold" }
  const rightTextStyle = { fontSize: 18, color: iStyles.text0.color }
  const clickableStyle = { ...rightTextStyle, color: iStyles.text1.color }

  return (
    <ExpandableContent title="Обща информация" titleStyle={iStyles.text1}>
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
      {oldPrograms.length === 0 && <Text style={iStyles.text0}>No other programs found :(</Text>}
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
  const checkBoxActiveColor = props.color || colors.green3
  const checkBoxColor = isCompleted ? checkBoxActiveColor : colors.grey1
  const backgroundColor = isCompleted ? colors.transparent("green3", 35) : `${colors.black}25`
  const dateText =
    displayDateFromTimestampFullMonth(getStampFromDate(currentDate)) || "invalid date"
  const completedText = dateText
  const notCompletedText = "Ненаправен"
  const textColor = colors.black
  const finalText = isCompleted ? completedText : notCompletedText

  return (
    <TouchableOpacity onPress={onPressCheckbox}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: backgroundColor,
          height: 33,
          width: 150,
          borderRadius: 20,
        }}
      >
        {/* <Checkbox
        onPress={onPressCheckbox}
        status={isCompleted ? "checked" : "unchecked"}
        // color={"green"}
        // color={"rgba(0, 0, 0, 0.13)"}
        // color={`${checkBoxColor}87`}
        // color={colors.transparent("black", 25)}
        color={colors.black}
        uncheckedColor={props.uncheckedColor ? props.uncheckedColor : `${colors.black}87`}
      /> */}
        <AlternativeCheckbox onPress={onPressCheckbox} status={isCompleted} />
        <Text> {finalText} </Text>
        {isPicking && (
          <DateTimePicker
            // value={moment(currentDate).toDate() || moment(return_todays_datestamp()).toDate()}
            value={moment(return_todays_datestamp()).toDate()}
            onChange={(event, newDate) => {
              if (newDate) {
                const date2 = newDate
                setIsPicking(false)
                onToggle(getStampFromDate(date2))
              } else setIsPicking(false)
            }}
            mode={"date"}
            display="default"
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

const text1 = iStyles.text1
const text2 = iStyles.text2
const greyText = iStyles.greyText

type DaysBoxModes = "week and day" | "week only"

type DaysBoxProps = {
  program: any
  state: any
  onPressDay: Function
  editWeeks?: boolean
  onAddWeek?: Function
  onRemoveWeek?: Function
  startOpen?: boolean
  mode?: DaysBoxModes
  onPressLeft?: Function
  onPressRight?: Function
  style?: Object
  headerStyle?: Object
}

export const DaysBox: React.FC<DaysBoxProps> = props => {
  const { program, state } = props
  const { currentWeekIndex, currentDayIndex } = props.state
  const [isChoosing, setIsChoosing] = useState(props.startOpen ? true : false)

  let styles = {
    completed: { ...text2, fontWeight: "bold" },
    notCompleted: greyText,
  }

  let buttonColor = state.locked ? greyText.color : colors.black

  const weeksLength = program.Weeks.length
  const weekOnlyText = `${currentWeekIndex + 1}/${weeksLength}`
  const dayAndWeekText = `${translate("trainClientsScreen.Day")}${state.currentDayIndex +
    1} ${translate("trainClientsScreen.W")}${state.currentWeekIndex + 1}`

  const textToShow = props.mode === "week only" ? weekOnlyText : dayAndWeekText

  const animatedValue = useRef(new Animated.Value(0)).current
  // const animatedStyle = { backgroundColor: `#009246${animatedValue}` }
  // const animatedStyle = { backgroundColor: `#009${animatedValue}` }
  // const animatedStyle = { backgroundColor: `red` }
  // const animatedStyle = { backgroundColor: `rgb(255,0,${animatedValue})` }

  const interpolateColor = animatedValue.interpolate({
    inputRange: [0, 150],
    outputRange: ["rgb(0,100,0)", colors.green_transparent],
  })
  const animatedStyle = { backgroundColor: interpolateColor }

  useEffect(() => {
    animatedValue.setValue(0)

    Animated.timing(animatedValue, {
      toValue: 150,
      duration: 350,
      useNativeDriver: false,
    }).start()
    // console.log("fired animation")
  }, [currentWeekIndex])

  // return (
  //   <TouchableOpacity onPress={onPressCheckbox}>
  //     <Animated.View
  //       style={[
  //         {
  //           flexDirection: "row",
  //           backgroundColor: backgroundColor,
  //           height: 33,
  //           width: 150,
  //           borderRadius: 20,
  //         },
  //         animatedStyle,
  //       ]}
  //     >

  const PreviewButton = () => {
    if (props.mode === "week only")
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <MediumButtonIcon
            icon={icons.chevron_left}
            onPress={props.onPressLeft}
            style={{ width: 25 }}
          />
          <Button
            onPress={() => setIsChoosing(!isChoosing)}
            compact={true}
            color={buttonColor}
            disabled={state.locked}
            labelStyle={{ color: buttonColor, fontSize: 23 }}
            icon={icons.calendar}
          >
            {/* <TextPreview /> */}
            {props.mode === "week only" && <Text style={{ fontSize: 10 }}>седмица </Text>}
            <Text style={{ fontSize: 14 }}>{textToShow}</Text>
          </Button>
          <MediumButtonIcon
            icon={icons.chevron_right}
            onPress={props.onPressRight}
            style={{ width: 25 }}
          />
        </View>
      )
    else
      return (
        <Button
          onPress={() => setIsChoosing(!isChoosing)}
          color={buttonColor}
          disabled={state.locked}
          labelStyle={{ color: buttonColor }}
        >
          {textToShow}
        </Button>
      )
  }

  return (
    <View style={{ alignItems: "center", ...props.style }}>
      {/* <Animated.View style={animatedStyle}> */}
      <Animated.View
        style={[
          {
            backgroundColor: colors.green_transparent,
            alignItems: "center",
            // flexDirection: "row",
            ...props.headerStyle,
          },
          animatedStyle,
        ]}
      >
        {/* <MediumButtonIcon icon={icons.copy} color={colors.grey1} /> */}
        <PreviewButton />
      </Animated.View>
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
})
