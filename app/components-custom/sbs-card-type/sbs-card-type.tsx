import React, { useEffect, useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { ICardy_Type, card_types, ICardy_Type_Model } from "../../models/sub-stores/v2-cardy-types-store"
import { border_boxes } from "../../global-helper"
import { Text } from "../../components/text/text"
import { Input_Hoshi } from "../input-hoshi/input-hoshi"
import { color } from "../../theme"
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faPen, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { EditCardyType2Dialog } from "../../components"

interface SbsCardTypeProps {
    cardyTypeModel: ICardy_Type_Model,
    openEditDialog: Function,
    openDeleteDialog: Function
}

export const SbsCardType: React.FunctionComponent<SbsCardTypeProps> = observer(props => {
    // let cardType: ICardy_Type = {
    //     title: '2m 200lv',
    //     type: card_types.monthly,
    //     card_limit: 2,
    //     price: 100,
    //     rate: 50

    // }
    // let id: number

    const { cardyTypeModel, openEditDialog, openDeleteDialog } = props
    return (
        <View
            key={cardyTypeModel.id}
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
                style={[
                    // border_boxes().black,
                    {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexGrow: 1
                }]}
            >
                <Input_Hoshi 
                    placeholder={'title'} 
                    variable={cardyTypeModel.item.title} 
                    setVariable={x => x} 
                    width='30%'                            
                />
            
            <View
                style={[{
                    flexDirection: 'row',
                    // width: '100%',
                    justifyContent: 'flex-end'
                }]}
            >
                <TouchableOpacity
                    onPress={() => openEditDialog()}
                    style={[
                        // border_boxes().green,
                        {
                        // width: '20%',
                        padding: 10,
                        marginBottom: 20,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        // borderRadius: 50
                    }]}
                >
                    <FontAwesomeIcon 
                        icon={ faPen }
                        color={color.palette.green_sbs}
                        size={30}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => openDeleteDialog()}
                    style={[
                        // border_boxes().green,
                        {
                        // width: '20%',
                        padding: 10,
                        marginBottom: 20,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        // borderRadius: 50
                    }]}
                >
                    <FontAwesomeIcon 
                        icon={ faTimesCircle }
                        color={'red'}
                        size={40}
                    />
                </TouchableOpacity>

            </View>
            </View>
            <View
                style={[{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between'
                }]}
            >
                 
                <Input_Hoshi 
                    placeholder={'type'} 
                    variable={cardyTypeModel.item.type} 
                    setVariable={x => x} 
                    width='30%'                            
                />
                <Input_Hoshi 
                    placeholder={
                        cardyTypeModel.item.type === card_types.monthly?
                            'months'
                        : 'visits'
                    } 
                    variable={cardyTypeModel.item.card_limit.toString()} 
                    setVariable={x => x} 
                    width='30%'                            
                />   
                <Input_Hoshi 
                    placeholder={'rate'} 
                    variable={cardyTypeModel.item.rate.toString()} 
                    setVariable={x => x} 
                    width='30%'                            
                />            
            </View>
            <View
                style={[{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-around'
                }]}
            >
                
                <Input_Hoshi 
                    placeholder={'price'} 
                    variable={cardyTypeModel.item.price.toString()} 
                    setVariable={x => x} 
                    width='30%'                            
                />
            </View>
        </View>
    )
})