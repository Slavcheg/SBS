import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Progress_Loader, Button } from '../../../components'
import { color } from '../../../theme';
import { Text, View, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements'
import { Snack } from '../../../components'
import { globalStyles, border_boxes } from "../../../global-helper";
import {useStores } from "../../../models/root-store"
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare   } from '@fortawesome/free-solid-svg-icons'
import { faSquare   } from '@fortawesome/free-regular-svg-icons'
import moment from "moment"
import { card_types } from "../../../models/sub-stores/v2-cardy-types-store";
import { Avatar } from "react-native-elements";


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
            checkedIcon={<FontAwesomeIcon
                icon={faCheckSquare }
                size={30}    
                color={color.palette.blue_sbs}
            />}
            uncheckedIcon={<FontAwesomeIcon
                icon={faSquare }
                size={30}    
                color={color.palette.blue_sbs}
            />}
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
    const [showLoader, setShowLoader] = useState(true);  
    const [showSnack, setShowSnack] = useState(false);  
    const [seeVisitsCards, setSeeVisitsCards] = useState<boolean>(true);

    const {cardyStore2, sessionStore}  = useStores()
    const { navigation } = props
    
    useEffect(() => {
        cardyStore2.getItems()
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
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }
                ]}
            >
                <Button
                    style={[{
                        backgroundColor: color.transparent
                    }]}
                    onPress={() => setSeeVisitsCards(!seeVisitsCards)}
                >
                <Avatar
                        title={seeVisitsCards? 'V' : 'M'}             
                        rounded
                        overlayContainerStyle={
                            seeVisitsCards? 
                            {
                                backgroundColor: color.palette.green_sbs,
                                borderColor: color.palette.green_sbs,
                                borderWidth: 1
                            } :
                            {
                                backgroundColor: color.palette.blue_sbs,
                                borderColor: color.palette.blue_sbs,
                                borderWidth: 1
                            }
                        }
                        titleStyle={[{
                            color: 'white'
                        }]}
                        size='small'
                    />
                </Button>
                {/* <Text>{'Клиенти'}</Text> */}
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
                    cardyStore2.cards
                        .filter(card => card.item.trainers.includes(sessionStore.userEmail))
                        .filter(card => seeVisitsCards? 
                            card.item.card_type.type === card_types.per_visits
                            : card.item.card_type.type === card_types.monthly
                        )
                        .map( (card, index) => {
                        const item = card.item
                        const cardTrainedYesterday = trainedYesterday(item.visits)
                        const cardTrainedToday = trainedToday(item.visits)
                        return (
                            <View key={index}
                                style={[{
                                    paddingVertical: 5,
                                    width: '100%',
                                    flexDirection: 'row',
                                    // justifyContent: seeVisitsCards? 'space-around': 'flex-start',
                                    justifyContent: 'space-around',
                                    backgroundColor: index % 2 !== 1 ? 'white': color.palette.grey_sbs
                                }]}
                            >
                                <TouchableOpacity
                                    style={[
                                        // border_boxes().black,
                                        {
                                        padding: 10,
                                        alignSelf: 'center'
                                    }]}
                                    onPress={() => navigation.navigate('clientMulti', {clientEmail: item.clients[0]})}
                                >
                                    <Text
                                        style={[{
                                            color: color.palette.blue_sbs
                                        }]}
                                    >{item.clients[0].split('@', 1)}</Text>
                                </TouchableOpacity>
                                {   seeVisitsCards?
                                    checkBox(
                                        cardTrainedYesterday, 
                                        () => {
                                            if (cardTrainedYesterday) {
                                                cardyStore2.removeTrainingYesterday(card)
                                            } else {
                                                cardyStore2.addTrainingYesterday(card)
                                            }
                                            setShowSnack(true);
                                        }
                                    ): null
                                }
                                
                                {   seeVisitsCards?
                                    checkBox(
                                        cardTrainedToday, 
                                        () => {
                                            if (cardTrainedToday) {
                                                cardyStore2.removeTrainingToday(card)
                                            } else {
                                                cardyStore2.addTrainingToday(card)
                                            }
                                            setShowSnack(true);
                                        }
                                    ): null
                                }
                            </View>
                        )
                    })
                }
            </View>
        </Screen>
    )
})
