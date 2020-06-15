import React, { useEffect, useState } from "react"
import { Text, View } from 'react-native';
import { spacing, color } from '../../../theme';
import {Screen, MainHeader_Tr, ButtonSquare } from '../../../components'
import ProgressCircle from 'react-native-progress-circle'
import { Auth } from '../../../services/auth/auth.service';
import { Api } from "../../../services/api";
import { return_todays_date, today_vs_last_day } from "../../../global-helper";

export function HomeScreenAdmin({navigation}) {
    const [numberOfTrainings, setNumberOfTrainings] = useState(0);  
    
    const menuList = require('./menu-list-ad.json');
    const menu = menuList.map((el, i) => {
    const onPress = el.onClick !== "goSomewhere" ? () => navigation.navigate(el.onClick) : null;
        return  <ButtonSquare 
                    style={{marginTop: 20}} 
                    key={i} 
                    title={el.title}
                    onPress={onPress}
                    leftIcon={el.iconLeft}
                    rightIcon={el.iconRight}
                ></ButtonSquare>
    })

    useEffect(() => {
    //    Auth.login('dobrev.jordan@gmail.com')
       
      }, [])

    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flex: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.transparent,
                // paddingHorizontal: 20
            }}
        >
            <MainHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}}/>
            <View 
                style={[
                    // boxes.black,
                    {
                    paddingVertical: spacing[8]
                }]}
            >
                <ProgressCircle
                    percent={today_vs_last_day()*100}
                    radius={100}
                    borderWidth={15}
                    color={color.palette.blue_sbs}
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
                                color: color.palette.blue_sbs
                            }}
                        >{numberOfTrainings}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{'тренировки'}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{'до ' + return_todays_date()}</Text>
                    </View>            
                </ProgressCircle>
            </View>
            <View 
                style={[
                    // boxes.orange,
                    {
                        flex: 1,
                        width: '100%',
                        backgroundColor: "#F4F8FB",
                        paddingTop: 5,
                        paddingHorizontal: 25
                    }
                ]}
            >
                {
                    menu
                }
                
                {/* <ButtonSquare style={{marginTop: 20}}></ButtonSquare>
                <ButtonSquare style={{marginTop: 20}}></ButtonSquare> */}
            </View>
        </Screen>     
    )
}