import React, { useEffect } from "react"
import { View, FlatList, useWindowDimensions, TextStyle, Pressable } from "react-native"
import {
  DefaultHeader,
  Text,
  useGlobalState,
  MEASUREMENTS_COLLECTION,
  T_client_short,
  T_measurement_Document,
  useBackHandler,
} from "../../../components3"
import firestore from "@react-native-firebase/firestore"
import { useMeasurementsState, addNewMeasurementDocument } from "./MeasureClients_Reducer"
import { FAB, ShowClientMeasurements, Alerts } from "./Components"
import * as dateHelper from "../../../global-helper/global-date-helper/global-date-helper"

const useMeasurements = onLoad => {
  let mounted
  const [globalState, setGlobalState] = useGlobalState()
  useEffect(() => {
    mounted = true
    let subscriber
    if (globalState.loggedUser.ID) {
      subscriber = firestore()
        .collection(MEASUREMENTS_COLLECTION)
        .where("trainerIDs", "array-contains", globalState.loggedUser.ID)
        .onSnapshot(query => {
          const downloadedItems = []
          if (query) {
            query.forEach(doc => {
              downloadedItems.push(doc.data())
            })
          }
          const { Name, FamilyName, ID, ClientNumber } = globalState.loggedUser
          const trainer: T_client_short = {
            Name: Name,
            FamilyName: FamilyName,
            ID: ID,
            ClientNumber: ClientNumber,
          }
          if (mounted) onLoad(downloadedItems, trainer)
        })
    }
    return () => {
      mounted = false
      if (subscriber) {
        subscriber()
      }
    }
  }, [globalState.loggedUser.ID])
}

export const Measure_Clients_Screen = ({ navigation }) => {
  const [globalState, setGlobalState] = useGlobalState()
  const [state, dispatch] = useMeasurementsState()

  const window = useWindowDimensions()
  useMeasurements((measurements: T_measurement_Document[], trainer: T_client_short) => {
    dispatch({ type: "load measurements", value: measurements, loggedTrainer: trainer })
  })

  const isGoingBack = () => {
    console.log("tried")
    if (state.editedMeasurementIndex !== null || state.isEditing) {
      dispatch({ type: "cancel editing client measurements" })
      return false
    }
    return true
  }
  useBackHandler(isGoingBack, [state.isEditing])

  const renderHeader = () => {
    const textStyle: TextStyle = { fontSize: 21, fontWeight: "bold" }
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Text style={textStyle}>Клиент</Text>
        <View style={{ width: window.width / 3 }}>
          <Text style={textStyle} numberOfLines={2}>
            Последно измерване
          </Text>
        </View>
      </View>
    )
  }

  const onPressDeleteDoc = (doc: T_measurement_Document) => {
    const onConfirmDelete = () => {
      firestore()
        .collection(MEASUREMENTS_COLLECTION)
        .doc(doc.docID)
        .delete()
    }
    Alerts.ConfirmDeleteDoc(doc, onConfirmDelete)
  }

  const onPressAddNewDoc = () => {
    addNewMeasurementDocument(state)
  }

  const renderClients = ({ item, index }) => {
    const mesDoc: T_measurement_Document = item
    const textStyle = { fontSize: 17 }
    const lastMeasurement = mesDoc.measurements.length > 0 ? mesDoc.measurements[mesDoc.measurements.length - 1] : null

    return (
      <Pressable
        onPress={() => dispatch({ type: "start editing client measurements", value: mesDoc.docID })}
        onLongPress={() => onPressDeleteDoc(item)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View>
            <Text style={textStyle}>{mesDoc.client ? mesDoc.client.Name : "no client yet"}</Text>
            <Text style={textStyle}>
              {mesDoc.measurements.length === 1 ? "1 измерване" : `${mesDoc.measurements.length} измервания`}
            </Text>
          </View>
          <View>
            <Text style={{ ...textStyle, textAlign: "center" }}>
              {lastMeasurement ? `${dateHelper.displayDateFromTimestampFullMonth(lastMeasurement.dateStamp)}` : ""}
            </Text>
          </View>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <DefaultHeader mainText={`Измервания`} onPressLeft={() => (isGoingBack() ? navigation.goBack() : null)} />
      {state.isEditing && <ShowClientMeasurements state={state} dispatch={dispatch} />}
      {!state.isEditing && (
        <FlatList
          data={state.measurementDocs}
          keyExtractor={(item, index) => `${item.docID}+${index}`}
          renderItem={renderClients}
          ListHeaderComponent={renderHeader}
          ItemSeparatorComponent={() => <View style={{ height: 5, borderWidth: 1 }}></View>}
        />
      )}
      {!state.isEditing && <FAB onPress={onPressAddNewDoc} />}
    </View>
  )
}
