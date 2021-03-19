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
  keyExtractor: (item, index?) => any
  onSelect: (item, index?) => any
  renderItem: ({ item, index }) => any
  filterMethods: FilterMethods[]
  otherTextInputProps?: React.ComponentProps<typeof TextInput>
  otherFlatListProps?: React.ComponentProps<typeof FlatList>
  renderCancel?: () => any
  startWithSuggestions?: boolean
}

export const SearchAndChoose: React.FC<SearchProps> = props => {
  const { array, extractFilterItem, keyExtractor, filterMethods } = props
  const [searchText, setSearchText] = useState("")
  const [suggestions, setSuggestions] = useState(
    props.startWithSuggestions ? getSuggestions("", array, extractFilterItem, filterMethods) : [],
  )

  const searchRef = useRef(null)

  const onFocusInput = () => {
    setSuggestions(getSuggestions(searchText, array, extractFilterItem, filterMethods))
  }

  const onChangeText = newText => {
    setSearchText(newText)
    setSuggestions(getSuggestions(newText, array, extractFilterItem, filterMethods))
  }

  const onSelectItem = (item, index) => {
    props.onSelect(item, index)
    setSuggestions([])
    searchRef.current.clear()
  }

  const renderItems = ({ item, index }) => {
    return (
      <Pressable onPress={() => onSelectItem(item, index)}>
        {props.renderItem({ item, index })}
      </Pressable>
    )
  }

  const onPressCancel = () => {
    setSuggestions([])
  }

  return (
    <View>
      <TextInput
        onFocus={onFocusInput}
        value={searchText}
        onChangeText={onChangeText}
        // onBlur={onBlur}
        {...props.otherTextInputProps}
        ref={searchRef}
      />
      {suggestions.length > 0 && (
        <Pressable onPress={onPressCancel}>
          {props.renderCancel ? (
            props.renderCancel
          ) : (
            <Text style={{ fontSize: 20, textAlign: "center", color: colors.red }}>cancel</Text>
          )}
        </Pressable>
      )}
      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => keyExtractor(item, index)}
        renderItem={renderItems}
        keyboardShouldPersistTaps={"always"}
        {...props.otherFlatListProps}
      />
    </View>
  )
}
