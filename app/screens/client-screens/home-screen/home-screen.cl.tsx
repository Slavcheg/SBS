import React, { useEffect, useState } from "react"
import { Text, View } from 'react-native';
import { spacing, color } from '../../../theme';
import {Screen, MainHeader_Cl, ButtonSquare } from '../../../components'
import ProgressCircle from 'react-native-progress-circle'
import { Auth } from '../../../services/auth/auth.service';
import { border_boxes } from "../../../global-helper";

let number = 6

export function HomeScreenClient({navigation}) {
    const menuList = require('./menu-list-cl.json');
    const menu = menuList.map((el, i) => {
        const onPress = el.onClick !== "goSomewhere" ? () => navigation.navigate(el.onClick) : null;
        return  <ButtonSquare 
                    style={{marginTop: 0}} 
                    key={i} 
                    title={el.title} 
                    onPress={onPress}
                    leftIcon={el.iconLeft}
                    rightIcon={el.iconRight}
                    ></ButtonSquare>
    })

    useEffect(() => {
        Auth.login('georgi.v.slavchev@gmail.com')
        // console.log(Auth.getUserRole())
       }, [])

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
            <MainHeader_Cl navigation={navigation} style={{paddingHorizontal: 25}}/>
            <View 
                style={[
                    // boxes.black,
                    {
                    paddingVertical: spacing[8]
                }]}
            >
                <ProgressCircle
                    percent={(number/8)*100}
                    radius={100}
                    borderWidth={15}
                    color={color.palette.green_sbs}
                    shadowColor="#CCCCCC"
                    bgColor="#fff"
                >
                    <View
                        style={{
                            alignItems: 'center'
                        }}
                    >
                        <Text 
                            style={{ 
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: color.palette.green_sbs
                            }}
                        >{number}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{'тренировки'}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{'до 16.10.2020'}</Text>
                    </View>            
                </ProgressCircle>
            </View>
            <View 
                style={[
                    // border_boxes().orange,
                    {
                        flexGrow: 1,
                        width: '100%',
                        backgroundColor: "#F4F8FB",
                        paddingVertical: 20,
                        paddingHorizontal: 25,
                        // marginBottom: 20
                    }
                ]}
            >
                {
                    menu
                }
            </View>
        </Screen>     
    )
}