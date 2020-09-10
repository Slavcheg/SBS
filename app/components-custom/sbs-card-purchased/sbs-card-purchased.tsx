import React, { useEffect, useState } from "react"
import {Screen, MainHeader_Cl, ButtonSquare, PageHeader_Cl, Button, Input_Hoshi } from '../../components'
import { color } from "../../theme"
import { View, Text } from "react-native"
import { border_boxes, displayDateFromTimestamp } from "../../global-helper"
import { Badge, Avatar } from "react-native-elements"
import { Cardy } from "../../models"
import { ICardy_Type } from "../../models/sub-stores/v2-cardy-types-store"
import { observer } from "mobx-react-lite";
import { ICardy2_Model } from "../../models/sub-stores/v2-cardy-store"

interface SbsCardPurchasedProps {
    cardyModel: ICardy2_Model,
    // openEditDialog: Function,
    // openDeleteDialog: Function
}

export const SbsCardPurchased: React.FunctionComponent<SbsCardPurchasedProps> = observer(props => {
    const { cardyModel } = props
    return (
        <View            
            key={cardyModel.id}
            style={[
                // border_boxes().red,
                {
                    width: '90%',
                    marginVertical: 20,
                    marginHorizontal: 200,
                    borderRadius: 25,
                    padding: 20,
                    backgroundColor: 'white',
                    borderColor: color.palette.blue_sbs,
                    borderWidth: 1
            }]}
        >
            <View
                style={[{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }]}
            >
                <Input_Hoshi 
                    placeholder={'Име тип'} 
                    variable={cardyModel.item.card_type.title} 
                    editable={false}
                    setVariable={()=>{}} 
                    width='30%'                            
                />
                <View
                    style={[{
                        width: '50%',
                        flexDirection: 'row',
                        // justifyContent: 'space-between'
                    }]}
                >
                <Input_Hoshi 
                    placeholder={'Тип'} 
                    variable={cardyModel.item.card_type.type} 
                    editable={false}
                    setVariable={()=>{}} 
                    width='50%'                            
                />
                <Input_Hoshi 
                    placeholder={'Лимит м/п'} 
                    variable={cardyModel.item.card_type.card_limit.toString()} 
                    editable={false}
                    setVariable={()=>{}} 
                    width='50%'                            
                />
                </View>
            </View>
            <View
                style={[{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }]}
            >
                <View
                    style={[{
                        width: '50%',
                    }]}
                >
                    <Text>{'Клиенти'}</Text>
                    {
                        cardyModel.item.clients.map((cl, key) => {
                            return (
                                <Text key={key}>{cl}</Text>
                            )
                        })
                    }
                </View>
                <View
                    style={[{
                        width: '50%',
                    }]}
                >
                    <Text>{'Треньори'}</Text>
                    {
                        cardyModel.item.trainers.map((cl, key) => {
                            return (
                                <Text key={key}>{cl}</Text>
                            )
                        })
                    }
                </View>
            </View>

        </View>
    )
})