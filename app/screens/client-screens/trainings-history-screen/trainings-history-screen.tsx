import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button } from '../../../components'
import { color } from "../../../theme"
import { View, Text } from "react-native"
import { Cardy } from "../../../models"
import { border_boxes, displayDateFromTimestamp } from "../../../global-helper"
import { Avatar } from "react-native-elements"
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import {useStores } from "../../../models/root-store"

const Trainings: React.FunctionComponent<{}> = observer(props => {
    const { cardyStore2, sessionStore } = useStores()
    useEffect(() => {
        cardyStore2.getItems()
    }, [])
    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                cardyStore2.cards
                    .filter(card => card.item.clients.toString().includes(sessionStore.userEmail))
                    .map((card, k) => {
                        const item = card.item
                        return item.visits.map((v, i) => {
                            return (
                                <View
                                    key={i + k + v + '1'}
                                    style={[
                                        // border_boxes().red,
                                        {
                                            borderRadius: 15,
                                            shadowOffset: {width: 0, height: 2},
                                            shadowColor: '#0000001A',
                                            shadowOpacity: 0.5,
                                            backgroundColor: 'white',
                                            marginVertical: 10,
                                            padding: 10,
                                            flexDirection: 'row'
                                        }
                                    ]}
                                >
                                    <Avatar                
                                        rounded
                                        containerStyle={[{
                                            borderColor: color.palette.green_sbs,
                                            borderWidth: 1
                                        }]}
                                        size='medium'
                                        source={{
                                            uri:
                                            'https://images.assetsdelivery.com/compings_v2/4zevar/4zevar1604/4zevar160400009.jpg',
                                        }}
                                    />
                                    <View
                                        style={[{
                                            flexDirection: 'column',
                                            marginLeft: 20
                                        }]}
                                    >
                                        <View
                                            style={[{
                                                flexDirection: 'row'
                                            }]}
                                        >
                                            <Text
                                                style={[{
                                                    fontSize: 10
                                                }]}
                                            >{'* Карта ХХХ / от '}</Text>
                                            <Text 
                                                style={[{
                                                    color: color.palette.green_sbs,
                                                    fontSize: 10
                                                }]}
                                            >{v}</Text>
                                        </View>
                                    </View>

                                </View>
                            )
                        })
                    })
            }
        </View>
    )
})


interface TrainingsHistoryScreen_ClProps extends NavigationProps {}

export const TrainingsHistoryScreen_Cl: React.FunctionComponent<TrainingsHistoryScreen_ClProps> = observer(props => {
    const { navigation } = props
    const { cardStore, sessionStore } = useStores()

    useEffect(() => {
        cardStore.getCards()
    }, [])


    
    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flexGrow: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.transparent,
            }}
        >
            <PageHeader_Cl 
                navigation={navigation} 
                style={{paddingHorizontal: 25, backgroundColor: 'white'}}
                title={'ИСТОРИЯ НА ТРЕНИРОВКИТЕ'} 
            />
            <View
                style={[
                    // border_boxes().orange,
                    {
                    flexGrow: 1,
                    width: '100%',
                    padding: 45,
                    backgroundColor: color.palette.grey_sbs,
                }]}
            >
                <Trainings />
            </View>
        </Screen>
    )
})
