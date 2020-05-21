import React, { useEffect, useState } from "react"
import { View, Text} from "react-native"
import { color } from "../../theme";
// import { Icon } from "react-native-elements";
import { Button } from "../../components/button/button";
import { globalStyles, device_width, device_height } from "../../global-helper";


export function Snack({onDismiss, message, duration = 1000}) {

    useEffect(() => {
        setTimeout(() => {
            onDismiss()
        }, duration)
    }, [])

    return (        
        <View
            style={[{
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
                    borderColor: color.palette.green_sbs,
                    borderWidth: 2,
                    borderRadius: 20,
                    backgroundColor: color.palette.green_sbs,
                    width: 150,
                    height: 150,
                    marginBottom: 200,
                    opacity: 1,
                    justifyContent: 'center',
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
            </View>

        </View>
    )
}

export function ExampleUseofSnack() {
    const [showSnack, setShowSnack] = useState(false);  
    return (
        <View>

        <View style={globalStyles.snackView}>
            {showSnack ? 
                <Snack message={'Saved !'} onDismiss={() => {setShowSnack(false)}}/>
            : null}
        </View>

        <View>
            <Button 
                onPress={() => setShowSnack(true)}
                style={[{
                    width: 100
                }]}
            >
                <Text>{"View Snack"}</Text>
            </Button>
        </View>
        </View>
    )
}