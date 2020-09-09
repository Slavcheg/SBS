import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { RequiredWarning } from "../../components"
import { useStores } from "../../models/root-store"
import { card_types } from "../../models/sub-stores/v2-cardy-types-store"

export const AddCardyType2Dialog: React.FunctionComponent<{cardyTypeId, onDismiss}> = props => {
    const { onDismiss } = props
    const { cardyTypesStore2 }  = useStores()
    
    const [obj, setObj] = useState<{
        type: card_types,
        title: string,
        card_limit: number,
        price: number
    }>({
            type: card_types.monthly,
            title: undefined,
            card_limit: undefined,
            price: undefined
        })

    const [requireds, setRequireds] = useState({
        requiredMessage_title: false,
        requiredMessage_card_limit: false,
        requiredMessage_price: false 
    })
    useEffect(() => {

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
                        borderRadius: 20,
                        backgroundColor: color.palette.white,
                        width: device_width / 1.2,
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
                    placeholder={'Име'} 
                    variable={obj.title}
                    setVariable={val => setObj(prevState => ({...prevState, title: val}))}
                    editable = {true}
                />
                <RequiredWarning flag={requireds.requiredMessage_title} width={'100%'} />

                <Input_Hoshi    
                    width='100%'
                    placeholder={'Kартов лимит м/п'} 
                    variable={obj.card_limit}
                    setVariable={val => setObj(prevState => ({...prevState, card_limit: val}))}
                    editable = {true}
                />
                <RequiredWarning flag={requireds.requiredMessage_card_limit} width={'100%'} />            

                <Input_Hoshi    
                    width='100%'
                    placeholder={'Цена'} 
                    variable={obj.price}
                    setVariable={val => setObj(prevState => ({...prevState, price: val}))}
                    editable = {true}
                />
                <RequiredWarning flag={requireds.requiredMessage_price} width={'100%'} />
                
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
                            if(obj.title && obj.card_limit && obj.price) {
                                cardyTypesStore2.addCardType(obj)
                                onDismiss()
                            } else {
                                !obj.title ? setRequireds(prevState => ({...prevState, requiredMessage_title: true})) : null
                                !obj.card_limit ? setRequireds(prevState => ({...prevState, requiredMessage_card_limit: true})) : null
                                !obj.price ? setRequireds(prevState => ({...prevState, requiredMessage_price: true})) : null
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