import React, { useEffect } from "react"
import { View } from "react-native"
import {  device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import {useStores } from "../../models/root-store"
import { translate } from "../../i18n"

export const SeeClientDialog: React.FunctionComponent<{email, onDismiss}> = props => {
    const userStore = useStores().userStore2
    const { onDismiss } = props
    useEffect(() => {
        userStore.getItems()
    }, [])
    let client = userStore.clients
                    .find(cl => cl.item.email === props.email)
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
                    placeholder={translate('see/add-client-dialog.name_field')} 
                    variable={client.item.email}
                    setVariable={val => val}
                    editable = {false}
                />
                <Input_Hoshi    
                    width='100%'
                    placeholder={translate('see/add-client-dialog.generic_num_field')} 
                    variable={client.item.client.generic_number.toString()}
                    setVariable={val => val}
                    editable = {false}
                />
                <Input_Hoshi    
                    width='100%'
                    placeholder={translate('see/add-client-dialog.referral_field')} 
                    variable={client.item.client.referral}
                    setVariable={val => val}
                    editable = {false}
                />
                {/* <Input_Hoshi    
                    width='100%'
                    placeholder={'треньор'} 
                    variable={'?'}
                    setVariable={val => val}
                    editable = {false}
                /> */}
                <View
                    style={[{
                        width: '100%',
                        paddingVertical: 20,
                        flexDirection: 'row',
                        // justifyContent: 'space-between'
                        justifyContent: 'center'
                    }]}
                >
                    <Button 
                        onPress={() => onDismiss()} 
                        text={translate('generic.close_button')}
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
                    {/* <Button 
                        onPress={() => {
                            if(user.email !== '') {
                                userStore.aaddItem(user) 
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
                    </Button> */}
                </View>            
            </View>
        </View>
    )
}