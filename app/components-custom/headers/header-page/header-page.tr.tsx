import React from 'react';
import { PageHeaderProps } from "./header-page.props"
import { Avatar } from 'react-native-elements'
import { View } from 'react-native';
import { Icon as Iconn } from '../../../components/icon/icon';
import { CustomHeader } from "../header-custom/header-custom"
import { color } from '../../../theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import {useStores } from "../../../models/root-store"

export const PageHeader_Tr: React.FunctionComponent<PageHeaderProps> = props => {
    const {navigation, style, title} = props
    const rootStore = useStores()
    
    return (
        <CustomHeader 
            style={style}
            leftIcon={
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={30}    
                    color={color.palette.blue_sbs}
                />
            }
            onLeftPress={() => navigation.goBack()}
            headerText={title}
            titleStyle={{
                color: '#333333',
                fontSize: 20
            }}
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
            // onRightPress={() => navigation.navigate('_demo')}
        />
    )
}