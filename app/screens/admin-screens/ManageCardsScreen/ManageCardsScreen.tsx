import React, { useEffect, useReducer, useState } from "react"
import { View, FlatList, Pressable } from "react-native"
import firestore from "@react-native-firebase/firestore"

import {
  Text,
  colors,
  fonts,
  icons,
  useGlobalState,
  getState,
  Button,
  TextInput,
  DEFAULT_CARD,
  Loading,
  cardModel,
  CARDS_COLLECTION,
  T_client_short,
  T_trainer_short,
  SearchAndFilter,
  T_card,
} from "../../../components3"

import {
  EditCard,
  functions,
  Alerts,
  EditCardsReducer,
  cardStateUseReducer,
  useCardState,
  loadCards,
  loadClients,
  ReducerAddNewCard,
  ReducerRemoveCard,
} from "./Components"

export const ManageCardsScreen = ({ navigation }) => {
  const [globalState, setGlobalState] = useGlobalState()

  const [state, dispatch] = useCardState()
  const { isEditingCard } = state

  // const [editableCard, setEditableCard] = useReducer<cardStateUseReducer>(EditCardsReducer, {
  //   ...DEFAULT_CARD,
  // })
  let mounted = true

  useEffect(() => {
    getState(setGlobalState)
    return () => (mounted = false)
  }, [])

  useEffect(() => {
    let subscriber
    const handleChange = newCards => {
      if (globalState.loggedUser.ID) dispatch({ type: "load cards", value: newCards })
    }
    if (globalState.loggedUser.ID) {
      subscriber = firestore()
        .collection(CARDS_COLLECTION)
        .onSnapshot(query => {
          const downloadedCards = []
          query.forEach(doc => {
            downloadedCards.push(doc.data())
          })
          handleChange(downloadedCards)
        })
    }
    return () => {
      if (subscriber) subscriber()
    }
  }, [globalState.loggedUser.ID])

  useEffect(() => {
    loadClients(dispatch, mounted)
  }, [])

  useEffect(() => {
    loadCards(dispatch, mounted)
  }, [state.refreshString])

  const onPressAddNewCard = () => {
    ReducerAddNewCard(dispatch, mounted)
  }

  const onPressEditCard = (card: cardModel) => {
    if (mounted) {
      if (isEditingCard) {
        dispatch({ type: "make card null" })
      } else {
        dispatch({ type: "choose a different card", value: card })
      }
    }
  }

  const onPressDeleteCard = (card: cardModel) => {
    const onConfirmDelete = () => {
      ReducerRemoveCard(card, dispatch, mounted)
    }

    Alerts.ConfirmDelete(card, onConfirmDelete)
  }

  const renderPerson = ({ item }) => {
    const person: T_client_short = item
    return <Text> {person.Name}</Text>
  }

  const renderCards = ({ item, index }) => {
    const card: cardModel = item

    return (
      <View>
        <Pressable
          onPress={() => onPressEditCard(item)}
          onLongPress={() => onPressDeleteCard(item)}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View>
              {/* <Text>Card ID: {card.cardID}</Text> */}
              {card.cardType.variant === "monthly" && (
                <View>
                  <Text>Months: /{card.cardType.monthly_limit}</Text>
                </View>
              )}
              {card.cardType.variant === "visits" && (
                <View>
                  <Text>
                    Sessions: {card.cardType.sessions_limit - card.sessions.length}/{" "}
                    {card.cardType.sessions_limit}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <FlatList
                data={card.clients}
                keyExtractor={item => item.ID}
                renderItem={renderPerson}
                ListHeaderComponent={() => <Text>Clients: </Text>}
                horizontal={true}
              />
              <FlatList
                data={card.trainers}
                keyExtractor={item => item.ID}
                renderItem={renderPerson}
                ListHeaderComponent={() => <Text>Trainers: </Text>}
                horizontal={true}
              />
            </View>
          </View>
        </Pressable>
      </View>
    )
  }

  const getFilterString = (item: T_card) => {
    let string = ``
    item.clients.forEach(client => {
      string += `${client.Name} ${client.FamilyName} ${client.ClientNumber}`
    })
    item.trainers.forEach(client => {
      string += `${client.Name} ${client.FamilyName} ${client.ClientNumber}`
    })
    return string
  }

  if (!globalState) return <Loading />
  return (
    <View>
      <Text>
        manage cards screen, clients: {state.downloadedClients.length} cards:{" "}
        {state.downloadedCards.length}
      </Text>
      <Text>isEditingCard: {state.isEditingCard.toString()}</Text>
      <Button icon={icons.plus} color={colors.green2} onPress={onPressAddNewCard}>
        add new card
      </Button>
      {state.isEditingCard && <EditCard stateAction={() => [state, dispatch]} />}
      {/* {isEditingCard && <EditCard cardReducer={EditCardsReducer} />} */}
      {!state.isEditingCard && (
        <View>
          <SearchAndFilter
            array={state.downloadedCards}
            extractFilterItem={(item: T_card) => getFilterString(item)}
            onChange={(cards: T_card[]) => dispatch({ type: "filter cards", value: cards })}
          />

          <FlatList
            data={state.filteredCards}
            keyExtractor={(item: cardModel, index) => `${item.cardID}${index * Math.random()}`}
            renderItem={renderCards}
            ItemSeparatorComponent={() => <View style={{ height: 10, borderWidth: 1 }}></View>}
            extraData={state.downloadedCards}
          />
        </View>
      )}
    </View>
  )
}
