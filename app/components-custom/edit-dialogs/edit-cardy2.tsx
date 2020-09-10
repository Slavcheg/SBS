import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { border_boxes, device_width, device_height, displayDateFromTimestamp, return_todays_datestamp } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { RequiredWarning } from "../../components"
import { useStores } from "../../models/root-store"
import { ICardy2, ICardy2_Model } from "../../models/sub-stores/v2-cardy-store"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { ICardy_Type } from "../../models/sub-stores/v2-cardy-types-store"
import { GetCardyTypeSuggestions } from "./edit-cardy2-components/get-cardy-type-suggestions"
import { GetClientsSuggestions } from "./edit-cardy2-components/get-clients-suggestions"
import { GetTrainersSuggestions } from "./edit-cardy2-components/get-trainers-suggestions"
import { DatePicker } from "../date-picker/date-picker"

interface EditCardy2Props {
    cardyModel?: ICardy2_Model
    onDismiss: Function
}

export const EditCardy2Dialog: React.FunctionComponent<EditCardy2Props> = props => {
    const { cardyModel, onDismiss } = props
    const { cardyStore2 }  = useStores()
    
    const [obj, setObj] = useState<ICardy2>({
            // write properties
            clients: [],
            trainers: [],
            datestampPayment: return_todays_datestamp(),
            datestampStart: return_todays_datestamp(),
        })    

    const [pageHelpers, setPageHelper] = useState({
        isNewType: false,
        clientSearch: '',
        trainerSearch: '',
        seeCardTypeSuggestions: false,
        seeClientsSuggestions: false,
        seeTrainersSuggestions: false,
        seeDatePaymentPicker: false,
        seeDateStartPicker: false
    })

    const [requireds, setRequireds] = useState({
        requiredMessage_type: false,        
    })

    // useEffect(() => {
    //     if(cardyModel?.id){
    //         setObj(cardyModel.item)
    //     } else {
    //         setPageHelper(prState => ({... prState, isNewType: true}))
    //     }
    // }, [])

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
                {/* Type */}
                <View
                    style={[{
                        width: '100%'
                    }]}
                >
                    <Input_Hoshi    
                        width='100%'
                        placeholder={'Тип'} 
                        variable={obj.card_type?.type}
                        setVariable={()=>{}}
                        onF={() => setPageHelper(prS => ({...prS, seeCardTypeSuggestions: true}))}
                        onB={() => {
                            setPageHelper(prS => ({...prS, seeCardTypeSuggestions: false}))
                            if (obj.card_type?.type) {
                                setRequireds(prSt => ({...prSt, requiredMessage_type: false}))
                            } else {
                                setRequireds(prSt => ({...prSt, requiredMessage_type: true}))
                            }
                        }}
                    />
                    <RequiredWarning flag={requireds.requiredMessage_type} width={'100%'} />
                    
                    { pageHelpers.seeCardTypeSuggestions ? 
                        <GetCardyTypeSuggestions 
                            onTouch={(_card_type: ICardy_Type) => {
                                setObj(prSt => ({
                                    ...prSt,
                                    realPrice: _card_type.price,
                                    card_type: _card_type
                                }))
                                setPageHelper(prS => ({...prS, seeCardTypeSuggestions: false}))
                                setRequireds(prSt => ({...prSt, requiredMessage_type: false}))
                            }} 
                        />
                    : null}
                </View>
                {/* Clients */}
                <View
                    style={[{
                        width: '100%',
                        marginVertical: 20
                    }]}
                >

                    <Text>{'Клиенти: '}</Text>
                    {
                        obj.clients?.map((client, index) => {
                        return  <View
                                    key={index}
                                    style={[{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }]}
                                >
                                    <Text>{client}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const cls = obj.clients
                                            cls.splice(cls.indexOf(client) ,1)
                                            setObj(prSt => ({
                                                ...prSt,
                                                clients: cls
                                            }))
                                        }}
                                        style={[
                                            {
                                            padding: 10,
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                        }]}
                                    >
                                        <FontAwesomeIcon 
                                            icon={ faTimesCircle }
                                            color={'red'}
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                </View>
                        })
                    }
                    <Input_Hoshi    
                        width='100%'
                        placeholder={'Клиенти'} 
                        variable={pageHelpers.clientSearch}
                        setVariable={(val)=>{ setPageHelper(prSt => ({...prSt, clientSearch: val}))}}
                        onF={() => setPageHelper(prS => ({...prS, seeClientsSuggestions: true}))}
                        onB={() => {
                            setPageHelper(prS => ({
                                ...prS,
                                seeClientsSuggestions: false,
                                clientSearch: ''
                            }))
                            if (obj.card_type?.type) {
                                setRequireds(prSt => ({...prSt, requiredMessage_type: false}))
                            } else {
                                setRequireds(prSt => ({...prSt, requiredMessage_type: true}))
                            }
                        }}
                    />
                    { pageHelpers.seeClientsSuggestions ? 
                    <GetClientsSuggestions 
                        searchString={pageHelpers.clientSearch}
                        onTouch={(clientEmail: string) => {
                            if(!obj.clients.includes(clientEmail)){
                                setObj(prSt => ({
                                    ...prSt,
                                    // clients: [...prSt.clients, clientEmail]
                                    clients: prSt.clients.concat(clientEmail)
                                })
                            )
                            }                            
                            setPageHelper(prS => ({...prS, seeClientsSuggestions: false}))
                        }} 
                    />
                    : null}
                </View>
                {/* Trainers */}
                <View
                    style={[{
                        width: '100%',
                        marginVertical: 20
                    }]}
                >

                    <Text>{'Треньори: '}</Text>
                    {
                        obj.trainers?.map((trainer, index) => {
                        return  <View
                                    key={index}
                                    style={[{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }]}
                                >
                                    <Text>{trainer}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const cls = obj.trainers
                                            cls.splice(cls.indexOf(trainer) ,1)
                                            setObj(prSt => ({
                                                ...prSt,
                                                trainers: cls
                                            }))
                                        }}
                                        style={[
                                            {
                                            padding: 10,
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                        }]}
                                    >
                                        <FontAwesomeIcon 
                                            icon={ faTimesCircle }
                                            color={'red'}
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                </View>
                        })
                    }
                    <Input_Hoshi    
                        width='100%'
                        placeholder={'Треньори'} 
                        variable={pageHelpers.trainerSearch}
                        setVariable={(val)=>{ setPageHelper(prSt => ({...prSt, trainerSearch: val}))}}
                        onF={() => setPageHelper(prS => ({...prS, seeTrainersSuggestions: true}))}
                        onB={() => {
                            setPageHelper(prS => ({
                                ...prS,
                                seeTrainersSuggestions: false,
                                trainerSearch: ''
                            }))
                            // if (obj.card_type?.type) {
                            //     setRequireds(prSt => ({...prSt, requiredMessage_type: false}))
                            // } else {
                            //     setRequireds(prSt => ({...prSt, requiredMessage_type: true}))
                            // }
                        }}
                    />
                    { pageHelpers.seeTrainersSuggestions ? 
                    <GetTrainersSuggestions 
                        searchString={pageHelpers.trainerSearch}
                        onTouch={(clientEmail: string) => {
                            if(!obj.trainers.includes(clientEmail)){
                                setObj(prSt => ({
                                    ...prSt,
                                    // clients: [...prSt.clients, clientEmail]
                                    trainers: prSt.trainers.concat(clientEmail)
                                })
                            )
                            }                            
                            setPageHelper(prS => ({...prS, seeTrainersSuggestions: false}))
                        }} 
                    />
                    : null}
                </View>
                {/* Date Payment */}
                <View
                    style={[{
                        width: '100%'
                    }]}
                >
                    <Input_Hoshi    
                        width='100%'
                        placeholder={'Дата на плащане'} 
                        variable={displayDateFromTimestamp(obj.datestampPayment)}
                        setVariable={(val)=>{}}
                        onF={() => setPageHelper(prS => ({...prS, seeDatePaymentPicker: true}))}
                    />
                    { pageHelpers.seeDatePaymentPicker? (
                        <DatePicker 
                            showPicker={() => {
                                setPageHelper(prS => ({...prS, seeDatePaymentPicker: false}))
                            }}
                            inputDateStamp={obj.datestampPayment}
                            onDateChange={(_dateStamp: number) => {
                                setObj(prSt => ({...prSt, datestampPayment: _dateStamp}))
                            }}
                        />
                    ): null}
                </View>
                {/* Date Start */}
                <View
                    style={[{
                        width: '100%'
                    }]}
                >
                    <Input_Hoshi    
                        width='100%'
                        placeholder={'Дата на започване'} 
                        variable={displayDateFromTimestamp(obj.datestampStart)}
                        setVariable={(val)=>{}}
                        onF={() => setPageHelper(prS => ({...prS, seeDateStartPicker: true}))}
                    />
                    { pageHelpers.seeDateStartPicker? (
                        <DatePicker 
                            showPicker={() => {
                                setPageHelper(prS => ({...prS, seeDateStartPicker: false}))
                            }}
                            inputDateStamp={obj.datestampStart}
                            onDateChange={(_dateStamp: number) => {
                                setObj(prSt => ({...prSt, datestampStart: _dateStamp}))
                            }}
                        />
                    ): null}
                </View>
                <View
                    style={[{
                        width: '100%'
                    }]}
                >
                    <View
                        style={[{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }]}
                    >
                        <Input_Hoshi    
                            width='45%'
                            placeholder={'Лимит в/м'} 
                            variable={obj.card_type?.card_limit.toString()}
                            editable={false}
                            setVariable={(val)=>{}}
                        />
                        <Input_Hoshi    
                            width='45%'
                            placeholder={'Цена'} 
                            variable={obj.card_type?.price.toString()}
                            editable={false}
                            setVariable={(val)=>{}}
                        />
                    </View>
                    <Input_Hoshi    
                        width='100%'
                        placeholder={'Реална цена'} 
                        variable={obj.realPrice?.toString()}
                        setVariable={(val)=>{
                            setObj(prSt => ({...prSt, realPric: +val}))
                        }}
                    />
                </View>
                {/* Buttons */}
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
                        // onPress={() => {
                        //     if(obj.title && obj.card_limit && obj.price && !isNaN(Number(obj.card_limit)) && !isNaN(Number(obj.price))) {
                        //         isNewType ? cardyTypesStore2.addCardType(obj)
                        //             : cardyTypesStore2.updateItem(cardyTypeModel.id, obj)
                        //         onDismiss()
                        //     } else {
                        //         !obj.title  ? setRequireds(prevState => ({...prevState, requiredMessage_title: true}))
                        //                     : setRequireds(prevState => ({...prevState, requiredMessage_title: false}))

                        //         !obj.card_limit     ? setRequireds(prevState => ({...prevState, requiredMessage_card_limit: true}))
                        //                             : setRequireds(prevState => ({...prevState, requiredMessage_card_limit: false}))

                        //         !obj.price  ? setRequireds(prevState => ({...prevState, requiredMessage_price: true}))
                        //                     : setRequireds(prevState => ({...prevState, requiredMessage_price: false}))

                        //         isNaN(Number(obj.card_limit))   ? setNumericFlags(prevState => ({...prevState, requiredMessage_card_limit_numeric: true}))
                        //                                         : setNumericFlags(prevState => ({...prevState, requiredMessage_card_limit_numeric: false}))

                        //         isNaN(Number(obj.price))    ? setNumericFlags(prevState => ({...prevState, requiredMessage_price_numeric: true}))
                        //                                     : setNumericFlags(prevState => ({...prevState, requiredMessage_price_numeric: false}))
                        //     }                            
                        // }}
                        onPress={() => {
                            if(obj.card_type?.type) {
                                // pageHelpers.isNewType ? 
                                    cardyStore2.addItem(obj)
                                    // : cardyStore2.updateItem(cardyModel.id, obj)
                                onDismiss()
                            } else {

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