import React from "react"
import { View, FlatList, TextStyle } from "react-native"

import { Text, Button, colors, icons, T_measurement, ChooseClient, T_client_short, T_Client_Sex } from "../../../../components3"

import { T_State_Measurements, T_Dispatch_Measurements } from "../MeasureClients_Reducer"
import * as dateHelper from "../../../../global-helper/global-date-helper/global-date-helper"

import { Alerts } from "./alerts"

import { EditMeasurements } from "./EditMeasurementComponents"

type ShowClientMeasurements_Props = {
  state: T_State_Measurements
  dispatch: T_Dispatch_Measurements
}
export const ShowClientMeasurements: React.FC<ShowClientMeasurements_Props> = props => {
  const { state, dispatch } = props

  const client = state.editedDoc && state.editedDoc.client ? state.editedDoc.client : null

  const renderMeasurements = ({ item, index }) => {
    return <RenderMeasurement state={state} dispatch={dispatch} measurement={item} mesIndex={index} />
  }
  if (!state || !state.editedDoc) return <View></View>

  const clientSex: T_Client_Sex = state.editedDoc.sex

  return (
    <View style={{ flex: 1 }}>
      <ChooseClient
        clientID={state.editedDoc.clientID}
        onSelectClient={(newClient: T_client_short) => dispatch({ type: "change client", value: newClient })}
      />
      {client && (
        <View>
          <Text>
            Име: {client.Name} {client.FamilyName} #{client.ClientNumber}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Пол: </Text>
        <Button
          color={clientSex === "male" ? colors.blue3 : colors.grey1}
          onPress={() => dispatch({ type: "change client sex", value: "male" })}
        >
          Мъж
        </Button>
        <Button
          color={clientSex === "female" ? colors.blue3 : colors.grey1}
          onPress={() => dispatch({ type: "change client sex", value: "female" })}
        >
          Жена
        </Button>
        {/* <Button
          color={clientSex === "other" ? colors.blue3 : colors.grey1}
          onPress={() => dispatch({ type: "change client sex", value: "other" })}
        >
          Друг
        </Button> */}
      </View>

      {state.editedMeasurementIndex !== null && (
        <EditMeasurements
          state={state}
          dispatch={dispatch}
          measurement={state.editedDoc.measurements[state.editedMeasurementIndex]}
        />
      )}
      {state.editedMeasurementIndex === null && (
        <FlatList
          data={state.editedDoc.measurements}
          keyExtractor={(item, index) => `${index + Math.random()}`}
          renderItem={renderMeasurements}
          ItemSeparatorComponent={() => <View style={{ borderWidth: 1, height: 10 }}></View>}
          ListHeaderComponent={() => (
            <Text style={{ textAlign: "center", fontSize: 20 }}>Измервания: {state.editedDoc.measurements.length}</Text>
          )}
          ListFooterComponent={() => (
            <View>
              <View style={{ borderWidth: 1, height: 10 }}></View>
              <Button color={colors.green2} onPress={() => dispatch({ type: "add another measurement" })}>
                добави измерване
              </Button>
            </View>
          )}
        />
      )}

      <View style={{ justifyContent: "flex-end", bottom: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {!state.saved ? (
            <Button onPress={() => dispatch({ type: "cancel editing client measurements" })} color={colors.red}>
              cancel
            </Button>
          ) : (
            <View style={{ width: 5 }}></View>
          )}
          <Button disabled={state.saved} onPress={() => dispatch({ type: "save measurements" })}>
            {state.saved ? "saved" : "save"}
          </Button>
        </View>
      </View>
    </View>
  )
}

type MeasurementProps = {
  state: T_State_Measurements
  dispatch: T_Dispatch_Measurements
  measurement: T_measurement
  mesIndex: number
}

const RenderMeasurement: React.FC<MeasurementProps> = props => {
  const { dispatch, measurement, mesIndex } = props
  const dateString = dateHelper.displayDateFromTimestampFullMonth(measurement.dateStamp)

  const onPressDelete = () => {
    const onConfirm = () => {
      dispatch({ type: "delete measurement", value: mesIndex })
    }
    Alerts.ConfirmDeleteMeasurement(measurement, onConfirm)
  }

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Button
          onPress={() => {
            dispatch({ type: "choose measurement to edit", value: mesIndex })
          }}
          style={{ flex: 1 }}
        >{`${measurement.weight ? `${measurement.weight} kg - ` : ""} ${dateString}`}</Button>
        <Button icon={icons.delete} onPress={onPressDelete} compact={true} color={colors.red} style={{ flex: 0.2 }}>
          {""}
        </Button>
      </View>
    </View>
  )
}
