import React from "react"
import { View, FlatList, useWindowDimensions, TextStyle } from "react-native"
import { Text, colors, getFatEval, T_fat_eval_result } from "../../../../../components3"
import _ from "lodash"
import { errors } from "./errors"

export type T_person = {
  age: number
  sex: "male" | "female" | "other"
  fatPercent: number
}
type FatEvalRowProps = {
  person: T_person
}

export const FatEvalRow: React.FC<FatEvalRowProps> = ({ person }) => {
  const window = useWindowDimensions()

  const renderEval = (item: T_fat_eval_result, index, person, results) => {
    const textStyle: TextStyle = {
      fontSize: 17,
      color: item.comparison === "current" ? colors.blue2 : colors.grey1,
      textAlign: "center",
    }
    return (
      <View style={{ width: window.width / 5 }}>
        <Text style={textStyle}>{item.bodyFatRanges}</Text>
        <Text style={textStyle}>{item.score}</Text>
      </View>
    )
  }

  if (person.sex !== "other") {
    const error = errors.fatEval(person)
    if (error) return <Text style={errors.errorStyle}>{error}</Text>

    const results = getFatEval(person.sex, person.age, person.fatPercent)

    return (
      <View style={{}}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          {results[0].personGroup} и {person.fatPercent}% мазнини
        </Text>
        <FlatList
          horizontal={true}
          data={results}
          keyExtractor={(item, index) => `${index}+${Math.random()}`}
          renderItem={({ item, index }) => renderEval(item, index, person, results)}
        />
      </View>
    )
  } else {
    // const resultsMale = getFatEval("male", person.age, person.fatPercent)
    // const resultsFemale = null

    return <View></View>
  }
}
