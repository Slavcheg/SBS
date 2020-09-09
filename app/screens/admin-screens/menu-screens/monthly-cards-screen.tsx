import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Input_Hoshi, SbsCardType, ConfirmationDialog } from '../../../components'
import { color } from "../../../theme"
import { View, TouchableOpacity } from "react-native";
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { EditCardyType2Dialog } from "../../../components";
import { useStores } from "../../../models/root-store";
import { CardTypesStoreModel2, ICardy_Type_Model } from "../../../models/sub-stores/v2-cardy-types-store";

interface MonthlyCardsProps extends NavigationProps {}

export const MonthlyCardsScreen: React.FunctionComponent<MonthlyCardsProps> = observer(props => {
    const { navigation } = props
    const [seeDialog, setSeeDialog] = useState(false)
    const [seeDeleteConfirmation, setSeeDeleteConfirmation] = useState(false)
    const [editCTM, setECTM] = useState<ICardy_Type_Model>(null)
    const [searchValue, setSearchValue] = useState('')

    const { cardyTypesStore2 } = useStores()

    useEffect(() => {
        cardyTypesStore2.getItems()
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
            <PageHeader_Tr 
                navigation={navigation}
                style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 25
                }}
                title='Типове карти'
            />
            <View
                style={[
                    {
                        backgroundColor: color.palette.grey_sbs,
                        width: '100%',
                        paddingVertical: 30,
                        paddingHorizontal: '5%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }
                ]}
            >
                <Input_Hoshi    
                    width='75%'      
                    placeholder={'search'} 
                    variable={searchValue}
                    setVariable={val => setSearchValue(val)}
                    background={'white'}
                />
                <View
                    style={[{
                        flexDirection: 'row',
                        flexGrow: 1
                    }]}
                ></View>
                <TouchableOpacity
                    onPress={() => setSeeDialog(true)}
                    style={[
                        // border_boxes().green,
                        {
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }]}
                >
                    <FontAwesomeIcon 
                        icon={ faPlusCircle }
                        color={color.palette.green_sbs}
                        size={60}
                    />
                </TouchableOpacity>
            </View>
            {
                cardyTypesStore2.cards.map(cardModel => {
                    return  <SbsCardType 
                                key={cardModel.id}
                                cardyTypeModel={cardModel}
                                openEditDialog={() => {
                                    setSeeDialog(true)
                                    setECTM(cardModel)
                                }}
                                openDeleteDialog={() => {
                                    setSeeDeleteConfirmation(true)
                                    setECTM(cardModel)
                                }}
                            />
                })
            }
            {
                seeDialog ?
                    <EditCardyType2Dialog cardyTypeModel={editCTM} onDismiss={() => {
                        setSeeDialog(false)
                        setECTM(null)
                    }} />
                : null
            }
            {
                seeDeleteConfirmation ? 
                    <ConfirmationDialog 
                        message={'Delete card type?'}
                        onDismiss={(delFl) => {
                            setSeeDeleteConfirmation(false)
                            delFl ? cardyTypesStore2.deleteItem(editCTM.id) : null
                            setECTM(null)
                        }}
                    />
                : null
            }
        </Screen>
    )
})