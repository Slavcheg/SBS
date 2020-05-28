import React from 'react';
import { PageHeaderProps } from "./header-page.props"
import { Badge } from 'react-native-elements'
import { View } from 'react-native';
import { Icon as Iconn } from '../../../components/icon/icon';
import { CustomHeader } from "../header-custom/header-custom"
import { color } from '../../../theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export const PageHeader_Cl: React.FunctionComponent<PageHeaderProps> = props => {
    const {navigation, style, title} = props

    return (
        <CustomHeader 
            style={style}
            leftIcon={
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={30}    
                    color={color.palette.green_sbs}
                />
            }
            onLeftPress={() => navigation.goBack()}
            headerText={title}
            titleStyle={{
                color: '#333333',
                fontSize: 18
            }}
            rightIcon={
                <View>
                    <Iconn 
                        icon={'gr_bell'}
                    />
                    <Badge
                        status="success"
                        value='2'
                        containerStyle={{ position: 'absolute', top: 1, right: 1 }}
                    />
                </View>
            } 
            onRightPress={() => navigation.navigate('play')}
        />
    )
}