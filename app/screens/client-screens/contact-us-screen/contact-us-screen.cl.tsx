import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button } from '../../../components'
import { color, spacing } from "../../../theme"
import { View, Text } from "react-native"
import { border_boxes } from "../../../global-helper"
import { Input } from "react-native-elements"

export function ContactUsScreen({navigation}) { 
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

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
                // paddingHorizontal: 20
            }}
        >
            <PageHeader_Cl 
                navigation={navigation} 
                style={{paddingHorizontal: 25, backgroundColor: 'white'}}
                title={'СВЪРЖИ СЕ С НАС'} 
            />
            <View
                style={[
                    // border_boxes().orange,
                    {
                    flexGrow: 1,
                    width: '100%',
                    // paddingHorizontal: 20,
                    padding: 45,
                    backgroundColor: color.palette.grey_sbs
                }]}
            >
                <View
                    style={[{
                        borderColor: color.palette.green_sbs,
                        borderWidth: 1,
                        borderRadius: 15,
                        height: 40,
                        width: '100%',
                        marginBottom: 30
                    }]}
                >
                    <Input 
                        autoCapitalize='none'
                        autoCompleteType="off"
                        autoCorrect={false}

                        value={name}
                        onChangeText={(t) => {setName(t)}}
                        inputStyle={{
                            fontSize: 12,
                            color: color.palette.green_sbs
                        }}

                        inputContainerStyle={{
                            borderBottomWidth: 0
                        }}
                        placeholder={'име'}
                        placeholderTextColor={color.palette.green_sbs}
                    />
                </View>
                <View
                    style={[{
                        justifyContent: 'center',
                        borderColor: color.palette.green_sbs,
                        borderWidth: 1,
                        borderRadius: 15,
                        height: 300,
                        width: '100%',
                        marginBottom: 30
                    }]}
                >
                    <Input 
                        autoCapitalize='none'
                        autoCompleteType="off"
                        autoCorrect={false}

                        value={message}
                        onChangeText={(t) => {setMessage(t)}}
                        inputStyle={{
                            fontSize: 12,
                            color: color.palette.green_sbs
                        }}

                        inputContainerStyle={{
                            borderBottomWidth: 0
                        }}

                        containerStyle={[{
                            alignSelf: 'center'
                        }]}
                        placeholder={'Съобщение'}
                        placeholderTextColor={color.palette.green_sbs}

                        multiline={true}
                        numberOfLines={4}
                    />      
                </View>
                <Button
                    style={{
                        width: '80%',
                    // marginTop: spacing[8],
                        paddingVertical: spacing[3],
                        backgroundColor: color.palette.green_sbs,
                        alignSelf: 'center',
                        marginBottom: 30
                    }}
                    textStyle={{
                    color: 'white',
                    fontSize: 16
                    }}
                    // tx={'welcomeScreen.registrationBtn'}
                    text={'ИЗПРАТИ'}
                    // onPress={()=> navigation.navigate('registration')} 
                />  
                <View
                    style={[{
                        alignItems: 'center'
                    }]}
                >
                    <Text
                        style={[{
                            marginBottom: 10
                        }]}
                    >{'Не ти се пише?'}</Text>
                    <Text
                        style={[{
                            marginBottom: 10
                        }]}
                    >{'Звънни на тел:'}</Text>
                    <Text
                        style={[{
                            color: color.palette.green_sbs
                        }]}
                    >{'0897 074 269'}</Text>
                </View>
            </View>

        </Screen>
    )
}