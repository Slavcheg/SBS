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
import { translate } from "../../../i18n";
import { values } from "mobx";

interface CardTypesListProps extends NavigationProps {}

export const CardTypesListScreen: React.FunctionComponent<CardTypesListProps> = observer(props => {
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
                title={translate('cardTypesList.header_label')}
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
                    placeholder={translate('generic.search_label')} 
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
                    onPress={() => {
                        setECTM(null)
                        setSeeDialog(true)
                    }}
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
            <EditCardyType2Dialog
                cardyTypeModel={editCTM}
                seeDailog={seeDialog}
                onDismiss={() => {
                    setSeeDialog(false)
                    setECTM(null)
                }}
            />

            <ConfirmationDialog 
                message={'Delete card type?'}
                seeDailog={seeDeleteConfirmation}
                onDismiss={(delFl) => {
                    setSeeDeleteConfirmation(false)
                    delFl ? cardyTypesStore2.deleteItem(editCTM.id) : null
                    setECTM(null)
                }}
            />
        </Screen>
    )
})