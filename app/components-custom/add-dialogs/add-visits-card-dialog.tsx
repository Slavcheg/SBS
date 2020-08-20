import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import {useStores } from "../../models/root-store"
import { RequiredWarning } from "../../components"
import { VisitsCardItem } from "../../models/sub-stores/visits-cards"

export const AddVisitsCardDialog: React.FunctionComponent<{onDismiss}> = props => {
    const visitsCardStore = useStores().visitsCardStore
    const [vcard, setVCard] = useState(new VisitsCardItem())
    const [emailRequiredFlag, setRequiredFlag] = useState(false)
    const { onDismiss } = props

    useEffect(() => {
        visitsCardStore.getMItem()
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
                    variable={vcard.name}
                    setVariable={val => {
                        setVCard(prevState => ({...prevState, name: val}))
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
                    placeholder={'Брой посещения'} 
                    variable={vcard.visits.toString()}
                    setVariable={val => setVCard(prevState => ({...prevState, visits: +val}))}
                />
                <Input_Hoshi 
                    width='100%'
                    placeholder={'Месеци валидна'} 
                    variable={vcard.monthsValid.toString()}
                    setVariable={val => setVCard(prevState => ({...prevState, monthsValid: +val}))}
                />
                <Input_Hoshi 
                    width='100%'
                    placeholder={'Цена'} 
                    variable={vcard.price.toString()}
                    setVariable={val => setVCard(prevState => ({...prevState, price: +val}))}
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
                            if(vcard.name !== '') {
                                visitsCardStore.addMItem(vcard) 
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