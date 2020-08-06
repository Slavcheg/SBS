import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { Hoshi } from "react-native-textinput-effects"
import { color, spacing } from "../../theme"

export const RequiredWarning: React.FunctionComponent<{flag: boolean, width: string}> = props => {
    return (
        <View
            style={[{width: props.width}]}
        >
            {props.flag? 
                <Text
                    style={[{
                        color: 'red',
                        fontSize: 12,
                        width: '100%'
                    }]}
                >{'Полето е задължително!'}</Text>
            : null}
        </View>
    )
}