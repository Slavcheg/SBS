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
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from 'react-native-paper';
import { SwipeRow } from 'react-native-swipe-list-view';
import { Hoshi } from 'react-native-textinput-effects';
import { DatePicker } from '../../../components-custom/date-picker/date-picker';
import { return_date_formated} from '../../../global-helper';
export const PurchasedMonthlyCards: React.FunctionComponent<{search: string, startDate: Date, endDate: Date}> = observer(props => {
    const cardStore = useStores().cardStore
    useEffect(() => {
        cardStore.getCards()
    }, [])
    function exportGoogleSheet(){

    }
    return(
        <View
            style={[
                {                    
                    width: '100%',                    
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end'
                }
            ]}
        >
            <TouchableOpacity
                    onPress={() => exportGoogleSheet()}
                    style={[
                        // border_boxes().green,
                        {
                        width: '20%',
                        margin: 15,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }]}
                >
                    <FontAwesomeIcon 
                        icon={ faFileExcel }
                        color={color.palette.green_sbs}
                        size={30}
                    />
                </TouchableOpacity>
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
                    .filter(item => 
                        item.item.type === 'month' 
                        && (props.search !="" ?item.item.client.indexOf(props.search) >= 0:true) == true 
                        && (props.startDate != null ? props.startDate < new Date(item.item.dateStart): true 
                        && props.endDate != null? props.endDate > new Date(item.item.dateStart): true) == true
                        && item.item.visits.length > 0 )
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
        </View>
        
    )
})

interface PurchasedMonthlyCardsProps extends NavigationProps {}
export const PurchasedMonthlyCardsScreen: React.FunctionComponent<PurchasedMonthlyCardsProps> = observer(props => {
    const { navigation } = props
    const [searchValue, setSearchValue] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [seeEndDatePicker, setSeeEndDatePicker] = useState(false);
    const [seeStartDatePicker, setSeeStartDatePicker] = useState(false);
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
                title='Закупени месечни карти'
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
                <View
                    style={
                        [{
                            flexDirection: 'column',
                            width: "75%"
                        }]
                    }
                >
                    <Input_Hoshi    
                        width = "100%"     
                        placeholder={'search'} 
                        variable={searchValue}
                        setVariable={val => setSearchValue(val)}
                        background={'white'}
                    />
                    <View
                        style={[{
                            flexDirection: 'row',
                            flexGrow: 1,
                            width: "100%"
                        }]}
                    >
                        {   getInput('Дата на плащане',
                                    filterStartDate,
                                    (x) => {setFilterStartDate(x)},
                                    undefined,
                                    () => {setSeeStartDatePicker(true)},
                                    () => {setSeeStartDatePicker(false)}
                        )}
                        {   getInput('Дата на картата',
                                    filterEndDate,
                                    (x) => {setFilterEndDate(x)},
                                    undefined,
                                    () => {setSeeEndDatePicker(true)},
                                    () => {setSeeEndDatePicker(false)}
                        )}
                    </View>
                </View>
                
               
                {seeStartDatePicker? (
                    <DatePicker 
                        showPicker={() => {setSeeStartDatePicker(false)} }
                        useValue={(v: Date) => {
                            setFilterStartDate( return_date_formated(v)) }}
                    />
                ): null}

                {seeEndDatePicker? (
                    <DatePicker 
                        showPicker={() => {setSeeEndDatePicker(false)}} 
                        useValue={(v: Date) => {
                            setFilterEndDate( return_date_formated(v))
                        }}
                    />
                ): null}   
                <TouchableOpacity
                    onPress={() => navigation.navigate('payments')}
                    style={[
                        // border_boxes().green,
                        {
                        width: '25%',
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
            
            <PurchasedMonthlyCards search={searchValue} startDate = {filterStartDate != "" ? new Date(filterStartDate): null} endDate = {filterEndDate != ""? new Date(filterEndDate): null} />
            
        </Screen>
    )
})
const getInput = (placeholder, operatedVariable, setVarState, width='45%', onF, onB) => {
    return (
        <View
            style={[
                // border_boxes().black,
                {
                width: width,
                marginVertical: 5,
                margin: 5,
            }]}
        >
            <Hoshi 
                autoCapitalize='none'
                autoCompleteType="off"
                autoCorrect={false}
                value={operatedVariable}
                onChangeText={x => setVarState(x)}
                // placeholder={placeholder}
                placeholderTextColor={'#999999'}
                // containerStyle={{paddingHorizontal: 0}}
                // inputContainerStyle={styles.inputContainerStyle}          
                inputStyle={{fontSize: 16}}

                onFocus={() => onF()}
                onBlur={() => onB()}
                label={placeholder}
                labelStyle={[styles.inputTextStyle, {marginBottom: 10}]}
                defaultValue={operatedVariable}
                borderColor={color.palette.blue_sbs}
                inputPadding={3}
            />

        </View>
    )
}