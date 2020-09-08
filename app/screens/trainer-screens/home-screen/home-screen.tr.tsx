import React, { useEffect, useState } from "react"
import { Text, View } from 'react-native';
import { spacing, color } from '../../../theme';
import {Screen, MainHeader_Tr, ButtonSquare } from '../../../components'
import ProgressCircle from 'react-native-progress-circle'
import { return_todays_date, today_vs_last_day } from "../../../global-helper";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import {useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"
import crashlytics from '@react-native-firebase/crashlytics';
import { Button } from "react-native-elements";

import {IUser2} from "../../../models/sub-stores/v2-user-store"
import { IUser } from "../../../models/user.model";

interface HomeScreenTrainerProps extends NavigationProps {}

export const HomeScreenTrainer: React.FunctionComponent<HomeScreenTrainerProps> = observer(props => {
    const { navigation } = props
    const menuList = require('./menu-list-tr.json');
    const menu = menuList.map((el, i) => {
    const onPress = el.onClick !== "goSomewhere" ? () => navigation.navigate(el.onClick) : null;
        return  el.show ? 
                    <ButtonSquare 
                        style={{marginTop: 20}} 
                        key={i} 
                        title={translate(el.title)}
                        onPress={onPress}
                        leftIcon={el.iconLeft}
                        rightIcon={el.iconRight}
                    ></ButtonSquare>
                : null
    })
    const rootStore = useStores()
    const User2Strore = useStores().userStore2
    rootStore.hideLoader()
    useEffect(() => {
        User2Strore.getItems()
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
                        >{rootStore.numberOfTrainingsForLoggedTrainerThisMonth}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{translate('trainerHomeScreen.progressCircleTextTop')}</Text>
                        <Text
                            style={{
                                color: '#666666'
                            }}
                        >{translate('trainerHomeScreen.progressCircleTextBottom') + ' ' + return_todays_date()}</Text>
                    </View>            
                </ProgressCircle>
            <Button 
                containerStyle={[{
                    margin: 10
                }]}
                raised={true}
                title={'Create user2'}
                onPress={()=>{
                    let user: IUser2 = {
                        email: 'asdad'
                    }
                    user.first = 'asd'
                    User2Strore.addItem(user)
                }}
            />
            <Button 
                containerStyle={[{
                    margin: 10
                }]}
                raised={true}
                title={'List users'}
                onPress={()=> User2Strore.users.map(i => console.log(i.item.email))}
            />
            
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
})
