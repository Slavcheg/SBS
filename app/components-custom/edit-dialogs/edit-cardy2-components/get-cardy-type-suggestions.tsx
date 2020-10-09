import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { color, spacing } from "../../../theme"
import { useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite"
import {styles} from '../styles'


interface GetCardyTypeSuggestionsProps {
    onTouch: Function
}

export const GetCardyTypeSuggestions: React.FunctionComponent<GetCardyTypeSuggestionsProps> = observer(props => {
    const { cardyTypesStore2 } = useStores()
    const { onTouch } = props

    useEffect(() => {
        cardyTypesStore2.getItems()
    }, [])    

    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                cardyTypesStore2.cards?.map((card_type, index) => {
                    return  <TouchableOpacity
                                style={[
                                    styles.inputContainerStyle,
                                    {
                                        marginVertical: 2,
                                        paddingVertical: 10
                                    }
                                ]}
                                key={index}
                                onPress={() => onTouch(card_type.item)}
                            >
                            <Text
                                    style={[
                                        styles.inputTextStyle
                                    ]}
                                >{card_type.item.title}</Text>
                            </TouchableOpacity>
                })
            }
        </View>
    )
})