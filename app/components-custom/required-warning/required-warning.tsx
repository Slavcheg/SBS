import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { Hoshi } from "react-native-textinput-effects"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n"

export const RequiredWarning: React.FunctionComponent<{flag: boolean, width: string, message?:string}> = props => {
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
                >{props.message || translate('generic.required_field')}</Text>
            : null}
        </View>
    )
}