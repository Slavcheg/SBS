import React from "react"
import { View, FlatList } from "react-native"
import { Button } from "react-native-paper"

import { ExpandableContent, ShowProgramDays, Text } from "./index"
import iStyles from "../../../../components3/Constants/Styles"
import { colors } from "../../../../components3/Constants"

type ProgramPicker = {
  isVisible?: boolean
  programs: any[]
  onGoBack: Function
  state: any
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
            Копирай от тази програма
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
      <Text style={{ fontSize: 20, color: colors.grey1 }}>
        Тази настройка ще копира всички дни от избраната програма върху тази, която редактирате.
        Заместването на седмиците ще започне от 'сегашната' избрана седмица в програмата (в случая
        това е седмица {props.state.currentWeekIndex + 1})
      </Text>
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
