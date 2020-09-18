import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Cl, Button } from '../../../components'
import { color, styles } from "../../../theme"
import { Image, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { imgs } from '../../../assets';
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import {useStores } from "../../../models/root-store"
import { DataTable, TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { SwipeRow } from 'react-native-swipe-list-view';
import { DatePicker } from "../../../components-custom/date-picker/date-picker";
import { return_todays_datestamp, displayDateFromTimestamp, border_boxes } from "../../../global-helper";

export const LoadDiary: React.FunctionComponent<{}> = observer(props => {
    const { userStore2, sessionStore } = useStores()

    useEffect(() => {
        userStore2.getItems()
    }, [])

    return(
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
                        user.item.email === sessionStore.userEmail
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
                                                sessionStore.userEmail,
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

interface DiaryScreenProps extends NavigationProps {}
export const DiaryScreen: React.FunctionComponent<DiaryScreenProps> = observer(props => {
    const { navigation } = props
    const { userStore2, sessionStore } = useStores()
    const [seeDatePicker, setSeeDatePicker] = useState(false)
    const [date, setDate] = useState(return_todays_datestamp())
    const [weight, setWeight] = useState('')
    const [calories, setCalories] = useState('')
    const [protein, setProtein] = useState('')
    useEffect(() => {
        console.log('does this udpates?')
        userStore2.getItems()
    }, [])
    return(
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flexGrow: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.transparent
            }}
        >
            <PageHeader_Cl 
                navigation={navigation} 
                style={{paddingHorizontal: 25, backgroundColor: 'white'}}
                title={'Дневник'} 
            />
            <Image 
                source={imgs.dairy} 
                style={[{ height: 60, width: 200}]}
                
                // containerStyle={boxes.x}
            />
            <LoadDiary />
            <View
                style={[{
                    flexDirection: 'row',
                    width: '100%'
                }]}
            >
                <TextInput
                    style={[{
                        width: '25%',
                    }]}
                    accessibilityValue={''}
                    focusable={true}
                    showSoftInputOnFocus={true}
                    label="Дата"
                    value={displayDateFromTimestamp(date)}
                    onFocus={()=> setSeeDatePicker(true)}
                    // onChangeText={text => setDate(text)}
                />
                <TextInput
                    style={[{
                        width: '25%'
                    }]}
                    accessibilityValue={''}
                    focusable={true}
                    showSoftInputOnFocus={true}
                    label="Тегло"
                    value={weight}
                    onChangeText={text => setWeight(text)}
                />
                <TextInput
                    style={[{
                        width: '25%'
                    }]}
                    accessibilityValue={''}
                    focusable={true}
                    showSoftInputOnFocus={true}
                    label="Калории"
                    value={calories}
                    onChangeText={text => setCalories(text)}
                />
                <TextInput
                    style={[{
                        width: '25%'
                    }]}
                    accessibilityValue={''}
                    focusable={true}
                    showSoftInputOnFocus={true}
                    label="Протеин"
                    value={protein}
                    onChangeText={text => setProtein(text)}
                />

            </View>
            {seeDatePicker? 
            <View
                style={[{
                    width: '100%'
                }]}
            >
                <DatePicker 
                    showPicker={() => setSeeDatePicker(false)}
                    inputDateStamp={date}
                    onDateChange={(_dateStamp: number) => {
                        setDate(_dateStamp)
                    }}
                /></View>
            : null}    
            <TouchableOpacity
                onPress={() => {
                    userStore2.addToDiary(sessionStore.userEmail,
                        {
                            id: Math.random(),
                            date: date,
                            weight: +weight,
                            calories: +calories,
                            protein: +protein
                        }
                    )
                    setDate(return_todays_datestamp())
                    setWeight('')
                    setCalories('')
                    setProtein('')
                }}
                style={[
                    // border_boxes().green,
                    {
                    width: '20%',
                    margin: 20,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    alignSelf: 'flex-end'
                }]}
            >
                <FontAwesomeIcon 
                    icon={ faPlusCircle }
                    color={color.palette.green_sbs}
                    size={60}
                />
            </TouchableOpacity>
        </Screen>
    )
})
