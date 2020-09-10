import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Hoshi } from "react-native-textinput-effects"
import { color, spacing } from "../../theme"
import { border_boxes } from "../../global-helper/global-styles-helper/global-styles-helper"

export function Input_Hoshi ({
    placeholder, variable, setVariable, 
    width='45%', onF=() => {}, onB=() => {}, 
    background= color.transparent,
    editable = true
}) {
        return(
            <View
                style={[
                    // border_boxes().black,
                    {
                    width: width,
                    marginVertical: 5
                }]}
            >
                <Hoshi 
                    autoCapitalize='none'
                    autoCompleteType="off"
                    autoCorrect={false}
                    editable = {editable}
                    value={variable}
                    onChangeText={x => setVariable(x)}
                    // placeholder={placeholder}
                    placeholderTextColor={'#999999'}
                    // containerStyle={{paddingHorizontal: 0}}
                    style={[
                        {
                            backgroundColor: background
                        },
                        styles.inputContainerStyle
                    ]}          
                    inputStyle={{fontSize: 16}}

                    onFocus={() => onF()}
                    onBlur={() => onB()}
                    label={placeholder}
                    labelStyle={[styles.inputTextStyle, {marginBottom: 10}]}
                    defaultValue={variable}
                    borderColor={color.palette.blue_sbs}
                    inputPadding={3}
                />
            </View>
        )
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        width: '100%',
        paddingLeft: spacing[4],
        borderBottomColor: color.palette.grey_sbs,
        borderRadius: 4,
    },
    inputTextStyle: {
        fontSize: 12,
        opacity: 0.5
    }
})

export function ExampleUseofInputHoshi() {
    const [email, setEmail] = useState(false);  
    
    <Input_Hoshi 
        placeholder={'емайл'} 
        variable={email} 
        setVariable={x => setEmail(x)} 
        width='30%'                            
    />
}