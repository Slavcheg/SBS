import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, Progress_Loader } from '../../../components'
import { color } from '../../../theme';
import { Text, View } from 'react-native';
import { Auth } from '../../../services/auth/auth.service';
import { Api } from "../../../services/api"
import { CheckBox } from 'react-native-elements'
import { Snack } from '../../../components'
import { globalStyles, return_yesterdays_date, return_todays_date, static_clients } from "../../../global-helper";
import { ICardy, Cardy } from "../../../models";
import { fbUpdateCard } from "../../../services/firebase/firebase.service";
import firestore from '@react-native-firebase/firestore';

class TDCardy {
    id: string = ''
    trainedToday: boolean = false
    trainedYesterday: boolean = false
    cardy: ICardy = new Cardy()
}

const trainedYesterday = (vis: string[]):boolean => {
    return vis.includes(return_yesterdays_date(), 0)
}

const trainedToday = (vis: string[]):boolean => {
    return vis.includes(return_todays_date(), 0)
}

const getDelimiter = () => {
    return (
        <View   
            style={{
                borderRightColor: color.palette.blue_sbs,
                borderRightWidth: 1,
                width: 1,
                height: '100%',
                marginHorizontal: 25
            }}
        ></View>
    )
}

const checkBox = (bool, onClick) => {
    let flag: boolean = bool
    return (
        <CheckBox
            checked={bool}
            containerStyle={[{
                width: '15%'
            }]}
            checkedColor={color.palette.blue_sbs}
            onPress={() => onClick(flag)}
        />
    )
}

export function TrainingTodayScreen({navigation}) { 
    const [clients_list, setClients_list] = useState([]);  
    const [showLoader, setShowLoader] = useState(true);  
    const [showSnack, setShowSnack] = useState(false);  
    
    useEffect(() => {
        // const API = new Api()
        // API.setup()
        // API.postGetConditionalItems('cards', 'trainer', '==', 'dobrev.jordan@gmail.com')
        // .then((res: any) => {
                // setClients_list(res.data.data.map((i, index) => {
                //     return {
                //         id: i.id,
                //         cardy: i.item,
                //         trainedToday: trainedToday(i.item.visits),
                //         trainedYesterday: trainedYesterday(i.item.visits)
                //     } as TDCardy           
                // }))
                // setShowLoader(false)
        // })

        const some = firestore()
            .collection('users')
            .where('role', '==', "client")
            .onSnapshot(x => {
               x.forEach(y=> {
                   console.log(y.data())
                })
              })

        setClients_list(static_clients.map((i, index) => {
            return {
                id: i.client,
                cardy: i,
                trainedToday: trainedToday(i.visits),
                trainedYesterday: trainedYesterday(i.visits)
            } as TDCardy           
        }))
        setShowLoader(false)

    }, [])

    return (
        <Screen
            preset="scroll"
            unsafe={false} 
            style={{
                flex: 1, 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                backgroundColor: color.palette.transparent,
            }}
        >
            <PageHeader_Tr navigation={navigation} style={{paddingHorizontal: 25}} title='ТРЕНИРАЩИ ДНЕС'/>
            <View style={globalStyles.snackView}>
                {showSnack ? 
                    <Snack message={'Saved !'} onDismiss={() => {setShowSnack(false)}} duration={500}/>
                : null}
            </View>
            <Progress_Loader flag={showLoader} />
            <View
                style={[
                    {
                        backgroundColor: color.palette.grey_sbs,
                        width: '100%',
                        paddingVertical: 30,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                ]}
            >
                <Text>{'Клиенти'}</Text>
                {getDelimiter()}
                <Text>{'Вчера'}</Text>
                {getDelimiter()}
                <Text>{'Днес'}</Text>
            </View>
            <View
                style={[{
                    width: '100%'
                }]}
            >
                {
                    clients_list.map( (item: TDCardy, index) => {
                        return (
                            <View key={index}
                                style={[{
                                    paddingVertical: 5,
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    backgroundColor: index % 2 !== 1 ? 'white': color.palette.grey_sbs
                                }]}
                            >
                                <Text style={[{color: color.palette.blue_sbs, width: '23%', alignSelf: 'center'}]}>{item.cardy.client}</Text>
                                {/* {console.log(item)} */}
                                {checkBox(item.trainedYesterday, () => {
                                    if (item.trainedYesterday) {
                                        const pos = item.cardy.visits.indexOf(return_yesterdays_date(), 0)
                                        pos > -1 ? item.cardy.visits.splice(pos, 1) : () => {throw new Error('Client trained yesterday, but date is not in visits')};

                                    } else {
                                        item.cardy.visits.push(return_yesterdays_date())
                                    }
                                    item.trainedYesterday = !item.trainedYesterday;
                                    fbUpdateCard(item.id, item.cardy)
                                    setShowSnack(true);
                                    setClients_list(arr => [...arr])
                                })}
                                
                                {checkBox(item.trainedToday, () => {
                                    if (item.trainedToday) {
                                        const pos = item.cardy.visits.indexOf(return_todays_date(), 0)
                                        pos > -1 ? item.cardy.visits.splice(pos, 1) : () => {throw new Error('Client trained today, but date is not in visits')};

                                    } else {
                                        item.cardy.visits.push(return_todays_date())
                                    }
                                    item.trainedToday = !item.trainedToday;
                                    fbUpdateCard(item.id, item.cardy)
                                    setShowSnack(true);
                                    setClients_list(arr => [...arr])
                                })}
                            </View>
                        )
                    })
                }
            </View>
        </Screen>
    )
}