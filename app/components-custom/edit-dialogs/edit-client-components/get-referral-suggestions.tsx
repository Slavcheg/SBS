import React, { useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite"
import {styles} from '../styles'

interface GetReferralSuggestionsProps {
    searchString: string
    isVisible: boolean,
    onTouch: Function
}

export const GetReferralSuggestions: React.FunctionComponent<GetReferralSuggestionsProps> = observer(props => {
    const { referralStore } = useStores()
    const { onTouch, searchString, isVisible } = props
    
    useEffect(() => {
        referralStore.getItems()
    }, [])   
    
    return (
        <View
            style={[{
                display: isVisible? 'flex': 'none',
                width: '100%'
            }]}
        >
            {
                referralStore.referrals?.filter(ref => ref.item.name.includes(searchString))
                    .map(ref => {
                        return  <TouchableOpacity
                                style={[
                                    styles.inputContainerStyle,
                                    {
                                        marginVertical: 2,
                                        paddingVertical: 10
                                    }
                                ]}
                                key={ref.item.name}
                                onPress={() => onTouch(ref.item.name)}
                            >
                            <Text
                                    style={[
                                        styles.inputTextStyle
                                    ]}
                                >{ref.item.name}</Text>
                            </TouchableOpacity>
                    })
            }
        </View>
    )
})