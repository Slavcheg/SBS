import React, { useEffect, useState } from "react"
import {Screen, PageHeader_Tr, Button, AddTrainerDialog } from '../../../components'
import { color, spacing } from "../../../theme"
import { View, Text } from "react-native";
import {useStores } from "../../../models/root-store"
import { observer } from "mobx-react-lite";
import { NavigationProps } from "../../../models/commomn-navigation-props";

export const GetTrainers: React.FunctionComponent<{}> = observer(props => {
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
                userStore.trainers.map((user, key) => {
                    const item = user.item
                    return  <View 
                                key={key}
                                style={[{
                                    paddingVertical: 5,
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    backgroundColor: key % 2 !== 1 ? 'white': color.palette.grey_sbs
                                }]}
                            >
                                <Text 
                                    key={key} 
                                    style={[{color: 'black'}]}
                                >{item.email}</Text>
                            </View>
                })
            }
        </View>
    )
})
interface TrainersListProps extends NavigationProps {}

export const TrainersListScreen: React.FunctionComponent<TrainersListProps> = observer(props => {
    const { navigation} = props
    const [seeDialog, setSeeDialog] = useState(false)
    
    const [data, setData] = useState([])

    

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
                paddingHorizontal: 25
            }}
        >
            <PageHeader_Tr navigation={navigation} style={{backgroundColor: 'white'}} title='Списък треньори'/>
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
            ></View>
            <GetTrainers />
            {
                seeDialog ?
                    <AddTrainerDialog onDismiss={() => {setSeeDialog(false)}} />
                : null
            }
            
            
            <Button 
                text={'Add trainer'} 
                style={{
                    width: '90%',
                    marginTop: spacing[8],
                    paddingVertical: spacing[4],
                    backgroundColor: color.palette.blue_sbs,
                    marginHorizontal: '5%'
                  }}
                  textStyle={{
                    color: 'white',
                    fontSize: 16
                  }}
                onPress={() => setSeeDialog(true)}
            />
        </Screen>
    )
})