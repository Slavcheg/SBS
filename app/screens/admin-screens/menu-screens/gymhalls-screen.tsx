import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, AddTrainerDialog, Input_Hoshi, AddClientDialog, SeeClientDialog, AddGymHallDialog } from '../../../components'
import { color, spacing, styles } from "../../../theme"
import { View, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import { Avatar } from 'react-native-elements';
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { SwipeRow } from 'react-native-swipe-list-view';
import { translate } from "../../../i18n";

export const GetGymHalls: React.FunctionComponent<{search: string, setEm: any, setSeeDialog: any}> = observer(props => {
    const gymHallStore = useStores().gymHallStore
    useEffect(() => {
        gymHallStore.getGymHalls()
    }, [])

    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                gymHallStore.gymhalls
                    .filter(gym => props.search !== ''? gym.item.name.toLocaleLowerCase().includes(props.search): true)
                    .map((gym, key) => {
                        const item = gym.item
                        return ( 
                            <SwipeRow 
                                key={key}
                                // leftOpenValue={75}
                                rightOpenValue={-75}
                            >
                                <View style={styles.standaloneRowBack}>
                                    <TouchableOpacity
                                        style={[styles.standaloneRowBack, styles.backRightBtn, styles.backRightBtnRight]}
                                        onPress={() => gymHallStore.deleteGymHall(gym.id)}
                                    >
                                        <Text style={styles.backTextWhite}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <TouchableHighlight 
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
                                    onPressOut={() => {
                                        props.setEm(item.name)
                                        props.setSeeDialog(true)
                                    }}
                                    underlayColor={key % 2 === 1 ? 'white': color.palette.grey_sbs}
                                >
                                    <Text 
                                        key={key} 
                                        style={[{color: 'black', marginLeft: '5%'}]}
                                    >{item.name}</Text>
                                </TouchableHighlight>
                            </SwipeRow>
                        )
                    })
            }            
        </View>
    )
})
interface GymHallsProps extends NavigationProps {}

export const GymHallsScreen: React.FunctionComponent<GymHallsProps> = observer(props => {
    const { navigation} = props
    const [seeDialog, setSeeDialog] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [seeClientDialog, setSeeClientDialog] = useState(false)
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
            }}
        >
            <PageHeader_Tr
                navigation={navigation}
                style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 25
                }}
                title={translate('gymhalls_screen.header_label')}
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
            
            <GetGymHalls search={searchValue} setEm={setEmail} setSeeDialog={setSeeClientDialog}/>
            {
                seeDialog ?
                    <AddGymHallDialog onDismiss={() => {setSeeDialog(false)}} />
                : null
            }
            {/* {
                seeClientDialog ?
                    <SeeClientDialog email={email} onDismiss={() => {setSeeClientDialog(false)}} />
                : null
            } */}
        </Screen>
    )
})