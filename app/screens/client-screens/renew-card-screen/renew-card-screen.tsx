import React, { useEffect, useState } from "react"
import { View } from "react-native";
import {Button, Screen} from '../../../components'
import { spacing, color } from '../../../theme';

export function RenewCardScreen({navigation}) {

    return (
        <Screen 
            preset="scroll"
            unsafe={true}
            style={{ 
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'flex-start',
            backgroundColor: color.palette.blue_sbs
            }}
        >

      </Screen>
    )
}