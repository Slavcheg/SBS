import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button,  } from '../../components'
import { color } from "../../theme"

import { Hoshi } from 'react-native-textinput-effects';
import { View, Text } from "react-native";
import { border_boxes } from "../../global-helper";
export function _PlayScreen({navigation}) { 

    const [errorFlag, setErrorFlag] = useState(false)
    const [text, setText] = useState('a')

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
            }}
        >
        <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}} title='ТЕСТ ЕКРАН'/>
        <View
            style={[
                // border_boxes().green,
                {
                    width: '100%'
                }
            ]}
        >
            <Hoshi
            label={'Town'}
            // this is used as active border color
            defaultValue={text}
            borderColor={color.palette.blue_sbs}
            // active border height
            
            // borderHeight={3}
            inputPadding={16}
            // this is used to set backgroundColor of label mask.
            // please pass the backgroundColor of your TextInput container.
            // backgroundColor={'#F9F7F6'}
            onChangeText={(x) => setText(x)}
            onBlur={() => {
                text === ''? setErrorFlag(true): setErrorFlag(false);
            }}
        />
        {errorFlag? 
            <Text
                style={[{
                    color: 'red',
                    fontSize: 12
                }]}
            >{'Полето е задължително!'}</Text>

        : null}
        </View>
        

        </Screen>
    )    
}