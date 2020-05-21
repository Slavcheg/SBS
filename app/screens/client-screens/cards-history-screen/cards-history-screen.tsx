import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button, SbsCard } from '../../../components'
import { color } from "../../../theme"
import { View, Text } from "react-native"
import { static_cards, border_boxes } from "../../../global-helper"
import { Badge, Avatar } from "react-native-elements"

export function CardsHistoryScreen({navigation}) { 

const cards = static_cards.map((card, index) => {
    return (
       <SbsCard key={index} index={index} card={card} />
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
}