import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../../models/commomn-navigation-props";
import { Screen, Button, Input_Hoshi, RequiredWarning } from '../../../../components'
import { color, spacing } from "../../../../theme";
import { View, Text, TouchableOpacity } from "react-native";
import { useStores } from "../../../../models/root-store";
import { ICardy2 } from "../../../../models/sub-stores/v2-cardy-store";
import { return_todays_datestamp, displayDateFromTimestamp } from "../../../../global-helper";
import { translate } from "../../../../i18n";
import { GetCardyTypeSuggestions } from "../../../../components-custom/edit-dialogs/edit-cardy2-components/get-cardy-type-suggestions";
import { ICardy_Type, card_types } from "../../../../models/sub-stores/v2-cardy-types-store";
import { DatePicker } from "../../../../components-custom/date-picker/date-picker";
import { GetTrainersSuggestions } from "../../../../components-custom/edit-dialogs/edit-cardy2-components/get-trainers-suggestions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { GetClientsSuggestions } from "../../../../components-custom/edit-dialogs/edit-cardy2-components/get-clients-suggestions";

interface AddCardScreenProps extends NavigationProps {}
export const AddCardScreen: React.FunctionComponent<AddCardScreenProps> = observer(props => {
    const { navigation } = props
    const { cardyStore2 }  = useStores()
    
    const [obj, setObj] = useState<ICardy2>({
        // write properties
        clients: [],
        trainers: [],
        datestampPayment: return_todays_datestamp(),
        datestampStart: return_todays_datestamp(),
    })

    const [pageHelpers, setPageHelper] = useState({
        // isNewType: false,
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
        requiredMessage_clients: false,
        requiredMessage_trainers: false,
        requiredMessage_realPrice: false 
    })

    const [numericFlags, setNumericFlags] = useState({
        requiredMessage_realPrice_numeric: false,
    })

    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flexGrow: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.transparent,
                marginHorizontal: '5%'
            }}
        >
            <Input_Hoshi
                width='100%'
                placeholder={'* ' + translate('edit/sbsCardPurchased.type_name')}
                variable={obj.card_type?.title}
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
            {/* Clients */}
            <View
                    style={[{
                        width: '100%',
                        marginVertical: 20
                    }]}
                >

                    <Text>{translate('edit/sbsCardPurchased.clients')}</Text>
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
                        placeholder={'* ' + translate('edit/sbsCardPurchased.clients')} 
                        variable={pageHelpers.clientSearch}
                        setVariable={(val)=>{ setPageHelper(prSt => ({...prSt, clientSearch: val}))}}
                        onF={() => setPageHelper(prS => ({...prS, seeClientsSuggestions: true}))}
                        onB={() => {
                            setPageHelper(prS => ({
                                ...prS,
                                seeClientsSuggestions: false,
                                clientSearch: ''
                            }))
                            if (obj.clients.length !== 0) {
                                setRequireds(prSt => ({...prSt, requiredMessage_clients: false}))
                            } else {
                                setRequireds(prSt => ({...prSt, requiredMessage_clients: true}))
                            }
                        }}
                    />
                    <RequiredWarning flag={requireds.requiredMessage_clients} width={'100%'} />
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

                    <Text>{translate('edit/sbsCardPurchased.trainers')}</Text>
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
                        placeholder={'* ' + translate('edit/sbsCardPurchased.trainers')} 
                        variable={pageHelpers.trainerSearch}
                        setVariable={(val)=>{ setPageHelper(prSt => ({...prSt, trainerSearch: val}))}}
                        onF={() => setPageHelper(prS => ({...prS, seeTrainersSuggestions: true}))}
                        onB={() => {
                            setPageHelper(prS => ({
                                ...prS,
                                seeTrainersSuggestions: false,
                                trainerSearch: ''
                            }))
                            if (obj.trainers.length !== 0) {
                                setRequireds(prSt => ({...prSt, requiredMessage_trainers: false}))
                            } else {
                                setRequireds(prSt => ({...prSt, requiredMessage_trainers: true}))
                            }
                        }}
                    />
                    <RequiredWarning flag={requireds.requiredMessage_trainers} width={'100%'} />
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
                        placeholder={translate('edit/sbsCardPurchased.dateOfPayment')} 
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
                        placeholder={translate('edit/sbsCardPurchased.dateOfStart')} 
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
                            placeholder={
                                obj.card_type?.type === card_types.monthly ? 
                                    translate('edit/sbsCardPurchased.limit_months')
                                    : translate('edit/sbsCardPurchased.limit_visits')
                            } 
                            variable={obj.card_type?.card_limit.toString()}
                            editable={false}
                            setVariable={(val)=>{}}
                        />
                        <Input_Hoshi    
                            width='45%'
                            placeholder={translate('edit/sbsCardPurchased.price')} 
                            variable={obj.card_type?.price.toString()}
                            editable={false}
                            setVariable={(val)=>{}}
                        />
                    </View>
                    <Input_Hoshi    
                        width='100%'
                        placeholder={'* ' + translate('edit/sbsCardPurchased.realPrice')} 
                        variable={obj.realPrice?.toString()}
                        setVariable={(val)=>{
                            setObj(prSt => ({...prSt, realPrice: isNaN(+val)? val : +val}))
                        }}
                    />
                    <RequiredWarning flag={requireds.requiredMessage_realPrice} width={'100%'} />
                    <RequiredWarning flag={numericFlags.requiredMessage_realPrice_numeric} message={translate('generic.required_numeric')} width={'100%'} />
                </View>
            <View
                    style={[{
                        flexGrow: 1
                    }]}
            ></View>
            <View
                style={[{
                    width: '100%',
                    paddingVertical: 50,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }]}
            >
                <Button 
                    onPress={() => navigation.goBack()} 
                    text={translate('generic.close_button')}
                    style={{
                        width: '45%',
                        marginTop: spacing[8],
                        paddingVertical: spacing[4],
                        backgroundColor: color.palette.grey_sbs,
                        borderWidth: 1,
                        borderColor: 'black'
                        }}
                    textStyle={{
                        color: 'black',
                        fontSize: 16
                        }}
                />
                <Button
                    onPress={() => {
                        if(obj.card_type?.type && obj.clients.length !== 0 && obj.trainers.length !== 0
                            && obj.realPrice && !isNaN(Number(obj.realPrice))) {
                            cardyStore2.addItem(obj)
                            navigation.goBack()
                        } else {
                            !obj.card_type?.type  ? setRequireds(prevState => ({...prevState, requiredMessage_type: true}))
                                : setRequireds(prevState => ({...prevState, requiredMessage_type: false}))
    
                            obj.clients.length !== 0  ? setRequireds(prevState => ({...prevState, requiredMessage_clients: false}))
                                : setRequireds(prevState => ({...prevState, requiredMessage_clients: true}))

                            obj.trainers.length !== 0  ? setRequireds(prevState => ({...prevState, requiredMessage_trainers: false}))
                                : setRequireds(prevState => ({...prevState, requiredMessage_trainers: true}))
                        
                            !obj.realPrice  ? setRequireds(prevState => ({...prevState, requiredMessage_realPrice: true}))
                                            : setRequireds(prevState => ({...prevState, requiredMessage_realPrice: false}))
                            
                            isNaN(Number(obj.realPrice)) ? setNumericFlags(prevState => ({...prevState, requiredMessage_realPrice_numeric: true}))
                                : setNumericFlags(prevState => ({...prevState, requiredMessage_realPrice_numeric: false}))
                        }
                    }}
                    text={translate('generic.save_button')}
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
                />           
            </View>
        </Screen>  
    )
})