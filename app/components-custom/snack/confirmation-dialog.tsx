import React, { useEffect, useState } from "react"
import { View, Text} from "react-native"
import { color } from "../../theme";
// import { Icon } from "react-native-elements";
import { Button } from "../../components/button/button";
import { globalStyles, device_width, device_height } from "../../global-helper";

interface ConfirmationDialogProps {
    message: string,
    onDismiss: Function,
    seeDailog: boolean
}

export const ConfirmationDialog: React.FunctionComponent<ConfirmationDialogProps> = props  => {
    const {message, onDismiss, seeDailog} = props
    const dialog = (    
        <View
            style={[{
                // display: seeDailog? 'flex' : 'none',
                width: device_width,
                height: device_height,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                position: 'absolute',
                zIndex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }]}
        >
            <View
                style={[{
                    borderColor: color.palette.blue_sbs,
                    borderWidth: 2,
                    borderRadius: 20,
                    backgroundColor: color.palette.blue_sbs,
                    width: 250,
                    height: 150,
                    marginBottom: 200,
                    padding: 20,
                    opacity: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }]}
            >
                {/* <Icon
                    name='check-circle'
                    color='white'
                    size={50}
                /> */}
                <Text
                    style={[{
                        color: 'white',
                        fontSize: 18
                    }]}
                >{message}</Text>
                <View
                    style={[{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }]}
                >
                    <Button
                        style={[{
                            width: '45%',
                            backgroundColor: color.palette.grey_sbs
                        }]}
                        text={'Cancel'}
                        textStyle={[{
                            fontSize: 15,
                            color: 'black'
                        }]}
                        onPress={()=>{
                            onDismiss(false)
                        }}
                    >
                        
                    </Button>
                    <Button
                        style={[{
                            width: '45%',
                            backgroundColor: 'red'
                        }]}
                        text={'Delete'}
                        textStyle={[{
                            fontSize: 15
                        }]}
                        onPress={()=>{
                            onDismiss(true)
                        }}
                    ></Button>

                </View>
            </View>
        </View>
    )
    return seeDailog? dialog: <View></View>
}

// export function ExampleUseofSnack() {
//     const [showSnack, setShowSnack] = useState(false);  
//     return (
//         <View>

//         <View style={globalStyles.snackView}>
//             {showSnack ? 
//                 <Snack message={'Saved !'} onDismiss={() => {setShowSnack(false)}}/>
//             : null}
//         </View>

//         <View>
//             <Button 
//                 onPress={() => setShowSnack(true)}
//                 style={[{
//                     width: 100
//                 }]}
//             >
//                 <Text>{"View Snack"}</Text>
//             </Button>
//         </View>
//         </View>
//     )
// }