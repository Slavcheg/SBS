import React, { useEffect, useState } from "react"
import { Text, View, Linking } from 'react-native';
import { spacing, color } from '../../../theme';
import {Screen, MainHeader_Cl, ButtonSquare } from '../../../components'
import ProgressCircle from 'react-native-progress-circle'
import { border_boxes } from "../../../global-helper";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import {useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"

interface HomeScreenClientProps extends NavigationProps {}

export const HomeScreenClient: React.FunctionComponent<HomeScreenClientProps> = observer(props => {
    const { navigation } = props
    const rootStore = useStores()    
    
    const menuList = require('./menu-list-cl.json');
    const menu = menuList.map((el, i) => {
        let onPress = null;
        if (el.onClick !== "goSomewhere"){
            onPress = () => navigation.navigate(el.onClick) ;
        }
        if (el.onClick === "link"){
            onPress = ()=>{ Linking.openURL('https://strongby.science/more_info_mitko')}
        }
        
        return  <ButtonSquare 
                    style={{marginTop: 0}} 
                    key={i} 
                    title={translate(el.title)} 
                    onPress={onPress}
                    leftIcon={el.iconLeft}
                    rightIcon={el.iconRight}
                    ></ButtonSquare>
    })

    useEffect(() => {
    }, [])
    // const {counterDone, counterTotal} = rootStore.numberOfTrainingsForLoggedClientForActiveCards
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
                    percent={
                        (rootStore.numberOfTrainingsForLoggedClientForActiveCards.counterDone /
                        rootStore.numberOfTrainingsForLoggedClientForActiveCards.counterTotal) * 100 || 0
                    }
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
                        >{rootStore.numberOfTrainingsForLoggedClientForActiveCards.counterDone}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{translate('clientHomeScreen.progressCircleTextTop')}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{translate('clientHomeScreen.progressCircleTextBottom') + ' ХХХ'}</Text>
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
})
