import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr } from '../../../components'
import { color } from '../../../theme';
import { Accordeon } from "../../../components"

export function PaymentsScreen({navigation}) {

    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flex: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.grey_sbs
            }}
        >
        <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25, backgroundColor: 'white'}} title='Плащания'/>
        <Accordeon array={[]} />
        </Screen>
    )
}