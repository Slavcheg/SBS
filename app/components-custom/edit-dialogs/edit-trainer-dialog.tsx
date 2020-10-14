import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { border_boxes, device_width, device_height, regexMailValidator } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { useStores } from "../../models/root-store"
import { RequiredWarning } from "../required-warning/required-warning"
import { GetGymhallSuggestions } from "./edit-trainer-components/get-gymhall-suggestions"
import { translate } from "../../i18n"
import { getSnapshot } from "mobx-state-tree"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { observer } from "mobx-react-lite"

interface EditTrainerDialogProps {
    // setUser(getSnapshot(incommingUserModel.item))
    // line above doesnt work if incomingUSer is defined
    incommingUserModel?: any
    onDismiss: Function
    seeDailog: boolean
}

export const EditTrainerDialog: React.FunctionComponent<EditTrainerDialogProps> = observer(props => {
    const { onDismiss, incommingUserModel, seeDailog } = props
    const { userStore2 } = useStores()
    const resetUserData = {
        email: '',
        picture: '',
        generic_number: 0,
        password: '',
        first: '',
        last: '',
        referral: '',
        isAdmin: false,
        isTrainer: true,
        isClient: false,
        trainer: {
            gymhalls: []
        },
        diary: []
    }
    const [user, setUser] = useState<any>(resetUserData)
    const resetHelpers = {
        isNewUser: false,
        validMailFlag: true,
        emailReqField: false,
        firstReqField: false,
        lastReqField: false,
        gymSearch: '',
        seeGymSuggestions: false
    }
    const [pageHelpers, setPageHelper] = useState(resetHelpers)

    useEffect(() => {
        userStore2.getItems()
        setUser(resetUserData)
        if(incommingUserModel?.id){
            setUser(getSnapshot(incommingUserModel.item))
            setPageHelper(resetHelpers)
        } else {
            
            setPageHelper(prSt => ({...prSt, isNewUser: true}))
        }
    }, [incommingUserModel])

    useEffect(() => {
        try{ 
            setPageHelper(prSt => ({...prSt, 
                validMailFlag: !regexMailValidator.test(String(user.email).toLocaleLowerCase()) && user?.email !== ''
            }))
        } catch(e) {console.log(e)}
    }, [user.email])

    const dialog = (
        <View
            key={'full screen'}
            style={[{
                // display: seeDailog? 'flex' : 'none',
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
                    placeholder={'* ' + translate('see/add-trainer-dialog.email_field')} 
                    variable={user.email}
                    setVariable={val => {
                        setUser(prSt => ({...prSt, email: val}))
                        if (val === '') {
                            setPageHelper(prSt => ({...prSt, emailReqField: true}))
                        } else {
                            setPageHelper(prSt => ({...prSt, emailReqField: false}))
                        }
                    }}                    
                />
                <RequiredWarning flag={pageHelpers.emailReqField} width={'100%'} />
                <RequiredWarning flag={pageHelpers.validMailFlag} message={translate("see/add-client-dialog.isEmailValidMessage")} width={'100%'} />
                <Input_Hoshi 
                    width='100%'   
                    placeholder={'* ' + translate('see/add-trainer-dialog.name_field')} 
                    variable={user.first}
                    setVariable={val => {
                        setUser(prSt => ({...prSt, first: val}))
                        val === '' ? setPageHelper(prSt => ({...prSt, firstReqField: true}))
                            : setPageHelper(prSt => ({...prSt, firstReqField: false}))
                    }}
                />
                <RequiredWarning flag={pageHelpers.firstReqField} width={'100%'} />
                <Input_Hoshi 
                    width='100%'   
                    placeholder={'* ' + translate('see/add-trainer-dialog.family_name_field')} 
                    variable={user.last}
                    setVariable={val => {
                        setUser(prSt => ({...prSt, last: val}))
                        val === '' ? setPageHelper(prSt => ({...prSt, lastReqField: true}))
                            : setPageHelper(prSt => ({...prSt, lastReqField: false}))
                    }}
                />
                <RequiredWarning flag={pageHelpers.lastReqField} width={'100%'} />
                {/* Gymhalls */}
                <View
                    style={[{
                        width: '100%',
                        marginVertical: 20
                    }]}
                >
                    <Text>{translate('see/add-trainer-dialog.gyms_field') + ':'}</Text>
                    {
                        user.trainer?.gymhalls?.map((gym, index) => {
                        return  <View
                                    key={gym}
                                    style={[{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }]}
                                >
                                    <Text>{gym}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            let gyms = user.trainer?.gymhalls
                                            try{
                                                gyms.splice(gyms.indexOf(gym) ,1)
                                            } catch(e){console.log(e)}
                                            console.log(gyms)
                                            setUser(prSt => ({
                                                ...prSt,
                                                trainer: {
                                                    ...prSt.trainer,
                                                    gymhalls: gyms
                                                }
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
                </View>
                <Input_Hoshi 
                    width='100%'   
                    placeholder={translate('see/add-trainer-dialog.gyms_field')} 
                    variable={pageHelpers.gymSearch}
                    setVariable={val => setPageHelper(prSt => ({...prSt, gymSearch: val}))}
                    onF={() => setPageHelper(prSt => ({...prSt, seeGymSuggestions: true}))}
                    onB={() => {
                        setPageHelper(prS => ({
                            ...prS,
                            seeGymSuggestions: false,
                            gymSearch: ''
                        }))
                    }}
                />
                <GetGymhallSuggestions 
                    searchString={pageHelpers.gymSearch}
                    isVisible={pageHelpers.seeGymSuggestions}
                    onTouch={(refName: string) => {
                        if(!user.trainer?.gymhalls?.includes(refName)){
                            setUser(prSt => ({
                                ...prSt,
                                trainer: {
                                    // ...prSt.trainer,
                                    gymhalls: user.trainer?.gymhalls.concat(refName)
                                }
                            }))
                            setUser(prSt => ({
                                ...prSt,
                                trainer: {
                                    // ...prSt.trainer,
                                    gymhalls: user.trainer?.gymhalls.concat(refName)
                                }
                            }))
                        }                  
                        setPageHelper(prSt => ({
                            ...prSt,
                            seeGymSuggestions: false,
                            gymSearch: ''
                        }))
                    }}
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
                        onPress={() => {
                            setPageHelper(prSt => ({...prSt, gymSearch: ''}))
                            onDismiss()
                        }} 
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
                            if((user.first && user.last) && user.email !== '' && !pageHelpers.validMailFlag) {
                                pageHelpers.isNewUser ? userStore2.addItem(user)
                                    : userStore2.updateItem(incommingUserModel.id, user)
                                setPageHelper(prSt => ({...prSt, referralSearch: ''}))
                                onDismiss()
                            } else {
                                if(!user.first){
                                    setPageHelper(prSt => ({...prSt,
                                        firstReqField: true
                                    }))
                                }
                                if(!user.last){
                                    setPageHelper(prSt => ({...prSt,
                                        lastReqField: true
                                    }))
                                }
                                if(!user.email){
                                    setPageHelper(prSt => ({...prSt,
                                        emailReqField: true
                                    }))
                                }
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
            </View>
        </View>
    )
    return seeDailog? dialog: <View></View>
})