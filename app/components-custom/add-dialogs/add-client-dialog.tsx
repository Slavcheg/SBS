import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { border_boxes, device_width, device_height } from "../../global-helper"
import { Button } from "../../components/button/button"
import { color, spacing } from "../../theme"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { useStores } from "../../models/root-store"
import { IUser2 } from "../../models/sub-stores/v2-user-store"
import { RequiredWarning } from "../../components"

export const AddClientDialog: React.FunctionComponent<{onDismiss}> = props => {
    const userStore2 = useStores().userStore2
    const [user, setUser] = useState<IUser2>({})
    const [emailRequiredFlag, setRequiredFlag] = useState(false)
    const { onDismiss } = props
    let gen_num = 1000 + userStore2.clientsCount + 1
    useEffect(() => {
        userStore2.getItems()
        setUser(prevState => ({
            ...prevState, 
            client: {
                generic_number: 1000 + userStore2.clientsCount + 1,
                password: 'admin123'
            }
        }))
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
                    placeholder={'генериран номер'} 
                    variable={user.client?.generic_number.toString()}
                    setVariable={val => setUser(prevState => ({...prevState, generic_number: val}))}
                    editable = {false}
                />
                <Input_Hoshi    
                    width='100%'
                    placeholder={'емайл'} 
                    variable={user.email}
                    setVariable={val => {
                        setUser(prevState => ({...prevState, email: val, isClient: true, isAdmin: false, isTrainer: false}))
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
                    placeholder={'име'} 
                    variable={user.first}
                    setVariable={val => setUser(prevState => ({...prevState, first: val}))}
                />
                <Input_Hoshi 
                    width='100%'
                    placeholder={'фамилия'} 
                    variable={user.last}
                    setVariable={val => setUser(prevState => ({...prevState, last: val}))}
                />
                <Input_Hoshi 
                    width='100%'
                    placeholder={'препоръчител'} 
                    variable={user.referral}
                    setVariable={val => setUser(prevState => ({...prevState, referral: val}))}
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
                            if(user.email) {
                                userStore2.addItem(user) 
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