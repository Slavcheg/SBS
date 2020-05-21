import React from 'react';
import { PageHeaderProps } from "./header-page.props"
import { Badge } from 'react-native-elements'
import { Image, View } from 'react-native';
import { Icon } from 'react-native-elements'
import { Icon as Iconn } from '../../../components/icon/icon';
import { imgs } from '../../../assets';
import { CustomHeader } from "../header-custom/header-custom"
import { color } from '../../../theme';

export const PageHeader_Cl: React.FunctionComponent<PageHeaderProps> = props => {
    const {navigation, style, title} = props

    return (
        <CustomHeader 
            style={style}
            // titleStyle={{color: '#000000'}}
            leftIcon={
                <Icon
                    name='chevron-left'
                    size={40}    
                    color={color.palette.green_sbs}
                />
            }
            onLeftPress={() => navigation.goBack()}
            // headerLogo={<Image 
            //                 source={imgs.logo} 
            //                 style={[{ height: 40, width: 160}]}
                            
            //                 // containerStyle={boxes.x}
            //             />}
            headerText={title}
            titleStyle={{
                color: '#333333',
                fontSize: 18
            }}
            rightIcon={
                <View>
                    <Iconn 
                        icon={'gr_bell'}
                        style={{
                            // width: 34,
                            // height: 34,
                            // backgroundColor: 'red'
                        }} 
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