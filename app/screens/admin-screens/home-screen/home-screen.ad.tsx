import React, { useEffect, useState } from "react"
import { View } from 'react-native';
import { color } from '../../../theme';
import {Screen, MainHeader_Tr, ButtonSquare } from '../../../components'
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import { translate } from "../../../i18n"

interface HomeScreenAdminProps extends NavigationProps {}

export const HomeScreenAdmin: React.FunctionComponent<HomeScreenAdminProps> = observer(props => {  
    const menuList = require('./menu-list-ad.json');
    const menu = menuList.map((el, i) => {
    const onPress = el.onClick !== "goSomewhere" ? () => navigation.navigate(el.onClick) : null;
        
        if (el.title === 'flexGrow') {
            return (
                <View
                    key={i}
                    style={[{
                        flexGrow: 1
                    }]}
                ></View>
            )
        }
    
        return  <ButtonSquare 
                    style={{marginTop: 20}} 
                    key={i} 
                    title={translate(el.title)}
                    onPress={onPress}
                    leftIcon={el.iconLeft}
                    rightIcon={el.iconRight}
                ></ButtonSquare>
    })
    const { navigation } = props
    
    // useEffect(() => {

    //   }, [])

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
            }}
        >
            <MainHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}}/>
            <View  
                style={[
                    {
                        flex: 1,
                        width: '100%',
                        backgroundColor: "#F4F8FB",
                        paddingTop: 5,
                        paddingBottom: 30,
                        paddingHorizontal: 25
                    }
                ]}
            >
                {
                    menu
                }
            </View>
        </Screen>     
    )
})
