import React, { useEffect } from "react"
import {Screen, PageHeader_Tr, Button,  } from '../../../components'
import { color } from '../../../theme';
import { Text, View } from 'react-native';
import { Icon } from "react-native-elements";
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";

export const GetCards: React.FunctionComponent<{}> = observer(props => {
    const cardStore = useStores().cardStore
    
    useEffect(() => {
        cardStore.getCards()
    }, [])
    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
               cardStore.cards.map( (card, index) => {
                   const item = card.item
                    return (
                        <View 
                            key={index}
                            style={[{
                                paddingVertical: 5,
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: index % 2 !== 1 ? 'white': color.palette.grey_sbs
                            }]}
                        >
                            {/* <Text style={[{color: color.palette.blue_sbs, width: '23%', alignSelf: 'center'}]}>{item.name}</Text> */}
                            <Text style={[{color: '#666666', width: '20%', alignSelf: 'center'}]}>{item.card_limit}</Text>
                            {/* <Text style={[{color: color.palette.blue_sbs, width: '15%', alignSelf: 'center'}]}>{item.card_limit - item.visits.length}</Text> */}
                            <Button 
                            onPress={() => {
                                // navigation.navigate('trainings_history', {name: item.name, visits: item.visits})
                            }}
                                style={[{
                                    backgroundColor: index % 2 == 1 ? 'white': color.palette.grey_sbs,
                                    // width: '20%'
                                }]}
                            >
                               <Icon name='chevron-right' size={15}/>
                            </Button>
                        </View>
                    )
                })
            }
        </View>
    )
})

export function ClientsListScreen({navigation} ) {
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
            <GetCards />
        </Screen>
    )
}
