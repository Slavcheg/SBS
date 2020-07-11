import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button, SbsCard } from '../../../components'
import { color } from "../../../theme"
import { View, Text } from "react-native"
import { static_cards, border_boxes } from "../../../global-helper"
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";

interface CardsHistoryScreenProps extends NavigationProps {}

export const CardsHistoryScreen: React.FunctionComponent<CardsHistoryScreenProps> = observer(props => {
    const { cardStore, sessionStore } = useStores()
    const { navigation } = props
    
    useEffect(() => {
        cardStore.getCards()
    }, [])

    const cards = cardStore.cards
        .filter(card => card.item.client === sessionStore.userEmail)
        .map((card, index) => {
            const item = card.item
            return (
            <SbsCard key={index} index={index} card={item} />
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
                    padding: 45,
                    backgroundColor: color.palette.grey_sbs
                }]}
            >
                {cards}
            </View>
        </Screen>
    )
})
