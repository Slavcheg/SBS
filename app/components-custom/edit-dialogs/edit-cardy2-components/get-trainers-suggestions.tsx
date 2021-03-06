import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { color, spacing } from "../../../theme"
import { useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite"
import {styles} from '../styles'

interface GetTrainersSuggestionsProps {
    searchString: string
    onTouch: Function
}

export const GetTrainersSuggestions: React.FunctionComponent<GetTrainersSuggestionsProps> = observer(props => {
    const { userStore2 } = useStores()
    const { onTouch, searchString } = props

    useEffect(() => {
        userStore2.getItems()
    }, [])    

    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                userStore2.trainers?.filter(tr => tr.item.email.includes(searchString))
                .map((trainer, index) => {
                    return  <TouchableOpacity
                                style={[
                                    styles.inputContainerStyle,
                                    {
                                        marginVertical: 2,
                                        paddingVertical: 10
                                    }
                                ]}
                                key={index}
                                onPress={() => onTouch(trainer.item.email)}
                            >
                            <Text
                                    style={[
                                        styles.inputTextStyle
                                    ]}
                                >{trainer.item.email}</Text>
                            </TouchableOpacity>
                })
            }
        </View>
    )
})