import React from 'react';
import { MainHeaderProps } from "./header-main.props"
import { Avatar } from 'react-native-elements'
import { Image, View } from 'react-native';
import { Icon } from '../../../components/icon/icon';
import { imgs } from '../../../assets';
import { CustomHeader } from "../header-custom/header-custom"
import { color } from '../../../theme';
import {useStores } from "../../../models/root-store"

export const MainHeader_Tr: React.FunctionComponent<MainHeaderProps> = props => {
const {navigation, style} = props
const rootStore = useStores()
return (
    <CustomHeader 
        style={style}
        // titleStyle={{color: '#000000'}}
        leftIcon={
            <Icon 
                icon={'bl_exit_door'} 
                style={{width: 34, height: 34}} 
            />
        }
        onLeftPress={() => navigation.navigate('welcome')}
        headerLogo={<Image 
                        source={imgs.logo} 
                        style={[{ height: 40, width: 160}]}
                    />}
        rightIcon={
            <Avatar                
                rounded
                containerStyle={[{
                    borderColor: color.palette.blue_sbs,
                    borderWidth: 1
                }]}
                size='small'
                source={{
                    uri:
                    rootStore.getProfilePicture
                   }}
            />
        } 
        // onRightPress={() => navigation.navigate('play')}
    />
)
}