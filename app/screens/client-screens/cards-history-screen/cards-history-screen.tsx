import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button, SbsCard, SbsCardPurchased } from '../../../components'
import { color } from "../../../theme"
import { View, Text } from "react-native"
import { static_cards, border_boxes } from "../../../global-helper"
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";

interface CardsHistoryScreenProps extends NavigationProps {}

export const CardsHistoryScreen: React.FunctionComponent<CardsHistoryScreenProps> = observer(props => {
    const { cardyStore2, sessionStore } = useStores()
    const { navigation } = props
    
    useEffect(() => {
        cardyStore2.getItems()
    }, [])

    const cards = cardyStore2.cards
        .filter(card => card.item.clients.toString().includes(sessionStore.userEmail))
        .map((card, index) => {
            const item = card.item
            return (
            <SbsCardPurchased key={index} cardyModel={card} />
            )
        })

    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flexGrow: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.transparent,
            }}
        >
            <PageHeader_Cl 
                navigation={navigation} 
                style={{paddingHorizontal: 25, backgroundColor: 'white'}}
                title={'ИСТОРИЯ НА ПЛАЩАНИЯТА'} 
            />
            <View
                style={[
                    // border_boxes().orange,
                    {
                    flexGrow: 1,
                    width: '100%',
                    paddingVertical: 45,
                    alignItems: 'center',
                    backgroundColor: color.palette.grey_sbs
                }]}
            >
                {cards}
            </View>
        </Screen>
    )
})
