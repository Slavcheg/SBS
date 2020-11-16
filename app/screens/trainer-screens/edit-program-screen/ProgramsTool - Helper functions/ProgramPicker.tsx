import React from "react"
import { View, Text, FlatList } from "react-native"
import { Button } from "react-native-paper"

import { IProgram_Model, state } from "../../../../models/sub-stores"

import { ExpandableContent, ShowProgramDays } from "./index"
import iStyles from "../Constants/Styles"

type ProgramPicker = {
  isVisible?: boolean
  programs: IProgram_Model[]
  onGoBack: Function
  state: state
  onCopyWholeProgram: Function
}

export const ProgramPicker: React.FC<ProgramPicker> = props => {
  const renderPrograms = ({ item, index }) => {
    return (
      <View>
        <ExpandableContent
          title={item.item.Name}
          titleStyle={iStyles.text1}
          key={index}
          startMinimized={true}
        >
          <Button
            mode="contained"
            style={{ width: "90%", justifyContent: "center", alignSelf: "center" }}
            color={iStyles.text1.color}
            onPress={() => props.onCopyWholeProgram(item)}
          >
            Copy this program
          </Button>

          <ShowProgramDays
            mode="smallPreview"
            state={{
              ...props.state,
              currentProgram: item.item,
              currentWeekIndex: 0,
            }}
          />
        </ExpandableContent>
      </View>
    )
  }

  if (!props.isVisible) return <View></View>
  return (
    <View>
      <FlatList
        data={props.programs.filter(program => program.id != props.state.programID)}
        renderItem={renderPrograms}
        keyExtractor={item => item.id}
        listKey={"asdf"}
      />
      <Button onPress={props.onGoBack} color={iStyles.text3.color}>
        close
      </Button>
    </View>
  )
}
