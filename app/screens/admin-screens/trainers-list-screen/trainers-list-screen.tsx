import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, Input_Hoshi, AddTrainerDialog } from '../../../components'
import { color } from "../../../theme"
import firestore from '@react-native-firebase/firestore';
import { View, Text } from "react-native";
import { border_boxes } from "../../../global-helper";

export function TrainersListScreen({navigation}) {
    const [d, setD] = useState(['asd'])
    // const [email, setEmail] = useState()
    // const [first, setFirst] = useState()
    // const [last, setLast] = useState()
    const [seeDialog, setSeeDialog] = useState(false)
    
    const onResult = (qSnap) => {
        // console.log('Got Users collection result.');
        let temp = []
        qSnap.forEach(docSnap => {
            // console.log('User ID: ', docSnap.id, docSnap.data().email);
            temp.push(docSnap.data().email)
        })
        setD(temp)
      }
      
      const onError = (error) => {
        console.error(error);
      }
      
      firestore()
        .collection('google-login-pass')
        .onSnapshot(onResult, onError);
    

    // useEffect(() => {
        // let temp = []
        // firestore()
        //     .collection('google-login-pass')
        //     .get()
        //     .then(qSnap => {
        //         qSnap.forEach(docSnap => {
        //             // console.log('User ID: ', docSnap.id, docSnap.data().email);
        //             temp.push(docSnap.data().email)
        //         })
        // })
        // setD(temp)
    // }, []);

    const loadEmails = () => {
        try {
            return (
                d.map((item, key) => {
                    return  <View 
                                key={key}
                            >
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >{item}</Text>
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
            
            
            <Button text={'See Dialog'} onPress={() => {setSeeDialog(true)}}/>
        </Screen>
    )
}