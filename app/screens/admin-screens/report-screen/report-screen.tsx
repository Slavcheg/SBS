import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr } from '../../../components'
import { color } from '../../../theme';
import { Accordeon } from "../../../components"
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { View, Text } from "react-native";
import { DataTable } from 'react-native-paper';
import { border_boxes } from "../../../global-helper";

export const CardsReport: React.FunctionComponent<{}> = observer(props => {
    const cardStore = useStores().cardStore
    useEffect(() => {
        cardStore.getCards()
    }, [])

    return(
            <DataTable>
                <DataTable.Header accessibilityValue={''} focusable={''}>
                <DataTable.Title accessibilityValue={''}>Клиент</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Тренировки</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Ставка</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Тип</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Реална цена</DataTable.Title>
                </DataTable.Header>
            

            {
                cardStore.cards.map((card, key) => {
                    const item = card.item
                    return  <DataTable.Row accessibilityValue={''}
                                key={key}
                                style={[{
                                    paddingVertical: 5,
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    backgroundColor: key % 2 !== 1 ? 'white': color.palette.grey_sbs
                                }]}
                            >
                                <DataTable.Cell accessibilityValue={''}
                                    // key={key} 
                                    // style={[{color: 'black'}]}
                                >
                                    {item.client.split('@', 1) + '   '}
                                </DataTable.Cell>
                                <DataTable.Cell accessibilityValue={''} 
                                    // key={key} 
                                    // style={[{color: 'black'}]}
                                >
                                    {item.visits.length + '   '}
                                </DataTable.Cell >
                                {/* <DataTable.Cell accessibilityValue={''} 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.card_limit + '   '}
                                </Text> */}
                                <DataTable.Cell accessibilityValue={''} 
                                    // key={key} 
                                    // style={[{color: 'black'}]}
                                >
                                    {item.rate + '   '}
                                </DataTable.Cell>
                                <DataTable.Cell accessibilityValue={''} 
                                    // key={key} 
                                    // style={[{color: 'black'}]}
                                >
                                    {item.type + '   '}
                                </DataTable.Cell>
                                {/* <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >
                                    {item.price + '   '}
                                </Text> */}
                                <DataTable.Cell accessibilityValue={''}
                                    // key={key} 
                                    // style={[{color: 'black'}]}
                                >
                                    {item.realPrice + '   '}
                                </DataTable.Cell>
                            </DataTable.Row>
                })
            }
        </DataTable>
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