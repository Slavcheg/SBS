import * as React from "react"
import { Button } from "../../components/button/button"
import { View, ViewStyle } from "react-native"
import { color } from "../../theme/color"
// import { Icon } from "react-native-elements"
import { Icon } from '../../components/icon/icon'
import { Text } from "../../components/text/text"
import { ButtonSquareProps } from "./button-square.props"

const buttonSquare: ViewStyle = {  
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    // shadowRadius: 5,
    elevation: 1,
    borderColor: color.palette.white,
    borderWidth: 1,
    borderRadius: 4
}

export const ButtonSquare: React.FunctionComponent<ButtonSquareProps> = props => {
    let {style, title, onPress, leftIcon, rightIcon} = props
    leftIcon = leftIcon === undefined ? 'gr_arrow_forward' : leftIcon;
    rightIcon = rightIcon === undefined ? 'gr_arrow_forward' : rightIcon

    return (
        <Button
            preset="link"
            style={[
                style,
                {
                    marginTop: 20
                }
            ]}
            onPress={onPress}
        >

                <View
                    style={[
                        buttonSquare,
                        {
                            width: "100%",
                            height: 60,
                            backgroundColor: color.palette.white,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 18
                        }
                    ]}
                >
                    {/* <Icon name='bell' type='font-awesome' size={25}></Icon> */}
                    <Icon icon={leftIcon} style={{width: 34, height: 31}} />
                    <View style={[
                            // boxes.orange,
                            {flex:1}
                    ]}>
                        <Text
                            style={{
                                marginLeft: 15,
                                color: '#666666'
                            }}
                        >{title}</Text>
                    </View>
                    {/* <Icon name='bell' type='font-awesome' size={25}></Icon> */}
                    <Icon icon={rightIcon} style={{width: 34, height: 31}}/>
                   
            </View>
        </Button>
    )
}