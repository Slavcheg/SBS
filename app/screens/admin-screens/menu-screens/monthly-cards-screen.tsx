import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, AddTrainerDialog, Input_Hoshi, AddClientDialog, SeeClientDialog, AddGymHallDialog, AddMonthlyCardDialog } from '../../../components'
import { color, spacing } from "../../../theme"
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from 'react-native-elements';
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

export const GetMonthlyCards: React.FunctionComponent<{search: string, setEm: any, setSeeDialog: any}> = observer(props => {
    const monthlyCardStore = useStores().monthlyCardStore
    useEffect(() => {
        monthlyCardStore.getMItem()
    }, [])

    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                monthlyCardStore.monthlyCards
                    .filter(trainer => props.search !== ''? trainer.item.name.toLocaleLowerCase().includes(props.search): true)
                    .map((card, key) => {
                        const item = card.item
                        return  <TouchableOpacity 
                                    key={key}
                                    style={[{
                                        paddingVertical: 15,
                                        paddingHorizontal: '5%',
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        backgroundColor: key % 2 !== 1 ? 'white': color.palette.grey_sbs
                                    }]}
                                    onPress={() => {
                                        props.setEm(item.name)
                                        props.setSeeDialog(true)
                                    }}
                                >
                                    <Text 
                                        key={key} 
                                        style={[{color: 'black', marginLeft: '5%'}]}
                                    >{item.name}</Text>
                                </TouchableOpacity>
                    })
            }            
        </View>
    )
})
interface MonthlyCardsProps extends NavigationProps {}

export const MonthlyCardsScreen: React.FunctionComponent<MonthlyCardsProps> = observer(props => {
    const { navigation} = props
    const [seeDialog, setSeeDialog] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [seeClientDialog, setSeeClientDialog] = useState(false)
    const [email, setEmail] = useState('') 

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
                // paddingHorizontal: 20
                paddingHorizontal: 25
            }}
        >
            <PageHeader_Tr navigation={navigation} style={{backgroundColor: 'white'}} title='Списък месечни карти'/>
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
            
            <GetMonthlyCards search={searchValue} setEm={setEmail} setSeeDialog={setSeeClientDialog}/>
            {
                seeDialog ?
                    <AddMonthlyCardDialog onDismiss={() => {setSeeDialog(false)}} />
                : null
            }
            {/* {
                seeClientDialog ?
                    <SeeClientDialog email={email} onDismiss={() => {setSeeClientDialog(false)}} />
                : null
            } */}
        </Screen>
    )
})