import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, AddTrainerDialog, Input_Hoshi, AddClientDialog, SeeClientDialog, AddGymHallDialog, AddMonthlyCardDialog } from '../../../components'
import { color, spacing, styles } from "../../../theme"
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from 'react-native-elements';
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from 'react-native-paper';
import { SwipeRow } from 'react-native-swipe-list-view';

export const PurchasedVisitsCards: React.FunctionComponent<{}> = observer(props => {
    const cardStore = useStores().cardStore
    useEffect(() => {
        cardStore.getCards()
    }, [])

    return(
        <DataTable>
            <DataTable.Header accessibilityValue={''} focusable={true}>
                <DataTable.Title accessibilityValue={''}>Клиент</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Цена</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Дата на плащане</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Важи от</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Лимит м/в</DataTable.Title>
            </DataTable.Header>
            {
                cardStore.cards
                .filter(item => item.item.type === 'trainings')
                .map((card, key) => {
                const item = card.item
                
                return (
                    <DataTable.Row
                        accessibilityValue={''}
                        key={key}
                        style={[{
                            paddingVertical: 5,
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            backgroundColor: key % 2 !== 1 ? 'white': color.palette.grey_sbs
                        }]}
                    >
                        <DataTable.Cell
                            accessibilityValue={''}
                            // key={key} 
                            // style={[{color: 'black'}]}
                        >
                            {item.client.split('@', 1) + '   '}
                        </DataTable.Cell>
                        <DataTable.Cell
                            accessibilityValue={''}
                            // key={key} 
                            // style={[{color: 'black'}]}
                        >
                            {item.price}
                        </DataTable.Cell>
                        <DataTable.Cell
                            accessibilityValue={''}
                            // key={key} 
                            // style={[{color: 'black'}]}
                        >
                            {item.datePayment}
                        </DataTable.Cell>
                        <DataTable.Cell
                            accessibilityValue={''}
                            // key={key} 
                            // style={[{color: 'black'}]}
                        >
                            {item.dateStart}
                        </DataTable.Cell>
                        <DataTable.Cell
                            accessibilityValue={''}
                            // key={key} 
                            // style={[{color: 'black'}]}
                        >
                            {item.card_limit}
                        </DataTable.Cell>

                    </DataTable.Row>
                
                )
                })
            }
        </DataTable>
    )
})

interface PurchasedVisitsCardsProps extends NavigationProps {}
export const PurchasedVisitsCardsScreen: React.FunctionComponent<PurchasedVisitsCardsProps> = observer(props => {
    const { navigation } = props
    const [searchValue, setSearchValue] = useState('')
    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flex: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.transparent,
            }}
        >
            <PageHeader_Tr 
                navigation={navigation}
                style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 25
                }}
                title='Закупени карти на посещения'
            />
            <View
                style={[
                    {
                        backgroundColor: color.palette.grey_sbs,
                        width: '100%',
                        paddingVertical: 30,
                        paddingHorizontal: '5%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }
                ]}
            >
                <Input_Hoshi    
                    width='75%'      
                    placeholder={'search'} 
                    variable={searchValue}
                    setVariable={val => setSearchValue(val)}
                    background={'white'}
                />
                <View
                    style={[{
                        flexDirection: 'row',
                        flexGrow: 1
                    }]}
                ></View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('payments')}
                    style={[
                        // border_boxes().green,
                        {
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }]}
                >
                    <FontAwesomeIcon 
                        icon={ faPlusCircle }
                        color={color.palette.green_sbs}
                        size={60}
                    />
                </TouchableOpacity>
            </View>
            <PurchasedVisitsCards />
        </Screen>
    )
})