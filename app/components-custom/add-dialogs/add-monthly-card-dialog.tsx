import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import {useStores } from "../../models/root-store"
import { RequiredWarning } from "../../components"
import { MonthlyCardItem } from "../../models/sub-stores/monthly-card-store"

export const AddMonthlyCardDialog: React.FunctionComponent<{onDismiss}> = props => {
    const monthlyCardStore = useStores().monthlyCardStore
    const [mcard, setMCard] = useState(new MonthlyCardItem())
    const [emailRequiredFlag, setRequiredFlag] = useState(false)
    const { onDismiss } = props

    useEffect(() => {
        monthlyCardStore.getMItem()
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
                        paddingHorizontal: '5%',
                        marginBottom: 200,
                        opacity: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                ]}
            >
                <Input_Hoshi    
                    width='100%'
                    placeholder={'име'} 
                    variable={mcard.name}
                    setVariable={val => {
                        setMCard(prevState => ({...prevState, name: val}))
                        if (val === '') {
                            setRequiredFlag(true)
                        } else {
                            setRequiredFlag(false)
                        }
                    }}                    
                />
                <RequiredWarning flag={emailRequiredFlag} width={'100%'} />
                <Input_Hoshi 
                    width='100%'
                    placeholder={'Месеци'} 
                    variable={mcard.monthsValid.toString()}
                    setVariable={val => setMCard(prevState => ({...prevState, monthsValid: +val}))}
                />
                <Input_Hoshi 
                    width='100%'
                    placeholder={'Цена'} 
                    variable={mcard.price.toString()}
                    setVariable={val => setMCard(prevState => ({...prevState, price: +val}))}
                />
                
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
                            if(mcard.name !== '') {
                                monthlyCardStore.addMItem(mcard) 
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