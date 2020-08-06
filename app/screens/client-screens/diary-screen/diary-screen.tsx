import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Cl, Button } from '../../../components'
import { color } from "../../../theme"
import { Image, View, TouchableOpacity } from 'react-native';
import { imgs } from '../../../assets';
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import {useStores } from "../../../models/root-store"
import { DataTable, TextInput } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

export const LoadDiary: React.FunctionComponent<{}> = observer(props => {
    const { userStore, sessionStore } = useStores()

    useEffect(() => {
        userStore.ggetItems()
    }, [])

    return(
        <DataTable>
            <DataTable.Header accessibilityValue={''} focusable={''}>
                <DataTable.Title accessibilityValue={''}>Дата</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Тегло (кг)</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Калории</DataTable.Title>
                <DataTable.Title accessibilityValue={''} >Протейн</DataTable.Title>
            </DataTable.Header>

            {
                userStore.users
                    .find(user => 
                        user.item.email === sessionStore.userEmail
                    )
                    .item.diary
                        .map((diaryItem, index) => {
                            let item = userStore.decodeDiaryItem(diaryItem)
                            return (
                                <DataTable.Row 
                                    accessibilityValue={''}
                                    key={index}
                                >
                                    <DataTable.Cell accessibilityValue={''}>
                                        {item.date}
                                    </DataTable.Cell>
                                    <DataTable.Cell accessibilityValue={''}>
                                        {item.weight}
                                    </DataTable.Cell>
                                    <DataTable.Cell accessibilityValue={''}>
                                        {item.calories}
                                    </DataTable.Cell>
                                    <DataTable.Cell accessibilityValue={''}>
                                        {item.protein}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )
                        })
            }
        </DataTable>
    )
})

interface DiaryScreenProps extends NavigationProps {}
export const DiaryScreen: React.FunctionComponent<DiaryScreenProps> = observer(props => {
    const { navigation } = props
    const { userStore, sessionStore } = useStores()
    const [date, setDate] = useState('')
    const [weight, setWeight] = useState('')
    const [calories, setCalories] = useState('')
    const [protein, setProtein] = useState('')
    useEffect(() => {
        userStore.ggetItems()
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
                backgroundColor: color.palette.transparent,
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
                    focusable={''}
                    showSoftInputOnFocus={true}
                    label="Дата"
                    value={date}
                    onChangeText={text => setDate(text)}
                />
                <TextInput
                    style={[{
                        width: '25%'
                    }]}
                    accessibilityValue={''}
                    focusable={''}
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
                    focusable={''}
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
                    focusable={''}
                    showSoftInputOnFocus={true}
                    label="Протеин"
                    value={protein}
                    onChangeText={text => setProtein(text)}
                />

            </View>
            <TouchableOpacity
                onPress={() => {
                    userStore.updateDiary(sessionStore.userEmail,
                        date,
                        +weight,
                        +calories,
                        +protein
                    )
                    setDate('')
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