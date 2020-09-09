import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button } from '../../components'
import { color } from "../../theme"
import { View, Text } from "react-native"
import { border_boxes, displayDateFromTimestamp } from "../../global-helper"
import { Badge, Avatar } from "react-native-elements"
import { Cardy } from "../../models"

const {blue_sbs, green_sbs, grey_sbs, dark_grey_sbs} = color.palette

function infoRowItem(title, data) {

    const greenFlag = title === 'Оставащи' && +data > 0
    return (
        <View
        style={[
            // border_boxes().black,
            {
        }]}
    >
        <View
            style={[
                // border_boxes().red,
                {
                    alignItems: 'center',
                    marginBottom: 10
                }
            ]}
        >
            <Text 
                style={[
                    greenFlag
                    ? {color: green_sbs}: {color: '#666666'},
                    {
                        fontSize: 10,                        
                    }
                ]}
            >{title}</Text>
        </View>
        <View
            style={[
                // border_boxes().red,
                {
                    alignItems: 'center',
                }
            ]}
        >
            <Text 
                style={[                    
                    greenFlag
                    ? {color: green_sbs}: {color: '#666666'},
                    {
                    fontSize: 18
                }]}
            >{data}</Text>
        </View>
    </View>
    )
}

function infoRowBorder() {
    return (
        <View
            style={[{
                height: 50,
                borderColor: '#666666',
                borderRightWidth: 1
            }]}
        ></View>
    )
}

export const SbsCard: React.FunctionComponent<{card: Cardy, index: number}> = props => {
const {card, index} = props
    return (
        <View
        key={index}
        style={[
            // border_boxes().red,
            {
                width: '100%',
                // height: 150,
                marginVertical: 20,
                borderRadius: 25,
                backgroundColor: 'white'

        }]}
    >
        {/* Badges */}
        <View
            style={[{
                marginTop: 10,
                marginRight: 10,
                alignSelf: 'flex-end'
            }]}
        >
            {
                card.active ? 
                <View
                    style={[
                        // border_boxes().green,
                        {
                            borderRadius: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            backgroundColor: green_sbs
                        }
                    ]}
                >
                    <Text
                        style={[{
                            fontSize: 10,
                            fontWeight: '700',
                            color: 'white'
                        }]}
                    >{'Активна карта'}</Text>
                </View>
                :
                <View
                style={[
                    // border_boxes().green,
                    {
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: dark_grey_sbs
                    }
                ]}
            >
                <Text
                    style={[{
                        fontSize: 10,
                        fontWeight: '700',
                        color: 'white'
                    }]}
                >{'Неактивна карта'}</Text>
            </View>
            
            }
        </View>
        {/* Avatar row */}
        <View
            style={[
                // border_boxes().orange,
                {
                flexDirection: 'row',
                marginHorizontal: 10,
                alignItems: 'center'
            }]}
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
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRIm1-e42u-cWzDcG4E-X-MiLTqYgDW-eJcdLY6CzPc-1yaniSt&usqp=CAU',
                }}
            />
            <View
                style={[
                    // border_boxes().black,
                    {
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
                            color: color.palette.green_sbs
                        }]}
                    >{'Плащане към '}</Text>
                    <Text>{card.trainer.split('@', 1)}</Text>                    
                </View>
                <Text
                    style={[{
                        // color: color.palette.grey_sbs
                    }]}
                >{displayDateFromTimestamp(card.datestampStart)}</Text>
            </View>

        </View>
       {/* Info row */}
        <View
            style={[
                    // border_boxes().green,
                {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 30
            }]}
        >
            {infoRowItem('Карта','ХХХ')}
            {infoRowBorder()}
            {infoRowItem('Сума',card.price)}
            {infoRowBorder()}
            {infoRowItem('Посещения', card.visits.length)}
            {infoRowBorder()}
            {infoRowItem('Оставащи', +card.card_limit-card.visits.length)}
        </View>
    </View>
    )
}