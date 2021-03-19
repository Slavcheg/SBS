import React from "react"
import { View, ScrollView, useWindowDimensions } from "react-native"

import {
  Text,
  Button,
  colors,
  icons,
  EditableProperty,
  ToggleButton,
  SearchAndChoose,
  T_client_short,
} from "../../../../../components3"
import * as functions from "../functions/functions"

import { useCardStateType } from "../cardsReducer"
import { FlatList } from "react-native-gesture-handler"

type EditCardProps = {
  stateAction: useCardStateType
}

export const EditCard: React.FC<EditCardProps> = props => {
  const [state, dispatch] = props.stateAction()

  // const [tempCardPrice, setTempCardPrice] = useTempValue(
  //   state.card.cardType.price,
  //   newValue => dispatch({ type: "change card price", value: newValue }),
  //   [state],
  // )

  // const [tempPricePerSession, setTempPricePerSession] = useTempValue(
  //   state.card.cardType.pricePerSession,
  //   newValue => dispatch({ type: "change card price per session", value: newValue }),
  //   [state],
  // )

  const { card } = state
  const windowWidth = useWindowDimensions().width
  const row1Width = windowWidth / 3.5
  const row2Width = windowWidth / 3.5

  const onSelectClient = (item, index) => {
    dispatch({ type: "add client", value: item })
  }

  const onRemoveClient = clientID => {
    dispatch({ type: "remove client", value: clientID })
  }

  const clientString = (client: T_client_short) =>
    `${client.Name} ${client.FamilyName} ${client.ClientNumber || ""}`

  const renderSearchingClients = ({ item, index }) => {
    return (
      <View>
        <Text style={{ fontSize: 20 }}>{clientString(item)}</Text>
      </View>
    )
  }

  const renderAddedClients = ({ item, index }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ textAlign: "center" }}>
          {clientString(state.downloadedClients.find(client => client.ID === item))}
        </Text>
        <Button
          icon={icons.trash}
          onPress={() => onRemoveClient(item)}
          color={colors.red}
          children={""}
          compact={true}
        />
      </View>
    )
  }
  /// copy of top block but for trainers, should think of refactoring to not repeat?

  const onSelectTrainer = (item, index) => {
    dispatch({ type: "add trainer", value: item })
  }

  const onRemoveTrainer = clientID => {
    dispatch({ type: "remove trainer", value: clientID })
  }

  const renderSearchingTrainers = ({ item, index }) => {
    return (
      <View>
        <Text style={{ fontSize: 20 }}>{clientString(item)}</Text>
      </View>
    )
  }

  const renderAddedTrainers = ({ item, index }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ textAlign: "center" }}>
          {clientString(state.downloadedClients.find(client => client.ID === item))}
        </Text>
        <Button
          icon={icons.trash}
          onPress={() => onRemoveTrainer(item)}
          color={colors.red}
          children={""}
          compact={true}
        />
      </View>
    )
  }

  if (!card)
    return (
      <View>
        <Text>card null</Text>
      </View>
    )
  return (
    <ScrollView style={{ height: "80%" }}>
      {state.downloadedClients.length > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>Clients</Text>
            <FlatList
              data={card.clientIDs}
              keyExtractor={item => item}
              renderItem={renderAddedClients}
            />
          </View>
          <View style={{ width: windowWidth / 2 }}>
            <SearchAndChoose
              array={state.downloadedClients}
              extractFilterItem={(item: T_client_short) => clientString(item)}
              filterMethods={["words"]}
              keyExtractor={(item: T_client_short) => item.ID}
              onSelect={(item: T_client_short, index: number) => onSelectClient(item, index)}
              renderItem={renderSearchingClients}
            />
          </View>
        </View>
      )}
      {state.downloadedClients.length > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>Trainers</Text>
            <FlatList
              data={card.trainerIDs}
              keyExtractor={item => item}
              renderItem={renderAddedTrainers}
            />
          </View>
          <View style={{ width: windowWidth / 2 }}>
            <SearchAndChoose
              array={state.downloadedClients}
              extractFilterItem={(item: T_client_short) => clientString(item)}
              filterMethods={["words"]}
              keyExtractor={(item: T_client_short) => item.ID}
              onSelect={(item: T_client_short, index: number) => onSelectTrainer(item, index)}
              renderItem={renderSearchingTrainers}
            />
          </View>
        </View>
      )}
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 20 }}>Card type:</Text>
        <ToggleButton
          onChangeValue={() =>
            dispatch({
              type: "change card variant",
              value: card.cardType.variant === "visits" ? "monthly" : "visits",
            })
          }
          value={card.cardType.variant === "visits" ? true : false}
          textTrue={"на посещения"}
          textFalse={"месечна карта"}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <EditableProperty
          PropertyName="Цена на картата"
          PropertyValue={card.cardType.price}
          onEndEditing={newValue => dispatch({ type: "change card price", value: newValue })}
          width={row1Width}
          moreDependencies={[state]}
        />
        <EditableProperty
          PropertyName="Брой посещения"
          PropertyValue={card.cardType.sessions_limit}
          onChangeValue={newValue =>
            dispatch({
              type: "change card sessions limit",
              value: newValue,
            })
          }
          width={row1Width}
          disabled={card.cardType.variant === "monthly" ? true : false}
          moreDependencies={[state]}
        />
        <EditableProperty
          PropertyName="Цена на посещение"
          PropertyValue={card.cardType.pricePerSession}
          onEndEditing={newValue =>
            dispatch({ type: "change card price per session", value: newValue })
          }
          width={row1Width}
          disabled={card.cardType.variant === "monthly" ? true : false}
          moreDependencies={[state]}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <EditableProperty
          PropertyName="Име на картата"
          PropertyValue={card.cardType.title}
          onChangeValue={newValue =>
            dispatch({
              type: "change card title",
              value: newValue,
            })
          }
          width={"64%"}
        />

        <EditableProperty
          PropertyName="Месечен лимит"
          PropertyValue={card.cardType.monthly_limit}
          onChangeValue={newValue =>
            dispatch({
              type: "change card monthly limit",
              value: newValue,
            })
          }
          width={row2Width}
        />
      </View>
      <EditableProperty
        PropertyName="comments"
        PropertyValue={card.comments}
        onChangeValue={newValue => dispatch({ type: "change comments", value: newValue })}
      />

      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <Button onPress={() => dispatch({ type: "make card null" })}>cancel</Button>
        <Button onPress={() => dispatch({ type: "save card", value: card })}>save</Button>
      </View>
    </ScrollView>
  )
}
