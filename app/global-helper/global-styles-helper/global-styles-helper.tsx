import { Dimensions, StyleSheet } from "react-native"

export const device_width = Math.round(Dimensions.get('window').width);
export const device_height = Math.round(Dimensions.get('window').height);

export const globalStyles = StyleSheet.create({ 
    snackView: {
        width: device_width,
        zIndex: 1,
        alignItems: 'center'
    }
})

export const border_boxes = (width = 1) => StyleSheet.create({ 
    black: {
        borderColor: 'black',
        borderWidth: width,
    },
    orange: {
        borderColor: 'orange',
        borderWidth: width,
    },
    red: {
        borderColor: 'red',
        borderWidth: width,
    },
    green: {
        borderColor: 'green',
        borderWidth: width,
    }
})