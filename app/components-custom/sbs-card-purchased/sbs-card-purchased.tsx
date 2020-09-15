import React, { useEffect, useState } from "react"
import { Input_Hoshi, ActiveInactiveCardAvatar } from '../../components'
import { color } from "../../theme"
import { View, Text } from "react-native"
import { observer } from "mobx-react-lite";
import { ICardy2_Model } from "../../models/sub-stores/v2-cardy-store"
import { translate } from "../../i18n";
import { card_types } from "../../models/sub-stores/v2-cardy-types-store";
import { displayDateFromTimestamp, return_todays_datestamp } from "../../global-helper";
import moment from "moment";

interface SbsCardPurchasedProps {
    cardyModel: ICardy2_Model
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
                    placeholder={translate('edit/sbsCardPurchased.type_name')} 
                    variable={cardyModel.item.card_type.title} 
                    editable={false}
                    setVariable={()=>{}} 
                    width='30%'                            
                />
                <View
                    style={[{
                        width: '50%',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }]}
                >
                <Input_Hoshi 
                    placeholder={translate('edit/sbsCardPurchased.type')} 
                    variable={
                        cardyModel.item.card_type.type === card_types.monthly ? 
                            translate('edit/sbsCardPurchased.card_type_months')
                            : translate('edit/sbsCardPurchased.card_type_visits')
                    } 
                    editable={false}
                    setVariable={()=>{}} 
                    width='49%'                            
                />
                <Input_Hoshi 
                    placeholder={
                        cardyModel.item.card_type.type === card_types.monthly ?
                            translate('edit/sbsCardPurchased.limit_months')
                            : translate('edit/sbsCardPurchased.limit_visits')
                    } 
                    variable={cardyModel.item.card_type.card_limit.toString()} 
                    editable={false}
                    setVariable={()=>{}} 
                    width='50%'                            
                />
                </View>     
                <View
                    style={[{
                        width: '10%'
                    }]}
                >
                    <ActiveInactiveCardAvatar cardId={cardyModel.id}/>    
                </View>           
            </View>
            <View
                style={[{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10
                }]}
            >
                <View
                    style={[{
                        width: '50%',
                    }]}
                >
                    <Text>{translate('edit/sbsCardPurchased.clients')}</Text>
                    {
                        cardyModel.item.clients.map((cl, key) => {
                            return (
                                <Text 
                                    key={key}
                                    style={[{
                                        marginVertical: 5
                                    }]}
                                >{cl.split('@', 1)}</Text>
                            )
                        })
                    }
                </View>
                <View
                    style={[{
                        width: '50%',
                    }]}
                >
                    <Text>{translate('edit/sbsCardPurchased.trainers')}</Text>
                    {
                        cardyModel.item.trainers.map((cl, key) => {
                            return (
                                <Text 
                                    key={key}
                                    style={[{
                                        marginVertical: 5
                                    }]}
                                >{cl.split('@', 1)}</Text>
                            )
                        })
                    }
                </View>
            </View>
            <View
                style={[{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }]}
            >
                    <Input_Hoshi
                        placeholder={translate('edit/sbsCardPurchased.dateOfPayment')}
                        variable={displayDateFromTimestamp(cardyModel.item.datestampPayment)}
                        setVariable={()=>{}} 
                        editable={false}                        
                        width='34%'   
                    />
                    <Input_Hoshi
                        placeholder={translate('edit/sbsCardPurchased.dateOfStart')}
                        variable={displayDateFromTimestamp(cardyModel.item.datestampStart)}
                        setVariable={()=>{}} 
                        editable={false}                        
                        width='34%'   
                    />
                    <Input_Hoshi
                        placeholder={translate('edit/sbsCardPurchased.realPrice')}
                        variable={cardyModel.item.realPrice.toString()}
                        setVariable={()=>{}} 
                        editable={false}                        
                        width='30%'   
                    />
            </View>
        </View>
    )
})