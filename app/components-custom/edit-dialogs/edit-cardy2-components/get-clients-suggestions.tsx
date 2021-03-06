import React, { useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite"
import {styles} from '../styles'

interface GetClientsSuggestionsProps {
    searchString: string
    onTouch: Function
}

export const GetClientsSuggestions: React.FunctionComponent<GetClientsSuggestionsProps> = observer(props => {
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
                userStore2.clients?.filter(cl => cl.item.email.includes(searchString))
                .map((client, index) => {
                    return  <TouchableOpacity
                                style={[
                                    styles.inputContainerStyle,
                                    {
                                        marginVertical: 2,
                                        paddingVertical: 10
                                    }
                                ]}
                                key={client.item.email}
                                onPress={() => onTouch(client.item.email)}
                            >
                            <Text
                                    style={[
                                        styles.inputTextStyle
                                    ]}
                                >{client.item.email}</Text>
                            </TouchableOpacity>
                })
            }
        </View>
    )
})