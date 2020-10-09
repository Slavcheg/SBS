import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height, regexMailValidator } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { useStores } from "../../models/root-store"
import { GetReferralSuggestions, RequiredWarning } from "../../components"
import { translate } from "../../i18n"
import { getSnapshot } from "mobx-state-tree"
import { observer } from "mobx-react-lite"

interface EditClientDialogProps {
    // setUser(getSnapshot(incommingUserModel.item))
    // line above doesnt work if incomingUSer is defined
    incommingUserModel?: any
    onDismiss: Function
    seeDailog: boolean
}

export const EditClientDialog: React.FunctionComponent<EditClientDialogProps> = observer(props => {
    const { onDismiss, incommingUserModel, seeDailog } = props
    const { userStore2 } = useStores()

    const [user, setUser] = useState<any>({
        email: ''
    })
    const resetHelpers = {
        isNewUser: false,
        validMailFlag: true,
        firstReqField: false,
        lastReqField: false,
        referralSearch: '',
        seeReferralSuggestions: false
    }
    const [pageHelpers, setPageHelper] = useState(resetHelpers)

    useEffect(() => {
        userStore2.getItems()
        if(incommingUserModel?.id){
            setUser(getSnapshot(incommingUserModel.item))
            setPageHelper(resetHelpers)
        } else {
            setUser({
                email: '',
                diary: [],
                isClient: true, 
                isAdmin: false, 
                isTrainer: false,
                client: {
                    generic_number: 1000 + userStore2.clientsCount + 1,
                    password: 'admin123'
                }
            })
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
            style={[
                {               
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
                    placeholder={translate('see/add-client-dialog.generic_num_field')} 
                    variable={user.client?.generic_number.toString()}
                    setVariable={val => setUser(prSt => ({...prSt, generic_number: val}))}
                    editable = {false}
                />
                <Input_Hoshi    
                    width='100%'
                    placeholder={translate('see/add-client-dialog.email_field')} 
                    variable={user.email}
                    setVariable={val => {
                        setUser(prSt => ({...prSt, email: val}))
                    }}                    
                />
                <RequiredWarning flag={pageHelpers.validMailFlag} message={translate("see/add-client-dialog.isEmailValidMessage")} width={'100%'} />
                <Input_Hoshi 
                    width='100%'
                    placeholder={'* ' + translate('see/add-client-dialog.name_field')} 
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
                    placeholder={'* ' + translate('see/add-client-dialog.family_name_field')} 
                    variable={user.last}
                    setVariable={val => {
                        setUser(prSt => ({...prSt, last: val}))
                        val === '' ? setPageHelper(prSt => ({...prSt, lastReqField: true}))
                            : setPageHelper(prSt => ({...prSt, lastReqField: false}))
                    }}
                />
                <RequiredWarning flag={pageHelpers.lastReqField} width={'100%'} />
                <View
                    style={[{
                        width: '100%',
                        marginVertical: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }]}
                >
                    <Text>{translate('see/add-client-dialog.referral_field') + ':'}</Text>
                    <Text>{user.client?.referral}</Text>
                </View>
                <Input_Hoshi 
                    width='100%'
                    placeholder={translate('see/add-client-dialog.referral_field')} 
                    variable={pageHelpers.referralSearch}
                    setVariable={val => setPageHelper(prSt => ({...prSt, referralSearch: val}))}
                    onF={() => setPageHelper(prSt => ({...prSt, seeReferralSuggestions: true}))}
                    onB={() => {
                        setPageHelper(prS => ({
                            ...prS,
                            seeReferralSuggestions: false,
                            referralSearch: ''
                        }))
                    }}
                />
                
                <GetReferralSuggestions 
                    searchString={pageHelpers.referralSearch}
                    isVisible={pageHelpers.seeReferralSuggestions}
                    onTouch={(refName: string) => {
                        setUser(prSt => ({
                            ...prSt,
                            client: {
                                ...prSt.client,
                                referral: refName
                            }
                        }))
                        setPageHelper(prSt => ({
                            ...prSt,
                            seeReferralSuggestions: false,
                            referralSearch: ''
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
                            setPageHelper(prSt => ({...prSt, referralSearch: ''}))
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
                    >                
                    </Button>
                    <Button 
                        onPress={() => {
                            if((user.first && user.last) && !pageHelpers.validMailFlag) {
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
                    >                    
                    </Button>
                </View>                
            </View>            
        </View>
    )
    return seeDailog? dialog: <View></View>
})