import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { User } from "../../models/user.model"
import {useStores } from "../../models/root-store"

export const AddClientDialog: React.FunctionComponent<{onDismiss}> = props => {
    const userStore = useStores().userStore
    const [user, setUser] = useState(new User())
    const { onDismiss } = props

    useEffect(() => {
        userStore.ggetItems()
        setUser(prevState => ({...prevState, generic_number: 1000 + userStore.clientsCount + 1, password: 'admin123'}))        
    }, [])

    return (
        <View
            key={'full screen'}
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
                key={'pop-up container'}
                style={[
                    // border_boxes().black,
                    {
                        borderColor: color.palette.white,
                        // borderWidth: 2,
                        borderRadius: 20,
                        backgroundColor: color.palette.white,
                        width: device_width / 1.2,
                        // height: device_width / 2,
                        paddingVertical: 50,
                        marginBottom: 200,
                        opacity: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                ]}
            >
                <Input_Hoshi    
                    width='80%'      
                    placeholder={'генериран номер'} 
                    variable={user.generic_number.toString()}
                    setVariable={val => setUser(prevState => ({...prevState, generic_number: val}))}
                    
                />
                <Input_Hoshi    
                    width='80%'      
                    placeholder={'емайл'} 
                    variable={user.email}
                    setVariable={val => setUser(prevState => ({...prevState, email: val, isClient: true}))}
                    
                />
                <Input_Hoshi 
                    width='80%'   
                    placeholder={'име'} 
                    variable={user.first}
                    setVariable={val => setUser(prevState => ({...prevState, first: val}))}
                />
                <Input_Hoshi 
                    width='80%'   
                    placeholder={'фамилия'} 
                    variable={user.last}
                    setVariable={val => setUser(prevState => ({...prevState, last: val}))}
                />
                <Input_Hoshi 
                    width='80%'   
                    placeholder={'препоръчан'} 
                    variable={user.referral}
                    setVariable={val => setUser(prevState => ({...prevState, referral: val}))}
                />
                
                <View
                    style={[{
                        width: '80%',
                        paddingVertical: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }]}
                >
                    <Button 
                        onPress={() => onDismiss()} 
                        text={'Close'}
                        style={{
                            width: '45%',
                            marginTop: spacing[8],
                            paddingVertical: spacing[4],
                            backgroundColor: color.palette.grey_sbs,
                            marginHorizontal: '5%'
                          }}
                        textStyle={{
                            color: 'black',
                            fontSize: 16
                          }}
                    >                
                    </Button>
                    <Button 
                        onPress={() => {
                            userStore.aaddItem(user) 
                            onDismiss()
                        }}
                        text={'Save'}
                        style={{
                            width: '45%',
                            marginTop: spacing[8],
                            paddingVertical: spacing[4],
                            backgroundColor: color.palette.green_sbs,
                            marginHorizontal: '5%'
                          }}
                        textStyle={{
                            color: 'white',
                            fontSize: 16
                          }}
                    >                    
                    </Button>
                </View>
                
            </View>            
        </View>
    )
}