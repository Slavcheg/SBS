import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, AddTrainerDialog, Input_Hoshi } from '../../../components'
import { color, spacing } from "../../../theme"
import { View, Text, TouchableOpacity } from "react-native";
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

export const GetTrainers: React.FunctionComponent<{search: string}> = observer(props => {
    const userStore = useStores().userStore
    useEffect(() => {
        userStore.ggetItems()
    }, [])

    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                userStore.trainers
                    .filter(trainer => props.search !== ''? trainer.item.email.includes(props.search): true)
                    .map((user, key) => {
                        const item = user.item
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
                                    >{item.email}</Text>
                                </View>
                    })
            }
        </View>
    )
})
interface TrainersListProps extends NavigationProps {}

export const TrainersListScreen: React.FunctionComponent<TrainersListProps> = observer(props => {
    const { navigation} = props
    const [seeDialog, setSeeDialog] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    
    const [data, setData] = useState([])

    

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
            <PageHeader_Tr navigation={navigation} style={{backgroundColor: 'white'}} title='Списък треньори'/>
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
                    width='80%'      
                    placeholder={'search'} 
                    variable={searchValue}
                    setVariable={val => setSearchValue(val)}
                    background={'white'}
                />
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
            
            <GetTrainers search={searchValue}/>
            {
                seeDialog ?
                    <AddTrainerDialog onDismiss={() => {setSeeDialog(false)}} />
                : null
            }
        </Screen>
    )
})