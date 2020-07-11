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
import {useStores } from "../../../models/root-store"
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
// import { fbUpdateCard } from "../../../services/firebase/firebase.service";
// import firestore from '@react-native-firebase/firestore';
import moment from "moment"

const trainedYesterday = (vis: string[]):boolean => {
    return vis.includes(moment().subtract(1, 'days').format('MMM DD[,] YY').toString())
}

const trainedToday = (vis: string[]):boolean => {
    return vis.includes(moment().format('MMM DD[,] YY').toString())
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

interface TrainingTodayScreenProps extends NavigationProps {}

export const TrainingTodayScreen: React.FunctionComponent<TrainingTodayScreenProps> = observer(props => {
    // const [clients_list, setClients_list] = useState([]);  
    const [showLoader, setShowLoader] = useState(true);  
    const [showSnack, setShowSnack] = useState(false);  

    const cardStore = useStores().cardStore
    const { navigation } = props
    
    useEffect(() => {
        cardStore.getCards()
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
                    cardStore.cards.map( (card, index) => {
                        console.log(card.item.visits)
                        const item = card.item
                        const cardTrainedYesterday = trainedYesterday(item.visits)
                        const cardTrainedToday = trainedToday(item.visits)
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
                                <Text style={[{color: color.palette.blue_sbs, width: '23%', alignSelf: 'center'}]}>{item.client.split('@', 1)}</Text>
                                {   checkBox(
                                        cardTrainedYesterday, 
                                        () => {
                                            if (cardTrainedYesterday) {
                                                cardStore.removeTrainingYesterday(card)
                                            } else {
                                                cardStore.addTrainingYesterday(card)
                                            }
                                            setShowSnack(true);
                                        }
                                    )
                                }
                                
                                {   checkBox(
                                        cardTrainedToday, 
                                        () => {
                                            if (cardTrainedToday) {
                                                cardStore.removeTrainingToday(card)
                                            } else {
                                                cardStore.addTrainingToday(card)
                                            }
                                            setShowSnack(true);
                                        }
                                    )
                                }
                            </View>
                        )
                    })
                }
            </View>
        </Screen>
    )
})
