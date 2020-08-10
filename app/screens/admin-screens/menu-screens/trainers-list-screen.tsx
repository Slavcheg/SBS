import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, AddTrainerDialog, Input_Hoshi, SeeTrainerDialog } from '../../../components'
import { color, spacing, styles } from "../../../theme"
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from 'react-native-elements';
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { SwipeRow } from "react-native-swipe-list-view";

export const GetTrainers: React.FunctionComponent<{search: string,  setEm: any, setSeeDialog: any}> = observer(props => {
    const userStore = useStores().userStore
    useEffect(() => {
        userStore.ggetItems()
    }, [])

    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                userStore.trainers
                    .filter(trainer => props.search !== ''? trainer.item.email.toLocaleLowerCase().includes(props.search): true)
                    .map((user, key) => {
                        const item = user.item
                        return (
                            <SwipeRow 
                                key={key}
                                // leftOpenValue={75} 
                                rightOpenValue={-75}
                            >
                                <View 
                                    style={[
                                        {
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }]}>
                                    <TouchableOpacity
                                        style={[ 
                                            {
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            },
                                            styles.backRightBtn,
                                            styles.backRightBtnRight
                                        ]}
                                        onPress={() => userStore.ddeleteItem(user.id)}
                                    >
                                        <Text style={styles.backTextWhite}>Delete</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity 
                                    key={key}
                                    style={[{
                                        paddingVertical: 15,
                                        paddingHorizontal: '5%',
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        backgroundColor: key % 2 !== 1 ? 'white': color.palette.grey_sbs
                                    }]}
                                    onPress={() => {
                                        props.setEm(item.email)
                                        props.setSeeDialog(true)
                                    }}
                                >
                                    <Avatar                
                                        rounded
                                        containerStyle={[{
                                            borderColor: color.palette.blue_sbs,
                                            borderWidth: 1
                                        }]}
                                        size='medium'
                                        source={{
                                            uri: item.picture ||
                                                    'https://images.assetsdelivery.com/compings_v2/4zevar/4zevar1604/4zevar160400009.jpg',
                                        }}
                                    />
                                    <Text 
                                        key={key} 
                                        style={[{color: 'black', marginLeft: '5%'}]}
                                    >{item.email}</Text>
                                </TouchableOpacity>
                            </SwipeRow>  
                        )
                        
                       
                    })
            }
        </View>
    )
})
interface TrainersListProps extends NavigationProps {}

export const TrainersListScreen: React.FunctionComponent<TrainersListProps> = observer(props => {
    const { navigation} = props
    const [seeDialog, setSeeDialog] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [seeTrainerDialog, setSeeTrainerDialog] = useState(false)
    const [email, setEmail] = useState('') 

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
                // paddingHorizontal: 20
                // paddingHorizontal: 25
            }}
        >
            <PageHeader_Tr 
                navigation={navigation} 
                style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 25
                }} 
                title='Списък треньори'
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
            
            <GetTrainers search={searchValue} setEm={setEmail} setSeeDialog={setSeeTrainerDialog}/>
            {
                seeDialog ?
                    <AddTrainerDialog onDismiss={() => {setSeeDialog(false)}} />
                : null
            }
            {
                seeTrainerDialog ?
                    <SeeTrainerDialog email={email} onDismiss={() => {setSeeTrainerDialog(false)}} />
                : null
            }
        </Screen>
    )
})