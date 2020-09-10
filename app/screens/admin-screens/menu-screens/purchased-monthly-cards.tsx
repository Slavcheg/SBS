import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, AddTrainerDialog, Input_Hoshi, AddClientDialog, SeeClientDialog, AddGymHallDialog, AddMonthlyCardDialog, EditCardy2Dialog } from '../../../components'
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
// import { return_date_formated} from '../../../global-helper';
import {exportSpreadSheet} from '../../../services/spreadsheet/spreadsheet';
import {Snack} from '../../../components-custom/snack/snack';
import { displayDateFromTimestamp, return_todays_datestamp } from "../../../global-helper";
import { ICardy2_Model } from "../../../models/sub-stores/v2-cardy-store";

export const PurchasedCards: React.FunctionComponent<{search: string, startDate: number, endDate: number, setShowSnack: Function}> = observer(props => {
    const cardyStore2 = useStores().cardyStore2
    const cardStore = useStores().cardStore
    useEffect(() => {
        cardyStore2.getItems()
    }, [])
    
    async function exportGoogleSheet(){
       
        var data = cardStore.cards
                    .filter(item => 
                        item.item.type === 'month' 
                        && (props.search !="" ?item.item.client.indexOf(props.search) >= 0:true) == true 
                        && (props.startDate != null ? props.startDate < item.item.dateStart: true 
                        && props.endDate != null? props.endDate > item.item.dateStart: true) == true
                        && item.item.visits.length > 0 ).map((card, key)=>{
                            const item = card.item;
                            return [
                                item.client,
                                item.price,
                                item.datePayment,
                                item.dateStart,
                                item.card_limit
                            ]
                            
                        });
        data.unshift(["Клиент", "Цена", "Дата на плащане", "Важи от", "Лимит м/в"]);
        var dataForSpreadSheet = {
            "range": `Sheet1!A1:E${data.length}`,
            "majorDimension": "ROWS",
            "values": data
        }
        var result = await exportSpreadSheet(dataForSpreadSheet);
        if(result){
            props.setShowSnack(true);
        }
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

    const [filterStartDatestamp, setFilterStartDatestamp] = useState<number>(return_todays_datestamp());
    const [filterEndDatestamp, setFilterEndDatestamp] = useState<number>(return_todays_datestamp());

    const [seeEndDatePicker, setSeeEndDatePicker] = useState(false);
    const [seeStartDatePicker, setSeeStartDatePicker] = useState(false);
    
    const [seeDialog, setSeeDialog] = useState(false);
    const [editCTM, setECTM] = useState<ICardy2_Model>(null)

    const [showSnack, setShowSnack] = useState(false);
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
                        // flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }
                ]}
            >
                <View
                    style={
                        [{
                            flexDirection: 'row',
                            width: "100%",
                            justifyContent: 'center',
                            // paddingHorizontal: '5%'
                        }]
                    }
                >
                    <Input_Hoshi    
                        width = "75%"     
                        placeholder={'search'} 
                        variable={searchValue}
                        setVariable={val => setSearchValue(val)}
                        background={'white'}
                    />
                    <TouchableOpacity
                        // onPress={() => navigation.navigate('payments')}
                        onPress={() => setSeeDialog(true)}
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
                <View
                    style={[{
                        flexDirection: 'row',
                        flexGrow: 1,
                        width: "100%"
                    }]}
                >
                    <Input_Hoshi 
                        placeholder={'Дата на картата от'}
                        variable={displayDateFromTimestamp(filterStartDatestamp)}
                        setVariable={(x) => {setFilterStartDatestamp(x)}}
                        onF={() => {
                            setSeeStartDatePicker(true)
                        }}
                    />
                    <Input_Hoshi 
                        placeholder={'Дата на картата до'}
                        variable={displayDateFromTimestamp(filterEndDatestamp)}
                        setVariable={(x) => {setFilterEndDatestamp(x)}}
                        onF={() => {
                            setSeeEndDatePicker(true)
                        }}
                    />
                </View>
                <View
                    style={[{
                        width: '100%'
                    }]}
                >
                    {seeStartDatePicker? (
                        <DatePicker 
                            showPicker={(state) => {console.log(state);setSeeStartDatePicker(state)} }
                            inputDateStamp={filterStartDatestamp} 
                            onDateChange={(_dateStamp: number) => {
                                setFilterStartDatestamp(_dateStamp) }}
                        />
                    ): null}

                    {seeEndDatePicker? (                    
                        <DatePicker 
                            showPicker={(state) => {console.log(state);setSeeEndDatePicker(state)}}
                            inputDateStamp={filterEndDatestamp} 
                            onDateChange={(_dateStamp: number) => {
                                setFilterEndDatestamp(_dateStamp)
                            }}
                        />
                    ): null}   
                </View>                                 
            </View>
            
            {/* <PurchasedCards search={searchValue} startDate = {filterStartDatestamp ? filterStartDatestamp: null} endDate = {filterEndDatestamp ? filterEndDatestamp: null} setShowSnack = {(state)=>setShowSnack(state)} />
            {showSnack ? 
                <Snack message={'Saved !'} onDismiss={() => {setShowSnack(false)}} duration = {3000}/>
            : null} */}
            {
                seeDialog ?
                    <EditCardy2Dialog cardyModel={editCTM} onDismiss={() => {
                        setSeeDialog(false)
                        setECTM(null)
                    }} />
                : null
            }
        </Screen>
    )
})