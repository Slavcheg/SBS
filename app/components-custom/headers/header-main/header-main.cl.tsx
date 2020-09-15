import React from 'react';
import { MainHeaderProps } from "./header-main.props"
import { Badge } from 'react-native-elements'
import { Image, View } from 'react-native';
import { Icon } from '../../../components/icon/icon';
import { imgs } from '../../../assets';
import { CustomHeader } from "../header-custom/header-custom"
import { color } from '../../../theme';
import {useStores } from "../../../models/root-store"
import { Avatar } from 'react-native-elements'

export const MainHeader_Cl: React.FunctionComponent<MainHeaderProps> = props => {
const {navigation, style} = props
const rootStore = useStores()
return (
    <CustomHeader 
        style={style}
        // titleStyle={{color: '#000000'}}
        leftIcon={
            <Icon 
                icon={'gr_exit_door'} 
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
                    borderColor: color.palette.green_sbs,
                    borderWidth: 1
                }]}
                size='small'
                source={{
                    uri:
                    rootStore.getProfilePicture
                }}
            />
        } 
    />
)
}