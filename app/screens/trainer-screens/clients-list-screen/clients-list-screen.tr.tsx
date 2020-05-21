import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button,  } from '../../../components'
import { spacing, color } from '../../../theme';
import { Text, View } from 'react-native';
import { Auth } from '../../../services/auth/auth.service';
import { Api } from "../../../services/api"
// import { Icon } from "react-native-elements";
import { static_clients } from "../../../global-helper";

export function ClientsListScreen({navigation}) {
    const [clients_list, set_clients_list] = useState([]);  

    const getDelimiter = () => {
        return (
            <View   
                style={{
                    borderRightColor: color.palette.blue_sbs,
                    borderRightWidth: 1,
                    width: 1,
                    height: '100%',
                    marginHorizontal: 25
                }}
            ></View>
        )
    }

    useEffect(() => {
        // const API = new Api()
        // API.setup()
        // API.postGetConditionalItems('cards', 'trainer', '==', Auth.getUserEmail())
        // .then((res: any) => {
            set_clients_list(static_clients.map((i, index) => {
                return {
                    name: i.client,
                    card_limit: i.card_limit,
                    visits: i.visits
                }
            }))
        // })
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
        <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}} title='КЛИЕНТИ'/>
        <View
            style={[
                {
                    backgroundColor: color.palette.grey_sbs,
                    width: '100%',
                    paddingVertical: 30,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            ]}
        >
            <Text>{'Клиенти'}</Text>
            {getDelimiter()}
            <Text>{'Трен'}</Text>
            {getDelimiter()}
            <Text>{'Ост'}</Text>
            {getDelimiter()}
            <Text>{'Ист'}</Text>
        </View>
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                clients_list.map( (item, index) => {
                    return (
                        <View key={index}
                            style={[{
                                paddingVertical: 5,
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: index % 2 !== 1 ? 'white': color.palette.grey_sbs
                            }]}
                        >
                            <Text style={[{color: color.palette.blue_sbs, width: '23%', alignSelf: 'center'}]}>{item.name}</Text>
                            <Text style={[{color: '#666666', width: '20%', alignSelf: 'center'}]}>{item.card_limit}</Text>
                            <Text style={[{color: color.palette.blue_sbs, width: '15%', alignSelf: 'center'}]}>{item.card_limit - item.visits.length}</Text>
                            <Button 
                            onPress={() => {
                                navigation.navigate('trainings_history', {name: item.name, visits: item.visits})
                            }}
                                style={[{
                                    backgroundColor: index % 2 == 1 ? 'white': color.palette.grey_sbs,
                                    // width: '20%'
                                }]}
                            >
                               {/* <Icon name='chevron-right' size={15}/> */}
                            </Button>
                        </View>
                    )
                })
            }
        </View>
        </Screen>
    )
}