import React from "react"
import { View, StyleSheet, Modal } from "react-native"
import { Text, Button, colors, icons, T_measurementTypes } from "../../../../components3"

import { FAB as FAB_O } from "react-native-paper"

type FAB_Props = {
  onPress: () => any
  icon?: string
  moreStyle?: any
}
export const FAB: React.FC<FAB_Props> = props => {
  return <FAB_O icon={icons.plus} style={styles.fab} color={"white"} small={true} {...props} />
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.green2,
  },
})

type typeNamePair = {
  Name: string
  Type: T_measurementTypes
}
const buttonTypes: typeNamePair[] = [
  { Type: "daily activity calculator", Name: "активност" },
  { Type: "skinfold caliper", Name: "калипер" },
  { Type: "tape measure", Name: "шивашки метър" },
]
type ChooseMesBoxProps = {
  onChoose: (choice: T_measurementTypes) => any
}
export const ChooseMeasurementBox: React.FC<ChooseMesBoxProps> = props => {
  return (
    <View style={{ backgroundColor: "#fff", padding: 20 }}>
      <Text>Избери измерване</Text>
      <View style={{ flexDirection: "row" }}>
        {buttonTypes.map(pair => {
          return (
            <Button
              onPress={() => {
                props.onChoose(pair.Type)
              }}
              color={colors.blue3}
              key={`${pair.Name}+${pair.Type}`}
              compact={true}
              labelStyle={{ fontSize: 13 }}
            >
              {pair.Name}
            </Button>
          )
        })}
      </View>
    </View>
  )
}

type ChooseMeasurementProps = React.ComponentProps<typeof Modal> & {
  onChoose: (choice: T_measurementTypes) => any
}
export const ChooseMeasurement: React.FC<ChooseMeasurementProps> = props => {
  return (
    <Modal transparent={true} {...props}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00000080",
        }}
      >
        <ChooseMeasurementBox onChoose={props.onChoose} />
      </View>
    </Modal>
  )
}
