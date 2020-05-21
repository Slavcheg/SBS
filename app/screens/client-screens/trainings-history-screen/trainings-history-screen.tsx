import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button } from '../../../components'
import { color } from "../../../theme"
import { View, Text } from "react-native"
import { Cardy } from "../../../models"
import { static_cards, border_boxes } from "../../../global-helper"
import { Avatar } from "react-native-elements"

export function TrainingsHistoryScreen_Cl({navigation}) { 

    const trainings = static_cards.map((card, k) => {
        return card.visits.map((v, i) => {
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
                            >{card.dateStart}</Text>
                        </View>
                    </View>

                </View>
            )
        })
    })
    
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
                {trainings}
            </View>
        </Screen>
    )
}