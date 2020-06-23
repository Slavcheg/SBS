import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, Input_Hoshi, AddTrainerDialog } from '../../../components'
import { color } from "../../../theme"
import firestore from '@react-native-firebase/firestore';
import { View, Text } from "react-native";
import { border_boxes } from "../../../global-helper";
import {useStores } from "../../../models/root-store"
import { MUSer, MUserItem } from "../../../models/user.model";

export function TrainersListScreen({navigation}) {
    
    const [seeDialog, setSeeDialog] = useState(false)
    const userStore = useStores().userStore
    const [data, setData] = useState([])

    useEffect(() => {
        userStore.ggetItems()
        userStore.users.map(i => {
            console.log(i)
        })
    }, [])

    const loadEmails = () => {
        try {
            return (
                data.map((item, key) => {
                    console.log('lister')
                    return  <View 
                                key={key}
                            >
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >{item.item.email}</Text>
                            </View>
                })
            )
        } catch(e) {
            console.log('traners list screen error')
            console.log(e)
            console.log('end of trainers list error')
        }            
        return null
    }

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
            {
                loadEmails()
            }

            {
                seeDialog ?
                    <AddTrainerDialog onDismiss={() => {setSeeDialog(false)}} />
                : null
            }
            
            
            <Button text={'Add trainer email'} onPress={() => {userStore.aaddItem({

                email :'someone',
                picture : '',
                generic_number : 0,
                password : '',
                first : '',
                last : '',
                referral : '',
                isAdmin : false,
                isTrainer : false,
                isClient : false
            
            })}}/>
        </Screen>
    )
}