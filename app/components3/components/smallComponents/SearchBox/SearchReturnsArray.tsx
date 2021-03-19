import React, { useState, useRef } from "react"
import { View, Pressable, FlatList } from "react-native"
import { TextInput } from "react-native-paper"
import { Text } from "../../smallWrappers/smallWrappers"
import { colors } from "../../../Constants"

import { getSuggestions } from "./functions"

type FilterMethods = "words" | "alphabetical"

type SearchProps = {
  array: any[]
  extractFilterItem: (item) => any
  filterMethods?: FilterMethods[]
  otherTextInputProps?: React.ComponentProps<typeof TextInput>
  onChange: (any) => void
}

export const SearchAndFilter: React.FC<SearchProps> = props => {
  const [suggestions, setSuggestions] = useState([])
  const { array, extractFilterItem, filterMethods } = props
  const [searchText, setSearchText] = useState("")

  const onChangeText = newText => {
    setSearchText(newText)
    const suggestions = getSuggestions(
      newText,
      array,
      extractFilterItem,
      filterMethods || ["words"],
    )
    props.onChange(suggestions)
  }
  return (
    <View>
      <TextInput value={searchText} onChangeText={onChangeText} {...props.otherTextInputProps} />
    </View>
  )
}
