import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button,  } from '../../../components'
import { spacing, color } from '../../../theme';
import { Text, View } from 'react-native';
import { Auth } from '../../../services/auth/auth.service';
import { Api } from "../../../services/api"
// import { Icon } from "react-native-elements";

export function TrainingsHistoryScreen({route, navigation}) {
    const [visits, setVisits] = useState([''])
    const [name, setName] = useState('- -')

    useEffect(() => {
        let vs: any[] = route.params.visits;
        vs.push([''])
        setVisits(vs)
        setName(' ' + route.params.name.toUpperCase())
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
        <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}} title={'ТРЕНИРОВКИ НА' + name}/>
        <View
            style={[
                {
                    backgroundColor: color.palette.grey_sbs,
                    width: '100%',
                    paddingVertical: 60,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            ]}
        >
        </View>
        {visits.map((item, index) => {
            return (
                <View key={index}
                    style={[{
                        // borderColor: 'black',
                        // borderWidth: 1,
                        paddingVertical: 10,
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        backgroundColor: index % 2 !== 1 ? 'white': color.palette.grey_sbs
                    }]}
                >
                    <Text style={[{color: color.palette.blue_sbs}]}>{item}</Text>
                 </View>
            )
        })}

        </Screen>
    )
}