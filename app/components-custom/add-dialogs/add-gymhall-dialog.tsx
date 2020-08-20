import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { User } from "../../models/user.model"
import {useStores } from "../../models/root-store"
import { RequiredWarning } from "../../components"
import { GymHallItem } from "../../models/sub-stores/gymhall-store"

export const AddGymHallDialog: React.FunctionComponent<{onDismiss}> = props => {
    const gymHallStore = useStores().gymHallStore
    const [gymhall, setGymHall] = useState(new GymHallItem())
    const [nameRequiredFlag, setRequiredFlag] = useState(false)
    const { onDismiss } = props

    useEffect(() => {
        gymHallStore.getGymHalls()
    
    }, [])

    return (
        <View
            key={'full screen'}
            style={[{
                width: device_width,
                height: device_height,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                position: 'absolute',
                zIndex: 2,
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
                        paddingHorizontal: '5%',
                        marginBottom: 100,
                        opacity: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                ]}
            >
                <Input_Hoshi    
                    width='100%'
                    placeholder={'име'} 
                    variable={gymhall.name}
                    setVariable={val => {
                        setGymHall(prevState => ({...prevState, name: val}))
                        if (val === '') {
                            setRequiredFlag(true)
                        } else {
                            setRequiredFlag(false)
                        }
                    }}                    
                />
                <RequiredWarning flag={nameRequiredFlag} width={'100%'} />
                
                <View
                    style={[{
                        width: '100%',
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
                          }}
                        textStyle={{
                            color: 'black',
                            fontSize: 16
                          }}
                    >                
                    </Button>
                    <Button 
                        onPress={() => {
                            if(gymhall.name !== '') {
                                gymHallStore.addGymHall(gymhall) 
                                onDismiss()
                            } else {
                                setRequiredFlag(true)
                            }                            
                        }}
                        text={'Save'}
                        style={{
                            width: '45%',
                            marginTop: spacing[8],
                            paddingVertical: spacing[4],
                            backgroundColor: color.palette.green_sbs,
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