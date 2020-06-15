import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { User } from "../../models/user.model"
import firestore from '@react-native-firebase/firestore';

export function AddTrainerDialog({onDismiss}) {
    const [user, setUser] = useState(new User())


    return (
        <View
            style={[{
                width: device_width,
                height: device_height,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                position: 'absolute',
                zIndex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }]}
        >
            <View
                style={[
                    // border_boxes().black,
                    {
                        borderColor: color.palette.white,
                        // borderWidth: 2,
                        borderRadius: 20,
                        backgroundColor: color.palette.white,
                        width: device_width / 1.2,
                        // height: device_width / 2,
                        paddingVertical: 20,
                        marginBottom: 200,
                        opacity: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                ]}
            >
                <Input_Hoshi placeholder={'емайл'} variable={user.email}
                    setVariable={val => setUser(prevState => ({...prevState, email: val}))}
                    
                />
                <Input_Hoshi placeholder={'име'} variable={user.first}
                    setVariable={val => setUser(prevState => ({...prevState, first: val}))}/>
                <Input_Hoshi placeholder={'фамилия'} variable={user.last}
                    setVariable={val => setUser(prevState => ({...prevState, last: val}))}/>
                <Input_Hoshi placeholder={'препоръчан от'} variable={user.referral}
                    setVariable={val => setUser(prevState => ({...prevState, referral: val}))}/>
                
                <Button onPress={() => {
                    firestore()
                        .collection('google-login-pass')
                        .add(user)
                        .then(x => {
                            console.log('Saved')
                            console.log(x)
                        })
                        .catch(e => {
                            console.log('Errored')
                            console.log(e)
                        })

                }} text={'Save'}></Button>
                <Button onPress={() => onDismiss()} text={'Button'}></Button>
            </View>
        </View>
    )
}