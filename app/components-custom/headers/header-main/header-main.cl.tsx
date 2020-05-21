import React from 'react';
import { MainHeaderProps } from "./header-main.props"
import { Badge } from 'react-native-elements'
import { Image, View } from 'react-native';
import { Icon } from '../../icon/icon';
import { imgs } from '../../../assets';
import { CustomHeader } from "../header-custom/header-custom"
import { color } from '../../../theme';

export const MainHeader_Cl: React.FunctionComponent<MainHeaderProps> = props => {
const {navigation, style} = props
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
                        
                        // containerStyle={boxes.x}
                    />}
        // headerText={'asdasd'}
        rightIcon={
            <View>
                <Icon 
                    icon={'gr_bell'}
                    // style={{width: 34, height: 34}} 
                />
                <Badge
                    status="success"
                    value='2'
                    containerStyle={{ position: 'absolute', top: 1, right: 1 }}
                />
            </View>
        } 
    />
)
}