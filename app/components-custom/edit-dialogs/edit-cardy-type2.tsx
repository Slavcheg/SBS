import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { RequiredWarning } from "../../components"
import { useStores } from "../../models/root-store"
import { card_types, ICardy_Type, ICardy_Type_Model } from "../../models/sub-stores/v2-cardy-types-store"

interface EditCardyType2Props {
    cardyTypeModel?: ICardy_Type_Model
    onDismiss: Function
}

export const EditCardyType2Dialog: React.FunctionComponent<EditCardyType2Props> = props => {
    const { cardyTypeModel, onDismiss } = props
    const { cardyTypesStore2 }  = useStores()
    const [isNewType, setIsNewType] = useState(false)
    const [obj, setObj] = useState<ICardy_Type>({
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

    const [numericFlags, setNumericFlags] = useState({
        requiredMessage_card_limit_numeric: false,
        requiredMessage_price_numeric: false 
    })

    useEffect(() => {
        if(cardyTypeModel?.id){
            setObj(cardyTypeModel.item)
        } else {
            setIsNewType(true)
        }
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
                <View
                    style={[
                        // border_boxes().black,
                        {
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }]
                    }
                >
                    <Button
                        style={[{
                            width: '40%',
                            backgroundColor: obj.type === card_types.monthly ? color.palette.blue_sbs : color.palette.grey_sbs
                        }]}
                        text={'Monthly'}
                        textStyle={[{
                            fontSize: 15
                        }]}
                        onPress={()=>{
                            setObj(prevState => ({...prevState, type: card_types.monthly}))
                        }}
                    >
                        
                    </Button>
                    <Button
                        style={[{
                            width: '40%',
                            backgroundColor: obj.type === card_types.per_visits ? color.palette.blue_sbs : color.palette.grey_sbs
                        }]}
                        text={'Visits'}
                        textStyle={[{
                            fontSize: 15
                        }]}
                        onPress={()=>{
                            setObj(prevState => ({...prevState, type: card_types.per_visits}))
                        }}
                    ></Button>
                </View>
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
                    variable={obj.card_limit?.toString()}
                    setVariable={val => setObj(prevState => ({...prevState, card_limit: isNaN(+val)? val : +val}))}
                    editable = {true}
                />
                <RequiredWarning flag={requireds.requiredMessage_card_limit} width={'100%'} />
                <RequiredWarning flag={numericFlags.requiredMessage_card_limit_numeric} message={'Полето трябвя да е цифрово!'} width={'100%'} />
                <Input_Hoshi    
                    width='100%'
                    placeholder={'Цена'} 
                    variable={obj.price?.toString()}
                    setVariable={val => setObj(prevState => ({...prevState, price: isNaN(+val)? val : +val}))}
                    editable = {true}
                />
                <RequiredWarning flag={requireds.requiredMessage_price} width={'100%'} />
                <RequiredWarning flag={numericFlags.requiredMessage_price_numeric} message={'Полето трябвя да е цифрово!'} width={'100%'} />
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
                            console.log(obj.type)
                            if(obj.title && obj.card_limit && obj.price && !isNaN(Number(obj.card_limit)) && !isNaN(Number(obj.price))) {
                                isNewType ? cardyTypesStore2.addCardType(obj)
                                    : cardyTypesStore2.updateItem(cardyTypeModel.id, obj)
                                onDismiss()
                            } else {
                                !obj.title  ? setRequireds(prevState => ({...prevState, requiredMessage_title: true}))
                                            : setRequireds(prevState => ({...prevState, requiredMessage_title: false}))

                                !obj.card_limit     ? setRequireds(prevState => ({...prevState, requiredMessage_card_limit: true}))
                                                    : setRequireds(prevState => ({...prevState, requiredMessage_card_limit: false}))

                                !obj.price  ? setRequireds(prevState => ({...prevState, requiredMessage_price: true}))
                                            : setRequireds(prevState => ({...prevState, requiredMessage_price: false}))

                                isNaN(Number(obj.card_limit))   ? setNumericFlags(prevState => ({...prevState, requiredMessage_card_limit_numeric: true}))
                                                                : setNumericFlags(prevState => ({...prevState, requiredMessage_card_limit_numeric: false}))

                                isNaN(Number(obj.price))    ? setNumericFlags(prevState => ({...prevState, requiredMessage_price_numeric: true}))
                                                            : setNumericFlags(prevState => ({...prevState, requiredMessage_price_numeric: false}))
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