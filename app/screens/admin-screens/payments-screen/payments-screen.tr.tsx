import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr } from '../../../components'
import { color } from '../../../theme';
import { Accordeon } from "../../../components"
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { View } from "react-native";
import { border_boxes } from "../../../global-helper";

interface PaymentScreenProps extends NavigationProps {}

export const PaymentsScreen: React.FunctionComponent<PaymentScreenProps> = observer(props => {
    const userStore = useStores().userStore
    
    useEffect(() => {
        userStore.ggetItems()
    }, [])
    
    const { navigation } = props
    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flexGrow: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.grey_sbs
            }}
        >
        <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25, backgroundColor: 'white'}} title='Плащания'/>
        <Accordeon 
            trainers={
                userStore.trainers.map(trainer => {
                    return {
                        title: trainer.item.email,
                        expanded: false
                    }
                })
            } 
        />
        </Screen>
    )
})