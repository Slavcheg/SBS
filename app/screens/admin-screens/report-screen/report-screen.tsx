import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr } from '../../../components'
import { color } from '../../../theme';
import { Accordeon } from "../../../components"
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { View, Text } from "react-native";
import { border_boxes } from "../../../global-helper";
import { Card } from "react-native-elements";

export const CardsReport: React.FunctionComponent<{}> = observer(props => {
    const cardStore = useStores().cardStore
    useEffect(() => {
        cardStore.getCards()
    }, [])

    return(
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                cardStore.cards.map((card, key) => {
                    const item = card.item
                    return  <View 
                                key={key}
                                style={[{
                                    paddingVertical: 5,
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    backgroundColor: key % 2 !== 1 ? 'white': color.palette.grey_sbs
                                }]}
                            >
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.client.split('@', 1) + '   '}
                                </Text>
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.visits.length + '   '}
                                </Text>
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.card_limit + '   '}
                                </Text>
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.rate + '   '}
                                </Text>
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.type + '   '}
                                </Text>
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.price + '   '}
                                </Text>
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.realPrice + '   '}
                                </Text>
                            </View>
                })
            }
        </View>
    )
})

interface ReportScreenProps extends NavigationProps {}
export const ReportScreen: React.FunctionComponent<ReportScreenProps> = observer(props => {
    const { navigation } = props
    return(
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
            <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25, backgroundColor: 'white'}} title='Справка'/>
            <CardsReport />
        </Screen>
    )
})