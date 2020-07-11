import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button,  } from '../../../components'
import { spacing, color } from '../../../theme';
import { Text, View } from 'react-native';
import { Auth } from '../../../services/auth/auth.service';
import { Api } from "../../../services/api"
// import { Icon } from "react-native-elements";
import { observer } from "mobx-react-lite";
import { CommonNavigationProps } from "../../../models/commomn-navigation-props";

interface TrainingsHistoryScreenProps extends CommonNavigationProps {}

export const  TrainingsHistoryScreen: React.FunctionComponent<TrainingsHistoryScreenProps> = observer(props => {
    const [visits, setVisits] = useState([''])
    const [name, setName] = useState('- -')
    const { navigation, route } = props
    useEffect(() => {
        setVisits(route.params["visits"] as any[] || [""])
        setName(' ' + route.params["name"].toUpperCase())
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
        <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}} title={'ТРЕНИРОВКИ НА' + name.split('@', 1)}/>
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
})
