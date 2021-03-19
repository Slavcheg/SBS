import React, { useState } from "react"
import { Button, Text } from "../smallWrappers/smallWrappers"
import { View, FlatList } from "react-native"
import { icons, colors } from "../../Constants"
import { useTrainerClients } from "../hooks"
import { T_client_short } from "../../types"
import { SearchAndChoose } from "."

type BackButtonProps = React.ComponentProps<typeof Button>

export const BackButton: React.FC<BackButtonProps> = props => {
  return (
    <Button
      icon={icons.arrowLeftBold}
      compact={true}
      mode="contained"
      style={{ margin: 2 }}
      color={colors.blue3}
      {...props}
    ></Button>
  )
}

export const MenuButton: React.FC<BackButtonProps> = props => {
  return <Button icon={icons.menu} compact={true} mode="contained" style={{ margin: 2 }} color={colors.blue3} {...props}></Button>
}

type CancelConfirmProps = {
  onCancel: any
  onConfirm: any
}

export const CancelConfirm: React.FC<CancelConfirmProps> = props => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
      <Button onPress={props.onCancel} color="red">
        cancel
      </Button>
      <Button onPress={props.onConfirm}>confirm</Button>
    </View>
  )
}

type ChooseClientProps = {
  clientID: string
  onSelectClient: (newClient: T_client_short) => void
}
export const ChooseClient: React.FC<ChooseClientProps> = props => {
  const trainerClients = useTrainerClients()
  const currentClientID = props.clientID ? props.clientID : null
  const [isChoosing, setIsChoosing] = useState(false)

  const renderClients = ({ item, index }) => {
    const clientItem = item
    return (
      <View>
        <Text>{clientItem.Name}</Text>
      </View>
    )
  }

  const onSelect = (newClient: T_client_short) => {
    props.onSelectClient(newClient)
    setIsChoosing(false)
  }

  const client = trainerClients.find(client => client.ID === currentClientID)
  return (
    <View>
      {client ? (
        <Button onPress={() => setIsChoosing(!isChoosing)}>{client.Name}</Button>
      ) : (
        <Button color={colors.red} onPress={() => setIsChoosing(!isChoosing)}>
          {"> > избери клиент < <"}
        </Button>
      )}
      {isChoosing && (
        <SearchAndChoose
          array={trainerClients}
          extractFilterItem={(item: T_client_short) => `${item.Name} ${item.FamilyName} ${item.ClientNumber}`}
          startWithSuggestions={true}
          filterMethods={["words"]}
          keyExtractor={item => item.ID}
          onSelect={onSelect}
          renderItem={({ item }) => (
            <Text style={{ fontSize: 20, textAlign: "center" }}>{`${item.Name} ${item.FamilyName} ${item.ClientNumber}`}</Text>
          )}
        />
      )}
    </View>
  )
}
