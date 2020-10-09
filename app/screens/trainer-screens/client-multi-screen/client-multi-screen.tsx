import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Progress_Loader, Button, SbsCardPurchased } from '../../../components'
import { color, styles } from '../../../theme';
import { Text, View, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements'
import { Snack } from '../../../components'
import { globalStyles, border_boxes, displayDateFromTimestamp } from "../../../global-helper";
import {useStores } from "../../../models/root-store"
import { CommonNavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare   } from '@fortawesome/free-solid-svg-icons'
import { faSquare   } from '@fortawesome/free-regular-svg-icons'
import moment from "moment"
import { card_types } from "../../../models/sub-stores/v2-cardy-types-store";
import { Avatar } from "react-native-elements";
import { IUser2_Model } from "../../../models/sub-stores/v2-user-store";
import { DataTable, TextInput } from 'react-native-paper';
import { SwipeRow } from 'react-native-swipe-list-view';


interface DiaryDisplayProps {
    clEmail: string
}
export const DiaryDisplay: React.FunctionComponent<DiaryDisplayProps> = observer(props => {
    const { clEmail } = props
    const { userStore2 }  = useStores()

    useEffect(() => {
        userStore2.getItems()
    }, [])
    
    return (
        <DataTable>
        <DataTable.Header accessibilityValue={''} focusable={true}>
            <DataTable.Title accessibilityValue={''}>Дата</DataTable.Title>
            <DataTable.Title accessibilityValue={''} >Тегло (кг)</DataTable.Title>
            <DataTable.Title accessibilityValue={''} >Калории</DataTable.Title>
            <DataTable.Title accessibilityValue={''} >Протейн</DataTable.Title>
        </DataTable.Header>

        {
            userStore2.users
                .find(user => 
                    user.item.email === clEmail
                )
                .item.diary
                    .map((diaryItem, index) => {
                        return (
                            <SwipeRow 
                                key={index}
                                leftOpenValue={75} rightOpenValue={-75}
                            >
                                 <View style={styles.standaloneRowBack}>
                                    <TouchableOpacity
                                        style={[styles.standaloneRowBack, styles.backRightBtn, styles.backRightBtnRight]}
                                        onPress={() => userStore2.deleteFromDiary(
                                            clEmail,
                                            diaryItem
                                        )}
                                    >
                                        <Text style={styles.backTextWhite}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                                <DataTable.Row 
                                    accessibilityValue={''}
                                    style={styles.standaloneRowFront}
                                    key={index}
                                >
                                    <DataTable.Cell accessibilityValue={''}>
                                        {displayDateFromTimestamp(diaryItem.date)}
                                    </DataTable.Cell>
                                    <DataTable.Cell accessibilityValue={''}>
                                        {diaryItem.weight}
                                    </DataTable.Cell>
                                    <DataTable.Cell accessibilityValue={''}>
                                        {diaryItem.calories}
                                    </DataTable.Cell>
                                    <DataTable.Cell accessibilityValue={''}>
                                        {diaryItem.protein}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </SwipeRow>                                
                        )
                    })
        }
    </DataTable>
    )
})
interface CardsDisplayProps {
    clEmail: string
}
export const CardsDisplay: React.FunctionComponent<CardsDisplayProps> = observer(props => {
    const { clEmail } = props
    const { cardyStore2 }  = useStores()
    useEffect(() => {
        cardyStore2.getItems()
    }, [])
    return (
    <View
        style={[{
            width: '100%',
            alignItems: 'center'
        }]}
    >
        {
            cardyStore2.cards
            .filter(card => card.item.clients.toString().includes(clEmail))
            .map((card, index) => {
                return (
                    <SbsCardPurchased 
                        key={index}
                        cardyModel ={card}
                    />
                )
            })
        }
    </View>
    )
})

interface ClientMultiScreenProps extends CommonNavigationProps {}
export const ClientMultiScreen: React.FunctionComponent<ClientMultiScreenProps> = observer(props => {
    const { navigation, route } = props
    const [clientEmail] = useState(route.params['clientEmail'])
    const { userStore2, cardyStore2 }  = useStores()
    const [user] = useState<IUser2_Model>(userStore2.users.find(usr => usr.item.email === clientEmail))
    const [seeDiary, setSeeDiary] = useState<boolean>(true)

    useEffect(() => {
        userStore2.getItems()
        cardyStore2.getItems()
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
            <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}} title={user.item.email.split('@', 1) + ' - ' + user.item.client.generic_number}/>
        
            <View
                style={[{
                    width: '100%',
                    flexDirection: 'row',
                    paddingBottom: 30,
                    paddingTop: 30
                }]}
            >
                <Button
                    style={[{
                        width: '50%',
                        borderRadius: 0,
                        backgroundColor: color.transparent,
                        borderRightColor: color.palette.blue_sbs,
                        borderRightWidth: 2
                    }]}
                    onPress={() => setSeeDiary(true)}
                ><Text>{'Дневник'}</Text></Button>
                <Button
                    style={[{
                        width: '50%',
                        borderRadius: 0,
                        backgroundColor: color.transparent,
                    }]}
                    onPress={() => setSeeDiary(false)}
                ><Text>{'Карти'}</Text></Button>
            </View>
            {
                seeDiary? 
                    <DiaryDisplay clEmail={user.item.email} />
                : <CardsDisplay clEmail={user.item.email} />
            }
        </Screen>
    )
})